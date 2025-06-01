"""
app/schemas/todo.py
TODOスキーマ
"""

from typing import Optional

from pydantic import BaseModel, Field

from app.schemas.common import DeleteItemResponse, QueryResponse


class Todo(BaseModel):
    todo_id: str = Field(..., description="TODO ID（UUIDなどユニークな値）")
    group_id: str = Field(..., description="所属グループID")
    title: str = Field(..., description="タイトル")
    description: Optional[str] = Field(None, description="説明")
    owner_user_id: str = Field(..., description="作成者ユーザーID")
    due_date: Optional[str] = Field(None, description="期限")
    is_completed: bool = Field(False, description="完了フラグ")
    created_at: str = Field(..., description="作成日時")
    updated_at: Optional[str] = Field(..., description="更新日時")


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, description="タイトル")
    description: Optional[str] = Field(None, description="説明")
    due_date: Optional[str] = Field(None, description="期限")
    is_completed: Optional[bool] = Field(None, description="完了フラグ")


class TodoCreateRequest(BaseModel):
    group_id: str = Field(..., description="所属グループID")
    title: str = Field(..., description="タイトル")
    description: Optional[str] = Field(None, description="説明")
    due_date: Optional[str] = Field(None, description="期限")


class TodoCreateResponse(Todo):
    pass


class TodoListResponse(QueryResponse[Todo]):
    pass


class TodoGetResponse(Todo):
    pass


class TodoUpdateRequest(TodoUpdate):
    pass


class TodoUpdateResponse(TodoUpdate):
    pass


class TodoDeleteResponse(DeleteItemResponse):
    pass
