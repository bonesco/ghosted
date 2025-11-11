export interface Email {
  id: string
  threadId: string
  snippet: string
  labelIds: string[]
  from: string
  subject: string
  date: Date
  isUnread: boolean
  body?: string
}

export interface EmailMessage {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  payload: {
    headers: Array<{ name: string; value: string }>
    body?: { data?: string }
    parts?: Array<{
      mimeType: string
      body?: { data?: string }
      parts?: any[]
    }>
  }
  internalDate: string
}

export type View = 'list' | 'detail' | 'settings'

export interface AppState {
  view: View
  emails: Email[]
  selectedIndex: number
  selectedEmail: Email | null
  searchQuery: string
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  userEmail: string | null
}
