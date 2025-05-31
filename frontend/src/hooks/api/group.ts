import { api } from './fetcher'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { Group } from './types'
import { useDevLog } from '@/components/DevLogContext'

export const useCreateGroup = () =>
  useMutation({
    mutationFn: async (data: { name: string; owner_user_id: string; description?: string }) => {
      const { pushLog } = useDevLog()
      const res = await api.post<Group>('/groups', data)
      pushLog('グループ作成', '/groups')
      return res.data
    },
  })

export const useGetGroup = (group_id: string) =>
  (() => {
    const { pushLog } = useDevLog()
    return useQuery({
      queryKey: ['group', group_id],
      queryFn: async () => {
        const res = await api.get<Group>(`/groups/${group_id}`)
        pushLog('グループ取得', `/groups/${group_id}`)
        return res.data
      },
      enabled: !!group_id,
    })
  })()

export const useListGroups = (user_id: string) =>
  (() => {
    const { pushLog } = useDevLog()
    return useQuery({
      queryKey: ['groups', user_id],
      queryFn: async () => {
        const res = await api.get<Group[]>(`/users/${user_id}/groups`)
        pushLog('所属グループ取得', `/users/${user_id}/groups`)
        return res.data
      },
      enabled: !!user_id,
    })
  })()
