import { useState } from 'react'
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router'
import { useAtom } from 'jotai'
import { groupIdAtom, userIdAtom } from '@/stores/user'
import { useListGroups } from '@/hooks/api/group'
import { useDevLog } from '@/components/DevLogContext'

export default function SelectGroup() {
  const navigate = useNavigate()
  const { pushLog, pushErrorLog } = useDevLog()
  const [errorMsg, setErrorMsg] = useState('')
  const [, setGroupId] = useAtom(groupIdAtom)
  const [userId] = useAtom(userIdAtom)
  const { data: groups, isLoading } = useListGroups(userId)

  const handleSelect = (groupId: string, groupName: string) => {
    try {
      setGroupId(groupId)
      pushLog('グループ選択', `グループ「${groupName}」を選択`)
      navigate(`/groups/${groupId}/todos`)
    } catch (e: any) {
      setErrorMsg('グループ選択に失敗しました')
      pushErrorLog(`グループ選択失敗: ${e?.message || 'unknown error'}`)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          グループ選択
        </Typography>
        {errorMsg && (
          <Typography color="error" fontSize={14} mb={1}>
            {errorMsg}
          </Typography>
        )}
        {isLoading ? (
          <Typography color="text.secondary">読み込み中...</Typography>
        ) : (
          <List>
            {groups?.map((g: any) => (
              <ListItem
                key={g.group_id}
                component="button"
                onClick={() => handleSelect(g.group_id, g.group_name)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText primary={g.group_name} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
