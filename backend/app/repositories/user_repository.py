"""
app/repositories/user_repository.py
ユーザーリポジトリ

リポジトリ層ではPydantic のモデルを使用しない
"""

import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.config import settings
from app.repositories.dynamodb import DynamoDBRepository

logger = logging.getLogger(__name__)


class UserRepository(DynamoDBRepository):
    def __init__(self) -> None:
        super().__init__(settings.USER_TABLE_NAME)

    def create_user(self, user_id: str, email: str, name: str) -> Dict[str, Any]:
        """
        ユーザーを新規作成する
        """
        iso_ts = datetime.utcnow().isoformat()
        item = {
            "user_id": user_id,
            "email": email,
            "user_name": name,
            "created_at": iso_ts,
            "groups": [],
        }
        self.put_item(item)
        return item

    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        user_id をキーにユーザー情報を取得する
        """
        return self.get_item({"user_id": user_id})

    def update_user_groups(self, user_id: str, groups: List[str]) -> Dict[str, Any]:
        """
        groups 属性を更新する（存在チェックあり）
        """
        existing = self.get_user(user_id)
        if existing is None:
            raise ValueError(f"User not found: {user_id}")

        update_expression = "SET #groups = :groups"
        expression_attribute_names = {"#groups": "groups"}
        expression_attribute_values = {":groups": groups}

        updated = self.update_item(
            key={"user_id": user_id},
            update_expression=update_expression,
            expression_attribute_values=expression_attribute_values,
            expression_attribute_names=expression_attribute_names,
            condition_expression="attribute_exists(user_id)",
            return_values="ALL_NEW",
        )

        if updated is None:
            raise RuntimeError("Failed to retrieve updated user data.")

        return updated
