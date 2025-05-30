from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class GroupCreate(BaseModel):
    name: str


class GroupRead(BaseModel):
    group_id: str
    name: str
    owner_user_id: str
    created_at: datetime


class GroupInDB(GroupRead):
    pass
