import { Fetcher } from 'openapi-typescript-fetch'
import { paths } from '@/types/api'

const fetcher = Fetcher.for<paths>()

// APIのベースURLを設定（必要に応じて環境変数などで切り替え）
fetcher.configure({
  baseUrl: 'http://localhost:8000', // FastAPIサーバーのURL
  init: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
})
export const apiClient = fetcher
