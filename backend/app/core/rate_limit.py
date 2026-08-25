import time
from collections import defaultdict

from fastapi import HTTPException, Request, status

# Single-process, in-memory fixed-window counters keyed by "path:client_ip".
# Fine for a dev/prototype deployment; if this ever runs behind multiple
# worker processes, move the counters to Redis instead.
_attempts: dict[str, list[float]] = defaultdict(list)


def rate_limit(max_attempts: int = 5, window_seconds: int = 300):
    def dependency(request: Request) -> None:
        client_host = request.client.host if request.client else "unknown"
        key = f"{request.url.path}:{client_host}"
        now = time.monotonic()
        window_start = now - window_seconds

        attempts = _attempts[key]
        attempts[:] = [t for t in attempts if t > window_start]

        if len(attempts) >= max_attempts:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many attempts. Please try again later.",
            )

        attempts.append(now)

    return dependency
