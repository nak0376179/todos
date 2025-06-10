"""
app/repositories/dynamodb.py
DynamoDB共通リポジトリ

リポジトリ層ではPydantic のモデルを使用しない
DynamoDBの仕様により1回のレスポンスは最大1MBなので、Limit（最大1000件）または5MBまでを上限とし、それ以上は中断する。
429, 500系のエラーは上位層へraiseする。
"""

import json
import logging
from typing import Any, Dict, Generic, List, Optional, Tuple, TypeVar, Union

import boto3
from boto3.dynamodb.conditions import ConditionBase
from botocore.exceptions import ClientError

from app.config import settings

logger = logging.getLogger(__name__)
T = TypeVar("T")


class DynamoDBRepository(Generic[T]):
    """
    DynamoDBの共通操作を提供するベースリポジトリクラス。

    - クエリは1MB単位でページング処理。
    - 最大5MBまでを取得対象とし、それ以上は中断。
    - 429, 500系のエラーは上位層へraiseされる。
    """

    def __init__(self, table_name: str):
        self.table_name = table_name
        self.dynamodb = boto3.resource(
            "dynamodb",
            endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
            region_name=settings.AWS_REGION,
        )
        self.table = self.dynamodb.Table(table_name)

    def query(
        self,
        key_condition_expression: Union[str, ConditionBase],
        expression_attribute_values: Dict[str, Any],
        expression_attribute_names: Optional[Dict[str, str]] = None,
        filter_expression: Optional[Union[str, ConditionBase]] = None,
        limit: int = 1000,
        start_key: Optional[Dict[str, Any]] = None,
        index_name: Optional[str] = None,
    ) -> Tuple[List[Dict[str, Any]], Optional[Dict[str, Any]]]:
        """
        DynamoDB Query操作を最大 limit 件まで繰り返して取得する。
        DynamoDBの仕様により、1回のレスポンスは最大1MBまでのため、LastEvaluatedKeyを用いたページングを行う。

        累積取得サイズが5MBを超えたらループを停止する。

        Args:
            key_condition_expression: KeyConditionExpressionオブジェクトまたは文字列
            expression_attribute_values: 式の属性値
            expression_attribute_names: 式の属性名（必要な場合のみ）
            filter_expression: FilterExpression（任意）
            limit: 最大取得件数（デフォルト1000）
            start_key: 開始キー（ページング用）
            index_name: GSI名を指定する場合に使用（デフォルト: None）

        Returns:
            items: 取得アイテムリスト
            last_evaluated_key: 次のページのためのキー（Noneなら終了）

        Raises:
            ClientError: boto3によるDynamoDBエラー（429/500系含む）
        """
        items: List[Dict[str, Any]] = []
        last_evaluated_key = start_key
        total_size_bytes = 0
        MAX_RESPONSE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB

        try:
            while True:
                query_params = {
                    "KeyConditionExpression": key_condition_expression,
                    "ExpressionAttributeValues": expression_attribute_values,
                    "Limit": min(limit - len(items), 1000),
                }

                if expression_attribute_names:
                    query_params["ExpressionAttributeNames"] = expression_attribute_names
                if filter_expression:
                    query_params["FilterExpression"] = filter_expression
                if last_evaluated_key:
                    query_params["ExclusiveStartKey"] = last_evaluated_key
                if index_name:
                    query_params["IndexName"] = index_name

                response = self.table.query(**query_params)
                page_items = response.get("Items", [])
                last_evaluated_key = response.get("LastEvaluatedKey")
                items.extend(page_items)

                page_size = len(json.dumps(page_items).encode("utf-8"))
                total_size_bytes += page_size

                logger.debug(
                    f"[DynamoDB] Queried {len(page_items)} items, "
                    f"Page size: {page_size} bytes, "
                    f"Total size so far: {total_size_bytes} bytes"
                )

                if len(items) >= limit:
                    logger.info(f"[DynamoDB] Reached item limit: {limit}")
                    break
                if total_size_bytes >= MAX_RESPONSE_SIZE_BYTES:
                    logger.warning("[DynamoDB] Reached 5MB limit, stopping pagination")
                    break
                if not last_evaluated_key:
                    break

            return items[:limit], last_evaluated_key

        except ClientError as e:
            error_code = e.response["Error"].get("Code", "Unknown")
            status_code = e.response["ResponseMetadata"]["HTTPStatusCode"]
            logger.error(f"[DynamoDB] ClientError {status_code} ({error_code}): {e}")
            raise

    def get_item(self, key: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            response = self.table.get_item(Key=key)
            return response.get("Item")
        except ClientError as e:
            logger.error(f"[DynamoDB] get_item error: {e}")
            raise

    def put_item(self, item: Dict[str, Any]) -> None:
        try:
            self.table.put_item(Item=item)
        except ClientError as e:
            logger.error(f"[DynamoDB] put_item error: {e}")
            raise

    def update_item(
        self,
        key: Dict[str, Any],
        update_expression: str,
        expression_attribute_values: Dict[str, Any],
        expression_attribute_names: Optional[Dict[str, str]] = None,
        condition_expression: Optional[Union[str, ConditionBase]] = None,
        return_values: str = "ALL_NEW",
    ) -> Optional[Dict[str, Any]]:
        try:
            params = {
                "Key": key,
                "UpdateExpression": update_expression,
                "ExpressionAttributeValues": expression_attribute_values,
                "ReturnValues": return_values,
            }
            if expression_attribute_names:
                params["ExpressionAttributeNames"] = expression_attribute_names
            if condition_expression:
                params["ConditionExpression"] = condition_expression  # type: ignore

            response = self.table.update_item(**params)
            return response.get("Attributes")
        except ClientError as e:
            logger.error(f"[DynamoDB] update_item error: {e}")
            raise

    def delete_item(self, key: Dict[str, Any]) -> None:
        try:
            self.table.delete_item(Key=key)
        except ClientError as e:
            logger.error(f"[DynamoDB] delete_item error: {e}")
            raise
