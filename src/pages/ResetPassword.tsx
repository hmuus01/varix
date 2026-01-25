import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, formatAuthError } from '@/lib/supabaseClient'
import { Button, PasswordInput, Card, Logo } from '@/components'

interface RecoveryTokens {
  accessToken: string
  refreshToken: string
}

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokens, setTokens] = useState<RecoveryTokens | null>(null)
  const [tokenError, setTokenError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Reset Password | Varix'

    // Parse tokens from URL hash manually - DO NOT create a session
    // The URL hash format is: #access_token=...&refresh_token=...&type=recovery
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    // Validate we have a recovery token
    if (accessToken && refreshToken && type === 'recovery') {
      setTokens({ accessToken, refreshToken })
      // Clear the hash from URL for security (don't expose tokens)
      window.history.replaceState(null, '', window.location.pathname)
    } else {
      setTokenError(true)
    }

    // Sign out any existing session to ensure clean state
    // This prevents the auto-login behavior
    supabase.auth.signOut()
  }, [])

  // Password validation
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError(null)
      return false
    }
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return false
    }
    if (!/[A-Z]/.test(value)) {
      setPasswordError('Password must contain an uppercase letter')
      return false
    }
    if (!/[a-z]/.test(value)) {
      setPasswordError('Password must contain a lowercase letter')
      return false
    }
    if (!/\d/.test(value)) {
      setPasswordError('Password must contain a number')
      return false
    }
    setPasswordError(null)
    return true
  }

  // Confirm password validation
  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setConfirmError(null)
      return false
    }
    if (value !== password) {
      setConfirmError('Passwords do not match')
      return false
    }
    setConfirmError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tokens) {
      setError('Invalid reset token. Please request a new password reset link.')
      return
    }

    // Validate all fields
    const isPasswordValid = validatePassword(password)
    const isConfirmValid = validateConfirmPassword(confirmPassword)

    if (!isPasswordValid || !isConfirmValid) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Step 1: Set session with the recovery tokens
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      })

      if (sessionError) {
        console.error('Session error:', sessionError.message)
        setError('This reset link has expired. Please request a new one.')
        return
      }

      // Step 2: Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error('Password update failed:', updateError.message)
        setError(formatAuthError(updateError))
        // Sign out even on error to clear the temporary session
        await supabase.auth.signOut()
        return
      }

      // Step 3: Sign out immediately - user must log in with new password
      await supabase.auth.signOut()

      // Clear tokens from state
      setTokens(null)
      setSuccess(true)

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      console.error('Password reset error:', err)
      setError(formatAuthError(err))
      // Ensure we sign out on any error
      await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  // Show error if no valid tokens found
  if (tokenError) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="p-4 sm:p-6">
          <Logo />
        </header>
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Invalid or expired link
              </h1>
              <p className="text-slate-600 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/forgot-password">
                <Button fullWidth>
                  Request new link
                </Button>
              </Link>
            </div>
          </Card>
        </main>
        <footer className="p-4 text-center text-sm text-slate-500">
          © 2025 Varix Intelligence Ltd
        </footer>
      </div>
    )
  }

  // Show loading state while parsing tokens
  if (!tokens && !tokenError) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="p-4 sm:p-6">
          <Logo />
        </header>
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md" padding="lg">
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
            </div>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Logo />
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md" padding="lg">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Password updated
              </h1>
              <p className="text-slate-600 mb-6">
                Your password has been successfully reset. Redirecting you to login...
              </p>
              <Link to="/login">
                <Button variant="secondary" fullWidth>
                  Go to login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Set new password
                </h1>
                <p className="text-slate-600 mt-2">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <PasswordInput
                  label="New Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) validatePassword(e.target.value)
                    if (confirmPassword) validateConfirmPassword(confirmPassword)
                  }}
                  onBlur={() => password && validatePassword(password)}
                  error={passwordError || undefined}
                  placeholder="Enter new password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  showStrength
                  maxLength={128}
                />

                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (confirmError) validateConfirmPassword(e.target.value)
                  }}
                  onBlur={() => confirmPassword && validateConfirmPassword(confirmPassword)}
                  error={confirmError || undefined}
                  placeholder="Confirm new password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  maxLength={128}
                />

                {error && (
                  <div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3"
                    role="alert"
                  >
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" loading={loading} fullWidth size="lg">
                  {loading ? 'Updating...' : 'Update password'}
                </Button>
              </form>

              <p className="mt-8 text-center text-slate-600">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-[var(--green)] font-semibold hover:underline focus:outline-none focus:underline"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-slate-500">
        © 2025 Varix Intelligence Ltd
      </footer>
    </div>
  )
}
