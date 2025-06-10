"""
app/config.py
設定
"""

import os
from typing import Final

# DynamoDB設定
DYNAMODB_ENDPOINT_URL: Final[str] = os.getenv("DYNAMODB_ENDPOINT_URL", "http://localhost:4566")
AWS_REGION: Final[str] = os.getenv("AWS_REGION", "ap-northeast-1")

# テーブル名
TODO_TABLE_NAME: Final[str] = "todos"
GROUP_TABLE_NAME: Final[str] = "groups"
USER_TABLE_NAME: Final[str] = "users"


class Settings:
    """アプリケーション設定"""

    DYNAMODB_ENDPOINT_URL: str = DYNAMODB_ENDPOINT_URL
    AWS_REGION: str = AWS_REGION
    TODO_TABLE_NAME: str = TODO_TABLE_NAME
    GROUP_TABLE_NAME: str = GROUP_TABLE_NAME
    USER_TABLE_NAME: str = USER_TABLE_NAME


settings = Settings()
