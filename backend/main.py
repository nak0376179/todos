from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mangum
from app.api.todos import router as todos_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番は適切に制限
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(todos_router)

handler = mangum.Mangum(app)
