from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class UserGroup(BaseModel):
    group_id: str = Field(..., description="グループID")
    group_name: str = Field(..., description="グループ名")
    role: str = Field(..., description="ロール（admin/member）")
    invited_at: datetime = Field(..., description="招待日時")


class User(BaseModel):
    user_id: str = Field(..., description="ユーザーID（UUIDなどユニークな値）")
    email: str = Field(..., description="メールアドレス")
    created_at: datetime = Field(..., description="作成日時")
    name: Optional[str] = Field(None, description="表示名")
    groups: List[UserGroup] = Field(default_factory=list, description="所属グループ一覧")
