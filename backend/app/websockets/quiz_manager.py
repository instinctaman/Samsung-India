import asyncio
import json
import time
from typing import Any, Dict, List, Optional
from fastapi import WebSocket


class QuizRoom:
    def __init__(self, conference_uid: str):
        self.conference_uid = conference_uid
        self.suite_uid: Optional[str] = None
        self.trainers: Dict[WebSocket, str] = {}
        self.trainees: Dict[WebSocket, Dict[str, Any]] = {}
        self.state: str = "LOBBY"  # LOBBY, QUESTION_ACTIVE, QUESTION_REVEAL, LEADERBOARD
        self.active_question_index: int = 0
        self.active_question: Optional[Dict[str, Any]] = None
        self.timer_seconds: int = 30
        self.deadline_ts: Optional[float] = None
        # trainee_uid -> { option: "A", is_correct: True, time_taken: 4.2 }
        self.responses: Dict[str, Dict[str, Any]] = {}
        # option -> count
        self.option_counts: Dict[str, int] = {"A": 0, "B": 0, "C": 0, "D": 0}

    @property
    def total_trainees_connected(self) -> int:
        return len(self.trainees)

    @property
    def total_responses_count(self) -> int:
        return len(self.responses)

    def get_stats_payload(self) -> Dict[str, Any]:
        total_resp = self.total_responses_count
        percentages = {}
        for opt, count in self.option_counts.items():
            percentages[opt] = round((count / total_resp * 100), 1) if total_resp > 0 else 0.0

        return {
            "state": self.state,
            "activeQuestionIndex": self.active_question_index,
            "connectedTrainees": self.total_trainees_connected,
            "totalResponses": total_resp,
            "optionCounts": self.option_counts,
            "optionPercentages": percentages,
            "deadline": self.deadline_ts,
            "remainingSeconds": max(0, int(self.deadline_ts - time.time())) if self.deadline_ts else 0,
        }


class QuizRoomManager:
    def __init__(self):
        self.rooms: Dict[str, QuizRoom] = {}

    def get_or_create_room(self, conference_uid: str) -> QuizRoom:
        if conference_uid not in self.rooms:
            self.rooms[conference_uid] = QuizRoom(conference_uid)
        return self.rooms[conference_uid]

    async def connect_trainer(self, websocket: WebSocket, conference_uid: str, trainer_name: str = "Trainer"):
        await websocket.accept()
        room = self.get_or_create_room(conference_uid)
        room.trainers[websocket] = trainer_name
        # Send current room state to trainer
        await self._send_json(websocket, {
            "type": "ROOM_STATE",
            "role": "trainer",
            "room": room.get_stats_payload(),
            "activeQuestion": room.active_question,
        })

    async def connect_trainee(self, websocket: WebSocket, conference_uid: str, trainee_data: Dict[str, Any]):
        await websocket.accept()
        room = self.get_or_create_room(conference_uid)
        room.trainees[websocket] = trainee_data
        # Send current room state to trainee
        await self._send_json(websocket, {
            "type": "ROOM_STATE",
            "role": "trainee",
            "state": room.state,
            "activeQuestionIndex": room.active_question_index,
            "activeQuestion": room.active_question if room.state == "QUESTION_ACTIVE" else None,
            "deadline": room.deadline_ts if room.state == "QUESTION_ACTIVE" else None,
            "remainingSeconds": max(0, int(room.deadline_ts - time.time())) if room.deadline_ts and room.state == "QUESTION_ACTIVE" else 0,
        })
        # Notify trainers
        await self.broadcast_to_trainers(conference_uid, {
            "type": "ATTENDEE_UPDATE",
            "connectedTrainees": room.total_trainees_connected,
        })

    async def disconnect(self, websocket: WebSocket, conference_uid: str):
        if conference_uid not in self.rooms:
            return
        room = self.rooms[conference_uid]
        is_trainer = websocket in room.trainers
        if is_trainer:
            room.trainers.pop(websocket, None)
        else:
            room.trainees.pop(websocket, None)
            await self.broadcast_to_trainers(conference_uid, {
                "type": "ATTENDEE_UPDATE",
                "connectedTrainees": room.total_trainees_connected,
            })

    async def _send_json(self, websocket: WebSocket, payload: Dict[str, Any]):
        try:
            await websocket.send_text(json.dumps(payload))
        except Exception:
            pass

    async def broadcast_to_trainers(self, conference_uid: str, payload: Dict[str, Any]):
        if conference_uid not in self.rooms:
            return
        room = self.rooms[conference_uid]
        tasks = [self._send_json(ws, payload) for ws in list(room.trainers.keys())]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def broadcast_to_trainees(self, conference_uid: str, payload: Dict[str, Any]):
        if conference_uid not in self.rooms:
            return
        room = self.rooms[conference_uid]
        tasks = [self._send_json(ws, payload) for ws in list(room.trainees.keys())]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def broadcast_all(self, conference_uid: str, payload: Dict[str, Any]):
        await self.broadcast_to_trainers(conference_uid, payload)
        await self.broadcast_to_trainees(conference_uid, payload)

    async def start_question(self, conference_uid: str, question_data: Dict[str, Any], timer_seconds: int = 30):
        room = self.get_or_create_room(conference_uid)
        room.state = "QUESTION_ACTIVE"
        room.active_question = question_data
        room.active_question_index = question_data.get("index", room.active_question_index)
        room.timer_seconds = timer_seconds
        room.deadline_ts = time.time() + timer_seconds
        room.responses.clear()
        room.option_counts = {"A": 0, "B": 0, "C": 0, "D": 0}

        # Broadcast to trainees with question (excluding correct answer to prevent inspection)
        trainee_q = {
            "id": question_data.get("id"),
            "qNumber": question_data.get("qNumber", f"Q{room.active_question_index + 1}"),
            "questionText": question_data.get("questionText", ""),
            "options": question_data.get("options", []),
            "timerSecs": timer_seconds,
            "deadline": room.deadline_ts,
        }
        await self.broadcast_to_trainees(conference_uid, {
            "type": "QUESTION_ACTIVE",
            "question": trainee_q,
            "questionIndex": room.active_question_index,
            "deadline": room.deadline_ts,
            "timerSecs": timer_seconds,
        })

        # Broadcast to trainers with full question details and live response tracker
        await self.broadcast_to_trainers(conference_uid, {
            "type": "QUESTION_LAUNCHED",
            "question": question_data,
            "questionIndex": room.active_question_index,
            "stats": room.get_stats_payload(),
        })

    async def submit_answer(self, conference_uid: str, trainee_uid: str, answer_data: Dict[str, Any]):
        if conference_uid not in self.rooms:
            return
        room = self.rooms[conference_uid]
        if room.state != "QUESTION_ACTIVE":
            return

        selected_opt = answer_data.get("selectedOption")
        if not selected_opt:
            return

        is_new_response = trainee_uid not in room.responses
        prev_opt = room.responses.get(trainee_uid, {}).get("option") if not is_new_response else None

        if prev_opt and prev_opt in room.option_counts:
            room.option_counts[prev_opt] = max(0, room.option_counts[prev_opt] - 1)

        room.responses[trainee_uid] = {
            "option": selected_opt,
            "timeTaken": answer_data.get("timeTaken", 0.0),
            "submittedAt": time.time(),
        }
        if selected_opt in room.option_counts:
            room.option_counts[selected_opt] += 1

        # Broadcast updated response stats to trainers
        await self.broadcast_to_trainers(conference_uid, {
            "type": "RESPONSE_STATS_UPDATE",
            "stats": room.get_stats_payload(),
        })

    async def stop_timer(self, conference_uid: str):
        if conference_uid not in self.rooms:
            return
        room = self.rooms[conference_uid]
        room.deadline_ts = time.time()
        await self.broadcast_all(conference_uid, {
            "type": "TIMER_STOPPED",
            "stats": room.get_stats_payload(),
        })

    async def reveal_answer(self, conference_uid: str, correct_option: str, explanation: str = ""):
        if conference_uid not in self.rooms:
            return
        room = self.rooms[conference_uid]
        room.state = "QUESTION_REVEAL"
        await self.broadcast_all(conference_uid, {
            "type": "QUESTION_REVEAL",
            "correctOption": correct_option,
            "explanation": explanation,
            "stats": room.get_stats_payload(),
        })

    async def show_leaderboard(self, conference_uid: str):
        if conference_uid not in self.rooms:
            return
        room = self.rooms[conference_uid]
        room.state = "LEADERBOARD"
        await self.broadcast_all(conference_uid, {
            "type": "SHOW_LEADERBOARD",
            "stats": room.get_stats_payload(),
        })

    async def return_to_lobby(self, conference_uid: str):
        if conference_uid not in self.rooms:
            return
        room = self.rooms[conference_uid]
        room.state = "LOBBY"
        room.active_question = None
        await self.broadcast_all(conference_uid, {
            "type": "RETURN_TO_LOBBY",
            "stats": room.get_stats_payload(),
        })


quiz_room_manager = QuizRoomManager()
