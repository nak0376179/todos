from fastapi import APIRouter
from app.repositories.group_member_repository import GroupMemberRepository
from app.schemas.group_member import GroupMemberRead
from typing import List

router = APIRouter(tags=["user_groups"])
group_member_repo = GroupMemberRepository()


@router.get("/users/{user_id}/groups", response_model=List[GroupMemberRead])
def list_groups_by_user(user_id: str):
    all_groups = group_member_repo.table.scan().get("Items", [])
    return [GroupMemberRead(**g) for g in all_groups if g["user_id"] == user_id]
