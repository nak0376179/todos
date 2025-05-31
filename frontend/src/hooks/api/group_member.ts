import { api } from './fetcher'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { GroupMember } from './types'
import { useDevLog } from '@/components/DevLogContext'

export const useListGroupMembers = (group_id: string) =>
  (() => {
    const { pushLog } = useDevLog()
    return useQuery({
      queryKey: ['groupmembers', group_id],
      queryFn: async () => {
        const res = await api.get<GroupMember[]>(`/groups/${group_id}/members`)
        pushLog('グループメンバー一覧取得', `/groups/${group_id}/members`)
        return res.data
      },
      enabled: !!group_id,
      staleTime: 1000 * 60 * 5,
    })
  })()

export const useListGroupsByUser = (user_id: string) =>
  (() => {
    const { pushLog } = useDevLog()
    return useQuery({
      queryKey: ['usergroups', user_id],
      queryFn: async () => {
        const res = await api.get<GroupMember[]>(`/users/${user_id}/groups`)
        pushLog('所属グループ取得', `/users/${user_id}/groups`)
        return res.data
      },
      enabled: !!user_id,
      staleTime: 1000 * 60 * 5,
    })
  })()
