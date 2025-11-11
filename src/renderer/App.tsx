import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from './components/SearchBar'
import EmailList from './components/EmailList'
import EmailDetail from './components/EmailDetail'
import Settings from './components/Settings'
import FirstRun from './components/FirstRun'
import ErrorMessage from './components/ErrorMessage'
import { Email, View, AppState } from './types'
import { parseEmailMessage, formatEmailDate } from './utils/email-parser'

export default function App() {
  const [state, setState] = useState<AppState>({
    view: 'list',
    emails: [],
    selectedIndex: 0,
    selectedEmail: null,
    searchQuery: '',
    isLoading: true,
    error: null,
    isAuthenticated: false,
    userEmail: null,
  })

  const searchInputRef = useRef<HTMLInputElement>(null)
  const [showSettings, setShowSettings] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()

    // Listen for window shown event to focus search
    const cleanup = window.electron.onWindowShown(() => {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    })

    return cleanup
  }, [])

  // Load emails when authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      loadEmails()
    }
  }, [state.isAuthenticated])

  const checkAuth = async () => {
    console.log('🔐 Checking authentication...')
    const result = await window.electron.gmail.getAccount()

    setState(prev => ({
      ...prev,
      isAuthenticated: result.connected,
      userEmail: result.email || null,
      isLoading: !result.connected,
    }))
  }

  const loadEmails = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const result = await window.electron.gmail.listMessages(50)

    if (!result.success) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: result.error || 'Failed to load emails',
      }))
      return
    }

    // Fetch full details for each message
    const emailsWithDetails: Email[] = []

    for (const msg of result.messages.slice(0, 20)) {
      const detailResult = await window.electron.gmail.getMessage(msg.id)

      if (detailResult.success && detailResult.message) {
        emailsWithDetails.push(parseEmailMessage(detailResult.message))
      }
    }

    setState(prev => ({
      ...prev,
      emails: emailsWithDetails,
      isLoading: false,
      selectedIndex: 0,
    }))
  }

  const handleAuth = async () => {
    const result = await window.electron.gmail.startAuth()

    if (!result.success) {
      setState(prev => ({
        ...prev,
        error: result.error || 'Authentication failed',
      }))
    }
  }

  const handleDisconnect = async () => {
    await window.electron.gmail.disconnect()
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      userEmail: null,
      emails: [],
      selectedIndex: 0,
      selectedEmail: null,
    }))
    setShowSettings(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Settings shortcut (⌘,)
      if (e.key === ',' && e.metaKey) {
        e.preventDefault()
        setShowSettings(prev => !prev)
        return
      }

      // ESC key - priority order
      if (e.key === 'Escape') {
        e.preventDefault()

        if (showSettings) {
          setShowSettings(false)
        } else if (state.view === 'detail') {
          setState(prev => ({ ...prev, view: 'list', selectedEmail: null }))
        } else if (state.searchQuery) {
          setState(prev => ({ ...prev, searchQuery: '' }))
        } else {
          window.electron.hideWindow()
        }
        return
      }

      // Don't handle other shortcuts if in settings
      if (showSettings) return

      // Focus search on /
      if (e.key === '/' && state.view === 'list') {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      // Don't handle navigation if typing in search
      if (document.activeElement === searchInputRef.current && e.key !== 'Enter') {
        return
      }

      // Navigation shortcuts (only in list view)
      if (state.view === 'list') {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault()
            setState(prev => ({
              ...prev,
              selectedIndex: Math.max(0, prev.selectedIndex - 1),
            }))
            break

          case 'ArrowDown':
            e.preventDefault()
            setState(prev => ({
              ...prev,
              selectedIndex: Math.min(filteredEmails.length - 1, prev.selectedIndex + 1),
            }))
            break

          case 'Enter':
            e.preventDefault()
            if (filteredEmails[state.selectedIndex]) {
              openEmail(filteredEmails[state.selectedIndex])
            }
            break

          // Number keys (1-9) for quick selection
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            e.preventDefault()
            const index = parseInt(e.key) - 1
            if (filteredEmails[index]) {
              openEmail(filteredEmails[index])
            }
            break

          // Refresh (⌘R)
          case 'r':
            if (e.metaKey) {
              e.preventDefault()
              loadEmails()
            }
            break
        }
      }

      // Email actions (work in detail view)
      if (state.view === 'detail' && state.selectedEmail) {
        switch (e.key) {
          case 'a':
            e.preventDefault()
            archiveEmail(state.selectedEmail.id)
            break

          case 'd':
            e.preventDefault()
            deleteEmail(state.selectedEmail.id)
            break

          case 'u':
            e.preventDefault()
            toggleReadStatus(state.selectedEmail.id, state.selectedEmail.isUnread)
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state, showSettings])

  const openEmail = useCallback((email: Email) => {
    setState(prev => ({
      ...prev,
      view: 'detail',
      selectedEmail: email,
    }))

    // Mark as read if unread
    if (email.isUnread) {
      window.electron.gmail.modifyMessage(email.id, [], ['UNREAD'])
      setState(prev => ({
        ...prev,
        emails: prev.emails.map(e =>
          e.id === email.id ? { ...e, isUnread: false } : e
        ),
      }))
    }
  }, [])

  const archiveEmail = async (emailId: string) => {
    const result = await window.electron.gmail.modifyMessage(emailId, [], ['INBOX'])

    if (result.success) {
      setState(prev => ({
        ...prev,
        emails: prev.emails.filter(e => e.id !== emailId),
        view: 'list',
        selectedEmail: null,
      }))
    }
  }

  const deleteEmail = async (emailId: string) => {
    const result = await window.electron.gmail.deleteMessage(emailId)

    if (result.success) {
      setState(prev => ({
        ...prev,
        emails: prev.emails.filter(e => e.id !== emailId),
        view: 'list',
        selectedEmail: null,
      }))
    }
  }

  const toggleReadStatus = async (emailId: string, isUnread: boolean) => {
    const result = await window.electron.gmail.modifyMessage(
      emailId,
      isUnread ? [] : ['UNREAD'],
      isUnread ? ['UNREAD'] : []
    )

    if (result.success) {
      setState(prev => ({
        ...prev,
        emails: prev.emails.map(e =>
          e.id === emailId ? { ...e, isUnread: !isUnread } : e
        ),
        selectedEmail: prev.selectedEmail?.id === emailId
          ? { ...prev.selectedEmail, isUnread: !isUnread }
          : prev.selectedEmail,
      }))
    }
  }

  // Filter emails based on search query
  const filteredEmails = state.emails.filter(email => {
    if (!state.searchQuery) return true

    const query = state.searchQuery.toLowerCase()
    return (
      email.subject.toLowerCase().includes(query) ||
      email.from.toLowerCase().includes(query) ||
      email.snippet.toLowerCase().includes(query)
    )
  })

  // First run - not authenticated
  if (!state.isAuthenticated) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-transparent">
        <div className="w-[680px] h-[500px] rounded-raycast bg-raycast-bg backdrop-blur-raycast shadow-[0_24px_48px_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(255,255,255,0.1)] overflow-hidden relative">
          <FirstRun onConnect={handleAuth} onSettingsClick={() => setShowSettings(true)} onAuthComplete={checkAuth} error={state.error} />

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <Settings
                onClose={() => setShowSettings(false)}
                userEmail={state.userEmail}
                onDisconnect={handleDisconnect}
                onAuthComplete={checkAuth}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <div className="w-[680px] h-[500px] rounded-raycast bg-raycast-bg backdrop-blur-raycast shadow-[0_24px_48px_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col relative">
        {/* Search Bar */}
        {state.view === 'list' && (
          <SearchBar
            ref={searchInputRef}
            value={state.searchQuery}
            onChange={(value) => setState(prev => ({ ...prev, searchQuery: value, selectedIndex: 0 }))}
            onClear={() => setState(prev => ({ ...prev, searchQuery: '', selectedIndex: 0 }))}
            onSettingsClick={() => setShowSettings(true)}
            isLoading={state.isLoading}
          />
        )}

        {/* Error Message */}
        {state.error && (
          <ErrorMessage
            message={state.error}
            onRetry={loadEmails}
            onDismiss={() => setState(prev => ({ ...prev, error: null }))}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {state.view === 'list' && (
              <EmailList
                key="list"
                emails={filteredEmails}
                selectedIndex={state.selectedIndex}
                onSelectEmail={openEmail}
                onSelectIndex={(index) => setState(prev => ({ ...prev, selectedIndex: index }))}
                isLoading={state.isLoading}
              />
            )}

            {state.view === 'detail' && state.selectedEmail && (
              <EmailDetail
                key="detail"
                email={state.selectedEmail}
                onBack={() => setState(prev => ({ ...prev, view: 'list', selectedEmail: null }))}
                onArchive={() => archiveEmail(state.selectedEmail!.id)}
                onDelete={() => deleteEmail(state.selectedEmail!.id)}
                onToggleRead={() => toggleReadStatus(state.selectedEmail!.id, state.selectedEmail!.isUnread)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <Settings
              onClose={() => setShowSettings(false)}
              userEmail={state.userEmail}
              onDisconnect={handleDisconnect}
              onAuthComplete={checkAuth}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
