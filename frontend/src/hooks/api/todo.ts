import { api } from './openapiClient'
import { useDevLog } from '@/components/DevLogContext'
import { useQueryClient } from '@tanstack/react-query'

// GET /groups/{group_id}/todos
export const useListTodos = (group_id: string) => {
  const { pushLog } = useDevLog()
  return api.useQuery('get', '/groups/{group_id}/todos', {
    params: { path: { group_id } },
    queryKey: ['todos', group_id],
    enabled: !!group_id,
    onSuccess: () => pushLog('TODO取得', `/groups/${group_id}/todos`),
  })
}

// POST /groups/{group_id}/todos
export const useCreateTodo = () => {
  const { pushLog } = useDevLog()
  const queryClient = useQueryClient()
  return api.useMutation('post', '/groups/{group_id}/todos', {
    onSuccess: (_, variables) => {
      const groupId = variables?.params?.path?.group_id
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ['todos', groupId] })
      }
      pushLog('TODO追加', `/groups/${groupId}/todos`)
    },
  })
}

// PATCH /groups/{group_id}/todos/{todo_id}
export const useUpdateTodo = () => {
  const { pushLog } = useDevLog()
  const queryClient = useQueryClient()
  return api.useMutation('patch', '/groups/{group_id}/todos/{todo_id}', {
    onSuccess: (_, variables) => {
      const groupId = variables?.params?.path?.group_id
      const todoId = variables?.params?.path?.todo_id
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ['todos', groupId] })
      }
      pushLog('TODO更新', `/groups/${groupId}/todos/${todoId}`)
    },
  })
}

// DELETE /groups/{group_id}/todos/{todo_id}
export const useDeleteTodo = () => {
  const { pushLog } = useDevLog()
  const queryClient = useQueryClient()
  return api.useMutation('delete', '/groups/{group_id}/todos/{todo_id}', {
    onSuccess: (_, variables) => {
      const groupId = variables?.params?.path?.group_id
      const todoId = variables?.params?.path?.todo_id
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ['todos', groupId] })
      }
      pushLog('TODO削除', `/groups/${groupId}/todos/${todoId}`)
    },
  })
}
