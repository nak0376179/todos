import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './pages/login'
import UserRegister from './pages/register'
import CreateGroup from './pages/groups/[group_id]/create'
import TodoList from './pages/groups/[group_id]/todos'
import SelectGroup from './pages/select-group'
import { Provider as JotaiProvider } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { DevLogProvider } from '@/components/DevLogContext'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'
import '@fontsource/noto-sans-jp/300.css'
import '@fontsource/noto-sans-jp/400.css'
import '@fontsource/noto-sans-jp/500.css'
import '@fontsource/noto-sans-jp/700.css'

const queryClient = new QueryClient()

export default function App() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <DevLogProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/groups/:group_id/create" element={<CreateGroup />} />
                <Route path="/groups/:group_id/todos" element={<TodoList />} />
                <Route path="/select-group" element={<SelectGroup />} />
              </Routes>
            </BrowserRouter>
            {isDev && <ReactQueryDevtools initialIsOpen={false} />}
          </DevLogProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </ThemeProvider>
  )
}
