"""
app/services/user_service.py
ユーザーサービス
"""

from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self) -> None:
        self.repo = UserRepository()

    def create_user(self, user_id: str, email: str, name: str):
        user = self.repo.create_user(user_id, email, name)
        return user

    def get_user_by_id(self, user_id: str):
        user = self.repo.get_user(user_id)
        if user:
            return user
        return None
