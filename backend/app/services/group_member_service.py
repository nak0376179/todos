from app.repositories.group_member_repository import GroupMemberRepository
from app.models.group_member import GroupMember
from app.schemas.group_member import GroupMemberCreate, GroupMemberRead
from typing import List, Optional
from datetime import datetime


class GroupMemberService:
    def __init__(self):
        self.repo = GroupMemberRepository()

    def add_member(self, member_create: GroupMemberCreate) -> GroupMemberRead:
        member = GroupMember(
            group_id=member_create.group_id,
            user_id=member_create.user_id,
            role=member_create.role,
            invited_at=datetime.utcnow(),
        )
        self.repo.add_member(member)
        return GroupMemberRead(**member.model_dump())

    def list_members_by_group(self, group_id: str) -> List[GroupMemberRead]:
        members = self.repo.list_members_by_group(group_id)
        return [GroupMemberRead(**m.model_dump()) for m in members]

    def get_member(self, group_id: str, user_id: str) -> Optional[GroupMemberRead]:
        member = self.repo.get_member(group_id, user_id)
        if member:
            return GroupMemberRead(**member.model_dump())
        return None
