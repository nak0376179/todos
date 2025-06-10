import logging
import uuid
from datetime import datetime

import pytest
from fastapi.testclient import TestClient

from app.main import app

logger = logging.getLogger(__name__)


def unique_id():
    return str(uuid.uuid4())


client = TestClient(app)


@pytest.fixture(scope="module")
def group_and_user():
    # テスト用のダミーID
    group_id = unique_id()
    owner_user_id = unique_id()
    logger.info(f"テスト用のグループとユーザーを作成: group_id={group_id}, owner_user_id={owner_user_id}")
    return {
        "group_id": group_id,
        "owner_user_id": owner_user_id,
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
    logger.info(f"テスト用のTODOを作成: group_id={group_id}, todo_data={todo_data}")
    res = client.post(f"/groups/{group_id}/todos", json=todo_data)
    assert res.status_code == 200
    todo = res.json()
    logger.info(f"テスト用のTODOを作成完了: todo_id={todo['todo_id']}")
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
    logger.info(f"TODO作成テスト開始: group_id={group_id}, todo_data={todo_data}")
    res = client.post(f"/groups/{group_id}/todos", json=todo_data)
    assert res.status_code == 200
    todo = res.json()
    logger.info(f"TODO作成テスト完了: todo_id={todo['todo_id']}, title={todo['title']}")
    assert todo["title"] == "新規TODO"


def test_取得できる(created_todo_id):
    """TODOをIDで取得できる"""
    todo_id, group_id = created_todo_id
    logger.info(f"TODO取得テスト開始: group_id={group_id}, todo_id={todo_id}")
    res = client.get(f"/groups/{group_id}/todos/{todo_id}")
    assert res.status_code == 200
    todo = res.json()
    logger.info(f"TODO取得テスト完了: todo_id={todo['todo_id']}, title={todo['title']}")
    assert todo["todo_id"] == todo_id


def test_一覧取得できる(group_and_user, created_todo_id):
    """TODO一覧を取得できる"""
    group_id = group_and_user["group_id"]
    logger.info(f"TODO一覧取得テスト開始: group_id={group_id}")
    res = client.get(f"/groups/{group_id}/todos")
    assert res.status_code == 200
    todos = res.json()
    logger.info(f"TODO一覧取得テスト完了: 取得件数={len(todos)}")
    # assert any(t["group_id"] == group_id for t in todos)


def test_更新できる(created_todo_id):
    """TODOを更新できる"""
    todo_id, group_id = created_todo_id
    update_data = {"title": "更新後タイトル", "is_completed": True}
    logger.info(f"TODO更新テスト開始: group_id={group_id}, todo_id={todo_id}, update_data={update_data}")
    res = client.patch(f"/groups/{group_id}/todos/{todo_id}", json=update_data)
    assert res.status_code == 200
    todo = res.json()
    logger.info(
        f"TODO更新テスト完了: todo_id={todo['todo_id']}, title={todo['title']}, is_completed={todo['is_completed']}"
    )
    assert todo["title"] == "更新後タイトル"
    assert todo["is_completed"] is True


def test_削除できる(created_todo_id):
    """TODOを削除できる"""
    todo_id, group_id = created_todo_id
    logger.info(f"TODO削除テスト開始: group_id={group_id}, todo_id={todo_id}")
    res = client.delete(f"/groups/{group_id}/todos/{todo_id}")
    assert res.status_code == 200
    response = res.json()
    logger.info(f"TODO削除テスト完了: response={response}")
    assert response["todo_id"] == todo_id


def test_削除後取得できない(created_todo_id):
    """削除後はTODOを取得できない"""
    todo_id, group_id = created_todo_id
    logger.info(f"削除後のTODO取得テスト開始: group_id={group_id}, todo_id={todo_id}")
    res = client.get(f"/groups/{group_id}/todos/{todo_id}")
    logger.info(f"削除後のTODO取得テスト完了: status_code={res.status_code}")
    assert res.status_code == 404
