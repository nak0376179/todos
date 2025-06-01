"""
app/services/group_service.py
グループサービス
"""

import uuid
from datetime import datetime, timezone

from app.repositories.group_repository import GroupRepository
from app.repositories.user_repository import UserRepository


class GroupService:
    def __init__(self) -> None:
        self.group_repo = GroupRepository()
        self.user_repo = UserRepository()

    def create_group(self, group_name: str, owner_user_id: str):
        now = datetime.now(timezone.utc)
        group_id = str(uuid.uuid4())

        # 管理者として自分を追加
        owner_user = self.user_repo.get_user(owner_user_id)
        if not owner_user:
            raise Exception("User not found")

        group_user = {
            "user_id": owner_user["user_id"],
            "email": owner_user["email"],
            "user_name": owner_user["user_name"] or owner_user["user_id"],
            "role": "admin",
            "invited_at": now,
        }
        users = [group_user]
        res = self.group_repo.create_group(group_id, group_name, owner_user_id, users)

        # ユーザー側にもグループ追加
        user_group = {"group_id": group_id, "group_name": group_name, "role": "admin", "invited_at": now}
        owner_user["groups"].append(user_group)
        self.user_repo.update_user_groups(owner_user_id, owner_user["groups"])

        return res
