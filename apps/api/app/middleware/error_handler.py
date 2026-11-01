"""
Global Exception Handlers for CoCollaber.
Maps standard CoCollaber exceptions to structured error contracts matching SRS v1.0:
E-VAL, E-AUTH, E-FORB, E-NF, E-CONF, E-STATE, E-RATE, E-SYS.
"""

from apps.api.app.core.exceptions import CoCollaberException
from fastapi import FastAPI, Request
from starlette.responses import JSONResponse


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(CoCollaberException)
    async def cocollaber_exception_handler(request: Request, exc: CoCollaberException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error_code": exc.error_code,
                "message": exc.detail,
                "request_id": getattr(request.state, "request_id", None),
            },
        )
