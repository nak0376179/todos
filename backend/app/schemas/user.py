from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserRead(BaseModel):
    user_id: str
    email: EmailStr
    name: Optional[str] = None
    created_at: datetime


class UserInDB(UserRead):
    pass
