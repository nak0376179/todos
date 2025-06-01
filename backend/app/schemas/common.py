"""
app/schemas/common.py
共通スキーマ

# まだQuery,DeleteItemResponseしか使っていない
"""

from typing import Any, Dict, Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class GetItemResponse(BaseModel, Generic[T]):
    message: str = Field(..., description="成功メッセージ")
    data: T = Field(..., description="登録したアイテム")


# class PostItemRequest(BaseModel, Generic[T]):


class PostItemResponse(BaseModel, Generic[T]):
    message: str = Field(..., description="成功メッセージ")
    data: T = Field(..., description="登録したアイテム")


# class PutItemRequest(BaseModel, Generic[T]):


class PutItemResponse(BaseModel, Generic[T]):
    message: str = Field(..., description="成功メッセージ")
    data: T = Field(..., description="登録したアイテム")


class UpdateItemRequest(BaseModel):
    Key: Dict[str, Any] = Field(..., description="更新対象のキー")
    UpdateExpression: str = Field(..., description="DynamoDBのUpdateExpression")
    ExpressionAttributeValues: Dict[str, Any] = Field(..., description="式で使う値のマッピング")


class UpdateItemResponse(BaseModel, Generic[T]):
    message: str = Field(..., description="成功メッセージ")


# class DeleteItemRequest(BaseModel):


class DeleteItemResponse(BaseModel, Generic[T]):
    message: str = Field(..., description="削除成功メッセージ")
    data: T = Field(..., description="削除前のアイテム（ReturnValues=ALL_OLDの場合）")


class QueryResponse(BaseModel, Generic[T]):
    items: List[T] = Field(..., alias="Items", description="取得アイテムのリスト")
    last_evaluated_key: Optional[Dict[str, Any]] = Field(
        None, alias="LastEvaluatedKey", description="DynamoDBのLastEvaluatedKey。キーの辞書オブジェクト"
    )

    class Config:
        allow_population_by_field_name = True
