# SPA におけるトークンとセキュリティ対策

## はじめに

SPA（Single Page Application）において、認証情報をトークン（例：JWT）で管理する方式は一般的です。しかし、トークンの扱い方を誤ると深刻なセキュリティリスクにつながります。特に XSS（クロスサイトスクリプティング）によるトークンの漏洩は致命的です。

本資料では、SPA におけるトークン管理とそれに付随するセキュリティ対策について整理します。

---

## トークンの保存場所とそのリスク

| 保存場所                      | メリット                             | デメリット / リスク                          |
| ----------------------------- | ------------------------------------ | -------------------------------------------- |
| localStorage / sessionStorage | 実装が簡単。アクセス制御が明示的     | XSS により漏洩の危険性が高い                 |
| Secure Cookie (HTTP-only)     | JS からアクセス不可 → XSS に強い     | CSRF 対策が別途必要                          |
| memory（アプリ内のみ保持）    | 最も安全（タブを閉じると破棄される） | ページリロードでトークンが消える（工夫必要） |

---

## 推奨構成

- 認証：AWS Cognito などで ID トークン / アクセストークンを取得
- トークン保存：localStorage もしくは memory
- 認証時：API に対して `Authorization: Bearer <access_token>` ヘッダを付けて送信

この構成では Cookie を使用しないため、CSRF のリスクは本質的に存在しません。

---

## XSS 対策（トークン漏洩の最大要因）

### 1. Content Security Policy（CSP）の導入

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self';
```

- 外部スクリプトの読み込みやインラインスクリプトの実行を制限
- React や Vue のアプリに適した厳格なポリシーを設定

### 2. 危険な API の使用を避ける

- React：`dangerouslySetInnerHTML` は使用しない
- Vue：`v-html` は使用しない

### 3. ユーザー入力・外部データの適切なエスケープ

- JSX 内の変数は基本的にエスケープされるが、HTML として出力するケースでは `DOMPurify` 等でサニタイズ

### 4. ライブラリのバージョン管理・監査

- 外部ライブラリの依存性によって XSS の脆弱性が入ることもある
- `npm audit` や `yarn audit` の活用を推奨

---

## その他のセキュリティ対策

### HSTS（HTTPS 強制）

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### Referrer-Policy

```http
Referrer-Policy: strict-origin-when-cross-origin
```

### X-Content-Type-Options

```http
X-Content-Type-Options: nosniff
```

### X-Frame-Options

```http
X-Frame-Options: DENY
```

これらのヘッダーは FastAPI 側で設定できます（例：BaseHTTPMiddleware による実装）。

---

## まとめ

| 対策項目          | 状態・推奨                            |
| ----------------- | ------------------------------------- |
| トークン保存      | memory 優先、次に localStorage        |
| CSRF 対策         | Token 認証で不要（Cookie 不使用なら） |
| XSS 対策          | CSP + サニタイズ + 危険 API 禁止      |
| HTTP ヘッダー保護 | HSTS, X-Frame-Options 等を有効に      |

SPA + Token 認証の構成では XSS 対策が最大の鍵です。構成を安全に保つためにも、CSP やエスケープ処理の徹底を行いましょう。
