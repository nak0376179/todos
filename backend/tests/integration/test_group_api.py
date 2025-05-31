import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@pytest.fixture
def admin_user():
    # 事前にadminユーザーを作成
    res = client.post("/users", json={"email": "admin@example.com", "name": "管理者"})
    assert res.status_code == 200
    return res.json()


@pytest.fixture
def member_user():
    res = client.post("/users", json={"email": "member@example.com", "name": "メンバー"})
    assert res.status_code == 200
    return res.json()


def test_create_group(admin_user):
    res = client.post("/groups", json={"name": "テストグループ", "owner_user_id": admin_user["user_id"]})
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "テストグループ"
    assert data["owner_user_id"] == admin_user["user_id"]
    assert len(data["users"]) == 1
    assert data["users"][0]["user_id"] == admin_user["user_id"]
    assert data["users"][0]["role"] == "admin"
    # group_idを返す
    return data["group_id"]


def test_invite_member(admin_user, member_user):
    # グループ作成
    res = client.post("/groups", json={"name": "テストグループ", "owner_user_id": admin_user["user_id"]})
    group = res.json()
    group_id = group["group_id"]
    # メンバー招待
    res2 = client.post(f"/groups/{group_id}/invite", json={"user_id": member_user["user_id"], "role": "member"})
    assert res2.status_code == 200
    # グループ取得してメンバーが2人いることを確認
    res3 = client.get(f"/groups/{group_id}")
    assert res3.status_code == 200
    group_data = res3.json()
    user_ids = [u["user_id"] for u in group_data["users"]]
    assert admin_user["user_id"] in user_ids
    assert member_user["user_id"] in user_ids
