from fastapi import APIRouter
from app.schemas.todo import Todo, PostTodoResponse
from app.schemas.error import ErrorResponse, ValidationErrorResponse
from app.schemas.response import ItemsResponse, UpdateResponse, DeleteResponse
from app.services.todos_service import TodoService

router = APIRouter()


@router.get(
    "/todos",
    response_model=ItemsResponse[Todo],
    responses={
        200: {"description": "List all todos"},
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
    },
)
def list_todos():
    return TodoService.list_todos()


@router.post(
    "/todos",
    response_model=PostTodoResponse,
    responses={
        400: {"model": ErrorResponse, "description": "ID already exists"},
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
    },
)
def create_todo(todo: Todo):
    TodoService.create_todo(todo)
    return {"todo_id": todo.todo_id, "message": "ok"}


@router.get(
    "/todos/{todo_id}",
    response_model=Todo,
    responses={
        404: {"model": ErrorResponse, "description": "Todo not found"},
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
    },
)
def get_todo(todo_id: str):
    return TodoService.get_todo(todo_id)


@router.put(
    "/todos/{todo_id}",
    response_model=UpdateResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Todo not found"},
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
    },
)
def update_todo(todo_id: str, updated: Todo):
    TodoService.update_todo(todo_id, updated)
    return {"message": "ok"}


@router.delete(
    "/todos/{todo_id}",
    response_model=DeleteResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Todo not found"},
        200: {"description": "Todo deleted"},
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
    },
)
def delete_todo(todo_id: str):
    TodoService.delete_todo(todo_id)
    return {"message": "ok"}
