import boto3
from app.models.todo import Todo
from typing import Optional, List
import os
from datetime import datetime

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource(
    "dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION
)
TODO_TABLE_NAME = "todos"


class TodoRepository:
    def __init__(self):
        self.table = dynamodb.Table(TODO_TABLE_NAME)

    def create_todo(self, todo: Todo) -> Todo:
        item = todo.model_dump()
        for k in ["created_at", "updated_at", "due_date"]:
            if isinstance(item.get(k), datetime):
                item[k] = item[k].isoformat()
        self.table.put_item(Item=item)
        return todo

    def get_todo_by_id(self, todo_id: str) -> Optional[Todo]:
        response = self.table.get_item(Key={"todo_id": todo_id})
        item = response.get("Item")
        if item:
            return Todo(**item)
        return None

    def list_todos_by_group(self, group_id: str) -> List[Todo]:
        response = self.table.scan(
            FilterExpression="group_id = :group_id",
            ExpressionAttributeValues={":group_id": group_id},
        )
        items = response.get("Items", [])
        return [Todo(**item) for item in items]

    def update_todo(self, todo_id: str, updates: dict) -> Optional[Todo]:
        todo = self.get_todo_by_id(todo_id)
        if not todo:
            return None
        for k, v in updates.items():
            setattr(todo, k, v)
        item = todo.model_dump()
        for k in ["created_at", "updated_at", "due_date"]:
            if isinstance(item.get(k), datetime):
                item[k] = item[k].isoformat()
        self.table.put_item(Item=item)
        return todo

    def delete_todo(self, todo_id: str) -> None:
        self.table.delete_item(Key={"todo_id": todo_id})
