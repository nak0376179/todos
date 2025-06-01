"""
app/services/todo_service.py
Todoサービス
"""

import uuid

from app.repositories.todo_repository import TodoRepository


class TodoService:
    def __init__(self) -> None:
        self.repo = TodoRepository()

    def create_todo(self, group_id: str, title: str, description: str, due_date: str, owner_user_id: str):
        todo_id = str(uuid.uuid4())
        todo = self.repo.create_todo(todo_id, group_id, title, description, due_date, owner_user_id)
        return todo

    def list_todos_by_group(self, group_id: str):
        todos = self.repo.list_todos_by_group(group_id)
        return todos

    def update_todo(self, todo_id: str, updates: dict):
        todo = self.repo.update_todo(todo_id, updates)
        if todo:
            return todo
        return None

    def delete_todo(self, todo_id: str) -> None:
        self.repo.delete_todo(todo_id)
