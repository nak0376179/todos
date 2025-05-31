import { apiClient } from './fetcher'
import { useQuery } from '@tanstack/react-query'
import { useDevLog } from '@/components/DevLogContext'

export const useListGroupsByUser = (user_id: string) =>
  (() => {
    const { pushLog } = useDevLog()
    return useQuery({
      queryKey: ['usergroups', user_id],
      queryFn: async () => {
        const getListGroupsByUser = apiClient.path('/users/{user_id}/groups').method('get').create() as any
        const res = await getListGroupsByUser({ user_id })
        pushLog('所属グループ取得', `/users/${user_id}/groups`)
        return res.data
      },
      enabled: !!user_id,
      staleTime: 1000 * 60 * 5,
    })
  })()
