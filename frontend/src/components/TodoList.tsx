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
import { useListTodos, useCreateTodo, useDeleteTodo, useUpdateTodo } from '@/hooks/api'
import { useNavigate } from 'react-router'
import { api } from '@/hooks/api/fetcher'
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
  const { data: todos, refetch, isLoading } = useListTodos(groupId)
  const createTodo = useCreateTodo()
  const deleteTodo = useDeleteTodo()
  const updateTodo = useUpdateTodo()
  const [groupName, setGroupName] = useState('')
  const navigate = useNavigate()

  // 開発者ログ管理
  const { pushLog, pushErrorLog } = useDevLog()

  // スナックバー用
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  useEffect(() => {
    if (groupId) {
      api
        .get(`/groups/${groupId}`)
        .then((res) => setGroupName(res.data.group_name || res.data.name || ''))
        .catch(() => setGroupName(''))
    }
  }, [groupId])

  useEffect(() => {
    if (!ownerUserId) {
      navigate('/login')
    } else if (!groupId) {
      navigate('/select-group')
    }
  }, [ownerUserId, groupId, navigate])

  const handleAdd = () => {
    createTodo.mutate(
      { group_id: groupId, title, description, due_date: dueDate || undefined, owner_user_id: ownerUserId },
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
      { group_id: groupId, todo_id },
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
      { group_id: groupId, todo_id, is_completed: !is_completed },
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
          maxWidth: 1000,
          width: '100%',
          mx: 'auto',
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={6} sx={{ width: '100%', p: 2, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" mb={2} color="primary.main" textAlign="center">
            TODO管理（{groupName}）
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AddCircleOutlineIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField label="説明" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
            <TextField
              label="期限"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: 'bold', borderRadius: 2, minWidth: 80 }}
              onClick={handleAdd}
              disabled={!groupId || !title || !ownerUserId}
            >
              追加
            </Button>
          </Box>
          {/* ローディング表示 */}
          {isLoading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CircularProgress color="primary" />
              <Typography color="text.secondary" mt={2}>
                読み込み中...
              </Typography>
            </Box>
          ) : todos?.length ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              {todos.map((todo) => (
                <Card
                  key={todo.todo_id}
                  elevation={todo.is_completed ? 1 : 3}
                  sx={{
                    borderRadius: 3,
                    bgcolor: todo.is_completed ? '#e0f2f1' : '#fff',
                    opacity: todo.is_completed ? 0.7 : 1,
                    position: 'relative',
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Checkbox
                      checked={todo.is_completed}
                      onChange={() => handleToggle(todo.todo_id, todo.is_completed)}
                      color="primary"
                      icon={<CheckCircleIcon color="disabled" />}
                      checkedIcon={<CheckCircleIcon color="success" />}
                      sx={{ mr: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          textDecoration: todo.is_completed ? 'line-through' : 'none',
                          color: todo.is_completed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {todo.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {todo.description}
                      </Typography>
                      {todo.due_date && (
                        <Chip
                          label={`期限: ${todo.due_date.slice(0, 10)}`}
                          size="small"
                          color={todo.is_completed ? 'default' : 'primary'}
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                    <IconButton edge="end" onClick={() => handleDelete(todo.todo_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
              <img
                src="https://mui.com/static/branding/illustrations/empty-state.svg"
                alt="empty"
                width={180}
                style={{ opacity: 0.7, marginBottom: 16 }}
              />
              <Typography variant="h6" fontWeight="bold">
                TODOがありません
              </Typography>
              <Typography variant="body2">新しいTODOを追加してみましょう！</Typography>
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
