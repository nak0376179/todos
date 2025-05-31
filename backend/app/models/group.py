from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class GroupUser(BaseModel):
    user_id: str = Field(..., description="ユーザーID")
    email: str = Field(..., description="メールアドレス")
    user_name: str = Field(..., description="表示名")
    role: str = Field(..., description="ロール（admin/member）")
    invited_at: datetime = Field(..., description="招待日時")


class Group(BaseModel):
    group_id: str = Field(..., description="グループID（UUIDなどユニークな値）")
    group_name: str = Field(..., description="グループ名")
    owner_user_id: str = Field(..., description="グループ作成者のユーザーID")
    created_at: datetime = Field(..., description="作成日時")
    users: List[GroupUser] = Field(default_factory=list, description="グループのユーザー一覧")
