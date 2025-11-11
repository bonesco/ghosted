import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SettingsProps {
  onClose: () => void
  userEmail: string | null
  onDisconnect: () => void
  onAuthComplete: () => void
}

export default function Settings({
  onClose,
  userEmail,
  onDisconnect,
  onAuthComplete,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'credentials' | 'shortcuts' | 'about'>('account')
  const [version, setVersion] = useState('1.0.0')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    loadVersion()
    loadCredentials()
  }, [])

  const loadVersion = async () => {
    const v = await window.electron.getAppVersion()
    setVersion(v)
  }

  const loadCredentials = async () => {
    const result = await window.electron.gmail.getCredentials()
    if (result.success) {
      setClientId(result.clientId)
      setClientSecret(result.clientSecret)
    }
  }

  const handleSaveCredentials = async () => {
    const result = await window.electron.gmail.saveCredentials(clientId, clientSecret)
    if (result.success) {
      setSavedMessage('Credentials saved successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
    }
  }

  const shortcuts = [
    { keys: ['⌘', '⇧', 'E'], description: 'Show/hide Ghosted' },
    { keys: ['/'], description: 'Focus search bar' },
    { keys: ['↑', '↓'], description: 'Navigate emails' },
    { keys: ['↵'], description: 'Open selected email' },
    { keys: ['1', '–', '9'], description: 'Quick select email' },
    { keys: ['ESC'], description: 'Go back / Clear / Hide' },
    { keys: ['A'], description: 'Archive email' },
    { keys: ['D'], description: 'Delete email' },
    { keys: ['U'], description: 'Toggle read status' },
    { keys: ['⌘', 'R'], description: 'Refresh inbox' },
    { keys: ['⌘', ','], description: 'Open settings' },
  ]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: 680 }}
        animate={{ x: 0 }}
        exit={{ x: 680 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="absolute inset-y-0 right-0 w-[500px] bg-[rgba(28,28,30,0.95)] backdrop-blur-xl border-l border-white/10 flex flex-col"
      >
        {/* Header */}
        <div className="h-[60px] px-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white text-[17px] font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-white/10">
          <Tab
            active={activeTab === 'account'}
            onClick={() => setActiveTab('account')}
          >
            Account
          </Tab>
          <Tab
            active={activeTab === 'credentials'}
            onClick={() => setActiveTab('credentials')}
          >
            OAuth Setup
          </Tab>
          <Tab
            active={activeTab === 'shortcuts'}
            onClick={() => setActiveTab('shortcuts')}
          >
            Shortcuts
          </Tab>
          <Tab
            active={activeTab === 'about'}
            onClick={() => setActiveTab('about')}
          >
            About
          </Tab>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Connected Account</h3>
                {userEmail ? (
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{userEmail}</div>
                      <div className="text-white/60 text-sm mt-1">Gmail Account</div>
                    </div>
                    <button
                      onClick={onDisconnect}
                      className="px-3 py-1.5 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <p className="text-white/60">No account connected</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Google OAuth 2.0 Credentials</h3>
                <p className="text-white/60 text-sm mb-4">
                  To use Ghosted, you need to create OAuth credentials in the Google Cloud Console.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Client ID</label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="your-client-id.apps.googleusercontent.com"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Client Secret</label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder="GOCSPX-..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
                    />
                  </div>

                  <button
                    onClick={handleSaveCredentials}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-apple-blue to-apple-purple text-white font-medium hover:shadow-lg hover:shadow-apple-blue/30 transition-all"
                  >
                    Save Credentials
                  </button>

                  {savedMessage && (
                    <div className="text-green-400 text-sm text-center">{savedMessage}</div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Setup Instructions:</h4>
                  <ol className="text-white/60 text-sm space-y-2 list-decimal list-inside">
                    <li>Go to Google Cloud Console</li>
                    <li>Create a new project or select existing</li>
                    <li>Enable Gmail API</li>
                    <li>Create OAuth 2.0 credentials</li>
                    <li>Add redirect URI: http://localhost:3000/oauth/callback</li>
                    <li>Copy Client ID and Secret here</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div>
              <h3 className="text-white font-semibold mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-white/80 text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-1 bg-white/10 rounded text-white/80 text-xs font-medium min-w-[24px] text-center"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">👻</div>
                <h3 className="text-white font-bold text-xl mb-1">Ghosted</h3>
                <p className="text-white/60 text-sm">Version {version}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">About</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Ghosted is a premium keyboard-first Gmail client for macOS. Built with Electron,
                  React, and TypeScript, designed to feel like a $200/year premium app.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">License</h4>
                <p className="text-white/60 text-sm">MIT License</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
        ${active
          ? 'text-white bg-white/5'
          : 'text-white/60 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {children}
    </button>
  )
}
