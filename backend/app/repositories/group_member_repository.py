import os
from datetime import datetime
from typing import List, Optional

import boto3

from app.models.group_member import GroupMember

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource("dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION)
GROUP_MEMBER_TABLE_NAME = "groupmembers"


class GroupMemberRepository:
    def __init__(self):
        self.table = dynamodb.Table(GROUP_MEMBER_TABLE_NAME)

    def add_member(self, member: GroupMember) -> GroupMember:
        item = member.model_dump()
        if isinstance(item.get("invited_at"), datetime):
            item["invited_at"] = item["invited_at"].isoformat()
        self.table.put_item(Item=item)
        return member

    def list_members_by_group(self, group_id: str) -> List[GroupMember]:
        response = self.table.scan(
            FilterExpression="group_id = :group_id",
            ExpressionAttributeValues={":group_id": group_id},
        )
        items = response.get("Items", [])
        return [GroupMember(**item) for item in items]

    def get_member(self, group_id: str, user_id: str) -> Optional[GroupMember]:
        response = self.table.get_item(Key={"group_id": group_id, "user_id": user_id})
        item = response.get("Item")
        if item:
            return GroupMember(**item)
        return None
