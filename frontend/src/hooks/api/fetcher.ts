import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    // 他に共通ヘッダがあればここに追加
  },
  // withCredentials: true, // 必要に応じて
})
