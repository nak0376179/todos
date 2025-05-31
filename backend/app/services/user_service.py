from datetime import datetime

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreateRequest, UserReadResponse


class UserService:
    def __init__(self) -> None:
        self.repo = UserRepository()

    def create_user(self, user_create: UserCreateRequest) -> UserReadResponse | None:
        user = User(
            user_id=user_create.email,
            email=user_create.email,
            user_name=user_create.name,  # Changed from user_name to name to match schema
            created_at=datetime.utcnow(),
        )
        self.repo.create_user(user)
        return UserReadResponse(**user.model_dump())

    def get_user_by_id(self, user_id: str) -> UserReadResponse | None:
        user = self.repo.get_user_by_id(user_id)
        if user:
            return UserReadResponse(**user.model_dump())
        return None
