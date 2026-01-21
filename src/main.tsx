import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider, ErrorBoundary } from '@/components'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
