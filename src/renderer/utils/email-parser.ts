import { Email, EmailMessage } from '../types'

export function parseEmailMessage(message: EmailMessage): Email {
  const headers = message.payload.headers
  const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')
  const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')

  return {
    id: message.id,
    threadId: message.threadId,
    snippet: message.snippet,
    labelIds: message.labelIds || [],
    from: fromHeader?.value || 'Unknown',
    subject: subjectHeader?.value || '(No Subject)',
    date: new Date(parseInt(message.internalDate)),
    isUnread: message.labelIds?.includes('UNREAD') || false,
    body: extractBody(message),
  }
}

function extractBody(message: EmailMessage): string {
  const payload = message.payload

  // Try to get HTML body
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return decodeBase64(part.body.data)
      }
    }
  }

  // Try to get plain text body
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBase64(part.body.data)
      }
    }
  }

  // Try direct body
  if (payload.body?.data) {
    return decodeBase64(payload.body.data)
  }

  return message.snippet
}

function decodeBase64(data: string): string {
  try {
    // Gmail uses URL-safe base64
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
    return atob(base64)
  } catch (error) {
    console.error('Failed to decode base64:', error)
    return data
  }
}

export function formatEmailDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) {
    return 'Just now'
  } else if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

export function extractSenderName(from: string): string {
  // Extract name from "Name <email@example.com>" format
  const match = from.match(/^(.*?)\s*</)
  if (match && match[1]) {
    return match[1].replace(/"/g, '').trim()
  }
  return from.split('@')[0]
}
