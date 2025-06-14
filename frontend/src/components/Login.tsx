import { Box, Button, TextField, Typography, Paper, InputAdornment, Avatar, Link as MuiLink } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonIcon from '@mui/icons-material/Person'
import { useGetUser, useCreateUser } from '@/hooks/api/user'
import { useNavigate, Link as RouterLink } from 'react-router'
import { useAtom } from 'jotai'
import { userIdAtom } from '@/stores/user'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Zod スキーマ定義
const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const [userId, setUserId] = useAtom(userIdAtom)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@example.com',
    },
  })

  const { data: user, isFetched } = useGetUser(userId)
  const createUser = useCreateUser()

  const onSubmit = (data: FormData) => {
    setError('')
    setUserId(data.email)
  }

  useEffect(() => {
    if (!userId || !isFetched) return

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
  }, [userId, isFetched, user, navigate, createUser])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, sm: 6 }, 
          maxWidth: 440, 
          width: '100%', 
          borderRadius: 4, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Avatar sx={{ 
            m: '0 auto', 
            bgcolor: 'primary.main', 
            width: 64, 
            height: 64,
            mb: 3,
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            boxShadow: '0 8px 25px -5px rgba(37, 99, 235, 0.4)',
          }}>
            <LockOutlinedIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h3" fontWeight="700" mb={1} sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ようこそ
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            メールアドレスでログインまたは自動登録
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Controller を使用して MUI の TextField を連携 */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="ユーザーID（メールアドレス）"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              mt: 3, 
              mb: 2,
              fontWeight: 600, 
              fontSize: '1.1rem', 
              py: 1.8, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              boxShadow: '0 8px 25px -5px rgba(37, 99, 235, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                boxShadow: '0 12px 35px -5px rgba(37, 99, 235, 0.5)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            ログイン
          </Button>
        </form>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
          <MuiLink
            component={RouterLink}
            to="/register"
            underline="none"
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 500,
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark',
              },
              transition: 'color 0.2s ease-in-out',
            }}
          >
            アカウント新規作成はこちら →
          </MuiLink>
        </Box>

        {error && (
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            backgroundColor: 'error.light', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'error.main',
          }}>
            <Typography color="error.main" fontWeight={500}>
              {error}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
