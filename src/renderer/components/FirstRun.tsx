import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface FirstRunProps {
  onConnect: () => void
  onSettingsClick: () => void
  error: string | null
}

export default function FirstRun({ onConnect, onSettingsClick, error }: FirstRunProps) {
  const [authCode, setAuthCode] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleManualAuth = async () => {
    if (!authCode.trim()) return

    setIsConnecting(true)
    try {
      const result = await window.electron.gmail.handleCallback(authCode.trim())
      if (result.success) {
        // Success! The app will reload
        console.log('✅ Successfully authenticated!')
      } else {
        console.error('❌ Authentication failed:', result.error)
      }
    } catch (error) {
      console.error('❌ Error:', error)
    }
    setIsConnecting(false)
  }
  return (
    <div className="h-full flex flex-col">
      {/* Top bar with Settings button */}
      <div className="px-4 py-3 border-b border-raycast-border flex items-center justify-between">
        <h2 className="text-text-primary text-title">Welcome to Ghosted</h2>
        <motion.button
          onClick={onSettingsClick}
          className="px-3 py-1.5 rounded-button bg-raycast-hover-subtle hover:bg-raycast-hover text-text-secondary hover:text-text-primary text-body font-medium transition-all duration-150 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          Setup OAuth Credentials
        </motion.button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
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
        <h1 className="text-text-primary text-title-large mb-3">Welcome to Ghosted</h1>
        <p className="text-text-secondary text-body mb-8 leading-relaxed">
          A premium keyboard-first Gmail client for macOS.
          Connect your Gmail account to get started.
        </p>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-priority-high/10 border border-priority-high/30 rounded-button"
          >
            <p className="text-priority-high text-body">{error}</p>
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
          className="px-8 py-3 rounded-button bg-gradient-to-r from-link to-apple-purple text-text-primary font-medium text-body shadow-[0_8px_16px_rgba(0,122,255,0.3)] transition-all duration-150"
        >
          Connect Gmail Account
        </motion.button>

        {/* OR divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-raycast-border-subtle"></div>
          <span className="text-text-tertiary text-caption font-medium tracking-caps uppercase">OR PASTE CODE</span>
          <div className="flex-1 h-px bg-raycast-border-subtle"></div>
        </div>

        {/* Manual Code Input */}
        <div className="w-full space-y-3">
          <input
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualAuth()}
            placeholder="Paste authorization code here..."
            className="w-full px-4 py-2.5 bg-raycast-hover-subtle border border-raycast-border-subtle rounded-button text-text-primary text-body placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-link/50 focus:border-link/50 transition-all duration-150"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleManualAuth}
            disabled={!authCode.trim() || isConnecting}
            className="w-full px-4 py-2.5 rounded-button bg-raycast-hover hover:bg-raycast-selected text-text-primary font-medium text-body transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Connect with Code'}
          </motion.button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-raycast-hover-subtle rounded-button text-left">
          <h3 className="text-text-primary font-medium text-body mb-3">How to connect:</h3>
          <ol className="text-text-secondary text-body space-y-2 list-decimal list-inside">
            <li>Set up OAuth credentials (click button above)</li>
            <li>Click "Connect Gmail Account"</li>
            <li>Sign in with Google in your browser</li>
            <li>Copy the authorization code shown</li>
            <li>Paste it in the field above and click "Connect with Code"</li>
          </ol>
          <p className="text-text-tertiary text-caption mt-4">
            💡 Make sure the OAuth callback server is running: <code className="bg-white/8 px-1.5 py-0.5 rounded-small font-mono">npm run oauth-server</code>
          </p>
        </div>

        {/* Hint */}
        <div className="mt-6 text-text-tertiary text-caption">
          Tip: Press <kbd className="shortcut-pill">⌘⇧E</kbd> anytime to show/hide Ghosted
        </div>
      </motion.div>
      </div>
    </div>
  )
}
