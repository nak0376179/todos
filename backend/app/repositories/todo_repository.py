import logging
import os
from datetime import datetime
from typing import Any, List, Optional

import boto3

from app.models.todo import Todo

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource("dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION)
TODO_TABLE_NAME = "todos"

logger = logging.getLogger(__name__)


class TodoRepository:
    def __init__(self) -> None:
        self.table = dynamodb.Table(TODO_TABLE_NAME)

    def create_todo(self, todo: Todo) -> Todo:
        item = todo.model_dump()
        for k in ["created_at", "updated_at", "due_date"]:
            if isinstance(item.get(k), datetime):
                item[k] = item[k].isoformat()
        try:
            logger.info(f"[DynamoDB] put_item: {item}")
            self.table.put_item(Item=item)
            logger.info(f"[DynamoDB] put_item success: todo_id={todo.todo_id}")
        except Exception as e:
            logger.error(f"[DynamoDB] put_item error: {e}")
            raise
        return todo

    def get_todo_by_id(self, todo_id: str) -> Optional[Todo]:
        try:
            logger.info(f"[DynamoDB] get_item: todo_id={todo_id}")
            response = self.table.get_item(Key={"todo_id": todo_id})
            item = response.get("Item")
            logger.info(f"[DynamoDB] get_item success: found={bool(item)}")
            if item:
                return Todo(**item)
            return None
        except Exception as e:
            logger.error(f"[DynamoDB] get_item error: {e}")
            raise

    def list_todos_by_group(self, group_id: str) -> List[Todo]:
        try:
            logger.info(f"[DynamoDB] scan: group_id={group_id}")
            response = self.table.scan(
                FilterExpression="group_id = :group_id",
                ExpressionAttributeValues={":group_id": group_id},
            )
            items = response.get("Items", [])
            logger.info(f"[DynamoDB] scan success: count={len(items)}")
            return [Todo(**item) for item in items]
        except Exception as e:
            logger.error(f"[DynamoDB] scan error: {e}")
            raise

    def update_todo(self, todo_id: str, updates: dict[str, Any]) -> Optional[Todo]:
        try:
            logger.info(f"[DynamoDB] update_todo: todo_id={todo_id}, updates={updates}")
            todo = self.get_todo_by_id(todo_id)
            if not todo:
                logger.warning(f"[DynamoDB] update_todo: todo not found: {todo_id}")
                return None
            for k, v in updates.items():
                setattr(todo, k, v)
            item = todo.model_dump()
            for k in ["created_at", "updated_at", "due_date"]:
                if isinstance(item.get(k), datetime):
                    item[k] = item[k].isoformat()
            self.table.put_item(Item=item)
            logger.info(f"[DynamoDB] update_todo success: todo_id={todo_id}")
            return todo
        except Exception as e:
            logger.error(f"[DynamoDB] update_todo error: {e}")
            raise

    def delete_todo(self, todo_id: str) -> None:
        try:
            logger.info(f"[DynamoDB] delete_item: todo_id={todo_id}")
            self.table.delete_item(Key={"todo_id": todo_id})
            logger.info(f"[DynamoDB] delete_item success: todo_id={todo_id}")
        except Exception as e:
            logger.error(f"[DynamoDB] delete_item error: {e}")
            raise
