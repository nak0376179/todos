import uuid
from datetime import datetime

import pytest
from fastapi.testclient import TestClient

from app.main import app


def unique_id():
    return str(uuid.uuid4())


client = TestClient(app)


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
        "title": "テストTODO",
        "description": "説明",
        "due_date": datetime.utcnow().isoformat(),
        "owner_user_id": owner_user_id,
    }
    res = client.post(f"/groups/{group_id}/todos", json=todo_data)
    assert res.status_code == 200
    todo = res.json()
    return todo["todo_id"], group_id


def test_作成できる(group_and_user):
    """TODOを作成できる"""
    group_id = group_and_user["group_id"]
    owner_user_id = group_and_user["owner_user_id"]
    todo_data = {
        "title": "新規TODO",
        "description": "説明",
        "due_date": datetime.utcnow().isoformat(),
        "owner_user_id": owner_user_id,
    }
    res = client.post(f"/groups/{group_id}/todos", json=todo_data)
    assert res.status_code == 200
    todo = res.json()
    assert todo["title"] == "新規TODO"


def test_取得できる(created_todo_id):
    """TODOをIDで取得できる"""
    todo_id, group_id = created_todo_id
    res = client.get(f"/groups/{group_id}/todos/{todo_id}")
    assert res.status_code == 200
    assert res.json()["todo_id"] == todo_id


def test_一覧取得できる(group_and_user, created_todo_id):
    """TODO一覧を取得できる"""
    group_id = group_and_user["group_id"]
    res = client.get(f"/groups/{group_id}/todos")
    assert res.status_code == 200
    todos = res.json()
    assert any(t["group_id"] == group_id for t in todos)


def test_更新できる(created_todo_id):
    """TODOを更新できる"""
    todo_id, group_id = created_todo_id
    update_data = {"title": "更新後タイトル", "is_completed": True}
    res = client.patch(f"/groups/{group_id}/todos/{todo_id}", json=update_data)
    assert res.status_code == 200
    assert res.json()["title"] == "更新後タイトル"
    assert res.json()["is_completed"] is True


def test_削除できる(created_todo_id):
    """TODOを削除できる"""
    todo_id, group_id = created_todo_id
    res = client.delete(f"/groups/{group_id}/todos/{todo_id}")
    assert res.status_code == 200
    assert res.json()["result"] == "ok"


def test_削除後取得できない(created_todo_id):
    """削除後はTODOを取得できない"""
    todo_id, group_id = created_todo_id
    res = client.get(f"/groups/{group_id}/todos/{todo_id}")
    assert res.status_code == 404
