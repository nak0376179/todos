import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.schemas.group import GroupReadResponse
from app.services.group_service import GroupService

router = APIRouter(prefix="/groups", tags=["groups"])
service = GroupService()
logger = logging.getLogger(__name__)


class GroupCreateRequest(BaseModel):
    group_name: str
    owner_user_id: str


class InviteMemberRequest(BaseModel):
    user_id: str
    role: str = "member"


@router.post("", response_model=GroupReadResponse)
def create_group(body: GroupCreateRequest) -> GroupReadResponse:
    logger.info(f"[POST /groups] body={body}")
    group = service.create_group(body.group_name, owner_user_id=body.owner_user_id)
    logger.info(f"[POST /groups] created group_id={group.group_id}")
    return group


# @router.post("/{group_id}/invite")
# def invite_member(group_id: str, body: InviteMemberRequest) -> GroupRead:
#    logger.info(f"[POST /groups/{{group_id}}/invite] group_id={group_id}, body={body}")
#    result = service.invite_member(group_id, body.user_id, body.role)
#    logger.info(f"[POST /groups/{{group_id}}/invite] invited user_id={body.user_id} to group_id={group_id}")
#   return result


@router.get("/{group_id}", response_model=GroupReadResponse)
def get_group(group_id: str) -> GroupReadResponse:
    logger.info(f"[GET /groups/{{group_id}}] group_id={group_id}")
    group = service.group_repo.get_group_by_id(group_id)
    if not group:
        logger.warning(f"[GET /groups/{{group_id}}] group not found: {group_id}")
        raise HTTPException(status_code=404, detail="Group not found")
    logger.info(f"[GET /groups/{{group_id}}] found group_id={group_id}")
    return GroupReadResponse(**group)
