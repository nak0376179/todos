from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TodoCreate(BaseModel):
    group_id: str
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None


class TodoRead(BaseModel):
    todo_id: str
    group_id: str
    title: str
    description: Optional[str] = None
    owner_user_id: str
    due_date: Optional[datetime] = None
    is_completed: bool
    created_at: datetime
    updated_at: datetime


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None
