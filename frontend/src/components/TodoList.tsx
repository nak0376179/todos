import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Paper,
  Divider,
  InputAdornment,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useListTodos, useCreateTodo, useDeleteTodo, useUpdateTodo } from '@/hooks/api'
import { useNavigate } from 'react-router'
import { api } from '@/hooks/api/fetcher'
import AdminLayout from '@/layouts/AdminLayout'
import { useAtom } from 'jotai'
import { userIdAtom, groupIdAtom } from '@/stores/user'

export default function TodoList() {
  const [ownerUserId] = useAtom(userIdAtom)
  const [groupId] = useAtom(groupIdAtom)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const { data: todos, refetch } = useListTodos(groupId)
  const createTodo = useCreateTodo()
  const deleteTodo = useDeleteTodo()
  const updateTodo = useUpdateTodo()
  const [groupName, setGroupName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (groupId) {
      api
        .get(`/groups/${groupId}`)
        .then((res) => setGroupName(res.data.name))
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
        },
      }
    )
  }

  const handleDelete = (todo_id: string) => {
    deleteTodo.mutate({ group_id: groupId, todo_id }, { onSuccess: () => refetch() })
  }

  const handleToggle = (todo_id: string, is_completed: boolean) => {
    updateTodo.mutate({ group_id: groupId, todo_id, is_completed: !is_completed }, { onSuccess: () => refetch() })
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
          <List sx={{ bgcolor: '#f5fafd', borderRadius: 2, boxShadow: 1 }}>
            {todos?.length ? (
              todos.map((todo, idx) => (
                <>
                  <ListItem
                    key={todo.todo_id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDelete(todo.todo_id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      boxShadow: 1,
                      bgcolor: todo.is_completed ? '#e0f2f1' : '#fff',
                      '&:hover': { bgcolor: '#e3f2fd' },
                    }}
                  >
                    <Checkbox
                      checked={todo.is_completed}
                      onChange={() => handleToggle(todo.todo_id, todo.is_completed)}
                      color="primary"
                    />
                    <ListItemText
                      primary={
                        <span style={{ fontWeight: 600, textDecoration: todo.is_completed ? 'line-through' : 'none' }}>
                          {todo.title}
                          {todo.is_completed ? '（完了）' : ''}
                        </span>
                      }
                      secondary={todo.description}
                    />
                  </ListItem>
                  {idx < todos.length - 1 && <Divider />}
                </>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ my: 2, textAlign: 'center' }}>
                TODOがありません
              </Typography>
            )}
          </List>
        </Paper>
      </Box>
    </AdminLayout>
  )
}
