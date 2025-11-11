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
      <div className="h-[60px] px-4 border-b border-raycast-border flex items-center justify-between">
        <h2 className="text-white text-[15px] font-semibold">Welcome to Ghosted</h2>
        <button
          onClick={onSettingsClick}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
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
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
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

        {/* OR divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-white/40 text-xs font-medium">OR PASTE CODE</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Manual Code Input */}
        <div className="w-full space-y-3">
          <input
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualAuth()}
            placeholder="Paste authorization code here..."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue/50 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleManualAuth}
            disabled={!authCode.trim() || isConnecting}
            className="w-full px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Connect with Code'}
          </motion.button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg text-left">
          <h3 className="text-white font-semibold text-sm mb-3">How to connect:</h3>
          <ol className="text-white/60 text-sm space-y-2 list-decimal list-inside">
            <li>Set up OAuth credentials (click button above)</li>
            <li>Click "Connect Gmail Account"</li>
            <li>Sign in with Google in your browser</li>
            <li>Copy the authorization code shown</li>
            <li>Paste it in the field above and click "Connect with Code"</li>
          </ol>
          <p className="text-white/40 text-xs mt-4">
            💡 Make sure the OAuth callback server is running: <code className="bg-white/10 px-1 rounded">npm run oauth-server</code>
          </p>
        </div>

        {/* Hint */}
        <div className="mt-6 text-white/40 text-xs">
          Tip: Press <kbd className="px-2 py-1 bg-white/10 rounded text-white/60 font-medium">⌘⇧E</kbd> anytime to show/hide Ghosted
        </div>
      </motion.div>
      </div>
    </div>
  )
}
