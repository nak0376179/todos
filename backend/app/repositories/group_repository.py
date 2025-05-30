import os
from datetime import datetime
from typing import Optional

import boto3

from app.models.group import Group

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource("dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION)
GROUP_TABLE_NAME = "groups"


class GroupRepository:
    def __init__(self):
        self.table = dynamodb.Table(GROUP_TABLE_NAME)

    def create_group(self, group: Group) -> Group:
        item = group.model_dump()
        if isinstance(item.get("created_at"), datetime):
            item["created_at"] = item["created_at"].isoformat()
        self.table.put_item(Item=item)
        return group

    def get_group_by_id(self, group_id: str) -> Optional[Group]:
        response = self.table.get_item(Key={"group_id": group_id})
        item = response.get("Item")
        if item:
            return Group(**item)
        return None
