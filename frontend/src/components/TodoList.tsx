import { useState } from 'react'
import { useTodos } from '../hooks/api/useTodos'
import type { Todo } from '../hooks/api/useTodos'
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Stack,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

export function TodoList() {
  const { data, isLoading, addTodo, addTodoStatus, deleteTodo, deleteTodoStatus, editTodo, editTodoStatus } = useTodos()
  const todos = data?.Items ?? []
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      const newTodo: Todo = {
        todo_id: Date.now().toString(),
        title,
        description,
        completed: false,
      }
      await addTodo(newTodo)
      setTitle('')
      setDescription('')
    } catch (e: any) {
      if (Array.isArray(e.detail)) {
        setFormError(e.detail.map((d: any) => d.msg).join(', '))
      } else {
        setFormError(e.detail || '追加失敗')
      }
    }
  }

  async function handleDelete(id: string) {
    setFormError(null)
    try {
      await deleteTodo(id)
    } catch (e: any) {
      setFormError(e.detail || '削除失敗')
    }
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.todo_id)
    setEditTitle(todo.title)
    setEditDescription(todo.description ?? '')
    setFormError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
    setFormError(null)
  }

  async function handleEditSave(id: string) {
    setFormError(null)
    try {
      await editTodo({ id, todo: { todo_id: id, title: editTitle, description: editDescription, completed: false } })
      setEditingId(null)
      setEditTitle('')
      setEditDescription('')
    } catch (e: any) {
      setFormError(e.detail || '編集失敗')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Todo App
      </Typography>
      <Box component="form" onSubmit={handleAdd} mb={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            sx={{ flex: 2 }}
          />
          <Button type="submit" variant="contained" disabled={addTodoStatus === 'pending'}>
            追加
          </Button>
        </Stack>
      </Box>
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.todo_id}
              secondaryAction={
                editingId === todo.todo_id ? (
                  <>
                    <Button
                      onClick={() => handleEditSave(todo.todo_id)}
                      disabled={editTodoStatus === 'pending'}
                      variant="contained"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      保存
                    </Button>
                    <Button onClick={cancelEdit} size="small" variant="outlined">キャンセル</Button>
                  </>
                ) : (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => startEdit(todo)} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(todo.todo_id)}
                      disabled={deleteTodoStatus === 'pending'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }
              divider
            >
              {editingId === todo.todo_id ? (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    size="small"
                    label="タイトル"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    size="small"
                    label="説明"
                    sx={{ flex: 2 }}
                  />
                </Stack>
              ) : (
                <ListItemText
                  primary={todo.title}
                  secondary={todo.description}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  )
}
 