import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/marcellus/400.css'
import '@fontsource-variable/source-sans-3/wght.css'
import './styles/theme.css'
import { AuthProvider } from './auth/AuthContext'
import App from './App'
import { retry } from './api/retry'
import { ToastProvider } from './components/ui/Toast'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
