import { apiClient } from './fetcher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from './types'
import { useDevLog } from '@/components/DevLogContext'

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { email: string; name?: string }) => {
      const { pushLog } = useDevLog()
      const res = await apiClient.path('/users').method('post').create()({ body: data })
      pushLog('ユーザー登録', '/users')
      return res.data
    },
    onSuccess: (_, variables) => {
      if (variables?.email) {
        queryClient.invalidateQueries({ queryKey: ['user', variables.email] })
      }
    },
  })
}

export const useGetUser = (user_id: string) =>
  (() => {
    const { pushLog } = useDevLog()
    return useQuery({
      queryKey: ['user', user_id],
      queryFn: async () => {
        const res = await apiClient.path('/users/{user_id}').method('get').create()({ user_id })
        pushLog('ユーザー取得', `/users/${user_id}`)
        return res.data
      },
      enabled: !!user_id,
      staleTime: 1000 * 60 * 5,
    })
  })()
