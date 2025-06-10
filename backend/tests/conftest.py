import logging

import pytest


@pytest.fixture(autouse=True)
def setup_logging():
    """テスト実行時のログ設定"""
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
