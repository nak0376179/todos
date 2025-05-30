import os
from datetime import datetime
from typing import Optional

import boto3

from app.models.user import User

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource("dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION)
USER_TABLE_NAME = "users"


class UserRepository:
    def __init__(self):
        self.table = dynamodb.Table(USER_TABLE_NAME)

    def create_user(self, user: User) -> User:
        item = user.model_dump()
        if isinstance(item.get("created_at"), datetime):
            item["created_at"] = item["created_at"].isoformat()
        self.table.put_item(Item=item)
        return user

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        response = self.table.get_item(Key={"user_id": user_id})
        item = response.get("Item")
        if item:
            return User(**item)
        return None

    def get_user_by_email(self, email: str) -> Optional[User]:
        response = self.table.scan(
            FilterExpression="email = :email",
            ExpressionAttributeValues={":email": email},
        )
        items = response.get("Items", [])
        if items:
            return User(**items[0])
        return None
