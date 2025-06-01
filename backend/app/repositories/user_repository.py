"""
app/repositories/user_repository.py
ユーザーリポジトリ

リポジトリ層ではPydantic のモデルを使用しない
"""

import os
from datetime import datetime
from typing import Any, Dict, List, Optional

import boto3

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource("dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION)
USER_TABLE_NAME = "users"


class UserRepository:
    def __init__(self) -> None:
        self.table = dynamodb.Table(USER_TABLE_NAME)

    def create_user(self, user_id: str, email: str, name: str) -> Dict[str, Any]:
        """
        user_id, email, name, password, created_at をもとに新規ユーザーを作成。
        created_at は ISO 文字列に変換して保存します。
        """
        iso_ts = datetime.utcnow().isoformat()  # ISO8601 文字列に変換
        item = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "created_at": iso_ts,
            "groups": [],  # 初期グループは空リスト
        }
        self.table.put_item(Item=item)
        return item

    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        user_id をキーに GetItem。存在すれば辞書を返し、なければ None。
        """
        resp = self.table.get_item(Key={"user_id": user_id})
        return resp.get("Item")

    def update_user_groups(self, user_id: str, groups: List[str]) -> Dict[str, Any]:
        """
        user_id で既存ユーザーを取得し、groups 属性だけを更新します。
        ConditionExpression によって存在チェックを行い、なければ例外を投げます。
        更新後は「最新のユーザー情報を返却」します。
        """
        # 1) 存在チェック：get_user で None ならエラーにする
        existing = self.get_user(user_id)
        if existing is None:
            raise ValueError(f"User not found: {user_id}")

        # 2) UpdateItem で groups のみを更新し、更新後の全属性を返す
        resp = self.table.update_item(
            Key={"user_id": user_id},
            UpdateExpression="SET #g = :g",
            ExpressionAttributeNames={"#g": "groups"},
            ExpressionAttributeValues={":g": groups},
            ConditionExpression="attribute_exists(user_id)",
            ReturnValues="ALL_NEW",  # 更新後のアイテムをすべて返す
        )

        # 3) 更新後の属性は resp["Attributes"] に入っている
        updated_item = resp.get("Attributes")
        if updated_item is None:
            # ReturnValues="ALL_NEW" なのに Attributes がない場合は異常なのでエラー
            raise RuntimeError("Failed to retrieve updated user data.")
        return updated_item
