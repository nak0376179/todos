import { api } from './fetcher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Todo } from './types'
import { useDevLog } from '@/components/DevLogContext'

export const useListTodos = (group_id: string) => {
  const { pushLog } = useDevLog()

  return useQuery({
    queryKey: ['todos', group_id],
    queryFn: async () => {
      const res = await api.get<Todo[]>(`/groups/${group_id}/todos`)
      pushLog('TODO取得', `/groups/${group_id}/todos`)
      return res.data
    },
    enabled: !!group_id,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateTodo = () => {
  const queryClient = useQueryClient()
  const { pushLog } = useDevLog()

  return useMutation({
    mutationFn: async (data: {
      group_id: string
      title: string
      description?: string
      due_date?: string
      owner_user_id: string
    }) => {
      const { group_id, ...rest } = data
      const res = await api.post<Todo>(`/groups/${group_id}/todos`, rest)
      pushLog('TODO追加', `/groups/${group_id}/todos`)
      return res.data
    },
    onSuccess: (_, variables) => {
      if (variables?.group_id) {
        queryClient.invalidateQueries({ queryKey: ['todos', variables.group_id] })
      }
    },
  })
}

export const useUpdateTodo = () => {
  const queryClient = useQueryClient()
  const { pushLog } = useDevLog()
  return useMutation({
    mutationFn: async ({
      group_id,
      todo_id,
      ...data
    }: {
      group_id: string
      todo_id: string
      title?: string
      description?: string
      due_date?: string
      is_completed?: boolean
    }) => {
      const res = await api.patch<Todo>(`/groups/${group_id}/todos/${todo_id}`, data)
      pushLog('TODO更新', `/groups/${group_id}/todos/${todo_id}`)
      return res.data
    },
    onSuccess: (_, variables) => {
      if (variables?.group_id) {
        queryClient.invalidateQueries({ queryKey: ['todos', variables.group_id] })
      }
    },
  })
}

export const useDeleteTodo = () => {
  const queryClient = useQueryClient()
  const { pushLog } = useDevLog()
  return useMutation({
    mutationFn: async ({ group_id, todo_id }: { group_id: string; todo_id: string }) => {
      const res = await api.delete<{ result: string }>(`/groups/${group_id}/todos/${todo_id}`)
      pushLog('TODO削除', `/groups/${group_id}/todos/${todo_id}`)
      return res.data
    },
    onSuccess: (_, variables) => {
      if (variables?.group_id) {
        queryClient.invalidateQueries({ queryKey: ['todos', variables.group_id] })
      }
    },
  })
}
