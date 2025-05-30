.DEFAULT_GOAL := help

.PHONY: help install init-db dev down pytest vitest build deploy clean storybook-test

install:  ## 初期セットアップ（バックエンド・フロントエンド依存インストール）
	@echo "=== 依存パッケージインストール ==="
	cd backend && poetry install
	cd frontend && npm install

up: ## LocalStackをバックグラウンドで起動
	docker compose up -d

init-db:  ## データベースの初期化を行います
	@echo "=== データベース初期化 ==="
	cd backend && poetry run python ../infrastructure/init_db.py

down: ## LocalStackコンテナを停止
	docker compose down

dev:  ## フロントエンドとバックエンドの開発サーバを起動します（DB初期化も実施）
	@echo "=== 開発サーバ起動 ==="
	$(MAKE) init-db
	cd frontend && npm run dev &
	cd backend && poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

stop:  ## 開発サーバを停止します
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

logs: ## LocalStackのログ表示
	docker compose logs

ps: ## LocalStackコンテナ状態確認
	docker compose ps

shell: ## LocalStackコンテナ内でシェルを起動
	docker compose exec localstack bash

clean: ## dockerの未使用リソースをクリーンアップ（安全）
	docker container prune -f
	docker image prune -f
	docker volume prune -f
	docker network prune -f

help:  ## ヘルプ表示
	@echo "Usage: make [target]"
	@awk 'BEGIN {FS = ":.*##"; red = "\033[31m"; green = "\033[32m"; reset = "\033[0m"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  %s%-10s%s %s\n", green, $$1, reset, $$2}' $(MAKEFILE_LIST)
