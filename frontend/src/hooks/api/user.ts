import { api } from './openapiClient'
import { useDevLog } from '@/components/DevLogContext'
import { useQueryClient } from '@tanstack/react-query'

// ユーザー作成 POST /users
export const useCreateUser = () => {
  const { pushLog } = useDevLog()
  const queryClient = useQueryClient()
  return api.useMutation('post', '/users', {
    onSuccess: (_, variables) => {
      const email = variables?.body?.email
      if (email) {
        queryClient.invalidateQueries({ queryKey: ['user', email] })
      }
      pushLog('ユーザー登録', '/users')
    },
  })
}

// ユーザー取得 GET /users/{user_id}
export const useGetUser = (user_id: string) => {
  const { pushLog } = useDevLog()
  return api.useQuery('get', '/users/{user_id}', {
    params: { path: { user_id } },
    queryKey: ['user', user_id],
    enabled: !!user_id,
    onSuccess: () => pushLog('ユーザー取得', `/users/${user_id}`),
  })
}
