import { useState, useEffect } from 'react'
import { useCreateGroup } from '@/hooks/api/group'
import { Box, TextField, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { useAtom } from 'jotai'
import { userIdAtom } from '@/stores/user'

export default function CreateGroup() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [userId] = useAtom(userIdAtom)
  const createGroup = useCreateGroup()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) {
      navigate('/login')
    }
  }, [userId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createGroup.mutateAsync({
      body: {
        group_name: name,
        owner_user_id: userId,
      },
    })
    setName('')
    setDescription('')
    navigate(`/select-group?user_id=${userId}`)
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
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
