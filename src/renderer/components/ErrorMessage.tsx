import React from 'react'
import { motion } from 'framer-motion'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  onDismiss: () => void
}

export default function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mx-4 mt-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
    >
      {/* Icon */}
      <div className="text-red-400 text-xl flex-shrink-0">⚠️</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-red-400 font-semibold text-sm mb-1">Something went wrong</h4>
        <p className="text-red-300/80 text-xs leading-relaxed">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 text-xs font-medium transition-colors"
          >
            Retry
          </motion.button>
        )}

        <button
          onClick={onDismiss}
          className="w-6 h-6 rounded hover:bg-red-500/20 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1 1L9 9M1 9L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
