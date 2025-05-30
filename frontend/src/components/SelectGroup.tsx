import { useSearchParams, useNavigate } from 'react-router'
import { useListGroupsByUser } from '@/hooks/api/group_member'
import { useGetGroup } from '@/hooks/api/group'
import { Box, Button, List, ListItem, ListItemText, Typography, Paper, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { api } from '@/hooks/api/fetcher'
import GroupIcon from '@mui/icons-material/Group'
import { useAtom } from 'jotai'
import { userIdAtom, groupIdAtom } from '@/stores/user'

export default function SelectGroup() {
  const [params] = useSearchParams()
  const [userId, setUserId] = useAtom(userIdAtom)
  const [, setGroupId] = useAtom(groupIdAtom)
  const { data: groups } = useListGroupsByUser(userId)
  const navigate = useNavigate()
  const [groupNames, setGroupNames] = useState<{ [group_id: string]: string }>({})

  useEffect(() => {
    if (groups) {
      Promise.all(
        groups.map(async (g) => {
          try {
            const res = await api.get(`/groups/${g.group_id}`)
            return { group_id: g.group_id, name: res.data.name }
          } catch {
            return { group_id: g.group_id, name: g.group_id }
          }
        })
      ).then((arr) => {
        const map: { [group_id: string]: string } = {}
        arr.forEach(({ group_id, name }) => {
          map[group_id] = name
        })
        setGroupNames(map)
      })
    }
  }, [groups])

  const handleSelect = (group_id: string) => {
    setUserId(userId)
    setGroupId(group_id)
    navigate(`/groups/${group_id}/todos`)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={8} sx={{ p: 5, maxWidth: 400, width: '100%', borderRadius: 3, textAlign: 'center' }}>
        <GroupIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" fontWeight="bold" mb={2} color="primary.main">
          グループ選択
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          所属グループを選択してください
        </Typography>
        <List sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          {groups?.length ? (
            groups.map((g, idx) => (
              <>
                <ListItem
                  component="button"
                  key={g.group_id}
                  onClick={() => handleSelect(g.group_id)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    boxShadow: 1,
                    bgcolor: '#f5fafd',
                    '&:hover': { bgcolor: '#e3f2fd' },
                  }}
                >
                  <ListItemText
                    primary={<span style={{ fontWeight: 600 }}>{groupNames[g.group_id] || g.group_id}</span>}
                    secondary={g.role}
                  />
                </ListItem>
                {idx < groups.length - 1 && <Divider />}
              </>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              グループがありません
            </Typography>
          )}
        </List>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2, fontWeight: 'bold', borderRadius: 2 }}
          onClick={() => navigate(`/group?user_id=${userId}`)}
        >
          グループ新規作成
        </Button>
      </Paper>
    </Box>
  )
}
