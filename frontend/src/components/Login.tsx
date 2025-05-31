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
            sx={{ mt: 2, fontWeight: 'bold', fontSize: 18, py: 1.2, borderRadius: 2 }}
          >
            ログイン
          </Button>
        </form>

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
