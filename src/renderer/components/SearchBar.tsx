import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  onSettingsClick: () => void
  isLoading: boolean
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, onClear, onSettingsClick, isLoading }, ref) => {
    return (
      <div className="h-[60px] px-4 border-b border-raycast-border flex items-center gap-3">
        {/* Search Icon */}
        <div className="text-white/40">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12.5 12.5L16 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search emails... (press /)"
          className="flex-1 bg-transparent border-none text-white text-[15px] font-medium placeholder-white/40 focus:outline-none"
          autoFocus
        />

        {/* Clear button */}
        {value && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClear}
            className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M1 1L9 9M1 9L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="w-4 h-4">
            <svg
              className="animate-spin text-white/40"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="30 10"
              />
            </svg>
          </div>
        )}

        {/* Settings button */}
        <button
          onClick={onSettingsClick}
          className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors"
          title="Settings (⌘,)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M13 8C13 8.7 13.2 9 13.7 9.3L14.5 9.7C14.8 9.9 15 10.2 15 10.6C15 11 14.8 11.3 14.5 11.5L13.7 11.9C13.2 12.1 13 12.5 13 13.2V14C13 14.6 12.6 15 12 15H11.2C10.5 15 10.1 14.8 9.9 14.3L9.5 13.5C9.3 13.2 9 13 8.6 13C8.2 13 7.9 13.2 7.7 13.5L7.3 14.3C7.1 14.8 6.7 15 6 15H5.2C4.6 15 4.2 14.6 4.2 14V13.2C4.2 12.5 4 12.1 3.5 11.9L2.7 11.5C2.4 11.3 2.2 11 2.2 10.6C2.2 10.2 2.4 9.9 2.7 9.7L3.5 9.3C4 9.1 4.2 8.7 4.2 8V7.2C4.2 6.6 4.6 6.2 5.2 6.2H6C6.7 6.2 7.1 6 7.3 5.5L7.7 4.7C7.9 4.4 8.2 4.2 8.6 4.2C9 4.2 9.3 4.4 9.5 4.7L9.9 5.5C10.1 6 10.5 6.2 11.2 6.2H12C12.6 6.2 13 6.6 13 7.2V8Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    )
  }
)

SearchBar.displayName = 'SearchBar'

export default SearchBar
