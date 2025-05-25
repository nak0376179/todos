from typing import List, Optional, Dict, Any, TypeVar, Generic
from pydantic import BaseModel

T = TypeVar("T")

# Get応答は定義しない。


class MessageResponse(BaseModel):
    message: str


class ItemsResponse(BaseModel, Generic[T]):
    """複数のアイテムを返すための共通レスポンススキーマ"""

    Items: List[T]
    LastEvaluatedKey: Optional[Dict[str, Any]] = None


class UpdateResponse(BaseModel):
    """更新した結果を返すための共通レスポンススキーマ"""

    message: str


class DeleteResponse(BaseModel):
    """削除した結果を返すための共通レスポンススキーマ"""

    message: str
