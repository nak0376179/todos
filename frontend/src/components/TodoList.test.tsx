import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TodoList } from './TodoList'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let todos = [
  { id: '1', title: 'テスト1', description: '説明1', completed: false },
  { id: '2', title: 'テスト2', description: '説明2', completed: false },
]

const server = setupServer(
  http.get('http://localhost:8000/todos', () => HttpResponse.json({ Items: todos })),
  http.post('http://localhost:8000/todos', async ({ request }: any) => {
    const body = await request.json()
    const newTodo = { ...(body && typeof body === 'object' ? body : {}), id: Date.now().toString() }
    todos = [...todos, newTodo]
    return HttpResponse.json(newTodo, { status: 201 })
  }),
  http.delete('http://localhost:8000/todos/:id', ({ params }: any) => {
    todos = todos.filter((t) => t.id !== params.id)
    return HttpResponse.json({ ok: true })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const queryClient = new QueryClient()

describe('TodoList', () => {
  it('Todo一覧が表示される', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    )
    expect(await screen.findByText('Todo App')).toBeInTheDocument()
    expect(await screen.findByText('テスト1')).toBeInTheDocument()
    expect(await screen.findByText('テスト2')).toBeInTheDocument()
  })

  it('追加ボタンが表示される', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    )
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })
})
 