from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import mangum
from db import get_table

app = FastAPI()


class Todo(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool = False


@app.get("/todos", response_model=List[Todo])
def list_todos():
    table = get_table()
    items = table.scan().get("Items", [])
    return [Todo(**item) for item in items]


@app.post("/todos", response_model=Todo)
def create_todo(todo: Todo):
    table = get_table()
    if table.get_item(Key={"id": todo.id}).get("Item"):
        raise HTTPException(status_code=400, detail="ID already exists")
    table.put_item(Item=todo.dict())
    return todo


@app.get("/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id: str):
    table = get_table()
    item = table.get_item(Key={"id": todo_id}).get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Todo not found")
    return Todo(**item)


@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: str, updated: Todo):
    table = get_table()
    if not table.get_item(Key={"id": todo_id}).get("Item"):
        raise HTTPException(status_code=404, detail="Todo not found")
    table.put_item(Item=updated.dict())
    return updated


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: str):
    table = get_table()
    if not table.get_item(Key={"id": todo_id}).get("Item"):
        raise HTTPException(status_code=404, detail="Todo not found")
    table.delete_item(Key={"id": todo_id})
    return {"ok": True}


handler = mangum.Mangum(app)
