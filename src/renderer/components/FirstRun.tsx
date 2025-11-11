import React from 'react'
import { motion } from 'framer-motion'

interface FirstRunProps {
  onConnect: () => void
  error: string | null
}

export default function FirstRun({ onConnect, error }: FirstRunProps) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="text-8xl mb-6"
        >
          👻
        </motion.div>

        {/* Title */}
        <h1 className="text-white text-3xl font-bold mb-3">Welcome to Ghosted</h1>
        <p className="text-white/60 text-base mb-8 leading-relaxed">
          A premium keyboard-first Gmail client for macOS.
          Connect your Gmail account to get started.
        </p>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Connect Button */}
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: '0 8px 24px rgba(0, 122, 255, 0.4)',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onConnect}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-apple-blue to-apple-purple text-white font-semibold text-base shadow-[0_8px_16px_rgba(0,122,255,0.3)] transition-all"
        >
          Connect Gmail Account
        </motion.button>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg text-left">
          <h3 className="text-white font-semibold text-sm mb-3">Before you start:</h3>
          <ol className="text-white/60 text-sm space-y-2 list-decimal list-inside">
            <li>Make sure you have OAuth credentials set up</li>
            <li>Click "Connect Gmail Account" above</li>
            <li>Sign in with your Google account in the browser</li>
            <li>Grant permissions to Ghosted</li>
            <li>You'll be redirected back automatically</li>
          </ol>
          <p className="text-white/40 text-xs mt-4">
            Need help setting up OAuth? Check Settings → OAuth Setup
          </p>
        </div>

        {/* Hint */}
        <div className="mt-6 text-white/40 text-xs">
          Tip: Press <kbd className="px-2 py-1 bg-white/10 rounded text-white/60 font-medium">⌘⇧E</kbd> anytime to show/hide Ghosted
        </div>
      </motion.div>
    </div>
  )
}
