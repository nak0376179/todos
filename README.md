# TODO アプリケーション（React + FastAPI + DynamoDB）

このリポジトリは、**React (Vite) + FastAPI + DynamoDB (LocalStack)** を用いたグループ型 TODO 管理アプリのサンプルです。  
開発・検証・学習用途を想定しています。

---

## 構成

- **フロントエンド**: React v18, Vite, MUI, Tanstack Query, Jotai, axios, react-router v7, Storybook
- **バックエンド**: FastAPI, Mangum, pydantic, boto3, poetry, pytest
- **DB**: DynamoDB（LocalStack でローカル動作）
- **CI/CD**: AWS SAM（Zip 形式で Lambda デプロイ想定）
- **テスト**: Vitest（フロントエンド）、pytest（バックエンド）、Storybook Test Runner

---

## 主な機能

- メールアドレスでユーザー登録
- ユーザーはグループを複数作成可能
- グループごとに TODO を管理
- グループ管理者は他ユーザーを招待可能
- メンバーは招待不可

---

## セットアップ手順

1. **依存インストール**

```sh
cd backend
pyenv install 3.11.12
pyenv local 3.11.12
PYTHON_PATH=$(pyenv which python)
echo "Using python: $PYTHON_PATH"
poetry env use $PYTHON_PATH
cd ..
make install
```

2. **開発サーバ起動（DB 初期化含む）**

   ```sh
   make dev
   ```

   - フロントエンド: http://localhost:5173
   - バックエンド: http://localhost:8000

3. **開発サーバ停止**
   ```sh
   make down
   ```

---

## Makefile コマンド一覧

| コマンド              | 説明                                                                  |
| --------------------- | --------------------------------------------------------------------- |
| `make install`        | バックエンド・フロントエンドの依存パッケージを一括インストール        |
| `make dev`            | フロントエンド・バックエンドの開発サーバを同時起動（DB 初期化も実施） |
| `make down`           | 開発サーバを停止                                                      |
| `make init-db`        | DynamoDB テーブルの初期化・サンプルデータ投入                         |
| `make pytest`         | バックエンドの pytest テスト実行                                      |
| `make vitest`         | フロントエンドの Vitest テスト実行                                    |
| `make build`          | バックエンドの Python コードをコンパイル                              |
| `make deploy`         | デプロイ処理（AWS SAM 用、詳細は別途記述）                            |
| `make clean`          | 一時ファイル削除                                                      |
| `make storybook-test` | Storybook Test Runner による UI テスト実行                            |
| `make help`           | コマンド一覧表示                                                      |

---

## 注意事項

- DynamoDB は LocalStack（http://localhost:4566）を利用します。別途 LocalStack の起動が必要です。
