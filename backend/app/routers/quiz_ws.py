import json
import logging
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

from app.websockets.quiz_manager import quiz_room_manager

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Live Quiz WebSocket"])


@router.websocket("/ws/quiz/{conference_uid}")
async def quiz_websocket_endpoint(
    websocket: WebSocket,
    conference_uid: str,
    role: str = Query(default="trainee"),
    name: str = Query(default="User"),
    uid: Optional[str] = Query(default=None),
):
    """
    Real-Time WebSocket channel for Trainer Live Studio & Trainee Quiz Screen.
    Connect as role="trainer" or role="trainee".
    """
    user_id = uid or name
    if role == "trainer":
        await quiz_room_manager.connect_trainer(websocket, conference_uid, trainer_name=name)
    else:
        await quiz_room_manager.connect_trainee(websocket, conference_uid, trainee_data={"uid": user_id, "name": name})

    try:
        while True:
            raw_data = await websocket.receive_text()
            if not raw_data:
                continue

            try:
                msg = json.loads(raw_data)
            except Exception:
                continue

            msg_type = msg.get("type", "").upper()

            if msg_type == "PING":
                await websocket.send_text(json.dumps({"type": "PONG"}))

            elif msg_type == "START_QUESTION":
                question_data = msg.get("question", {})
                timer_secs = int(msg.get("timerSecs", 30))
                await quiz_room_manager.start_question(conference_uid, question_data, timer_seconds=timer_secs)

            elif msg_type == "SUBMIT_ANSWER":
                answer_data = msg.get("answer", {})
                trainee_id = msg.get("traineeUid", user_id)
                await quiz_room_manager.submit_answer(conference_uid, trainee_id, answer_data)

            elif msg_type == "STOP_TIMER":
                await quiz_room_manager.stop_timer(conference_uid)

            elif msg_type == "REVEAL_ANSWER":
                correct_option = msg.get("correctOption", "A")
                explanation = msg.get("explanation", "")
                await quiz_room_manager.reveal_answer(conference_uid, correct_option=correct_option, explanation=explanation)

            elif msg_type == "SHOW_LEADERBOARD":
                await quiz_room_manager.show_leaderboard(conference_uid)

            elif msg_type in ("LOBBY", "RETURN_TO_LOBBY"):
                await quiz_room_manager.return_to_lobby(conference_uid)

    except WebSocketDisconnect:
        await quiz_room_manager.disconnect(websocket, conference_uid)
    except Exception as e:
        logger.warning(f"WebSocket error in room {conference_uid}: {e}")
        await quiz_room_manager.disconnect(websocket, conference_uid)
