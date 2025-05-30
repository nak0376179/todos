import boto3
import os
import glob
import json
import sys

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

TABLES_DIR = os.path.join(os.path.dirname(__file__), "tables")
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

dynamodb = boto3.resource(
    "dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION
)
client = boto3.client(
    "dynamodb", endpoint_url=DYNAMODB_ENDPOINT_URL, region_name=AWS_REGION
)


def create_tables():
    table_files = glob.glob(os.path.join(TABLES_DIR, "*.json"))
    for table_file in table_files:
        with open(table_file, "r", encoding="utf-8") as f:
            table_def = json.load(f)
        table_name = table_def.get("TableName")
        try:
            client.create_table(**table_def)
            print(f"Created table: {table_name}")
        except client.exceptions.ResourceInUseException:
            print(f"Table {table_name} already exists.")


def insert_data():
    data_files = glob.glob(os.path.join(DATA_DIR, "*.jsonl"))
    for data_file in data_files:
        table_name = os.path.splitext(os.path.basename(data_file))[0]
        table = dynamodb.Table(table_name)
        with open(data_file, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    item = json.loads(line)
                    table.put_item(Item=item)
        print(f"Inserted data into: {table_name}")


def main():
    args = sys.argv[1:]
    if not args:
        create_tables()
        insert_data()
    else:
        if "--create-tables" in args:
            create_tables()
        if "--insert-data" in args:
            insert_data()


if __name__ == "__main__":
    main()
