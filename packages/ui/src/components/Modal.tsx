'use client'

import { ReactNode, useEffect, useCallback } from 'react'
import { X, AlertTriangle, Info, HelpCircle, CheckCircle } from 'lucide-react'
import { cn } from '../lib/utils'

export type ModalType = 'danger' | 'warning' | 'info' | 'question' | 'success' | 'default'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  overlayClassName?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') onClose()
    },
    [onClose, closeOnEscape]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-background/60 backdrop-blur-sm animate-fade-in',
        overlayClassName
      )}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg animate-zoom-in',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: ReactNode
  confirmText?: string
  cancelText?: string
  type?: ModalType
}

const typeStyles = {
  danger: {
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    icon: <AlertTriangle size={24} />,
    button: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    icon: <AlertTriangle size={24} />,
    button: 'bg-warning text-foreground hover:bg-warning/90',
  },
  info: {
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
    icon: <Info size={24} />,
    button: 'bg-info text-foreground hover:bg-info/90',
  },
  question: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    icon: <HelpCircle size={24} />,
    button: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  success: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    icon: <CheckCircle size={24} />,
    button: 'bg-success text-foreground hover:bg-success/90',
  },
  default: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    icon: <Info size={24} />,
    button: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}: ConfirmModalProps) {
  const style = typeStyles[type]

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 md:p-8">
        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div
            className={cn(
              'w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0',
              style.iconBg
            )}
          >
            <div className={style.iconColor}>{style.icon}</div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-foreground mb-6 md:mb-8 leading-relaxed">
          {message}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 md:px-6 py-3 bg-muted hover:bg-muted/80 border border-border text-foreground rounded-xl transition-all font-semibold hover:scale-[1.02] active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={cn(
              'flex-1 px-4 md:px-6 py-3 rounded-xl transition-all font-semibold hover:scale-[1.02] active:scale-[0.98]',
              style.button
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
