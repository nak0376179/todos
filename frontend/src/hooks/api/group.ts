import { api } from './openapiClient'
import { useDevLog } from '@/components/DevLogContext'
import { useQueryClient } from '@tanstack/react-query'

export const useCreateGroup = () => {
  const { pushLog } = useDevLog()
  const queryClient = useQueryClient()
  return api.useMutation('post', '/groups', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      pushLog('グループ作成', '/groups')
    },
  })
}

// グループ取得 GET /groups/{group_id}
export const useGetGroup = (group_id: string) => {
  const { pushLog } = useDevLog()
  return api.useQuery('get', '/groups/{group_id}', {
    params: { path: { group_id } },
    queryKey: ['group', group_id],
    enabled: !!group_id,
    onSuccess: () => pushLog('グループ取得', `/groups/${group_id}`),
  })
}

// 所属グループ一覧 GET /users/{user_id}/groups
export const useListGroups = (user_id: string) => {
  const { pushLog } = useDevLog()
  return api.useQuery('get', '/users/{user_id}/groups', {
    params: { path: { user_id } },
    queryKey: ['groups', user_id],
    enabled: !!user_id,
    onSuccess: () => pushLog('所属グループ取得', `/users/${user_id}/groups`),
  })
}
