import json
import logging
from pathlib import Path
from typing import List, Optional

from app.repositories.todo_repository import TodoRepository

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

MOCK_TODO_FILE = Path(__file__).parent / "mocks" / "todos.jsonl"


class MockTodoRepository:
    def __init__(self):
        logger.info("Initializing MockTodoRepository")
        self.todos = self._load_mock_data()
        logger.info(f"Loaded {len(self.todos)} todos from {MOCK_TODO_FILE}")

    def _load_mock_data(self) -> List[dict]:
        if not MOCK_TODO_FILE.exists():
            logger.warning(f"Mock todo file not found: {MOCK_TODO_FILE}")
            return []

        todos = []
        with open(MOCK_TODO_FILE, encoding="utf-8") as f:
            for i, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    todo = json.loads(line)
                    todos.append(todo)
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error in line {i}: {e}")
        logger.debug(f"Loaded {len(todos)} todos from file")
        return todos

    def get_todo_by_id(self, todo_id: str) -> Optional[dict]:
        logger.debug(f"Searching for todo with id={todo_id}")
        for todo in self.todos:
            if todo.get("todo_id") == todo_id:
                logger.info(f"Found todo with id={todo_id}")
                return todo
        logger.info(f"Todo with id={todo_id} not found")
        return None

    def list_todos_by_group(
        self, group_id: str, limit: int = 1000, start_key: Optional[dict] = None
    ) -> tuple[List[dict], Optional[dict]]:
        logger.debug(f"Listing todos for group_id={group_id} with limit={limit}")
        filtered = [todo for todo in self.todos if todo.get("group_id") == group_id]
        paginated = filtered[:limit]
        logger.info(f"Found {len(filtered)} todos for group_id={group_id}, returning {len(paginated)}")
        next_key = None  # ページネーションは未実装
        return paginated, next_key

    def create_todo(self, todo: dict) -> None:
        """TODOを作成する"""
        logger.info("Creating todo: Not implemented")
        return None
