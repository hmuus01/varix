import { Link } from 'react-router-dom'

interface LogoProps {
  variant?: 'dark' | 'light'
  linkTo?: string
  className?: string
}

export default function Logo({ variant = 'dark', linkTo = '/', className = '' }: LogoProps) {
  const textFill = variant === 'dark' ? '#0f172a' : 'white'

  const logoSvg = (
    <svg viewBox="0 0 100 40" className={`h-10 ${className}`} aria-label="Varix">
      <path d="M8 20 L2 6 L6 6 L12 20 L6 34 L2 34 Z" fill="#275A45" />
      <path d="M18 20 L8 6 L12 6 L18 20 L12 34 L8 34 Z" fill="#275A45" />
      <text x="24" y="28" fontFamily="Inter" fontWeight="800" fontSize="14" fill={textFill}>
        VARIX
      </text>
    </svg>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        {logoSvg}
      </Link>
    )
  }

  return logoSvg
}
