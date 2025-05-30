from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class Todo(BaseModel):
    todo_id: str = Field(..., description="TODO ID（UUIDなどユニークな値）")
    group_id: str = Field(..., description="所属グループID")
    title: str = Field(..., description="タイトル")
    description: Optional[str] = Field(None, description="説明")
    owner_user_id: str = Field(..., description="作成者ユーザーID")
    due_date: Optional[datetime] = Field(None, description="期限")
    is_completed: bool = Field(False, description="完了フラグ")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")
