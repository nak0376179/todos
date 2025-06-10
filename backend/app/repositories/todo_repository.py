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

from app.config import settings
from app.repositories.dynamodb import DynamoDBRepository

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=DYNAMODB_ENDPOINT_URL,
    region_name=AWS_REGION,
)
TODO_TABLE_NAME = "todos"

logger = logging.getLogger(__name__)


class TodoRepository(DynamoDBRepository):
    def __init__(self):
        super().__init__(settings.TODO_TABLE_NAME)

    def list_todos_by_group(
        self, group_id: str, limit: int = 1000, start_key: Optional[dict] = None
    ) -> tuple[List[dict], Optional[dict]]:
        """
        グループに属するTODO一覧を取得する

        Args:
            group_id: グループID
            limit: 取得件数の上限
            start_key: ページネーションの開始キー

        Returns:
            tuple[List[dict], Optional[dict]]: (TODO一覧, 次のページの開始キー)
        """
        key_condition_expression = "group_id = :group_id"
        expression_attribute_values = {":group_id": group_id}

        return self.query(
            key_condition_expression=key_condition_expression,
            expression_attribute_values=expression_attribute_values,
            limit=limit,
            start_key=start_key,
            index_name="group_id-index",
        )

    def get_todo_by_id(self, todo_id: str) -> Optional[dict]:
        """TODOをIDで取得する"""
        return self.get_item({"todo_id": todo_id})

    def create_todo(self, todo: dict) -> None:
        """TODOを作成する"""
        self.put_item(todo)

    def update_todo(self, todo_id: str, update_data: dict) -> Optional[dict]:
        """TODOを更新する"""
        if not update_data:
            return None

        update_expression = "SET "
        expression_attribute_values = {}
        expression_attribute_names = {}

        for i, (key, value) in enumerate(update_data.items()):
            if i > 0:
                update_expression += ", "
            update_expression += f"#{key} = :{key}"
            expression_attribute_values[f":{key}"] = value
            expression_attribute_names[f"#{key}"] = key

        return self.update_item(
            key={"todo_id": todo_id},
            update_expression=update_expression,
            expression_attribute_values=expression_attribute_values,
            expression_attribute_names=expression_attribute_names,
        )

    def delete_todo(self, todo_id: str) -> None:
        """TODOを削除する"""
        self.delete_item({"todo_id": todo_id})
