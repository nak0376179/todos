"""
app/services/todo_service.py
Todoサービス
"""

import logging
import uuid
from datetime import datetime
from typing import List, Optional, Tuple

from fastapi import HTTPException

# from app.repositories.mock_todo_repository import TodoRepository
from app.repositories.todo_repository import TodoRepository

logger = logging.getLogger(__name__)


class TodoService:
    def __init__(self):
        self.repo = TodoRepository()

    def list_todos_by_group(
        self, group_id: str, limit: int = 1000, start_key: Optional[dict] = None
    ) -> Tuple[List[dict], Optional[dict]]:
        """グループに属するTODO一覧を取得する"""
        return self.repo.list_todos_by_group(group_id, limit, start_key)

    def create_todo(
        self,
        group_id: str,
        title: str,
        description: str,
        due_date: str,
        owner_user_id: str,
    ) -> dict:
        """TODOを作成する"""
        todo_id = str(uuid.uuid4())
        now_iso = datetime.utcnow().isoformat()
        todo = {
            "todo_id": todo_id,
            "group_id": group_id,
            "title": title,
            "description": description,
            "due_date": due_date,
            "owner_user_id": owner_user_id,
            "created_at": now_iso,
            "updated_at": now_iso,
        }
        self.repo.create_todo(todo)
        return todo

    def get_todo_by_id(self, todo_id: str) -> Optional[dict]:
        """TODOをIDで取得する"""
        return self.repo.get_todo_by_id(todo_id)

    def update_todo(self, todo_id: str, update_data: dict) -> Optional[dict]:
        """TODOを更新する"""
        if not update_data:
            return None

        # updated_atを常に更新
        update_data["updated_at"] = datetime.utcnow().isoformat()
        return self.repo.update_todo(todo_id, update_data)

    def delete_todo(self, group_id: str, todo_id: str) -> None:
        """
        TODOを削除する

        Args:
            group_id: グループID
            todo_id: TODOのID
        """
        todo = self.get_todo_by_id(todo_id)
        if not todo or todo["group_id"] != group_id:
            logger.warning(f"[TodoService.delete_todo] not found: group_id={group_id}, todo_id={todo_id}")
            raise HTTPException(status_code=404, detail="Not found")
        self.repo.delete_todo(todo_id)
        logger.info(f"[TodoService.delete_todo] deleted: group_id={group_id}, todo_id={todo_id}")
