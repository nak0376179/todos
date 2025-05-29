import { useSearchParams, useNavigate } from 'react-router-dom'
import { useListGroupsByUser } from '../hooks/api/group_member'
import { useGetGroup } from '../hooks/api/group'
import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { api } from '../hooks/api/fetcher'
import BackToTopButton from '../components/BackToTopButton'

export default function SelectGroup() {
  const [params] = useSearchParams()
  const userId = params.get('user_id') || ''
  const { data: groups } = useListGroupsByUser(userId)
  const navigate = useNavigate()
  const [groupNames, setGroupNames] = useState<{ [group_id: string]: string }>({})

  useEffect(() => {
    if (groups) {
      Promise.all(
        groups.map(async g => {
          try {
            const res = await api.get(`/groups/${g.group_id}`)
            return { group_id: g.group_id, name: res.data.name }
          } catch {
            return { group_id: g.group_id, name: g.group_id }
          }
        })
      ).then(arr => {
        const map: { [group_id: string]: string } = {}
        arr.forEach(({ group_id, name }) => { map[group_id] = name })
        setGroupNames(map)
      })
    }
  }, [groups])

  const handleSelect = (group_id: string) => {
    localStorage.setItem('user_id', userId)
    localStorage.setItem('group_id', group_id)
    window.location.href = '/todo'
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <BackToTopButton />
      <Typography variant="h5" mb={2}>所属グループ選択</Typography>
      <List>
        {groups?.map(g => (
          <ListItem component="button" key={g.group_id} onClick={() => handleSelect(g.group_id)}>
            <ListItemText primary={groupNames[g.group_id] || g.group_id} secondary={g.role} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
} 