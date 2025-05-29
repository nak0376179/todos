import { api } from './fetcher'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { Todo } from './types'

export const useListTodos = (group_id: string) =>
  useQuery({
    queryKey: ['todos', group_id],
    queryFn: async () => {
      const res = await api.get<Todo[]>(`/todos?group_id=${group_id}`)
      return res.data
    },
    enabled: !!group_id,
  })

export const useCreateTodo = () =>
  useMutation({
    mutationFn: async (data: { group_id: string; title: string; description?: string; due_date?: string; owner_user_id: string }) => {
      const res = await api.post<Todo>('/todos', data)
      return res.data
    },
  })

export const useUpdateTodo = () =>
  useMutation({
    mutationFn: async ({ todo_id, ...data }: { todo_id: string; title?: string; description?: string; due_date?: string; is_completed?: boolean }) => {
      const res = await api.patch<Todo>(`/todos/${todo_id}`, data)
      return res.data
    },
  })

export const useDeleteTodo = () =>
  useMutation({
    mutationFn: async (todo_id: string) => {
      const res = await api.delete<{ result: string }>(`/todos/${todo_id}`)
      return res.data
    },
  }) 