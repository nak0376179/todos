"""
app/repositories/todo_repository.py
Todoリポジトリ

リポジトリ層ではPydantic のモデルを使用しない
"""

import logging
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

import boto3
from boto3.dynamodb.conditions import Attr

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=DYNAMODB_ENDPOINT_URL,
    region_name=AWS_REGION,
)
TODO_TABLE_NAME = "todos"

logger = logging.getLogger(__name__)


class TodoRepository:
    def __init__(self) -> None:
        self.table = dynamodb.Table(TODO_TABLE_NAME)

    def create_todo(
        self,
        todo_id: str,
        group_id: str,
        title: str,
        description: str,
        due_date: str,
        owner_user_id: str,
    ) -> Dict[str, Any]:
        """
        新規 Todo を作成して保存します。
        - due_date, created_at, updated_at は ISO 8601 文字列で保存。
        - 成功すれば保存したアイテム（辞書）を返します。
        """
        now_iso = datetime.now().isoformat()
        item = {
            "todo_id": todo_id,
            "group_id": group_id,
            "title": title,
            "description": description,
            "due_date": due_date,
            "owner_user_id": owner_user_id,
            "created_at": now_iso,
            "updated_at": now_iso,
        }
        try:
            logger.info(f"[DynamoDB] put_item: {item}")
            self.table.put_item(Item=item)
            logger.info(f"[DynamoDB] put_item success: todo_id={todo_id}")
        except Exception as e:
            logger.error(f"[DynamoDB] put_item error: {e}")
            raise
        return item

    def get_todo_by_id(self, todo_id: str) -> Optional[Dict[str, Any]]:
        """
        todo_id をキーに GetItem。存在すれば辞書を返し、なければ None。
        """
        try:
            logger.info(f"[DynamoDB] get_item: todo_id={todo_id}")
            response = self.table.get_item(Key={"todo_id": todo_id})
            item = response.get("Item")
            logger.info(f"[DynamoDB] get_item success: found={bool(item)}")
            return item
        except Exception as e:
            logger.error(f"[DynamoDB] get_item error: {e}")
            raise

    def list_todos_by_group(self, group_id: str) -> Dict[str, Any]:
        """
        group_id でフィルタした一覧を返します。
        ※ 件数が多いと scan はコスト高になるため、実運用では GSI＋query を検討してください。
        """
        try:
            logger.info(f"[DynamoDB] scan: group_id={group_id}")
            response = self.table.scan(FilterExpression=Attr("group_id").eq(group_id))
            items = response.get("Items", [])
            logger.info(f"[DynamoDB] scan success: count={len(items)}")
            return {"Items": items, "LastEvaluatedKey": None}
        except Exception as e:
            logger.error(f"[DynamoDB] scan error: {e}")
            raise

    def update_todo(self, todo_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        todo_id をキーに部分更新を行い、更新後の最新アイテムを返します。
        - updates: 更新したい属性のキーと値のマッピング
        - 存在しなければ None を返し、更新があれば ALL_NEW で返却します。
        """

        # 1) 存在チェック
        existing = self.get_todo_by_id(todo_id)
        if existing is None:
            logger.warning(f"[DynamoDB] update_todo: not found: todo_id={todo_id}")
            return None

        # 2) UpdateExpression を動的に組み立てる
        expr_list = []
        expr_values: Dict[str, Any] = {}
        expr_names: Dict[str, str] = {}
        for idx, (key, value) in enumerate(updates.items()):
            placeholder_name = f"#attr{idx}"
            placeholder_value = f":val{idx}"
            expr_list.append(f"{placeholder_name} = {placeholder_value}")
            expr_names[placeholder_name] = key
            expr_values[placeholder_value] = value

        # 3) updated_at だけは常に上書きする
        idx = len(expr_list)
        placeholder_name = f"#attr{idx}"
        placeholder_value = f":val{idx}"
        expr_list.append(f"{placeholder_name} = {placeholder_value}")
        expr_names[placeholder_name] = "updated_at"
        expr_values[placeholder_value] = datetime.utcnow().isoformat()

        update_expression = "SET " + ", ".join(expr_list)

        try:
            logger.info(
                f"[DynamoDB] update_item: todo_id={todo_id}, "
                f"UpdateExpression={update_expression}, "
                f"ExpressionAttributeNames={expr_names}, "
                f"ExpressionAttributeValues={expr_values}"
            )
            resp = self.table.update_item(
                Key={"todo_id": todo_id},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expr_names,
                ExpressionAttributeValues=expr_values,
                ConditionExpression="attribute_exists(todo_id)",
                ReturnValues="ALL_NEW",
            )
            updated_item = resp.get("Attributes")
            logger.info(f"[DynamoDB] update_item success: todo_id={todo_id}")
            return updated_item
        except Exception as e:
            logger.error(f"[DynamoDB] update_item error: {e}")
            raise

    def delete_todo(self, todo_id: str) -> bool:
        """
        todo_id をキーに DeleteItem。存在すれば削除して True、なければ False を返します。
        """
        try:
            logger.info(f"[DynamoDB] delete_item: todo_id={todo_id}")
            resp = self.table.delete_item(
                Key={"todo_id": todo_id},
                ConditionExpression="attribute_exists(todo_id)",
            )
            status = resp.get("ResponseMetadata", {}).get("HTTPStatusCode")
            success = status == 200
            logger.info(f"[DynamoDB] delete_item success: {success}, todo_id={todo_id}")
            return success
        except Exception as e:
            logger.error(f"[DynamoDB] delete_item error: {e}")
            raise
