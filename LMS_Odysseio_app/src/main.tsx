import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { RoleProvider } from './context/RoleContext.tsx'
import { NavigationProvider } from './context/NavigationContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </RoleProvider>
    </QueryClientProvider>
  </StrictMode>,
)
