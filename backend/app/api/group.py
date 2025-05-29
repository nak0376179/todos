from fastapi import APIRouter, HTTPException
from app.schemas.group import GroupCreate, GroupRead
from app.schemas.group_member import GroupMemberCreate
from app.services.group_service import GroupService
from pydantic import BaseModel

router = APIRouter(prefix="/groups", tags=["groups"])
service = GroupService()


class GroupCreateRequest(BaseModel):
    name: str
    owner_user_id: str


@router.post("", response_model=GroupRead)
def create_group(body: GroupCreateRequest):
    return service.create_group(
        GroupCreate(name=body.name), owner_user_id=body.owner_user_id
    )


@router.post("/{group_id}/invite")
def invite_member(group_id: str, user_id: str):
    return service.invite_member(group_id, user_id)


@router.get("/{group_id}", response_model=GroupRead)
def get_group(group_id: str):
    group = service.group_repo.get_group_by_id(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return GroupRead(**group.model_dump())
