import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Alert
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
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
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, sm: 6 }, 
          maxWidth: 600, 
          width: '100%',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar sx={{ 
            m: '0 auto', 
            width: 64, 
            height: 64,
            mb: 3,
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            boxShadow: '0 8px 25px -5px rgba(37, 99, 235, 0.4)',
          }}>
            <GroupIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography 
            variant="h3" 
            fontWeight="700" 
            mb={1}
            sx={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            グループ選択
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            参加するグループを選択してください
          </Typography>
        </Box>

        {errorMsg && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              '& .MuiAlert-message': {
                fontWeight: 500,
              }
            }}
          >
            {errorMsg}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress 
              size={48}
              thickness={4}
              sx={{
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              読み込み中...
            </Typography>
          </Box>
        ) : groups?.length ? (
          <Stack spacing={2}>
            {groups?.map((g: any) => (
              <Card
                key={g.group_id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '2px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 25px -5px rgba(0, 0, 0, 0.12)',
                    border: '2px solid #3b82f6',
                  },
                }}
                onClick={() => handleSelect(g.group_id, g.group_name)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        width: 48,
                        height: 48,
                      }}>
                        <GroupIcon />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          fontWeight="600"
                          color="text.primary"
                          sx={{ mb: 0.5 }}
                        >
                          {g.group_name}
                        </Typography>
                        <Chip 
                          label="参加可能" 
                          size="small" 
                          color="success"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                    <ArrowForwardIosIcon 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: 20,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box sx={{ 
            py: 8, 
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: '#f8fafc',
            border: '2px dashed #cbd5e1',
          }}>
            <GroupIcon 
              sx={{ 
                fontSize: 64, 
                color: 'text.secondary', 
                mb: 2,
                opacity: 0.6,
              }}
            />
            <Typography variant="h5" fontWeight="600" color="text.secondary" mb={1}>
              グループがありません
            </Typography>
            <Typography variant="body1" color="text.secondary">
              管理者にグループの作成を依頼してください
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
