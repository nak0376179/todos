from typing import List
from app.schemas.todo import Todo
from app.models.todo import TodoModel
from app.repositories.todos_repository import TodoRepository
from fastapi import HTTPException
from app.schemas.response import ItemsResponse


class TodoService:
    @staticmethod
    def list_todos() -> ItemsResponse[Todo]:
        return TodoRepository.list_todos()

    @staticmethod
    def get_todo(todo_id: str) -> Todo:
        todo = TodoRepository.get_todo(todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        return todo

    @staticmethod
    def create_todo(todo: Todo) -> Todo:
        if TodoRepository.get_todo(todo.todo_id):
            raise HTTPException(status_code=400, detail="ID already exists")
        return TodoRepository.create_todo(todo)

    @staticmethod
    def update_todo(todo_id: str, updated: Todo) -> Todo:
        if not TodoRepository.get_todo(todo_id):
            raise HTTPException(status_code=404, detail="Todo not found")
        return TodoRepository.update_todo(updated)

    @staticmethod
    def delete_todo(todo_id: str) -> bool:
        if not TodoRepository.get_todo(todo_id):
            raise HTTPException(status_code=404, detail="Todo not found")
        return TodoRepository.delete_todo(todo_id)
