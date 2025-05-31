from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.group import GroupUser


class GroupUserResponse(BaseModel):
    user_id: str
    email: str
    user_name: str
    role: str
    invited_at: datetime


class GroupCreateResponse(BaseModel):
    group_name: str


class GroupReadResponse(BaseModel):
    group_id: str
    group_name: str
    owner_user_id: str
    created_at: datetime
    users: List[GroupUser]
