import { api } from './fetcher'
import { useQuery } from '@tanstack/react-query'
import type { GroupMember } from './types'

export const useListGroupMembers = (group_id: string) =>
  useQuery({
    queryKey: ['groupmembers', group_id],
    queryFn: async () => {
      const res = await api.get<GroupMember[]>(`/groups/${group_id}/members`)
      return res.data
    },
    enabled: !!group_id,
  })

export const useListGroupsByUser = (user_id: string) =>
  useQuery({
    queryKey: ['usergroups', user_id],
    queryFn: async () => {
      const res = await api.get<GroupMember[]>(`/users/${user_id}/groups`)
      return res.data
    },
    enabled: !!user_id,
  })
