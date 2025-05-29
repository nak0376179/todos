import { Button } from '@mui/material'
import { useNavigate } from 'react-router'

export default function BackToTopButton() {
  const navigate = useNavigate()
  return (
    <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate('/')}>
      トップページに戻る
    </Button>
  )
}
