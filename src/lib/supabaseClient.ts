import { createClient, SupabaseClient, AuthError } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Check if env vars exist
export const isMissingEnvVars = !supabaseUrl || !supabaseAnonKey

// Validate key format: accept both legacy JWT (eyJ...) and new publishable keys (sb_publishable_...)
function isValidSupabaseKey(key: string | undefined): boolean {
  if (!key) return false
  return key.startsWith('eyJ') || key.startsWith('sb_publishable_')
}

export const isInvalidAnonKey = supabaseAnonKey ? !isValidSupabaseKey(supabaseAnonKey) : false

// Create client only if env vars are valid
// CRITICAL SECURITY: detectSessionInUrl is FALSE to prevent auto-login on password reset
// OAuth and email confirmation flows are handled manually in their respective pages
export const supabase: SupabaseClient = (isMissingEnvVars || isInvalidAnonKey)
  ? (null as unknown as SupabaseClient)
  : createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        detectSessionInUrl: false, // Prevent auto-session from URL tokens
        persistSession: true,
        autoRefreshToken: true,
      },
    })

/**
 * Helper to format Supabase auth errors into user-friendly messages
 */
export function formatAuthError(error: AuthError | Error | unknown): string {
  if (!error) return 'An unknown error occurred'

  // Handle AuthError from Supabase
  if (error && typeof error === 'object' && 'message' in error) {
    const authError = error as AuthError
    const message = authError.message || 'Authentication failed'

    // Map common error messages to friendlier versions
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password. Please check your credentials and try again.',
      'Email not confirmed': 'Please check your email and click the confirmation link before logging in.',
      'User already registered': 'An account with this email already exists. Try logging in instead.',
      'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
      'Unable to validate email address: invalid format': 'Please enter a valid email address.',
      'Signup requires a valid password': 'Please enter a valid password.',
      'Email rate limit exceeded': 'Too many attempts. Please wait a few minutes before trying again.',
      'For security purposes, you can only request this once every 60 seconds': 'Please wait 60 seconds before trying again.',
    }

    // Check for partial matches
    for (const [key, friendlyMessage] of Object.entries(errorMap)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return friendlyMessage
      }
    }

    // Return original message if no mapping found
    return message
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Unable to connect to the server. Please check your internet connection and try again.'
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}
