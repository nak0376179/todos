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

const queryClient = new QueryClient()

export default function App() {
  // @ts-ignore
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
  return (
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
  )
}
