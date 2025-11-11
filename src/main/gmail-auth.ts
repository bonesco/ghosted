import { BrowserWindow, ipcMain, shell } from 'electron'
import { google } from 'googleapis'
import * as keytar from 'keytar'
import Store from 'electron-store'
import { OAuth2Client } from 'google-auth-library'

const store = new Store()

// OAuth 2.0 configuration
// Users will need to create their own OAuth credentials at:
// https://console.cloud.google.com/apis/credentials
const KEYTAR_SERVICE = 'com.ghosted.gmail'
const REDIRECT_URI = 'http://localhost:3000/oauth/callback'

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expiry_date?: number
  token_type: string
  scope: string
}

let oauth2Client: OAuth2Client | null = null

export function setupGmailAuth(mainWindow: BrowserWindow) {
  console.log('📧 Setting up Gmail authentication...')

  // Handle OAuth start
  ipcMain.handle('gmail-auth-start', async () => {
    try {
      const clientId = store.get('gmail_client_id') as string
      const clientSecret = store.get('gmail_client_secret') as string

      if (!clientId || !clientSecret) {
        throw new Error('OAuth credentials not configured. Please set them in Settings.')
      }

      oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        REDIRECT_URI
      )

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://mail.google.com/',
        ],
        prompt: 'consent',
      })

      console.log('🔐 Opening OAuth URL in browser...')
      await shell.openExternal(authUrl)

      return { success: true }
    } catch (error) {
      console.error('❌ OAuth start error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Handle OAuth callback (will be called from renderer after redirect)
  ipcMain.handle('gmail-auth-callback', async (_event, code: string) => {
    try {
      if (!oauth2Client) {
        throw new Error('OAuth client not initialized')
      }

      console.log('🔄 Exchanging code for tokens...')
      const { tokens } = await oauth2Client.getToken(code)
      oauth2Client.setCredentials(tokens)

      // Get user email
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
      const profile = await gmail.users.getProfile({ userId: 'me' })
      const email = profile.data.emailAddress

      if (!email) {
        throw new Error('Could not get user email')
      }

      // Store tokens securely in macOS Keychain
      await keytar.setPassword(
        KEYTAR_SERVICE,
        email,
        JSON.stringify(tokens)
      )

      // Store email in preferences
      store.set('gmail_email', email)

      console.log('✅ Gmail authenticated:', email)

      return { success: true, email }
    } catch (error) {
      console.error('❌ OAuth callback error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Get stored credentials
  ipcMain.handle('gmail-get-account', async () => {
    try {
      const email = store.get('gmail_email') as string

      if (!email) {
        return { connected: false }
      }

      const tokensStr = await keytar.getPassword(KEYTAR_SERVICE, email)

      if (!tokensStr) {
        return { connected: false }
      }

      return { connected: true, email }
    } catch (error) {
      console.error('❌ Get account error:', error)
      return { connected: false }
    }
  })

  // Disconnect Gmail
  ipcMain.handle('gmail-disconnect', async () => {
    try {
      const email = store.get('gmail_email') as string

      if (email) {
        await keytar.deletePassword(KEYTAR_SERVICE, email)
      }

      store.delete('gmail_email')
      oauth2Client = null

      console.log('🔌 Gmail disconnected')

      return { success: true }
    } catch (error) {
      console.error('❌ Disconnect error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // List emails
  ipcMain.handle('gmail-list-messages', async (_event, maxResults = 50) => {
    try {
      const email = store.get('gmail_email') as string

      if (!email) {
        throw new Error('Not authenticated')
      }

      const tokensStr = await keytar.getPassword(KEYTAR_SERVICE, email)

      if (!tokensStr) {
        throw new Error('No tokens found')
      }

      const tokens = JSON.parse(tokensStr) as TokenResponse

      const clientId = store.get('gmail_client_id') as string
      const clientSecret = store.get('gmail_client_secret') as string

      if (!clientId || !clientSecret) {
        throw new Error('OAuth credentials not configured')
      }

      const auth = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)
      auth.setCredentials(tokens)

      // Check if token needs refresh
      if (tokens.expiry_date && tokens.expiry_date < Date.now() + 5 * 60 * 1000) {
        console.log('🔄 Refreshing access token...')
        const { credentials } = await auth.refreshAccessToken()
        await keytar.setPassword(
          KEYTAR_SERVICE,
          email,
          JSON.stringify(credentials)
        )
        auth.setCredentials(credentials)
      }

      const gmail = google.gmail({ version: 'v1', auth })
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults,
        labelIds: ['INBOX'],
      })

      console.log(`📬 Fetched ${response.data.messages?.length || 0} messages`)

      return { success: true, messages: response.data.messages || [] }
    } catch (error) {
      console.error('❌ List messages error:', error)
      return { success: false, error: (error as Error).message, messages: [] }
    }
  })

  // Get email details
  ipcMain.handle('gmail-get-message', async (_event, messageId: string) => {
    try {
      const email = store.get('gmail_email') as string
      const tokensStr = await keytar.getPassword(KEYTAR_SERVICE, email)

      if (!tokensStr) {
        throw new Error('Not authenticated')
      }

      const tokens = JSON.parse(tokensStr) as TokenResponse
      const clientId = store.get('gmail_client_id') as string
      const clientSecret = store.get('gmail_client_secret') as string

      const auth = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)
      auth.setCredentials(tokens)

      const gmail = google.gmail({ version: 'v1', auth })
      const response = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      })

      return { success: true, message: response.data }
    } catch (error) {
      console.error('❌ Get message error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Modify message (mark read/unread, archive, etc.)
  ipcMain.handle('gmail-modify-message', async (_event, messageId: string, addLabels: string[] = [], removeLabels: string[] = []) => {
    try {
      const email = store.get('gmail_email') as string
      const tokensStr = await keytar.getPassword(KEYTAR_SERVICE, email)

      if (!tokensStr) {
        throw new Error('Not authenticated')
      }

      const tokens = JSON.parse(tokensStr) as TokenResponse
      const clientId = store.get('gmail_client_id') as string
      const clientSecret = store.get('gmail_client_secret') as string

      const auth = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)
      auth.setCredentials(tokens)

      const gmail = google.gmail({ version: 'v1', auth })
      await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: addLabels,
          removeLabelIds: removeLabels,
        },
      })

      console.log('✅ Message modified:', messageId)

      return { success: true }
    } catch (error) {
      console.error('❌ Modify message error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Delete message (move to trash)
  ipcMain.handle('gmail-delete-message', async (_event, messageId: string) => {
    try {
      const email = store.get('gmail_email') as string
      const tokensStr = await keytar.getPassword(KEYTAR_SERVICE, email)

      if (!tokensStr) {
        throw new Error('Not authenticated')
      }

      const tokens = JSON.parse(tokensStr) as TokenResponse
      const clientId = store.get('gmail_client_id') as string
      const clientSecret = store.get('gmail_client_secret') as string

      const auth = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)
      auth.setCredentials(tokens)

      const gmail = google.gmail({ version: 'v1', auth })
      await gmail.users.messages.trash({
        userId: 'me',
        id: messageId,
      })

      console.log('🗑️  Message deleted:', messageId)

      return { success: true }
    } catch (error) {
      console.error('❌ Delete message error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Save OAuth credentials
  ipcMain.handle('gmail-save-credentials', async (_event, clientId: string, clientSecret: string) => {
    try {
      store.set('gmail_client_id', clientId)
      store.set('gmail_client_secret', clientSecret)
      console.log('💾 OAuth credentials saved')
      return { success: true }
    } catch (error) {
      console.error('❌ Save credentials error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Get OAuth credentials
  ipcMain.handle('gmail-get-credentials', async () => {
    try {
      const clientId = store.get('gmail_client_id') as string
      const clientSecret = store.get('gmail_client_secret') as string

      return {
        success: true,
        clientId: clientId || '',
        clientSecret: clientSecret || ''
      }
    } catch (error) {
      console.error('❌ Get credentials error:', error)
      return { success: false, clientId: '', clientSecret: '' }
    }
  })
}
