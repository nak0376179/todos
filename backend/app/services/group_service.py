from app.repositories.group_repository import GroupRepository
from app.repositories.group_member_repository import GroupMemberRepository
from app.models.group import Group
from app.models.group_member import GroupMember
from app.schemas.group import GroupCreate, GroupRead
from app.schemas.group_member import GroupMemberCreate
from datetime import datetime
import uuid


class GroupService:
    def __init__(self):
        self.group_repo = GroupRepository()
        self.member_repo = GroupMemberRepository()

    def create_group(self, group_create: GroupCreate, owner_user_id: str) -> GroupRead:
        group = Group(
            group_id=str(uuid.uuid4()),
            name=group_create.name,
            owner_user_id=owner_user_id,
            created_at=datetime.utcnow(),
        )
        self.group_repo.create_group(group)
        # 管理者として自分を追加
        member = GroupMember(
            group_id=group.group_id,
            user_id=owner_user_id,
            role="admin",
            invited_at=datetime.utcnow(),
        )
        self.member_repo.add_member(member)
        return GroupRead(**group.model_dump())

    def invite_member(self, group_id: str, user_id: str, role: str = "member"):
        member = GroupMember(
            group_id=group_id,
            user_id=user_id,
            role=role,
            invited_at=datetime.utcnow(),
        )
        self.member_repo.add_member(member)
        return member
