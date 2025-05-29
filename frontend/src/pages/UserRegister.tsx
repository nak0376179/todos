import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useCreateUser } from '../hooks/api'

export default function UserRegister() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const { mutate, data, isSuccess, isPending, error } = useCreateUser()

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" mb={2}>ユーザー登録</Typography>
      <TextField
        label="メールアドレス"
        fullWidth
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        label="名前（任意）"
        fullWidth
        margin="normal"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isPending || !email}
        onClick={() => mutate({ email, name: name || undefined })}
      >
        登録
      </Button>
      {isSuccess && (
        <Typography color="success.main" mt={2}>
          登録成功！ユーザーID: {data.user_id}
        </Typography>
      )}
      {error && (
        <Typography color="error.main" mt={2}>
          エラー: {error instanceof Error ? error.message : '登録に失敗しました'}
        </Typography>
      )}
    </Box>
  )
} 