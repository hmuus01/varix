import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardBodyProps {
  children: ReactNode
  className?: string
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-200
        shadow-sm hover:shadow-md transition-shadow duration-200
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={className}>{children}</div>
}

export default Card
