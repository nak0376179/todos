import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './pages/login'
import UserRegister from './pages/register'
import CreateGroup from './pages/groups/[group_id]/create'
import TodoList from './pages/groups/[group_id]/todos'
import SelectGroup from './pages/select-group'
import { Provider as JotaiProvider } from 'jotai'

export default function App() {
  return (
    <JotaiProvider>
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
    </JotaiProvider>
  )
}
