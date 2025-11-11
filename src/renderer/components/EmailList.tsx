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
              className="animate-spin text-text-secondary"
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
          <p className="text-text-secondary text-body">Loading your inbox...</p>
        </div>
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-text-secondary text-body">No emails found</p>
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
        py-2.5 px-4 flex items-center gap-3 cursor-pointer transition-all duration-150 rounded-item mx-2
        ${isSelected
          ? 'bg-raycast-selected shadow-selected'
          : 'hover:bg-raycast-hover'
        }
      `}
    >
      {/* Number badge */}
      <div
        className={`
          w-5 h-5 rounded-small flex items-center justify-center text-metadata font-medium flex-shrink-0
          ${isSelected
            ? 'bg-link text-text-primary'
            : 'bg-white/8 text-text-secondary'
          }
        `}
      >
        {index + 1}
      </div>

      {/* Unread indicator */}
      {email.isUnread && (
        <div className="w-1.5 h-1.5 rounded-full bg-link flex-shrink-0" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {/* Sender */}
        <div
          className={`
            w-32 truncate text-body
            ${email.isUnread ? 'font-medium text-text-primary' : 'font-normal text-text-secondary'}
          `}
        >
          {senderName}
        </div>

        {/* Subject */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span
            className={`
              truncate text-body
              ${email.isUnread ? 'font-normal text-text-primary' : 'text-text-secondary'}
            `}
          >
            {email.subject}
          </span>
          <span className="text-text-tertiary text-body">—</span>
          <span className="text-text-tertiary text-body truncate">
            {truncateText(email.snippet, 50)}
          </span>
        </div>

        {/* Date */}
        <div className="text-text-tertiary text-metadata font-normal ml-auto flex-shrink-0">
          {formatEmailDate(email.date)}
        </div>
      </div>
    </motion.div>
  )
}
