import React from 'react'
import { motion } from 'framer-motion'
import { Email } from '../types'
import { formatEmailDate, extractSenderName, truncateText } from '../utils/email-parser'

interface EmailListProps {
  emails: Email[]
  selectedIndex: number
  onSelectEmail: (email: Email) => void
  onSelectIndex: (index: number) => void
  isLoading: boolean
}

export default function EmailList({
  emails,
  selectedIndex,
  onSelectEmail,
  onSelectIndex,
  isLoading,
}: EmailListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 mb-3 mx-auto">
            <svg
              className="animate-spin text-white/40"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="40 20"
              />
            </svg>
          </div>
          <p className="text-white/60 text-sm">Loading your inbox...</p>
        </div>
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-white/60 text-sm">No emails found</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="h-full overflow-y-auto"
    >
      {emails.slice(0, 9).map((email, index) => (
        <EmailListItem
          key={email.id}
          email={email}
          index={index}
          isSelected={index === selectedIndex}
          onClick={() => onSelectEmail(email)}
          onHover={() => onSelectIndex(index)}
        />
      ))}
    </motion.div>
  )
}

interface EmailListItemProps {
  email: Email
  index: number
  isSelected: boolean
  onClick: () => void
  onHover: () => void
}

function EmailListItem({ email, index, isSelected, onClick, onHover }: EmailListItemProps) {
  const senderName = extractSenderName(email.from)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      onClick={onClick}
      onMouseEnter={onHover}
      className={`
        h-[48px] px-4 flex items-center gap-3 cursor-pointer transition-all duration-150
        ${isSelected
          ? 'bg-gradient-to-r from-apple-blue/15 to-apple-purple/15 border-l-2 border-apple-blue'
          : 'hover:bg-white/5 border-l-2 border-transparent'
        }
      `}
    >
      {/* Number badge */}
      <div
        className={`
          w-5 h-5 rounded flex items-center justify-center text-[11px] font-semibold
          ${isSelected
            ? 'bg-apple-blue text-white'
            : 'bg-white/10 text-white/60'
          }
        `}
      >
        {index + 1}
      </div>

      {/* Unread indicator */}
      {email.isUnread && (
        <div className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {/* Sender */}
        <div
          className={`
            w-32 truncate text-[13px]
            ${email.isUnread ? 'font-semibold text-white' : 'font-medium text-white/80'}
          `}
        >
          {senderName}
        </div>

        {/* Subject */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span
            className={`
              truncate text-[13px]
              ${email.isUnread ? 'font-medium text-white/90' : 'text-white/60'}
            `}
          >
            {email.subject}
          </span>
          <span className="text-white/40 text-[13px]">—</span>
          <span className="text-white/40 text-[13px] truncate">
            {truncateText(email.snippet, 50)}
          </span>
        </div>

        {/* Date */}
        <div className="text-white/40 text-[11px] font-medium ml-auto">
          {formatEmailDate(email.date)}
        </div>
      </div>
    </motion.div>
  )
}
