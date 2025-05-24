from pydantic import BaseModel
from typing import List, Any

class ErrorResponse(BaseModel):
    detail: str

class ValidationErrorDetail(BaseModel):
    loc: List[Any]
    msg: str
    type: str

class ValidationErrorResponse(BaseModel):
    detail: List[ValidationErrorDetail] 