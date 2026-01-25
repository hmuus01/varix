/**
 * Get the site URL for auth redirects.
 * Uses VITE_PUBLIC_SITE_URL env var if set, otherwise falls back to window.location.origin.
 * This ensures redirects work correctly in both development and production.
 */
export function getSiteUrl(): string {
  // Check for environment variable first (set in Vercel for production)
  const envSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined
  if (envSiteUrl) {
    // Remove trailing slash if present
    return envSiteUrl.replace(/\/$/, '')
  }

  // Fall back to current origin (works for localhost and any domain)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // SSR fallback (shouldn't happen in this SPA, but just in case)
  return 'https://www.varixai.com'
}

/**
 * Build a redirect URL for auth flows
 */
export function getAuthRedirectUrl(path: string): string {
  const base = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}
