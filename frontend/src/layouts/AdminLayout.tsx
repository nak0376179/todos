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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          color: 'text.primary',
          borderBottom: '1px solid #e2e8f0',
          backdropFilter: 'blur(10px)',
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Typography 
            variant="h5" 
            noWrap 
            component="div" 
            fontWeight="700"
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.025em',
            }}
          >
            TODO管理システム
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ 
              px: 3, 
              py: 1, 
              borderRadius: 2, 
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
            }}>
              <Typography variant="body2" fontWeight="600" color="primary.main">
                {userEmail}
              </Typography>
            </Box>
            <Button 
              color="primary"
              variant="outlined"
              startIcon={<LogoutIcon />} 
              onClick={handleLogout} 
              sx={{ 
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                border: '2px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              ログアウト
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: 'calc(100vh - 64px)' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: 'border-box',
              background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
              color: '#fff',
              borderRight: 0,
              borderRadius: 0,
              top: '64px',
              height: 'calc(100vh - 64px)',
            },
          }}
          slotProps={{ paper: { sx: { top: '64px', height: 'calc(100vh - 64px)', borderRadius: 0 } } }}
        >
          <Box sx={{ p: 3 }}>
            <List sx={{ mt: 2 }}>
              <ListItem
                component="a"
                href={groupId ? `/groups/${groupId}/todos` : '/'}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <ListItemText 
                  primary="TODO管理" 
                  slotProps={{ 
                    primary: { 
                      fontWeight: 600, 
                      color: '#fff',
                      fontSize: '1.1rem',
                    } 
                  }} 
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  )
}
