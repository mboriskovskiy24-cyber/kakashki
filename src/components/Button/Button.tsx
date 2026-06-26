import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import styles from './Button.module.css'
import { playButtonClickSound } from '../../utils/uiFeedback'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps
  extends PropsWithChildren,
    ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

export function Button({
  children,
  className,
  fullWidth = false,
  onClick,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      type={type}
      onClick={(event) => {
        if (!props.disabled) {
          playButtonClickSound()
        }

        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </button>
  )
}
