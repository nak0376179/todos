import logging

from fastapi import APIRouter, Body, HTTPException, Path
from pydantic import BaseModel

from app.schemas.todo import (
    DeleteItemResponse,
    TodoCreateResponse,
    TodoGetResponse,
    TodoListResponse,
    TodoUpdateRequest,
    TodoUpdateResponse,
)
from app.services.todo_service import TodoService

router = APIRouter(prefix="/groups/{group_id}/todos", tags=["todos"])
service = TodoService()
logger = logging.getLogger(__name__)


class TodoCreateRequest(BaseModel):
    title: str
    description: str | None = None
    due_date: str | None = None
    owner_user_id: str


@router.get("", response_model=TodoListResponse)
def list_todos(group_id: str = Path(...)):
    logger.info(f"[GET /groups/{{group_id}}/todos] group_id={group_id}")
    todos = service.list_todos_by_group(group_id)
    logger.info(f"[GET /groups/{{group_id}}/todos] found {len(todos)} todos")
    return TodoListResponse(**todos)


@router.post("", response_model=TodoCreateResponse)
def create_todo(body: TodoCreateRequest, group_id: str = Path(...)):
    logger.info(f"[POST /groups/{{group_id}}/todos] group_id={group_id}, body={body}")
    todo = service.create_todo(
        group_id=group_id,
        title=body.title,
        description=body.description or "",
        due_date=body.due_date or "",
        owner_user_id=body.owner_user_id,
    )
    logger.info(f"[POST /groups/{{group_id}}/todos] created todo_id={todo['todo_id']}")
    return TodoCreateResponse(**todo)


@router.get("/{todo_id}", response_model=TodoGetResponse)
def get_todo(group_id: str = Path(...), todo_id: str = Path(...)):
    logger.info(f"[GET /groups/{{group_id}}/todos/{{todo_id}}] group_id={group_id}, todo_id={todo_id}")
    todo = service.repo.get_todo_by_id(todo_id)
    if not todo or todo["group_id"] != group_id:
        logger.warning("[GET /groups/{group_id}/todos/{todo_id}] not found")
        raise HTTPException(status_code=404, detail="Not found")
    logger.info(f"[GET /groups/{{group_id}}/todos/{{todo_id}}] found todo_id={todo_id}")
    return TodoGetResponse(**todo)


@router.patch("/{todo_id}", response_model=TodoUpdateResponse)
def update_todo(group_id: str = Path(...), todo_id: str = Path(...), body: TodoUpdateRequest = Body(...)):
    logger.info(f"[PATCH /groups/{{group_id}}/todos/{{todo_id}}] group_id={group_id}, todo_id={todo_id}, body={body}")
    todo = service.update_todo(todo_id, body.model_dump(exclude_unset=True) or {})
    if not todo or todo["group_id"] != group_id:
        logger.warning("[PATCH /groups/{group_id}/todos/{todo_id}] not found")
        raise HTTPException(status_code=404, detail="Not found")
    logger.info(f"[PATCH /groups/{{group_id}}/todos/{{todo_id}}] updated todo_id={todo_id}")
    return TodoUpdateResponse(**todo)


@router.delete("/{todo_id}", response_model=DeleteItemResponse)
def delete_todo(group_id: str = Path(...), todo_id: str = Path(...)):
    logger.info(f"[DELETE /groups/{{group_id}}/todos/{{todo_id}}] group_id={group_id}, todo_id={todo_id}")
    todo = service.repo.get_todo_by_id(todo_id)
    if not todo or todo["group_id"] != group_id:
        logger.warning("[DELETE /groups/{group_id}/todos/{todo_id}] not found")
        raise HTTPException(status_code=404, detail="Not found")
    service.delete_todo(todo_id)
    logger.info(f"[DELETE /groups/{{group_id}}/todos/{{todo_id}}] deleted todo_id={todo_id}")
    return {"message": "ok", "data": todo}
