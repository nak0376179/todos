import { Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Button } from '@mui/material'
import { ReactNode } from 'react'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAtom } from 'jotai'
import { userIdAtom, groupIdAtom } from '@/stores/user'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [userEmail, setUserId] = useAtom(userIdAtom)
  const [groupId, setGroupId] = useAtom(groupIdAtom)

  const handleLogout = () => {
    setUserId('')
    setGroupId('')
    window.location.href = '/login'
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fa' }}>
      <AppBar position="fixed" color="primary" elevation={2} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div" fontWeight="bold" letterSpacing={2}>
            TODO管理システム
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
              {userEmail}
            </Typography>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ fontWeight: 'bold' }}>
              ログアウト
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box sx={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 64px)' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 200,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 200,
              boxSizing: 'border-box',
              bgcolor: '#263238',
              color: '#fff',
              borderRight: 0,
              top: '64px',
              height: 'calc(100vh - 64px)',
            },
          }}
          slotProps={{ paper: { sx: { top: '64px', height: 'calc(100vh - 64px)' } } }}
        >
          <List>
            <ListItem
              component="a"
              href={groupId ? `/groups/${groupId}/todos` : '/'}
              sx={{ '&:hover': { bgcolor: '#37474f' } }}
            >
              <ListItemText primary="TODO管理" slotProps={{ primary: { fontWeight: 'bold', color: '#fff' } }} />
            </ListItem>
            {/* 他の管理メニューがあればここに追加 */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
        >
          <Box sx={{ p: 3, width: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  )
}
