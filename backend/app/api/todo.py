from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel

from app.schemas.todo import TodoCreate, TodoRead, TodoUpdate
from app.services.todo_service import TodoService

router = APIRouter(prefix="/groups/{group_id}/todos", tags=["todos"])
service = TodoService()


class TodoCreateRequest(BaseModel):
    title: str
    description: str | None = None
    due_date: str | None = None
    owner_user_id: str


@router.get("", response_model=List[TodoRead])
def list_todos(group_id: str = Path(...)):
    return service.list_todos_by_group(group_id)


@router.post("", response_model=TodoRead)
def create_todo(group_id: str = Path(...), body: TodoCreateRequest = ...):
    return service.create_todo(
        TodoCreate(
            group_id=group_id,
            title=body.title,
            description=body.description,
            due_date=datetime.fromisoformat(body.due_date) if body.due_date else None,
        ),
        owner_user_id=body.owner_user_id,
    )


@router.get("/{todo_id}", response_model=TodoRead)
def get_todo(group_id: str = Path(...), todo_id: str = Path(...)):
    todo = service.get_todo_by_id(todo_id)
    if not todo or todo.group_id != group_id:
        raise HTTPException(status_code=404, detail="Not found")
    return todo


@router.patch("/{todo_id}", response_model=TodoRead)
def update_todo(group_id: str = Path(...), todo_id: str = Path(...), body: TodoUpdate = ...):
    todo = service.update_todo(todo_id, body)
    if not todo or todo.group_id != group_id:
        raise HTTPException(status_code=404, detail="Not found")
    return todo


@router.delete("/{todo_id}")
def delete_todo(group_id: str = Path(...), todo_id: str = Path(...)):
    todo = service.get_todo_by_id(todo_id)
    if not todo or todo.group_id != group_id:
        raise HTTPException(status_code=404, detail="Not found")
    service.delete_todo(todo_id)
    return {"result": "ok"}
