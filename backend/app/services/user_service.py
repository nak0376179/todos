from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from datetime import datetime


class UserService:
    def __init__(self):
        self.repo = UserRepository()

    def create_user(self, user_create: UserCreate) -> UserRead:
        user = User(
            user_id=user_create.email,
            email=user_create.email,
            name=user_create.name,
            created_at=datetime.utcnow(),
        )
        self.repo.create_user(user)
        return UserRead(**user.model_dump())

    def get_user_by_id(self, user_id: str) -> UserRead | None:
        user = self.repo.get_user_by_id(user_id)
        if user:
            return UserRead(**user.model_dump())
        return None
