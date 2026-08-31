from jose import JWTError, jwt

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.config import settings

router = APIRouter(tags=["ws"])


class ConnectionManager:
    """Tracks live `/ws/admin` connections by trainer/admin username so a
    write endpoint can push a small "something changed" event to just the
    trainer who owns it (`send_to`) or to everyone (`broadcast`, for data
    like the trainee list that every admin/trainer sees unscoped)."""

    def __init__(self) -> None:
        self._connections: dict[str, set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, username: str) -> None:
        await websocket.accept()
        self._connections.setdefault(username, set()).add(websocket)

    def disconnect(self, websocket: WebSocket, username: str) -> None:
        sockets = self._connections.get(username)
        if not sockets:
            return
        sockets.discard(websocket)
        if not sockets:
            self._connections.pop(username, None)

    async def send_to(self, username: str | None, event: dict) -> None:
        if not username:
            return
        for websocket in list(self._connections.get(username, ())):
            try:
                await websocket.send_json(event)
            except Exception:
                self.disconnect(websocket, username)

    async def broadcast(self, event: dict) -> None:
        for username, sockets in list(self._connections.items()):
            for websocket in list(sockets):
                try:
                    await websocket.send_json(event)
                except Exception:
                    self.disconnect(websocket, username)


manager = ConnectionManager()


def _resolve_username(token: str) -> str | None:
    """Lightweight counterpart to `get_current_admin` for the WS handshake -
    HTTPBearer/Depends doesn't apply here, and neither browsers nor React
    Native's WebSocket can set a custom Authorization header, so the token
    travels as a query param instead (visible in access logs - acceptable
    for this app's local/dev threat model, not for a public deployment)."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None

    subject = payload.get("sub") or ""
    if subject.startswith("admin:"):
        return subject.removeprefix("admin:")
    if subject.startswith("agencyteam:"):
        return subject.removeprefix("agencyteam:")
    return None


@router.websocket("/ws/admin")
async def admin_events(websocket: WebSocket, token: str = ""):
    username = _resolve_username(token)
    if not username:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, username)
    try:
        while True:
            # Nothing meaningful expected from the client - this just
            # blocks until the socket closes so we can clean up below.
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(websocket, username)
