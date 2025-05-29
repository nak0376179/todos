import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Root() {
  return (
    <Box maxWidth={400} mx="auto" mt={8} textAlign="center">
      <Typography variant="h4" mb={4}>
        TODOアプリデモ
      </Typography>
      <Stack spacing={2} direction="column" alignItems="center">
        <Button component={Link} to="/register" variant="contained">
          ユーザー登録へ
        </Button>
        <Button component={Link} to="/group" variant="outlined">
          グループ作成へ
        </Button>
        <Button component={Link} to="/todo" variant="outlined">
          TODO一覧へ
        </Button>
        <Button component={Link} to="/login" variant="outlined">
          テスト用ログイン
        </Button>
      </Stack>
    </Box>
  )
}
