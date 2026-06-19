'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../lib/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const toastStyles: Record<ToastType, string> = {
  success:
    'bg-success/10 border-success/30 text-success',
  error:
    'bg-destructive/10 border-destructive/30 text-destructive',
  info:
    'bg-info/10 border-info/30 text-info',
  warning:
    'bg-warning/10 border-warning/30 text-warning',
}

const toastIcons: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
}

function ToastItem({
  message,
  type,
  onClose,
}: {
  message: string
  type: ToastType
  onClose: () => void
}) {
  return (
    <div
      className={cn(
        'min-w-[300px] px-4 py-3 rounded-lg border backdrop-blur-sm animate-slide-in-right',
        toastStyles[type]
      )}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {toastIcons[type]}
        <p className="font-medium flex-1">{message}</p>
        <button onClick={onClose} className="hover:opacity-70 transition" aria-label="Dismiss">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export interface ToastProviderProps {
  children: ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const positionClasses = {
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
}

export function ToastProvider({
  children,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration: number = 3000) => {
      const id = Math.random().toString(36).substring(7)
      setToasts((prev) => [...prev, { id, message, type, duration }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    },
    []
  )

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={cn('fixed z-50 space-y-3', positionClasses[position])}>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
