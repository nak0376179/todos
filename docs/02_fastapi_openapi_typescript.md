# FastAPI 概要とドキュメント生成・型連携について

FastAPI は Python 製のモダンな Web API フレームワークで、型注釈に基づいて自動的に OpenAPI ドキュメントを生成する機能が特徴です。

---

## 1. FastAPI の概要

### 🔹 特徴

- **型安全**：Python の型ヒントを活用して、リクエスト・レスポンスの検証や補完が可能。
- **自動ドキュメント生成**：OpenAPI（Swagger）形式で API ドキュメントを自動生成。
- **高速**：Starlette（ASGI）ベースで非同期処理に強い。
- **Pydantic** によるデータバリデーション。

---

## 2. ドキュメント生成機能

FastAPI で API を定義するだけで、以下の 2 種類の自動ドキュメント UI が提供されます。

| URL      | 内容                                    |
| -------- | --------------------------------------- |
| `/docs`  | Swagger UI（インタラクティブな API UI） |
| `/redoc` | ReDoc（ドキュメント中心の UI）          |

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
def hello():
    return {"message": "Hello, FastAPI!"}
```

これだけで `/docs` や `/redoc` に API ドキュメントが自動生成されます。

---

## 3. openapi-typescript による TypeScript 型連携

### 🔹 目的

FastAPI の OpenAPI スキーマから TypeScript 型定義を自動生成することで、**バックエンドとフロントエンドの型を同期**できます。

---

### 🔧 セットアップ手順

#### FastAPI 側（OpenAPI スキーマをエクスポート）

```bash
curl http://localhost:8000/openapi.json -o openapi.json
```

#### フロントエンド側（型の生成）

```bash
# openapi-typescript のインストール
npm install -D openapi-typescript

# 型生成（例: types/api.ts に出力）
npx openapi-typescript openapi.json -o types/api.ts
```

---

## 4. 利用メリット

- バックエンドの API 定義に変更があった場合でも、型定義を再生成するだけでフロントエンドが追従可能。
- 手動で型定義を書く必要がない。
- 型のミスマッチによるバグを未然に防止。

---

## 5. openapi-react-query 連携

openapi-react-query は、OpenAPI スキーマを操作するための@tanstack/react-query をラップした型セーフな小さなラッパー (1 KB) です。

これは openapi-fetch と openapi-typescript を使用して動作するため、次のすべての機能が利用できます。

- ✅ URL またはパラメータにタイプミスがないこと。
- ✅ すべてのパラメータ、リクエストボディ、レスポンスは型チェックされ、スキーマと 100％一致します
- ✅ API を手動で入力する必要はありません

---

## 6. 参考リンク

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAPI TypeScript](https://openapi-ts.dev/)

---

FastAPI の型注釈と OpenAPI ドキュメント生成機能を活かすことで、API 開発が効率的かつ安全に行えます。
