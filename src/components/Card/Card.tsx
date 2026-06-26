import type { PropsWithChildren } from 'react'
import styles from './Card.module.css'

interface CardProps extends PropsWithChildren {
  className?: string
}

export function Card({ children, className }: CardProps) {
  return <article className={[styles.card, className].filter(Boolean).join(' ')}>{children}</article>
}
