import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import '@fontsource/noto-sans-jp'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans JP", sans-serif',
  },
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
