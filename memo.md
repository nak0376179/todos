# AI 駆動開発

## 大方針

- AI 中心の開発にできるよう、回答を得やすい構成で再構築したい。React(Vue) ＋ FastAPI の構成で再構築）。
- フロントエンド、バックエンド、LocalStack を同時起動し、ホットリロードを駆使してローカル環境のみで高速開発できるようにしたい。
- Linter や Formatter を最大限活用してコードの品質と一貫性を維持したい。回答でもチェックされるため。
- ドキュメントはなるべくコードや DB から自動生成する方法を検討する（コードに記載しないと伝わらない＆コードとドキュメントの乖離防止）。
- テストのコード・カバレッジを AI 活用により 85%以上にしたい。

**参考**

- FastAPI: https://fastapi.tiangolo.com/ja/

## 開発効率化

- API 仕様は、バックエンドの models, schemas でモデルとスキーマを定義する方式を採用する。
  - バックエンドの型定義、バリデーションが自動適用される。
  - バックエンドの API マニュアルが自動生成される。
  - typescript 変換によりフロントエンドの API レスポンスの型が自動定義される。

**参考**

- https://qiita.com/Tomato_otamoT/items/a4c00fef59b7cb866c2a
- https://openapi-ts.dev/
- https://openapi-ts.dev/openapi-react-query/

## 自動テスト

- バックエンドのユニットテストは、pytest + moto（or LocalStack）
- バックエンドのインテグレーションテストは、pytest + LocalStack
- フロントエンドのユニットテストは、vitest (主に UI を含まない部分)
- フロントエンドのインテグレーションテストは vitest + storybook + msw v2
- playwright による

## 開発環境

- フロントエンド、バックエンド、LocalStack を同時起動し、ホットリロードを駆使してローカル環境のみで高速開発できるようにしたい。
- Linter や Formatter を最大限活用してコードの品質と一貫性を維持したい。回答でもチェックされるため。
- ドキュメントはなるべくコードから自動生成する方法を検討する（コードに記載しないと伝わらない＆コードとドキュメントの乖離防止）。
- VSCode (.vscode で強制)

### Python3

- python3.11.12
- poetry + pyenv + virtualenv
- フォーマッタ
  - ruff
- Linter
  - ruff

## Node.js 環境

- node.js v22
- react v19
- vue v3
- フォーマッタ
  - prettier
- Linter
  - eslint
- エディタ

## デザイン

- マテリアルデザイン

**参考**

- https://mui.com/material-ui/
- https://vuetifyjs.com/ja/
- https://m3.material.io/

## ログ出力方針

- グローバルなリクエスト/レスポンスロギング（ミドルウェア）
- リポジトリ層（DynamoDB や外部サービス呼び出しの前後）
- サービス層での詳細ログ
