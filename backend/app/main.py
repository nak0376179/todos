from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.api import group, group_member, todo, user, user_group

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(group.router)
app.include_router(group_member.router)
app.include_router(todo.router)
app.include_router(user_group.router)

handler = Mangum(app)
