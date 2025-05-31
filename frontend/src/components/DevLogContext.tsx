import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import DevLogPanel from '@/components/DevLogPanel'

export type DevLog = { type: string; message: string; time: string }

interface DevLogContextType {
  pushLog: (type: string, message: string) => void
  pushErrorLog: (message: string) => void
  open: boolean
  openPanel: () => void
  closePanel: () => void
  clear: () => void
}

const DevLogContext = createContext<DevLogContextType | undefined>(undefined)

// ログメッセージを整形するユーティリティ
function formatHttpLog(message: string): string {
  // 例: [ユーザー取得] GET /users/admin%40example.com HTTP/1.1" 200 OK
  // → [ユーザー取得] /users/admin%40example.com
  const match = message.match(/^\[([^\]]+)\]\s+(GET|POST|PATCH|PUT|DELETE)\s+([^\s]+)(?:\s+HTTP.*)?/)
  if (match) {
    return `[${match[1]}] ${match[3]}`
  }
  return message
}

export const DevLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // @ts-ignore
  const env = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENV
  const isDev = env === 'local' || env === 'devel'
  const [logs, setLogs] = useState<DevLog[]>([])
  const [open, setOpen] = useState(isDev)

  const pushLog = (type: string, message: string) => {
    const formatted = formatHttpLog(message)
    setLogs((prev) => [...prev, { type, message: formatted, time: new Date().toLocaleTimeString() }])
  }
  const pushErrorLog = (message: string) => {
    setLogs((prev) => [...prev, { type: 'エラー', message, time: new Date().toLocaleTimeString() }])
  }
  const clear = () => setLogs([])
  const openPanel = () => setOpen(true)
  const closePanel = () => setOpen(false)

  return (
    <DevLogContext.Provider value={{ pushLog, pushErrorLog, open, openPanel, closePanel, clear }}>
      {children}
      <DevLogPanel logs={logs} open={open} onClose={closePanel} onClear={clear} />
    </DevLogContext.Provider>
  )
}

export function useDevLog() {
  const ctx = useContext(DevLogContext)
  if (!ctx) throw new Error('useDevLog must be used within a DevLogProvider')
  return ctx
}
