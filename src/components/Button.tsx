import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import Spinner from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--green)] text-white hover:bg-[var(--green-dark)] focus-visible:ring-[var(--green)]',
  secondary:
    'border-2 border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-white focus-visible:ring-[var(--green)]',
  ghost:
    'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-base px-5 py-2.5 rounded-lg',
  lg: 'text-lg px-6 py-3 rounded-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2 font-semibold
          transition-all duration-150 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading && <Spinner size={size === 'sm' ? 'sm' : 'md'} />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
