from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserGroup


class UserGroupResponse(BaseModel):
    group_id: str
    group_name: str
    role: str
    invited_at: datetime


class UserCreateRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserReadResponse(BaseModel):
    user_id: str
    email: EmailStr
    user_name: Optional[str] = None
    created_at: datetime
    groups: List[UserGroup]
