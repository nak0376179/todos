import uuid
from datetime import datetime, timezone

from app.models.group import Group, GroupUser
from app.models.user import UserGroup
from app.repositories.group_repository import GroupRepository
from app.repositories.user_repository import UserRepository
from app.schemas.group import GroupCreate, GroupRead


class GroupService:
    def __init__(self):
        self.group_repo = GroupRepository()
        self.user_repo = UserRepository()

    def create_group(self, group_create: GroupCreate, owner_user_id: str) -> GroupRead:
        now = datetime.now(timezone.utc)
        group = Group(
            group_id=str(uuid.uuid4()),
            name=group_create.name,
            owner_user_id=owner_user_id,
            created_at=now,
            users=[],
        )
        # 管理者として自分を追加
        owner_user = self.user_repo.get_user_by_id(owner_user_id)
        if owner_user:
            group_user = GroupUser(
                user_id=owner_user.user_id,
                email=owner_user.email,
                name=owner_user.name or owner_user.user_id,
                role="admin",
                invited_at=now,
            )
            group.users.append(group_user)
            self.group_repo.create_group(group)
            # ユーザー側にもグループ追加
            user_group = UserGroup(
                group_id=group.group_id,
                role="admin",
                invited_at=now,
            )
            owner_user.groups.append(user_group)
            self.user_repo.update_user(owner_user)
        else:
            self.group_repo.create_group(group)
        return GroupRead(**group.model_dump())

    def invite_member(self, group_id: str, user_id: str, role: str = "member"):
        now = datetime.utcnow()
        group = self.group_repo.get_group_by_id(group_id)
        user = self.user_repo.get_user_by_id(user_id)
        if not group or not user:
            raise Exception("Group or user not found")
        # 既存メンバーでなければ追加
        if not any(u.user_id == user.user_id for u in group.users):
            group_user = GroupUser(
                user_id=user.user_id,
                email=user.email,
                name=user.name or user.user_id,
                role=role,
                invited_at=now,
            )
            group.users.append(group_user)
            self.group_repo.update_group(group)
        # ユーザー側にもグループ追加
        if not any(g.group_id == group_id for g in user.groups):
            user_group = UserGroup(
                group_id=group_id,
                role=role,
                invited_at=now,
            )
            user.groups.append(user_group)
            self.user_repo.update_user(user)
        return group
