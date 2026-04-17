import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import { AccessControlProvider } from './contexts/AccessControlContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import GlobalErrorToast from './components/common/GlobalErrorToast.jsx';
import '../src/style.css'
import App from './App.jsx'

// ── QueryClient created ONCE outside the component tree ──────────────────────
// If placed inside a component it gets recreated on every render, wiping cache.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // data fresh for 5 min — no refetch on nav
      gcTime:    10 * 60 * 1000,       // keep unused cache for 10 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AccessControlProvider>
            <SocketProvider>
              <QueryClientProvider client={queryClient}>
                <App />
                <GlobalErrorToast />
              </QueryClientProvider>
            </SocketProvider>
          </AccessControlProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)

