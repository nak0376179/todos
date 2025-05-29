from pydantic import BaseModel, Field
from datetime import datetime


class GroupMemberCreate(BaseModel):
    group_id: str
    user_id: str
    role: str


class GroupMemberRead(BaseModel):
    group_id: str
    user_id: str
    role: str
    invited_at: datetime


class GroupMemberInDB(GroupMemberRead):
    pass
