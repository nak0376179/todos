import os
import pytest
from fastapi.testclient import TestClient
from main import app
from db import create_table, get_table

os.environ["DYNAMODB_ENDPOINT"] = "http://localhost:4566"
os.environ["DYNAMODB_TABLE"] = "todos-test"

client = TestClient(app)


def setup_module(module):
    create_table()
    # テスト前にテーブルを空にする
    table = get_table()
    scan = table.scan()
    with table.batch_writer() as batch:
        for item in scan.get("Items", []):
            batch.delete_item(Key={"id": item["id"]})


def teardown_module(module):
    # テスト後にテーブルを空にする
    table = get_table()
    scan = table.scan()
    with table.batch_writer() as batch:
        for item in scan.get("Items", []):
            batch.delete_item(Key={"id": item["id"]})


def test_crud():
    # Create
    todo = {"id": "1", "title": "test", "description": "desc", "completed": False}
    r = client.post("/todos", json=todo)
    assert r.status_code == 200
    assert r.json()["id"] == "1"

    # List
    r = client.get("/todos")
    assert r.status_code == 200
    assert len(r.json()) == 1

    # Get
    r = client.get("/todos/1")
    assert r.status_code == 200
    assert r.json()["title"] == "test"

    # Update
    updated = {"id": "1", "title": "updated", "description": "desc2", "completed": True}
    r = client.put("/todos/1", json=updated)
    assert r.status_code == 200
    assert r.json()["title"] == "updated"
    assert r.json()["completed"] is True

    # Delete
    r = client.delete("/todos/1")
    assert r.status_code == 200
    assert r.json()["ok"] is True

    # Not found
    r = client.get("/todos/1")
    assert r.status_code == 404
