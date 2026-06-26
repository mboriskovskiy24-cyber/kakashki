import type { PropsWithChildren } from 'react'
import styles from './Modal.module.css'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  title: string
}

export function Modal({ children, isOpen, title }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} role="presentation">
      <div
        aria-labelledby="modal-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <h2 className={styles.title} id="modal-title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
