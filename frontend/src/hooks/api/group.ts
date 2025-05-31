import { apiClient } from '@/hooks/api/fetcher'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDevLog } from '@/components/DevLogContext'
import type { paths } from '@/types/api'

type CreateGroupRequestBody = paths['/groups']['post']['requestBody']['content']['application/json']
type GetGroupResponse = paths['/groups/{group_id}']['get']['responses']['200']['content']['application/json']
type GetGroupsResponse = paths['/users/{user_id}/groups']['get']['responses']['200']['content']['application/json']

// グループ作成 POST /groups
export const useCreateGroup = () => {
  const { pushLog } = useDevLog()

  return useMutation({
    mutationFn: async (data: CreateGroupRequestBody) => {
      const postGroup = apiClient.path('/groups').method('post').create()
      const res = await postGroup(undefined, { body: data })
      pushLog('グループ作成', '/groups')
      return res.data
    },
  })
}

// グループ取得 GET /groups/{group_id}
export const useGetGroup = (group_id: string) => {
  const { pushLog } = useDevLog()

  return useQuery<GetGroupResponse>({
    queryKey: ['group', group_id],
    queryFn: async () => {
      const getGroup = apiClient.path('/groups/{group_id}').method('get').create()
      const res = await getGroup({ group_id })
      pushLog('グループ取得', `/groups/${group_id}`)
      return res.data
    },
    enabled: !!group_id,
  })
}

// 所属グループ一覧 GET /users/{user_id}/groups
export const useListGroups = (user_id: string) => {
  const { pushLog } = useDevLog()

  return useQuery<GetGroupsResponse>({
    queryKey: ['groups', user_id],
    queryFn: async () => {
      const getGroups = apiClient.path('/users/{user_id}/groups').method('get').create()
      const res = await getGroups({ user_id })
      pushLog('所属グループ取得', `/users/${user_id}/groups`)
      return res.data
    },
    enabled: !!user_id,
  })
}
