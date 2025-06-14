import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Checkbox,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useListTodos, useCreateTodo, useDeleteTodo, useUpdateTodo } from '@/hooks/api/todo'
import { useGetGroup } from '@/hooks/api/group'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import { useAtom } from 'jotai'
import { userIdAtom, groupIdAtom } from '@/stores/user'
import { useDevLog } from '@/components/DevLogContext'

export default function TodoList() {
  const [ownerUserId] = useAtom(userIdAtom)
  const [groupId] = useAtom(groupIdAtom)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const { data: group } = useGetGroup(groupId)
  const { data: todos, refetch, isLoading } = useListTodos(groupId)
  const createTodo = useCreateTodo()
  const deleteTodo = useDeleteTodo()
  const updateTodo = useUpdateTodo()
  const navigate = useNavigate()

  // 開発者ログ管理
  const { pushLog, pushErrorLog } = useDevLog()

  // スナックバー用
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  useEffect(() => {
    if (!ownerUserId) {
      navigate('/login')
    } else if (!groupId) {
      navigate('/select-group')
    }
  }, [ownerUserId, groupId, navigate])

  const handleAdd = () => {
    createTodo.mutate(
      {
        params: {
          path: { group_id: groupId },
        },
        body: {
          title,
          description,
          due_date: dueDate || undefined,
          owner_user_id: ownerUserId,
        },
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setDueDate('')
          refetch()
          showSnackbar('TODOを追加しました')
          pushLog('追加', `TODO「${title}」を追加`)
        },
        onError: (err: any) => {
          showSnackbar('追加に失敗しました', 'error')
          pushErrorLog(`追加失敗: ${err?.message || 'unknown error'}`)
        },
      }
    )
  }

  const handleDelete = (todo_id: string) => {
    deleteTodo.mutate(
      {
        params: {
          path: { group_id: groupId, todo_id },
        },
      },
      {
        onSuccess: () => {
          refetch()
          showSnackbar('TODOを削除しました')
          pushLog('削除', `TODOを削除 (id: ${todo_id})`)
        },
        onError: (err: any) => {
          showSnackbar('削除に失敗しました', 'error')
          pushErrorLog(`削除失敗: ${err?.message || 'unknown error'}`)
        },
      }
    )
  }

  const handleToggle = (todo_id: string, is_completed: boolean) => {
    updateTodo.mutate(
      {
        params: {
          path: { group_id: groupId, todo_id },
        },
        body: {
          is_completed: !is_completed,
        },
      },
      {
        onSuccess: () => {
          refetch()
          showSnackbar('TODOを更新しました')
          pushLog('更新', `TODOを${!is_completed ? '完了' : '未完了'}に変更 (id: ${todo_id})`)
        },
        onError: (err: any) => {
          showSnackbar('更新に失敗しました', 'error')
          pushErrorLog(`更新失敗: ${err?.message || 'unknown error'}`)
        },
      }
    )
  }

  return (
    <AdminLayout>
      <Box
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          mt: 4,
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            width: '100%', 
            p: { xs: 3, sm: 4 }, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              mb={1}
              sx={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TODO管理
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              {group?.group_name}
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2, 
              mb: 4,
              p: 3,
              borderRadius: 3,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <TextField
              label="タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ flex: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AddCircleOutlineIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField 
              label="説明" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              fullWidth 
              variant="outlined"
              sx={{ flex: 2 }}
            />
            <TextField
              label="期限"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{ minWidth: { xs: '100%', md: 180 } }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                fontWeight: 600, 
                borderRadius: 3, 
                minWidth: { xs: '100%', md: 120 },
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                  boxShadow: '0 6px 20px 0 rgba(37, 99, 235, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={handleAdd}
              disabled={!groupId || !title || !ownerUserId}
            >
              追加
            </Button>
          </Box>
          {/* ローディング表示 */}
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
          ) : todos?.Items?.length ? (
            <Stack spacing={3}>
              {todos?.Items?.map((todo, index) => (
                <Card
                  key={todo.todo_id}
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: todo.is_completed 
                      ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
                    border: todo.is_completed 
                      ? '2px solid #0ea5e9' 
                      : '2px solid #e2e8f0',
                    opacity: todo.is_completed ? 0.8 : 1,
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 25px -5px rgba(0, 0, 0, 0.12)',
                      border: todo.is_completed 
                        ? '2px solid #0284c7' 
                        : '2px solid #cbd5e1',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                      <Checkbox
                        checked={todo.is_completed}
                        onChange={() => handleToggle(todo.todo_id, todo.is_completed)}
                        color="primary"
                        size="large"
                        sx={{ 
                          mt: -0.5,
                          '& .MuiSvgIcon-root': { 
                            fontSize: 28,
                          },
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h5"
                          fontWeight="600"
                          sx={{
                            textDecoration: todo.is_completed ? 'line-through' : 'none',
                            color: todo.is_completed ? 'text.secondary' : 'text.primary',
                            mb: 1,
                            wordBreak: 'break-word',
                          }}
                        >
                          {todo.title}
                        </Typography>
                        {todo.description && (
                          <Typography 
                            variant="body1" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              lineHeight: 1.6,
                              wordBreak: 'break-word',
                            }}
                          >
                            {todo.description}
                          </Typography>
                        )}
                        {todo.due_date && (
                          <Chip
                            label={`期限: ${todo.due_date.slice(0, 10)}`}
                            size="medium"
                            variant={todo.is_completed ? "outlined" : "filled"}
                            color={todo.is_completed ? 'default' : 'primary'}
                            sx={{ 
                              fontWeight: 500,
                              fontSize: '0.875rem',
                            }}
                          />
                        )}
                      </Box>
                      <IconButton 
                        onClick={() => handleDelete(todo.todo_id)}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'error.dark',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
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
              <AddCircleOutlineIcon 
                sx={{ 
                  fontSize: 64, 
                  color: 'text.secondary', 
                  mb: 2,
                  opacity: 0.6,
                }}
              />
              <Typography variant="h5" fontWeight="600" color="text.secondary" mb={1}>
                TODOがありません
              </Typography>
              <Typography variant="body1" color="text.secondary">
                新しいTODOを追加してみましょう！
              </Typography>
            </Box>
          )}
        </Paper>
        {/* スナックバー */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ minWidth: 200 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  )
}
