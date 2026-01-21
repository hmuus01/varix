# Varix Intelligence

## Environment Variables

**Vite requires** `.env.local` variables to connect to Supabase. Create a `.env.local` file in the project root with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project settings: **Settings > API**

## Working Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with CTAs to sign up |
| `/signup` | Sign up form (email + password) |
| `/login` | Login form (email + password) |
| `/app` | Protected dashboard — redirects to `/login` if not authenticated |

## Authentication Flow

1. User signs up at `/signup` → receives email confirmation (if enabled in Supabase)
2. User logs in at `/login` → redirected to `/app`
3. `/app` is protected — unauthenticated users are redirected to `/login`
4. Logout button in `/app` signs out and redirects to `/login`
