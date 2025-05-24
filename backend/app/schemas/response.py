from typing import List, Optional, Dict, Any, TypeVar, Generic
from pydantic import BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")

# Get応答は定義しない。


class ItemsResponse(GenericModel, Generic[T]):
    """複数のアイテムを返すためのモデルです。"""

    Items: List[T]
    LastEvaluatedKey: Optional[Dict[str, Any]] = None


class PostResponse(BaseModel):
    """新しく作成した結果を返すためのモデルです。"""

    message: str


class UpdateResponse(BaseModel):
    """更新した結果を返すためのモデルです。"""

    message: str


class DeleteResponse(BaseModel):
    """削除した結果を返すためのモデルです。"""

    message: str
