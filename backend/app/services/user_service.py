"""
app/services/user_service.py
ユーザーサービス
"""

from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self) -> None:
        self.repo = UserRepository()

    def create_user(self, user_id: str, email: str, name: str):
        """
        ユーザーを作成する

        Args:
            user_id: ユーザーID
            email: メールアドレス
            name: ユーザー名

        Returns:
            dict: 作成されたユーザー情報
        """
        user = self.repo.create_user(user_id, email, name)
        if user:
            user["user_name"] = name  # user_nameを追加
        return user

    def get_user_by_id(self, user_id: str):
        user = self.repo.get_user(user_id)
        if user:
            return user
        return None
