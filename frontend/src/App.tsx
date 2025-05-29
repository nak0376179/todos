import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Root from './pages/root'
import UserRegister from './pages/UserRegister'
import CreateGroup from './pages/CreateGroup'
import TodoList from './pages/TodoList'
import Login from './pages/Login'
import SelectGroup from './pages/SelectGroup'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/group" element={<CreateGroup />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/select-group" element={<SelectGroup />} />
      </Routes>
    </BrowserRouter>
  )
}
