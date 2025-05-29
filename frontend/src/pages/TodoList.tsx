import { useState, useEffect } from 'react'
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useListTodos, useCreateTodo, useDeleteTodo, useUpdateTodo } from '../hooks/api'
import { useGetGroup } from '../hooks/api/group'
import { useNavigate } from 'react-router'
import { api } from '../hooks/api/fetcher'
import BackToTopButton from '../components/BackToTopButton'

export default function TodoList() {
  const [ownerUserId] = useState(() => localStorage.getItem('user_id') || '')
  const [groupId] = useState(() => localStorage.getItem('group_id') || '')
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
    const userId = localStorage.getItem('user_id') || ''
    createTodo.mutate(
      { group_id: groupId, title, description, due_date: dueDate || undefined, owner_user_id: userId },
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
    deleteTodo.mutate(todo_id, { onSuccess: () => refetch() })
  }

  const handleToggle = (todo_id: string, is_completed: boolean) => {
    updateTodo.mutate({ todo_id, is_completed: !is_completed }, { onSuccess: () => refetch() })
  }

  return (
    <Box maxWidth={600} mx="auto" mt={8}>
      <BackToTopButton />
      <Typography variant="h5" mb={2}>
        TODO一覧（{groupName}）
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField label="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="説明" value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField
          label="期限"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleAdd} disabled={!groupId || !title || !ownerUserId}>
          追加
        </Button>
      </Box>
      <List>
        {todos?.map((todo) => (
          <ListItem
            key={todo.todo_id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(todo.todo_id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox checked={todo.is_completed} onChange={() => handleToggle(todo.todo_id, todo.is_completed)} />
            <ListItemText primary={todo.title + (todo.is_completed ? '（完了）' : '')} secondary={todo.description} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
