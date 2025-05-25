import os
import boto3
from typing import Any

# テーブル名（必要に応じて環境変数などで設定）
TABLE_NAME = os.getenv("TODO_TABLE_NAME", "todos")

# LocalStack 用の DynamoDB エンドポイント
DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")


def get_table() -> Any:
    """
    Returns a DynamoDB Table resource connected to LocalStack.
    """
    dynamodb = boto3.resource(
        "dynamodb",
        endpoint_url=DYNAMODB_ENDPOINT_URL,
        region_name="ap-northeast-1",
        aws_access_key_id="dummy",  # LocalStack用ダミー
        aws_secret_access_key="dummy",
    )
    return dynamodb.Table(TABLE_NAME)


def create_table() -> None:
    """
    Create the DynamoDB table if it does not exist.
    """
    dynamodb = boto3.resource(
        "dynamodb",
        endpoint_url=DYNAMODB_ENDPOINT_URL,
        region_name="ap-northeast-1",
        aws_access_key_id="dummy",
        aws_secret_access_key="dummy",
    )
    existing_tables = [t.name for t in dynamodb.tables.all()]
    if TABLE_NAME in existing_tables:
        return

    dynamodb.create_table(
        TableName=TABLE_NAME,
        KeySchema=[{"AttributeName": "todo_id", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "todo_id", "AttributeType": "S"}],
        BillingMode="PAY_PER_REQUEST",
    )
