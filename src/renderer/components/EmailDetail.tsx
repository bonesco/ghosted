import React from 'react'
import { motion } from 'framer-motion'
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

  // Strip HTML tags for simple display (in production, use a proper HTML sanitizer)
  const cleanBody = email.body?.replace(/<[^>]*>/g, '') || email.snippet

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-raycast-border flex items-center gap-3">
        {/* Back button */}
        <button
          onClick={onBack}
          className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          title="Back (ESC)"
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
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-[15px] font-semibold truncate">
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
      <div className="flex-1 overflow-y-auto p-6">
        {/* Sender info */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-blue to-apple-purple flex items-center justify-center text-white font-semibold text-sm">
              {senderName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">{senderName}</span>
                {email.isUnread && (
                  <div className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                )}
              </div>
              <div className="text-white/60 text-xs mt-0.5">{email.from}</div>
              <div className="text-white/40 text-xs mt-1">
                {formatEmailDate(email.date)} • {email.date.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Email body */}
        <div className="prose prose-invert max-w-none">
          <div className="text-white/80 text-[14px] leading-relaxed whitespace-pre-wrap">
            {cleanBody}
          </div>
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
      className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
      title={title}
    >
      {icon}
    </motion.button>
  )
}
