from datetime import datetime

from pydantic import BaseModel, Field


class Group(BaseModel):
    group_id: str = Field(..., description="グループID（UUIDなどユニークな値）")
    name: str = Field(..., description="グループ名")
    owner_user_id: str = Field(..., description="グループ作成者のユーザーID")
    created_at: datetime = Field(..., description="作成日時")
