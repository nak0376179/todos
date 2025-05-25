from pydantic import BaseModel
from typing import Optional


class Todo(BaseModel):
    todo_id: str
    title: str
    description: Optional[str] = None
    completed: bool = False


class PostTodoResponse(BaseModel):
    todo_id: str
    message: str
