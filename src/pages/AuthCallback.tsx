import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Spinner, Logo } from '@/components'

/**
 * Auth callback page that handles OAuth and email confirmation tokens.
 *
 * Since detectSessionInUrl is disabled for security (to prevent auto-login on
 * password reset), we manually process auth tokens here for:
 * - OAuth sign-in (Google, GitHub)
 * - Email confirmation after signup
 *
 * Password reset tokens are handled separately by /reset-password.
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processAuthTokens = async () => {
      const hash = window.location.hash.substring(1)

      if (!hash) {
        // No tokens in URL, redirect to login
        navigate('/login', { replace: true })
        return
      }

      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const type = params.get('type')

      // If this is a recovery token, redirect to reset-password page
      // (shouldn't happen since recovery redirects to /reset-password directly,
      // but handle it just in case)
      if (type === 'recovery') {
        navigate(`/reset-password#${hash}`, { replace: true })
        return
      }

      // Check if we have valid tokens for OAuth or email confirmation
      if (!accessToken || !refreshToken) {
        setError('Invalid authentication link. Please try again.')
        return
      }

      try {
        // Manually set the session with the tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) {
          console.error('Failed to set session:', sessionError)
          setError('Authentication failed. Please try again.')
          return
        }

        // Clear the hash from URL for cleanliness
        window.history.replaceState(null, '', '/app')

        // Redirect to the app
        navigate('/app', { replace: true })
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('An unexpected error occurred. Please try again.')
      }
    }

    processAuthTokens()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="p-4 sm:p-6">
          <Logo />
        </header>
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-3">
              Authentication Error
            </h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <a
              href="/login"
              className="inline-block bg-[var(--green)] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[var(--green-dark)] transition-colors"
            >
              Back to Login
            </a>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Spinner size="lg" />
      <p className="mt-4 text-slate-600">Completing sign in...</p>
    </div>
  )
}
