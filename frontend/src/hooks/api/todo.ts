import { apiClient } from './fetcher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDevLog } from '@/components/DevLogContext'
import type { components, paths } from '@/types/api'

// GET /groups/{group_id}/todos
export const useListTodos = (group_id: string) => {
  const { pushLog } = useDevLog()
  return useQuery({
    queryKey: ['todos', group_id],
    queryFn: async () => {
      const { data } = await apiClient.path('/groups/{group_id}/todos').method('get').create()({ group_id })
      pushLog('TODO取得', `/groups/${group_id}/todos`)
      return data
    },
    enabled: !!group_id,
    staleTime: 1000 * 60 * 5,
  })
}

// POST /groups/{group_id}/todos
export const useCreateTodo = () => {
  const queryClient = useQueryClient()
  const { pushLog } = useDevLog()
  return useMutation({
    mutationFn: async (
      data: paths['/groups/{group_id}/todos']['post']['requestBody']['content']['application/json'] & {
        group_id: string
      }
    ) => {
      const { group_id, ...body } = data
      const postTodo = apiClient.path('/groups/{group_id}/todos').method('post').create()
      const res = await postTodo({
        group_id,
        title: body.title,
        description: body.description,
        owner_user_id: body.owner_user_id,
      })
      pushLog('TODO追加', `/groups/${group_id}/todos`)
      return res
    },
    onSuccess: (_, variables) => {
      if (variables?.group_id) {
        queryClient.invalidateQueries({ queryKey: ['todos', variables.group_id] })
      }
    },
  })
}

// PATCH /groups/{group_id}/todos/{todo_id}
export const useUpdateTodo = () => {
  const queryClient = useQueryClient()
  const { pushLog } = useDevLog()
  return useMutation({
    mutationFn: async (
      data: {
        group_id: string
        todo_id: string
      } & paths['/groups/{group_id}/todos/{todo_id}']['patch']['requestBody']['content']['application/json']
    ) => {
      const { group_id, todo_id, ...body } = data
      const { data: res } = await apiClient.path('/groups/{group_id}/todos/{todo_id}').method('patch').create()({
        group_id,
        todo_id,
        title: body.title,
        description: body.description,
        due_date: body.due_date,
        is_completed: body.is_completed,
      })
      pushLog('TODO更新', `/groups/${group_id}/todos/${todo_id}`)
      return res
    },
    onSuccess: (_, variables) => {
      if (variables?.group_id) {
        queryClient.invalidateQueries({ queryKey: ['todos', variables.group_id] })
      }
    },
  })
}

// DELETE /groups/{group_id}/todos/{todo_id}
export const useDeleteTodo = () => {
  const queryClient = useQueryClient()
  const { pushLog } = useDevLog()
  return useMutation({
    mutationFn: async ({ group_id, todo_id }: { group_id: string; todo_id: string }) => {
      const { data: res } = await apiClient.path('/groups/{group_id}/todos/{todo_id}').method('delete').create()({
        group_id,
        todo_id,
      })
      pushLog('TODO削除', `/groups/${group_id}/todos/${todo_id}`)
      return res
    },
    onSuccess: (_, variables) => {
      if (variables?.group_id) {
        queryClient.invalidateQueries({ queryKey: ['todos', variables.group_id] })
      }
    },
  })
}
