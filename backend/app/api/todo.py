from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.todo import TodoCreate, TodoRead, TodoUpdate
from app.services.todo_service import TodoService
from pydantic import BaseModel

router = APIRouter(prefix="/todos", tags=["todos"])
service = TodoService()


class TodoCreateRequest(BaseModel):
    group_id: str
    title: str
    description: str | None = None
    due_date: str | None = None
    owner_user_id: str


@router.get("", response_model=List[TodoRead])
def list_todos(group_id: str):
    return service.list_todos_by_group(group_id)


@router.post("", response_model=TodoRead)
def create_todo(body: TodoCreateRequest):
    return service.create_todo(
        TodoCreate(
            group_id=body.group_id,
            title=body.title,
            description=body.description,
            due_date=datetime.fromisoformat(body.due_date) if body.due_date else None,
        ),
        owner_user_id=body.owner_user_id,
    )


@router.get("/{todo_id}", response_model=TodoRead)
def get_todo(todo_id: str):
    todo = service.get_todo_by_id(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Not found")
    return todo


@router.patch("/{todo_id}", response_model=TodoRead)
def update_todo(todo_id: str, body: TodoUpdate):
    todo = service.update_todo(todo_id, body)
    if not todo:
        raise HTTPException(status_code=404, detail="Not found")
    return todo


@router.delete("/{todo_id}")
def delete_todo(todo_id: str):
    service.delete_todo(todo_id)
    return {"result": "ok"}
