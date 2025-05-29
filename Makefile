.DEFAULT_GOAL := help

.PHONY: help install init-db dev down pytest vitest build deploy clean storybook-test

install:  ## 初期セットアップ（バックエンド・フロントエンド依存インストール）
	@echo "=== 依存パッケージインストール ==="
	cd backend && poetry install
	cd frontend && npm install

init-db:  ## データベースの初期化を行います
	@echo "=== データベース初期化 ==="
	cd backend && poetry run python scripts/init_db.py

dev:  ## フロントエンドとバックエンドの開発サーバを起動します（DB初期化も実施）
	@echo "=== 開発サーバ起動 ==="
	$(MAKE) init-db
	cd frontend && npm run dev &
	cd backend && poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

down:  ## 開発サーバを停止します
	@echo "=== 開発サーバ停止 ==="
	pkill -f "npm run dev" || true
	pkill -f "uvicorn app.main:app" || true

pytest:  ## バックエンドのpytestテストを実行します
	@echo "=== バックエンドpytestテスト実行 ==="
	cd backend && poetry run pytest -v

vitest:  ## フロントエンドのvitestテストを実行します
	@echo "=== フロントエンドvitestテスト実行 ==="
	cd frontend && npm run test:ui

build:  ## バックエンドのPythonコードをコンパイルします
	@echo "=== バックエンドコンパイル ==="
	cd backend && poetry run python -m compileall app

deploy:  ## デプロイ処理（AWS SAM用に別途記述してください）
	@echo "=== デプロイ処理 ==="
	@echo "デプロイ処理はAWS SAM用に別途記述してください"

clean:  ## 一時ファイルを削除します
	@echo "=== 一時ファイル削除 ==="
	rm -rf backend/__pycache__ backend/.pytest_cache

storybook-test:  ## Storybookのテストを実行します
	@echo "=== Storybookテスト実行 ==="
	cd frontend && npx test-storybook

help:  ## ヘルプ表示
	@echo "Usage: make [target]"
	@awk 'BEGIN {FS = ":.*##"; red = "\033[31m"; green = "\033[32m"; reset = "\033[0m"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  %s%-10s%s %s\n", green, $$1, reset, $$2}' $(MAKEFILE_LIST)
