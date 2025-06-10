"""
app/repositories/group_repository.py
グループリポジトリ

リポジトリ層ではPydantic のモデルを使用しない
"""

import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.config import settings
from app.repositories.dynamodb import DynamoDBRepository

logger = logging.getLogger(__name__)


class GroupRepository(DynamoDBRepository):
    def __init__(self) -> None:
        super().__init__(settings.GROUP_TABLE_NAME)

    def create_group(
        self,
        group_id: str,
        group_name: str,
        owner_user_id: str,
        users: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        新規グループを作成して保存します。
        - created_at は ISO8601 形式の文字列で保存。
        """
        now_iso = datetime.now().isoformat()
        item = {
            "group_id": group_id,
            "group_name": group_name,
            "owner_user_id": owner_user_id,
            "created_at": now_iso,
            "users": users,
        }
        try:
            logger.info(f"[DynamoDB] put_item: {item}")
            self.put_item(item)
            logger.info(f"[DynamoDB] put_item success: group_id={group_id}")
        except Exception as e:
            logger.error(f"[DynamoDB] put_item error: {e}")
            raise
        return item

    def get_group_by_id(self, group_id: str) -> Optional[Dict[str, Any]]:
        """
        group_id をキーに GetItem。存在すれば辞書を返し、なければ None。
        """
        try:
            logger.info(f"[DynamoDB] get_item: group_id={group_id}")
            item = self.get_item({"group_id": group_id})
            logger.info(f"[DynamoDB] get_item success: found={bool(item)}")
            return item
        except Exception as e:
            logger.error(f"[DynamoDB] get_item error: {e}")
            raise
