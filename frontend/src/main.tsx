import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/noto-sans-jp/400.css'
import '@fontsource/noto-sans-jp/700.css'

const queryClient = new QueryClient()
const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#43a047', // soft green
      light: '#66bb6a',
      dark: '#2e7031',
      contrastText: '#fff',
    },
    secondary: {
      main: '#b2dfdb', // soft teal/green
      light: '#e0f2f1',
      dark: '#4f9a94',
      contrastText: '#222',
    },
    background: {
      default: '#f4f8f6', // very light greenish
      paper: '#f8fbf7',
    },
    error: {
      main: '#e57373', // soft red
    },
    success: {
      main: '#66bb6a',
    },
    info: {
      main: '#80cbc4',
    },
    warning: {
      main: '#ffd54f',
    },
    text: {
      primary: '#222',
      secondary: '#4f5b62',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
