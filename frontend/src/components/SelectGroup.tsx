import { useSearchParams, useNavigate } from 'react-router'
import { useListGroupsByUser } from '@/hooks/api/group_member'
import { Box, Button, List, ListItem, ListItemText, Typography, Paper, Divider } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import { useAtom } from 'jotai'
import { userIdAtom, groupIdAtom } from '@/stores/user'

export default function SelectGroup() {
  const [userId, setUserId] = useAtom(userIdAtom)
  const [, setGroupId] = useAtom(groupIdAtom)
  const { data: groups } = useListGroupsByUser(userId)
  const navigate = useNavigate()

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
            groups.map((g: { group_id: string; role: string }, idx: number) => (
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
                  <ListItemText primary={<span style={{ fontWeight: 600 }}>{g.group_id}</span>} secondary={g.role} />
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
