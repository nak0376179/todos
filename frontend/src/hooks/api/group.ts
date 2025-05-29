import { api } from './fetcher'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { Group } from './types'

export const useCreateGroup = () =>
  useMutation({
    mutationFn: async (data: { name: string; owner_user_id: string; description?: string }) => {
      const res = await api.post<Group>('/groups', data)
      return res.data
    },
  })

export const useGetGroup = (group_id: string) =>
  useQuery({
    queryKey: ['group', group_id],
    queryFn: async () => {
      const res = await api.get<Group>(`/groups/${group_id}`)
      return res.data
    },
    enabled: !!group_id,
  }) 