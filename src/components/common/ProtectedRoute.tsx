import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/config/app.config'
import { Landmark, Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute Guard
 * - Displays a loading indicator while Supabase verifies the session.
 * - When Supabase is configured: strictly redirects unauthenticated visitors to /login.
 * - When Supabase is not configured: permits local demo exploration with a persistent configuration banner,
 *   ensuring developers can preview the UI while clearly knowing real authentication is pending credentials.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isConfigured } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shadow-md">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--color-secondary)]" />
            <span>Verifying session...</span>
          </div>
        </div>
      </div>
    )
  }

  // If Supabase is configured and there is no active session, redirect to Login
  if (isConfigured && !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}

/**
 * PublicOnlyRoute Guard
 * - Redirects already-authenticated users away from /login and /register back to /dashboard.
 */
export function PublicOnlyRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isConfigured } = useAuth()

  if (isLoading) {
    return null
  }

  if (isConfigured && user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}
