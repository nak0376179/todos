import uuid
from datetime import datetime
from typing import List, Optional

from app.models.todo import Todo
from app.repositories.todo_repository import TodoRepository
from app.schemas.todo import TodoCreate, TodoRead, TodoUpdate


class TodoService:
    def __init__(self) -> None:
        self.repo = TodoRepository()

    def create_todo(self, todo_create: TodoCreate, owner_user_id: str) -> TodoRead:
        now = datetime.utcnow()
        todo = Todo(
            todo_id=str(uuid.uuid4()),
            group_id=todo_create.group_id,
            title=todo_create.title,
            description=todo_create.description,
            owner_user_id=owner_user_id,
            due_date=todo_create.due_date,
            is_completed=False,
            created_at=now,
            updated_at=now,
        )
        self.repo.create_todo(todo)
        return TodoRead(**todo.model_dump())

    def get_todo_by_id(self, todo_id: str) -> Optional[TodoRead]:
        todo = self.repo.get_todo_by_id(todo_id)
        if todo:
            return TodoRead(**todo.model_dump())
        return None

    def list_todos_by_group(self, group_id: str) -> List[TodoRead]:
        todos = self.repo.list_todos_by_group(group_id)
        return [TodoRead(**t.model_dump()) for t in todos]

    def update_todo(self, todo_id: str, todo_update: TodoUpdate) -> Optional[TodoRead]:
        updates = todo_update.model_dump(exclude_unset=True)
        updates["updated_at"] = datetime.utcnow()
        todo = self.repo.update_todo(todo_id, updates)
        if todo:
            return TodoRead(**todo.model_dump())
        return None

    def delete_todo(self, todo_id: str) -> None:
        self.repo.delete_todo(todo_id)
