import logging
from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.user import UserCreate, UserGroup, UserRead
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])
service = UserService()
logger = logging.getLogger(__name__)


@router.post("", response_model=UserRead)
def create_user(body: UserCreate) -> UserRead | None:
    logger.info(f"[POST /users] body={body}")
    user = service.create_user(body)
    if not user:
        logger.error("[POST /users] Failed to create user")
        raise HTTPException(status_code=500, detail="Failed to create user")
    logger.info(f"[POST /users] created user_id={user.user_id}")
    return user


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: str) -> UserRead | None:
    logger.info(f"[GET /users/{{user_id}}] user_id={user_id}")
    user = service.get_user_by_id(user_id)
    if not user:
        logger.warning(f"[GET /users/{{user_id}}] user not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"[GET /users/{{user_id}}] found user_id={user_id}")
    return user


@router.get("/{user_id}/groups", response_model=List[UserGroup])
def get_user_groups(user_id: str) -> List[UserGroup]:
    logger.info(f"[GET /users/{{user_id}}/groups] user_id={user_id}")
    user = service.get_user_by_id(user_id)
    if not user:
        logger.warning(f"[GET /users/{{user_id}}/groups] user not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"[GET /users/{{user_id}}/groups] found groups: {user.groups}")
    return user.groups
