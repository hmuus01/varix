import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase, isMissingEnvVars, isInvalidAnonKey } from '@/lib/supabaseClient'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Check if we're on the password reset page with recovery tokens.
 * In this case, we should NOT auto-create a session - the ResetPassword
 * component will handle the tokens manually for security.
 */
function isPasswordRecoveryFlow(): boolean {
  if (typeof window === 'undefined') return false

  const isResetPage = window.location.pathname === '/reset-password'
  const hash = window.location.hash
  const hasRecoveryToken = hash.includes('type=recovery')

  return isResetPage && hasRecoveryToken
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip if Supabase isn't configured
    if (isMissingEnvVars || isInvalidAnonKey) {
      setLoading(false)
      return
    }

    // Get initial session with error handling
    const initSession = async () => {
      try {
        // If we're in password recovery flow, don't get/set session
        // The ResetPassword component handles this manually
        if (isPasswordRecoveryFlow()) {
          setLoading(false)
          return
        }

        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Failed to get session:', error)
        }
        setSession(session)
      } catch (err) {
        console.error('Unexpected error getting session:', err)
      } finally {
        setLoading(false)
      }
    }

    initSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Don't auto-login for password recovery - ResetPassword handles it
        if (event === 'PASSWORD_RECOVERY' && isPasswordRecoveryFlow()) {
          // Sign out immediately to prevent auto-login
          supabase.auth.signOut()
          return
        }

        setSession(session)
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (err) {
      console.error('Unexpected sign out error:', err)
    } finally {
      setSession(null)
    }
  }

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
