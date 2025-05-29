import boto3
import os
from datetime import datetime

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

dynamodb = boto3.resource(
    "dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION
)
client = boto3.client(
    "dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION
)


def create_table_users():
    try:
        client.create_table(
            TableName="users",
            KeySchema=[{"AttributeName": "user_id", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "user_id", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )
        print("Created table: users")
    except client.exceptions.ResourceInUseException:
        print("Table users already exists.")


def create_table_groups():
    try:
        client.create_table(
            TableName="groups",
            KeySchema=[{"AttributeName": "group_id", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "group_id", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )
        print("Created table: groups")
    except client.exceptions.ResourceInUseException:
        print("Table groups already exists.")


def create_table_todos():
    try:
        client.create_table(
            TableName="todos",
            KeySchema=[{"AttributeName": "todo_id", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "todo_id", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )
        print("Created table: todos")
    except client.exceptions.ResourceInUseException:
        print("Table todos already exists.")


def create_table_group_members():
    try:
        client.create_table(
            TableName="groupmembers",
            KeySchema=[
                {"AttributeName": "group_id", "KeyType": "HASH"},
                {"AttributeName": "user_id", "KeyType": "RANGE"},
            ],
            AttributeDefinitions=[
                {"AttributeName": "group_id", "AttributeType": "S"},
                {"AttributeName": "user_id", "AttributeType": "S"},
            ],
            BillingMode="PAY_PER_REQUEST",
        )
        print("Created table: groupmembers")
    except client.exceptions.ResourceInUseException:
        print("Table groupmembers already exists.")


def insert_sample_data():
    users = [
        {
            "user_id": "u1",
            "email": "admin@example.com",
            "name": "管理者",
            "created_at": datetime.utcnow().isoformat(),
        },
        {
            "user_id": "u2",
            "email": "member@example.com",
            "name": "メンバー",
            "created_at": datetime.utcnow().isoformat(),
        },
    ]
    groups = [
        {
            "group_id": "g1",
            "name": "テストグループ",
            "owner_user_id": "u1",
            "created_at": datetime.utcnow().isoformat(),
        },
    ]
    todos = [
        {
            "todo_id": "t1",
            "group_id": "g1",
            "title": "サンプルTODO",
            "description": "説明",
            "owner_user_id": "u1",
            "due_date": None,
            "is_completed": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        },
    ]
    group_members = [
        {
            "group_id": "g1",
            "user_id": "u1",
            "role": "admin",
            "invited_at": datetime.utcnow().isoformat(),
        },
        {
            "group_id": "g1",
            "user_id": "u2",
            "role": "member",
            "invited_at": datetime.utcnow().isoformat(),
        },
    ]
    for u in users:
        dynamodb.Table("users").put_item(Item=u)
    for g in groups:
        dynamodb.Table("groups").put_item(Item=g)
    for t in todos:
        dynamodb.Table("todos").put_item(Item=t)
    for m in group_members:
        dynamodb.Table("groupmembers").put_item(Item=m)
    print("Inserted sample data.")


def main():
    create_table_users()
    create_table_groups()
    create_table_todos()
    create_table_group_members()
    insert_sample_data()


if __name__ == "__main__":
    main()
