from datetime import datetime

from pydantic import BaseModel, Field


class GroupMember(BaseModel):
    group_id: str = Field(..., description="グループID")
    user_id: str = Field(..., description="ユーザーID")
    role: str = Field(..., description="ロール（admin/member）")
    invited_at: datetime = Field(..., description="招待日時")
