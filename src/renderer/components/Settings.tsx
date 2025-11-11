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
        className="absolute inset-y-0 right-0 w-[500px] glassmorphic border-l border-raycast-border flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-raycast-border flex items-center justify-between">
          <h2 className="text-text-primary text-title">Settings</h2>
          <motion.button
            onClick={onClose}
            className="w-7 h-7 rounded-item hover:bg-raycast-hover flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-150"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4 border-b border-raycast-border">
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
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-text-primary font-medium text-body mb-3">Connected Account</h3>
                {userEmail ? (
                  <div className="bg-raycast-hover-subtle rounded-button p-4 flex items-center justify-between">
                    <div>
                      <div className="text-text-primary font-medium text-body">{userEmail}</div>
                      <div className="text-text-secondary text-caption mt-1">Gmail Account</div>
                    </div>
                    <motion.button
                      onClick={onDisconnect}
                      className="px-3 py-1.5 rounded-button bg-priority-high/20 text-priority-high hover:bg-priority-high/30 transition-all duration-150 text-body font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Disconnect
                    </motion.button>
                  </div>
                ) : (
                  <p className="text-text-secondary text-body">No account connected</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-text-primary font-medium text-body mb-2">Google OAuth 2.0 Credentials</h3>
                <p className="text-text-secondary text-body mb-4">
                  To use Ghosted, you need to create OAuth credentials in the Google Cloud Console.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-text-secondary text-body mb-2">Client ID</label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="your-client-id.apps.googleusercontent.com"
                      className="w-full px-3 py-2.5 bg-raycast-hover-subtle border border-raycast-border-subtle rounded-button text-text-primary text-body placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-link/50 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary text-body mb-2">Client Secret</label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder="GOCSPX-..."
                      className="w-full px-3 py-2.5 bg-raycast-hover-subtle border border-raycast-border-subtle rounded-button text-text-primary text-body placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-link/50 transition-all duration-150"
                    />
                  </div>

                  <motion.button
                    onClick={handleSaveCredentials}
                    className="w-full px-4 py-2.5 rounded-button bg-gradient-to-r from-link to-apple-purple text-text-primary font-medium hover:shadow-lg hover:shadow-link/30 transition-all duration-150"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Credentials
                  </motion.button>

                  {savedMessage && (
                    <div className="text-success text-body text-center">{savedMessage}</div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-raycast-hover-subtle rounded-button">
                  <h4 className="text-text-primary font-medium text-body mb-2">Setup Instructions:</h4>
                  <ol className="text-text-secondary text-body space-y-2 list-decimal list-inside">
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
              <h3 className="text-text-primary font-medium text-body mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2.5 border-b border-raycast-border-subtle last:border-0"
                  >
                    <span className="text-text-secondary text-body">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="shortcut-pill"
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
                <h3 className="text-text-primary font-semibold text-title-large mb-1">Ghosted</h3>
                <p className="text-text-secondary text-body">Version {version}</p>
              </div>

              <div className="bg-raycast-hover-subtle rounded-button p-4">
                <h4 className="text-text-primary font-medium text-body mb-2">About</h4>
                <p className="text-text-secondary text-body leading-relaxed">
                  Ghosted is a premium keyboard-first Gmail client for macOS. Built with Electron,
                  React, and TypeScript, designed to feel like a $200/year premium app.
                </p>
              </div>

              <div className="bg-raycast-hover-subtle rounded-button p-4">
                <h4 className="text-text-primary font-medium text-body mb-2">License</h4>
                <p className="text-text-secondary text-body">MIT License</p>
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
        px-4 py-2 text-body font-medium rounded-t-button transition-all duration-150
        ${active
          ? 'text-text-primary bg-raycast-hover-subtle'
          : 'text-text-secondary hover:text-text-primary hover:bg-raycast-hover-subtle'
        }
      `}
    >
      {children}
    </button>
  )
}
