# Varix Web App (Vite + React + TS + Tailwind + Supabase)

## Commands
- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview

## Stack & structure
- Vite + React + TypeScript
- TailwindCSS (prefer Tailwind utilities)
- Routing in: src/App.tsx
- Pages in: src/pages/*
- Supabase client in: src/lib/supabaseClient.ts
- Global styles / brand tokens likely in: src/index.css

## Non-negotiables (do not break)
- Keep existing routes and behavior: "/", "/login", "/signup", "/app"
- Supabase auth must keep working exactly as-is (no backend changes)
- Keep the existing brand green + colour direction (do NOT rebrand)
- No new UI libraries unless absolutely necessary (prefer Tailwind + small local components)

## UI goals
- Premium, sleek SaaS feel: spacing rhythm, typography, consistent components
- Strong states: hover/focus/active/disabled/error
- Accessibility: labels, focus rings, semantic HTML, contrast-safe
- Responsive: mobile-first, clean desktop layout

## Implementation approach
- Create reusable components first: Button, Input, Card, Badge, Container, Section, Navbar
- Then upgrade pages in order: Home → Login/Signup → ProtectedApp
- Make small, safe commits / incremental changes; keep the app building after each step

## Output expectations
When asked to “improve design”:
- Provide a short plan
- Implement changes
- Summarize files changed and why

