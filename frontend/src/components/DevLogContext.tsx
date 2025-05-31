/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'
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

export const DevLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const env = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENV
  // const isDev = env === 'local' || env === 'devel'
  const [logs, setLogs] = useState<DevLog[]>([])
  const [open, setOpen] = useState(false)

  const pushLog = (type: string, message: string) => {
    setLogs((prev) => [...prev, { type, message: message, time: new Date().toLocaleTimeString() }])
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
      <DevLogPanel logs={logs} open={open} onClose={closePanel} onClear={clear} onOpen={openPanel} />
    </DevLogContext.Provider>
  )
}

export function useDevLog() {
  const ctx = useContext(DevLogContext)
  if (!ctx) throw new Error('useDevLog must be used within a DevLogProvider')
  return ctx
}
