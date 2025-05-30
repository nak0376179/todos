from typing import List

from fastapi import APIRouter, Query

from app.repositories.group_member_repository import GroupMemberRepository
from app.schemas.group_member import GroupMemberRead
from app.services.group_member_service import GroupMemberService

router = APIRouter(prefix="/groups/{group_id}/members", tags=["group_members"])
service = GroupMemberService()
group_member_repo = GroupMemberRepository()


@router.get("", response_model=List[GroupMemberRead])
def list_members(group_id: str):
    return service.list_members_by_group(group_id)


@router.get("/user-groups", response_model=List[GroupMemberRead], include_in_schema=True)
def list_groups_by_user(user_id: str = Query(...)):
    # 全グループメンバーからuser_id一致を抽出
    all_groups = group_member_repo.table.scan().get("Items", [])
    return [GroupMemberRead(**g) for g in all_groups if g["user_id"] == user_id]
