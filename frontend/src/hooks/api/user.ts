import { api } from './fetcher'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { User } from './types'

export const useCreateUser = () =>
  useMutation({
    mutationFn: async (data: { email: string; name?: string }) => {
      const res = await api.post<User>('/users', data)
      return res.data
    },
  })

export const useGetUser = (user_id: string) =>
  useQuery({
    queryKey: ['user', user_id],
    queryFn: async () => {
      const res = await api.get<User>(`/users/${user_id}`)
      return res.data
    },
    enabled: !!user_id,
  }) 