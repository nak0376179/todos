import os
from fastapi.testclient import TestClient
from main import app
from app.db import create_table, get_table

os.environ["DYNAMODB_ENDPOINT"] = "http://localhost:4566"
os.environ["DYNAMODB_TABLE"] = "todos-test"

client = TestClient(app)


def setup_function(function):
    create_table()
    clear_table()


def teardown_function(function):
    clear_table()


def clear_table():
    table = get_table()
    scan = table.scan()
    with table.batch_writer() as batch:
        for item in scan.get("Items", []):
            batch.delete_item(Key={"todo_id": item["todo_id"]})


def post_todo(todo=None):
    if todo is None:
        todo = default_todo()
    return client.post("/todos", json=todo)


def default_todo():
    return {"todo_id": "1", "title": "test", "description": "desc", "completed": False}


def test_todo_新規作成できること():
    r = post_todo()
    assert r.status_code == 200
    assert r.json()["todo_id"] == "1"


def test_todo_一覧取得できること():
    post_todo()
    r = client.get("/todos")
    assert r.status_code == 200
    assert len(r.json()["Items"]) == 1


def test_todo_個別取得できること():
    post_todo()
    r = client.get("/todos/1")
    assert r.status_code == 200
    assert r.json()["title"] == "test"
    assert r.json()["todo_id"] == "1"


def test_todo_更新できること():
    post_todo()
    updated = {
        "todo_id": "1",
        "title": "updated",
        "description": "desc2",
        "completed": True,
    }
    r = client.put("/todos/1", json=updated)
    assert r.status_code == 200
    assert r.json()["message"] == "ok"


def test_todo_削除できること():
    post_todo()
    r = client.delete("/todos/1")
    assert r.status_code == 200
    assert r.json()["message"] == "ok"
    r = client.get("/todos/1")
    assert r.status_code == 404
