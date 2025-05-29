import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000', // FastAPIのエンドポイント
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetcher = async <T>(url: string, config?: object): Promise<T> => {
  const res = await api.get<T>(url, config)
  return res.data
} 