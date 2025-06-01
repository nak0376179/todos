import logging

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from starlette.middleware.base import BaseHTTPMiddleware

from app.api import group, todo, user

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")

app = FastAPI()


class SecureHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Content Security Policy（例：自己ドメインとCDNのみ許可）
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'"

        # HSTS（HTTPS 強制）
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"

        # XSS 対策
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Clickjacking 対策
        response.headers["X-Frame-Options"] = "DENY"

        # MIME-type スニッフィング防止
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Referrer ポリシー
        response.headers["Referrer-Policy"] = "no-referrer"

        return response


# セキュアヘッダーのミドルウェアを追加
app.add_middleware(SecureHeadersMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(group.router)
app.include_router(todo.router)

handler = Mangum(app)
