from typing import List, Optional
from app.schemas.todo import Todo
from app.models.todo import TodoModel
from app.db import get_table
from app.schemas.response import ItemsResponse


class TodoRepository:
    @staticmethod
    def list_todos() -> ItemsResponse[Todo]:
        table = get_table()
        scan_result = table.scan()
        items = scan_result.get("Items", [])
        last_evaluated_key = scan_result.get("LastEvaluatedKey")
        return ItemsResponse[Todo](Items=[Todo(**item) for item in items], LastEvaluatedKey=last_evaluated_key)

    @staticmethod
    def get_todo(todo_id: str) -> Optional[Todo]:
        table = get_table()
        item = table.get_item(Key={"id": todo_id}).get("Item")
        if not item:
            return None
        return Todo(**item)

    @staticmethod
    def create_todo(todo: Todo) -> Todo:
        table = get_table()
        table.put_item(Item=todo.model_dump())
        return todo

    @staticmethod
    def update_todo(todo: Todo) -> Todo:
        table = get_table()
        table.put_item(Item=todo.model_dump())
        return todo

    @staticmethod
    def delete_todo(todo_id: str) -> bool:
        table = get_table()
        table.delete_item(Key={"id": todo_id})
        return True
