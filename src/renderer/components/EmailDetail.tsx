import React from 'react'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'
import { Email } from '../types'
import { formatEmailDate, extractSenderName } from '../utils/email-parser'

interface EmailDetailProps {
  email: Email
  onBack: () => void
  onArchive: () => void
  onDelete: () => void
  onToggleRead: () => void
}

export default function EmailDetail({
  email,
  onBack,
  onArchive,
  onDelete,
  onToggleRead,
}: EmailDetailProps) {
  const senderName = extractSenderName(email.from)

  // Sanitize email HTML using DOMPurify with strict configuration
  const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
      // Allow only safe HTML tags and attributes
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'a', 'img', 'ul', 'ol', 'li',
        'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span',
        'table', 'thead', 'tbody', 'tr', 'td', 'th', 'code', 'pre', 'hr'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'width', 'height', 'class', 'id', 'style'
      ],
      // Protect against protocol-based attacks
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      // Keep relative URLs
      KEEP_CONTENT: true,
      // Return a string instead of DOM node
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      // Sanitize style attributes
      SANITIZE_DOM: true,
      // Remove data URIs (potential XSS vector)
      ALLOW_DATA_ATTR: false,
    })
  }

  const emailBody = email.body ? sanitizeHtml(email.body) : email.snippet

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-raycast-border flex items-center gap-3">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="w-7 h-7 rounded-item hover:bg-raycast-hover flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-150"
          title="Back (ESC)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-text-primary text-title truncate">
            {email.subject}
          </h2>
        </div>

        {/* Actions */}
        <ActionButton
          onClick={onToggleRead}
          title={email.isUnread ? 'Mark as read (U)' : 'Mark as unread (U)'}
          icon={
            email.isUnread ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4.5L8 8.5L14 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="2"
                  y="3.5"
                  width="12"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 6L8 9L14 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 4.5H14V11.5C14 12.0523 13.5523 12.5 13 12.5H3C2.44772 12.5 2 12.0523 2 11.5V4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            )
          }
        />

        <ActionButton
          onClick={onArchive}
          title="Archive (A)"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="2.5"
                y="3.5"
                width="11"
                height="9"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M2.5 5.5H13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M6 8.5H10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          }
        />

        <ActionButton
          onClick={onDelete}
          title="Delete (D)"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 5H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M6.5 2.5H9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11.5 5V12.5C11.5 13.0523 11.0523 13.5 10.5 13.5H5.5C4.94772 13.5 4.5 13.0523 4.5 12.5V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Sender info */}
        <div className="mb-5">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-link to-apple-purple flex items-center justify-center text-text-primary font-medium text-body">
              {senderName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-text-primary font-medium text-body">{senderName}</span>
                {email.isUnread && (
                  <div className="w-1.5 h-1.5 rounded-full bg-link" />
                )}
              </div>
              <div className="text-text-secondary text-caption mt-0.5">{email.from}</div>
              <div className="text-text-tertiary text-caption mt-1">
                {formatEmailDate(email.date)} • {email.date.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Email body */}
        <div className="email-body">
          {email.body ? (
            <div dangerouslySetInnerHTML={{ __html: emailBody }} />
          ) : (
            <div className="text-text-secondary whitespace-pre-wrap">
              {email.snippet}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ActionButton({
  onClick,
  title,
  icon,
}: {
  onClick: () => void
  title: string
  icon: React.ReactNode
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-7 h-7 rounded-item hover:bg-raycast-hover flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-150"
      title={title}
    >
      {icon}
    </motion.button>
  )
}
