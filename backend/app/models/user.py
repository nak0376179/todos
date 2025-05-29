from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class User(BaseModel):
    user_id: str = Field(..., description="ユーザーID（UUIDなどユニークな値）")
    email: str = Field(..., description="メールアドレス")
    created_at: datetime = Field(..., description="作成日時")
    name: Optional[str] = Field(None, description="表示名")
