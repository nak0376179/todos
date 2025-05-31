import { useState } from 'react'
import { Box, Button, TextField, Typography, Paper, InputAdornment, Avatar, Link as MuiLink } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useGetUser, useCreateUser } from '@/hooks/api/user'
import { useNavigate, Link as RouterLink } from 'react-router'
import { useAtom } from 'jotai'
import { userIdAtom } from '@/stores/user'

export default function Login() {
  const [inputId, setInputId] = useState('admin@example.com')
  const [userId, setUserId] = useAtom(userIdAtom)
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
        { body: { email: userId } },
        {
          onSuccess: () => navigate(`/select-group?user_id=${userId}`),
          onError: () => setError('ログイン/登録に失敗しました'),
        }
      )
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={8} sx={{ p: 5, maxWidth: 400, width: '100%', borderRadius: 3, textAlign: 'center' }}>
        <Avatar sx={{ m: '0 auto', bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight="bold" mt={2} mb={1} color="primary.main">
          ログイン
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          メールアドレスでログインまたは自動登録
        </Typography>
        <TextField
          label="ユーザーID（メールアドレス）"
          fullWidth
          margin="normal"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Avatar src="/src/assets/react.svg" sx={{ width: 24, height: 24, bgcolor: 'transparent' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, fontWeight: 'bold', fontSize: 18, py: 1.2, borderRadius: 2 }}
          disabled={!inputId}
          onClick={handleLogin}
        >
          ログイン
        </Button>
        <MuiLink
          component={RouterLink}
          to="/register"
          underline="hover"
          sx={{ display: 'block', mt: 3, fontWeight: 'bold' }}
        >
          アカウント新規作成はこちら
        </MuiLink>
        {error && (
          <Typography color="error.main" mt={2}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  )
}
