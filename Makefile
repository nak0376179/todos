# ===== 共通 =====
.PHONY: help frontend backend

help:
	@echo "Usage: make [target]"
	@echo "  frontend-dev        # フロントエンド開発サーバ起動"
	@echo "  frontend-build      # フロントエンドビルド"
	@echo "  frontend-lint       # フロントエンドLint"
	@echo "  frontend-storybook  # Storybook起動"
	@echo "  frontend-test       # フロントエンドテスト (Vitest)"
	@echo "  backend-dev         # バックエンド開発サーバ起動"
	@echo "  backend-test        # バックエンドテスト (pytest)"
	@echo "  backend-lint        # バックエンドLint (flake8等追加可)"
	@echo "  backend-sam-build   # SAMビルド(zip)"
	@echo "  backend-sam-deploy  # SAMデプロイ"

# ===== フロントエンド =====
frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-lint:
	cd frontend && npm run lint

frontend-storybook:
	cd frontend && npm run storybook

frontend-test:
	cd frontend && npx vitest run

# ===== バックエンド =====
backend-dev:
	cd backend && poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000

backend-test:
	cd backend && poetry run pytest

backend-lint:
	cd backend && poetry run flake8 || echo 'flake8未導入: 必要ならpoetry add --dev flake8'

backend-sam-build:
	cd backend && sam build --use-container

backend-sam-deploy:
	cd backend && sam deploy --guided 