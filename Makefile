# ===== 共通 =====
.PHONY: help frontend backend test-backend dev vitest pytest

help:
	@awk 'BEGIN {FS = ":|#"; printf "\033[1;36mUsage: make [target]\033[0m\n"} \
	/^[a-zA-Z0-9_.-]+:.*# / {printf "  \033[1;32m%-20s\033[0m %s\n", $$1, substr($$0, index($$0, "#") + 2)}' $(MAKEFILE_LIST)

dev: # フロントエンド・バックエンド同時起動＆DB初期化
	$(MAKE) backend-init-db
	$(MAKE) -j2 backend-dev frontend-dev

frontend-dev: # フロントエンド開発サーバ起動
	cd frontend && npm run dev

frontend-build: # フロントエンドビルド
	cd frontend && npm run build

frontend-lint: # フロントエンドLint
	cd frontend && npm run lint

frontend-storybook: # Storybook起動
	cd frontend && npm run storybook

storybook: frontend-storybook

frontend-test: # フロントエンドテスト (Vitest)
	cd frontend && npx vitest run

vitest: # フロントエンドテスト (Vitest)
	cd frontend && npx vitest run

backend-dev: # バックエンド開発サーバ起動
	cd backend && poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000

backend-test: # バックエンドテスト (pytest)
	cd backend && PYTHONIOENCODING=UTF-8 poetry run pytest -v

pytest: # バックエンドテスト (pytest)
	cd backend && PYTHONIOENCODING=UTF-8 poetry run pytest -v

backend-lint: # バックエンドLint (ruff)
	cd backend && poetry run ruff .

backend-format: # バックエンド自動整形 (black)
	cd backend && poetry run black .

backend-typecheck: # バックエンド型チェック (mypy)
	cd backend && poetry run mypy .

backend-sam-build: # SAMビルド(zip)
	cd backend && sam build --use-container

backend-sam-deploy: # SAMデプロイ
	cd backend && sam deploy --guided

backend-init-db: # LocalStack上にDynamoDBテーブルを作成
	cd backend && poetry run python -c "import app.db; app.db.create_table()" 