import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, formatAuthError } from '@/lib/supabaseClient'
import { getAuthRedirectUrl } from '@/lib/siteUrl'
import { Button, Input, PasswordInput, Card, Logo } from '@/components'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Sign Up | Varix'
  }, [])

  // Email validation
  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError(null)
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(null)
    return true
  }

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const isConfirmValid = validateConfirmPassword(confirmPassword)

    if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
      return
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl('/auth/callback'),
        },
      })

      if (error) {
        console.error('Sign up failed:', error.message, error)
        setError(formatAuthError(error))
        return
      }

      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists. Please log in instead.')
        return
      }

      // Email confirmation required
      if (data.user && !data.session) {
        setSuccess(true)
      } else if (data.session) {
        // Auto-confirmed, redirect to app
        navigate('/app')
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError(formatAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl('/auth/callback'),
        },
      })

      if (error) {
        console.error('Google sign-up failed:', error)
        setError('Failed to sign up with Google. Please try again.')
      }
    } catch (err) {
      console.error('Google sign-up error:', err)
      setError('Failed to sign up with Google. Please try again.')
    }
  }

  const handleGitHubSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: getAuthRedirectUrl('/auth/callback'),
        },
      })

      if (error) {
        console.error('GitHub sign-up failed:', error)
        setError('Failed to sign up with GitHub. Please try again.')
      }
    } catch (err) {
      console.error('GitHub sign-up error:', err)
      setError('Failed to sign up with GitHub. Please try again.')
    }
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
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Check your email
              </h1>
              <p className="text-slate-600 mb-6">
                We've sent a confirmation link to <strong className="text-slate-900">{email}</strong>.
                Please click the link to activate your account.
              </p>
              <p className="text-sm text-slate-500">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-[var(--green)] font-medium hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Create account
                </h1>
                <p className="text-slate-600 mt-2">
                  Sign up to get started with Varix
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-medium text-slate-700">Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGitHubSignUp}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span className="font-medium text-slate-700">Continue with GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) validateEmail(e.target.value)
                  }}
                  onBlur={() => email && validateEmail(email)}
                  error={emailError || undefined}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                  maxLength={254}
                />

                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) validatePassword(e.target.value)
                    if (confirmPassword) validateConfirmPassword(confirmPassword)
                  }}
                  onBlur={() => password && validatePassword(password)}
                  error={passwordError || undefined}
                  placeholder="Create a strong password"
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
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  maxLength={128}
                />

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[var(--green)] focus:ring-[var(--green)] focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-[var(--green)] hover:underline font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-[var(--green)] hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

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
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <p className="mt-8 text-center text-slate-600">
                Already have an account?{' '}
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
