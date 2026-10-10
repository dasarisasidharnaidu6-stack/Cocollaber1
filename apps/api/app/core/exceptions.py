"""
Standard application exceptions aligned with SRS v1.0 error taxonomy:
E-VAL, E-AUTH, E-FORB, E-NF, E-CONF, E-STATE, E-RATE, E-SYS.
"""
from fastapi import HTTPException, status

class CoCollaberException(HTTPException):
    def __init__(self, status_code: int, detail: str, error_code: str):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code

class ValidationError(CoCollaberException):
    def __init__(self, detail: str):
        super().__init__(status.HTTP_400_BAD_REQUEST, detail, "E-VAL")

class AuthenticationError(CoCollaberException):
    def __init__(self, detail: str = "Authentication credentials invalid"):
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail, "E-AUTH")

class ForbiddenError(CoCollaberException):
    def __init__(self, detail: str = "Action not permitted"):
        super().__init__(status.HTTP_403_FORBIDDEN, detail, "E-FORB")

class NotFoundError(CoCollaberException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status.HTTP_404_NOT_FOUND, detail, "E-NF")

class ConflictError(CoCollaberException):
    def __init__(self, detail: str = "Resource conflict or duplicate"):
        super().__init__(status.HTTP_409_CONFLICT, detail, "E-CONF")

class InvalidStateError(CoCollaberException):
    def __init__(self, detail: str = "Action invalid for current resource state"):
        super().__init__(status.HTTP_422_UNPROCESSABLE_ENTITY, detail, "E-STATE")

class RateLimitError(CoCollaberException):
    def __init__(self, detail: str = "Rate limit exceeded. Try again later"):
        super().__init__(status.HTTP_429_TOO_MANY_REQUESTS, detail, "E-RATE")
