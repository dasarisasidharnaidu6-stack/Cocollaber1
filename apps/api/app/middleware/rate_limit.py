"""
In-Memory Rate Limiting Middleware.
Provides rolling-window request throttling for sensitive endpoints (e.g. login, search)
returning SRS-compliant 429 E-RATE responses.
"""
import time
from collections import defaultdict
from fastapi import Request
from starlette.responses import JSONResponse

# In-memory tracking: key -> list of timestamp floats
_request_records = defaultdict(list)

# Route-specific thresholds: (path_prefix, max_requests, window_seconds)
RATE_LIMIT_RULES = [
    ("/api/v1/auth/login", 10, 60),
    ("/api/v1/auth/register", 15, 60),
]

async def rate_limit_middleware(request: Request, call_next):
    path = request.url.path
    matched_rule = None

    for rule_path, max_reqs, window_sec in RATE_LIMIT_RULES:
        if path == rule_path or path.startswith(rule_path):
            matched_rule = (max_reqs, window_sec)
            break

    if matched_rule:
        max_reqs, window_sec = matched_rule
        now = time.time()

        # Key by client host or path
        client_ip = request.client.host if request.client else "unknown"
        rate_key = f"{path}:{client_ip}"

        # Clean timestamps older than window
        timestamps = [ts for ts in _request_records[rate_key] if now - ts < window_sec]
        _request_records[rate_key] = timestamps

        if len(timestamps) >= max_reqs:
            return JSONResponse(
                status_code=429,
                content={
                    "error_code": "E-RATE",
                    "message": "Too many requests. Rate limit exceeded, please try again later.",
                },
            )

        # Record this attempt
        _request_records[rate_key].append(now)

    return await call_next(request)
