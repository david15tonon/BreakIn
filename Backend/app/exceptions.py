from fastapi import HTTPException


class ServiceUnavailable(HTTPException):
    def __init__(self, detail: str = "Service unavailable"):
        super().__init__(status_code=503, detail=detail)


class BadRequest(HTTPException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=400, detail=detail)


class NotFound(HTTPException):
    def __init__(self, detail: str = "Not found"):
        super().__init__(status_code=404, detail=detail)
