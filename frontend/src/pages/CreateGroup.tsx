import { useState, useEffect } from 'react'
import { useCreateGroup } from '../hooks/api/group'
import { Box, TextField, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import BackToTopButton from '../components/BackToTopButton'

export default function CreateGroup() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const userId = localStorage.getItem('user_id') || ''
  const createGroup = useCreateGroup()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) {
      navigate('/login')
    }
  }, [userId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createGroup.mutateAsync({ name, owner_user_id: userId, description })
    setName('')
    setDescription('')
    // グループ作成後の遷移など必要なら追加
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <BackToTopButton />
      <Typography variant="h5" mb={2}>
        グループ作成
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="グループ名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField label="オーナーユーザーID" value={userId} fullWidth margin="normal" disabled />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          作成
        </Button>
      </form>
    </Box>
  )
}
