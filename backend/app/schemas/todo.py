"""
app/schemas/todo.py
TODOスキーマ
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.schemas.common import DeleteItemResponse, QueryResponse


class TodoBase(BaseModel):
    title: str
    description: str = ""
    due_date: str = ""
    owner_user_id: str


class TodoCreateRequest(TodoBase):
    pass


class TodoCreateResponse(TodoBase):
    todo_id: str
    group_id: str
    created_at: str
    updated_at: str


class TodoGetResponse(TodoBase):
    todo_id: str
    group_id: str
    created_at: str
    updated_at: str


class TodoUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    is_completed: Optional[bool] = None


class TodoUpdateResponse(TodoBase):
    todo_id: str
    group_id: str
    created_at: str
    updated_at: str
    is_completed: bool = False


class TodoListResponse(BaseModel):
    Items: List[Dict[str, Any]] = Field(default_factory=list)
    LastEvaluatedKey: Optional[Dict[str, Any]] = None


class TodoDeleteResponse(BaseModel):
    todo_id: str
