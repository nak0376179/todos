import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useGetUser, useCreateUser } from '../hooks/api'
import { useNavigate } from 'react-router'
import BackToTopButton from '../components/BackToTopButton'

export default function Login() {
  const [inputId, setInputId] = useState('')
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')
  const { data: user, isFetched } = useGetUser(userId)
  const createUser = useCreateUser()
  const navigate = useNavigate()

  const handleLogin = () => {
    setError('')
    setUserId(inputId)
  }

  if (userId && isFetched) {
    if (user) {
      navigate(`/select-group?user_id=${userId}`)
    } else {
      createUser.mutate(
        { email: userId },
        {
          onSuccess: () => navigate(`/select-group?user_id=${userId}`),
          onError: () => setError('ログイン/登録に失敗しました'),
        }
      )
    }
    setUserId('')
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <BackToTopButton />
      <Typography variant="h5" mb={2}>
        テスト用ログイン
      </Typography>
      <TextField
        label="ユーザーID（メールアドレス）"
        fullWidth
        margin="normal"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
      />
      <Button variant="contained" fullWidth sx={{ mt: 2 }} disabled={!inputId} onClick={handleLogin}>
        ログイン
      </Button>
      {error && (
        <Typography color="error.main" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
