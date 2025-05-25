import type { Meta, StoryObj } from '@storybook/react'
import { TodoList } from './TodoList'
import { http, HttpResponse } from 'msw'
import type { Todo } from '../hooks/api/useTodos'

const meta: Meta<typeof TodoList> = {
  title: 'components/TodoList',
  component: TodoList,
}
export default meta

type Story = StoryObj<typeof TodoList>

// メモリ上でCRUDを模倣するtodos配列
let todos: Todo[] = [
  { id: '1', title: 'サンプルタスク1', completed: false },
  { id: '2', title: 'サンプルタスク2', completed: true },
]

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:8000/todos', () => {
          return HttpResponse.json({ Items: todos })
        }),
        http.post('http://localhost:8000/todos', async ({ request }: any) => {
          const body = await request.json()
          const newTodo = { ...(body && typeof body === 'object' ? body : {}), id: Date.now().toString() }
          todos = [...todos, newTodo]
          return HttpResponse.json(newTodo, { status: 201 })
        }),
        http.delete('http://localhost:8000/todos/:id', ({ params }: any) => {
          todos = todos.filter((t) => t.id !== params.id)
          return HttpResponse.json({ ok: true })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const { findByText, getByRole } = await import('@storybook/testing-library')
    // タイトルが表示される
    await findByText(canvasElement, 'Todo App')
    // 追加ボタンが表示される
    getByRole(canvasElement, 'button', { name: '追加' })
    // サンプルタスクが表示される
    await findByText(canvasElement, 'サンプルタスク1')
    await findByText(canvasElement, 'サンプルタスク2')
  },
}
 