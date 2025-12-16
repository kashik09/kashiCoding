'use client'

import { CheckCircle, XCircle, Info, AlertTriangle, X, Undo } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
  showUndo?: boolean
  onUndo?: () => void
}

export default function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  showUndo = false,
  onUndo
}: ToastProps) {
  
  useEffect(() => {
    if (!showUndo) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose, showUndo])

  const styles = {
    success: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400'
  }

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
      <div className={`px-6 py-4 rounded-lg shadow-lg border backdrop-blur-sm ${styles[type]}`}>
        <div className="flex items-center gap-3">
          {icons[type]}
          <p className="font-medium">{message}</p>
          
          {showUndo && onUndo && (
            <button
              onClick={onUndo}
              className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition flex items-center gap-1 text-sm font-semibold"
            >
              <Undo size={14} />
              Undo
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="ml-auto hover:opacity-70 transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}