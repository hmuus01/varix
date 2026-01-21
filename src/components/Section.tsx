import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'slate' | 'dark'
  padding?: 'sm' | 'md' | 'lg'
  id?: string
}

const backgroundStyles = {
  white: 'bg-white',
  slate: 'bg-slate-50',
  dark: 'bg-slate-900 text-white',
}

const paddingStyles = {
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-20',
  lg: 'py-20 sm:py-24',
}

export default function Section({
  children,
  className = '',
  background = 'white',
  padding = 'md',
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </section>
  )
}
