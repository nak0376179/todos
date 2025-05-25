from typing import Optional, Dict, Any


class TodoModel:
    def __init__(
        self,
        todo_id: str,
        title: str,
        description: Optional[str] = None,
        completed: bool = False,
    ):
        self.todo_id = todo_id
        self.title = title
        self.description = description
        self.completed = completed

    def to_dict(self) -> Dict[str, Any]:
        return {
            "todo_id": self.todo_id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "TodoModel":
        return cls(
            todo_id=data["todo_id"],
            title=data["title"],
            description=data.get("description"),
            completed=data.get("completed", False),
        )
