import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components'

interface RouteGuardProps {
  children: React.ReactNode
}

/**
 * Protects routes that require authentication.
 * Redirects to /login if not authenticated.
 */
export function ProtectedRoute({ children }: RouteGuardProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    // Redirect to login, but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

/**
 * Protects auth routes (login, signup) from authenticated users.
 * Redirects to /app if already authenticated.
 */
export function AuthRoute({ children }: RouteGuardProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (user) {
    // Redirect to the page they came from, or /app by default
    const from = (location.state as { from?: Location })?.from?.pathname || '/app'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}
