import pytest
from fastapi.testclient import TestClient
from app.main import app
import uuid
from datetime import datetime

client = TestClient(app)


def unique_id():
    return str(uuid.uuid4())


@pytest.fixture(scope="module")
def group_and_user():
    # テスト用のダミーID
    return {
        "group_id": unique_id(),
        "owner_user_id": unique_id(),
    }


@pytest.fixture(scope="module")
def created_todo_id(group_and_user):
    group_id = group_and_user["group_id"]
    owner_user_id = group_and_user["owner_user_id"]
    todo_data = {
        "group_id": group_id,
        "title": "テストTODO",
        "description": "説明",
        "due_date": datetime.utcnow().isoformat(),
        "owner_user_id": owner_user_id,
    }
    res = client.post("/todos", json=todo_data)
    assert res.status_code == 200
    todo = res.json()
    return todo["todo_id"]


def test_作成できる(group_and_user):
    """TODOを作成できる"""
    group_id = group_and_user["group_id"]
    owner_user_id = group_and_user["owner_user_id"]
    todo_data = {
        "group_id": group_id,
        "title": "新規TODO",
        "description": "説明",
        "due_date": datetime.utcnow().isoformat(),
        "owner_user_id": owner_user_id,
    }
    res = client.post("/todos", json=todo_data)
    assert res.status_code == 200
    todo = res.json()
    assert todo["title"] == "新規TODO"


def test_取得できる(created_todo_id):
    """TODOをIDで取得できる"""
    res = client.get(f"/todos/{created_todo_id}")
    assert res.status_code == 200
    assert res.json()["todo_id"] == created_todo_id


def test_一覧取得できる(group_and_user, created_todo_id):
    """TODO一覧を取得できる"""
    group_id = group_and_user["group_id"]
    res = client.get(f"/todos?group_id={group_id}")
    assert res.status_code == 200
    todos = res.json()
    assert any(t["todo_id"] == created_todo_id for t in todos)


def test_更新できる(created_todo_id):
    """TODOを更新できる"""
    update_data = {"title": "更新後タイトル", "is_completed": True}
    res = client.patch(f"/todos/{created_todo_id}", json=update_data)
    assert res.status_code == 200
    assert res.json()["title"] == "更新後タイトル"
    assert res.json()["is_completed"] is True


def test_削除できる(created_todo_id):
    """TODOを削除できる"""
    res = client.delete(f"/todos/{created_todo_id}")
    assert res.status_code == 200
    assert res.json()["result"] == "ok"


def test_削除後取得できない(created_todo_id):
    """削除後はTODOを取得できない"""
    res = client.get(f"/todos/{created_todo_id}")
    assert res.status_code == 404
