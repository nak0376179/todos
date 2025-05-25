import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './fetcher'

export type Todo = {
  todo_id: string
  title: string
  description?: string
  completed: boolean
}

export type ItemsResponse<T> = {
  Items: T[]
  LastEvaluatedKey?: any
}

export type PostTodoResponse = {
  todo_id: string
  message: string
}

export type MessageResponse = {
  message: string
}

export type ErrorResponse = {
  detail: string
}

export type ValidationErrorDetail = {
  loc: any[]
  msg: string
  type: string
}

export type ValidationErrorResponse = {
  detail: ValidationErrorDetail[]
}

async function fetchTodos(): Promise<ItemsResponse<Todo>> {
  const res = await api.get<ItemsResponse<Todo>>('/todos')
  return res.data
}

/*
async function fetchTodo(id: string): Promise<Todo> {
  const res = await api.get<Todo>(`/todos/${id}`)
  return res.data
}
*/

async function createTodo(todo: Todo): Promise<PostTodoResponse> {
  const res = await api.post<PostTodoResponse>('/todos', todo)
  return res.data
}

async function updateTodo(id: string, todo: Todo): Promise<MessageResponse> {
  const res = await api.put<MessageResponse>(`/todos/${id}`, todo)
  return res.data
}

async function deleteTodo(id: string): Promise<MessageResponse> {
  const res = await api.delete<MessageResponse>(`/todos/${id}`)
  return res.data
}

export function useTodos() {
  const queryClient = useQueryClient()
  const query = useQuery<ItemsResponse<Todo>>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  const addMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const editMutation = useMutation({
    mutationFn: (args: { id: string; todo: Todo }) => updateTodo(args.id, args.todo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return {
    ...query,
    addTodo: addMutation.mutateAsync,
    addTodoStatus: addMutation.status,
    deleteTodo: deleteMutation.mutateAsync,
    deleteTodoStatus: deleteMutation.status,
    editTodo: editMutation.mutateAsync,
    editTodoStatus: editMutation.status,
  }
}
 