import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isMissingEnvVars = !supabaseUrl || !supabaseAnonKey

// Create a dummy client if env vars are missing to prevent app crash
export const supabase: SupabaseClient = isMissingEnvVars
  ? (null as unknown as SupabaseClient)
  : createClient(supabaseUrl, supabaseAnonKey)
