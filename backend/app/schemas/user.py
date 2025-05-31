from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserGroup(BaseModel):
    group_id: str
    group_name: str
    role: str
    invited_at: datetime


class UserCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserRead(BaseModel):
    user_id: str
    email: EmailStr
    user_name: Optional[str] = None
    created_at: datetime
    groups: List[UserGroup]


class UserInDB(UserRead):
    pass
