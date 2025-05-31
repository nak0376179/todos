from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class GroupUser(BaseModel):
    user_id: str
    email: str
    user_name: str
    role: str
    invited_at: datetime


class GroupCreate(BaseModel):
    name: str


class GroupRead(BaseModel):
    group_id: str
    group_name: str
    owner_user_id: str
    created_at: datetime
    users: List[GroupUser]


class GroupInDB(GroupRead):
    pass
