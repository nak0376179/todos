import os
import boto3

DYNAMODB_ENDPOINT = os.environ.get("DYNAMODB_ENDPOINT", "http://localhost:4566")
TABLE_NAME = os.environ.get("DYNAMODB_TABLE", "todos")

dynamodb = boto3.resource(
    "dynamodb", endpoint_url=DYNAMODB_ENDPOINT, region_name="us-east-1"
)


def create_table():
    if TABLE_NAME in [t.name for t in dynamodb.tables.all()]:
        return
    dynamodb.create_table(
        TableName=TABLE_NAME,
        KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
        ProvisionedThroughput={"ReadCapacityUnits": 1, "WriteCapacityUnits": 1},
    )


def get_table():
    return dynamodb.Table(TABLE_NAME)
