from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserRead
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])
service = UserService()


@router.post("", response_model=UserRead)
def create_user(body: UserCreate):
    return service.create_user(body)


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: str):
    user = service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
