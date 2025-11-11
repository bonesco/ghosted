# 👻 Ghosted

A premium keyboard-first Gmail client for macOS with a beautiful Raycast-like UI. Built with Electron, React, TypeScript, and Tailwind CSS.

![Ghosted Screenshot](https://via.placeholder.com/1200x700/1c1c1e/ffffff?text=Ghosted+Email+Client)

## ✨ Features

- **🎨 Raycast-Inspired UI** - Beautiful frosted glass design with smooth animations
- **⌨️ Keyboard-First** - Navigate your inbox without touching the mouse
- **🔐 Secure** - OAuth 2.0 authentication with macOS Keychain integration
- **⚡️ Fast** - Instant search and lightning-fast email navigation
- **🎯 Focused** - Minimal distractions, maximum productivity
- **🌙 Dark Mode** - Native dark mode that's easy on the eyes

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘⇧E` | Show/hide Ghosted (global hotkey) |
| `/` | Focus search bar |
| `↑` / `↓` | Navigate emails |
| `Enter` | Open selected email |
| `1` - `9` | Quick select email by number |
| `ESC` | Go back / Clear search / Hide window |
| `A` | Archive email |
| `D` | Delete email |
| `U` | Toggle read/unread status |
| `⌘R` | Refresh inbox |
| `⌘,` | Open settings |

## 🚀 Getting Started

### Prerequisites

- **macOS 13.0+** (Ventura or later)
- **Node.js 18+** and npm
- **Google Cloud Project** with Gmail API enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ghosted.git
   cd ghosted
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google OAuth 2.0 Credentials**

   You need to create OAuth credentials to access Gmail API:

   a. Go to [Google Cloud Console](https://console.cloud.google.com/)

   b. Create a new project or select an existing one

   c. Enable the Gmail API:
      - Go to **APIs & Services** → **Library**
      - Search for "Gmail API"
      - Click **Enable**

   d. Create OAuth 2.0 credentials:
      - Go to **APIs & Services** → **Credentials**
      - Click **Create Credentials** → **OAuth client ID**
      - Choose **Desktop app** as application type
      - Name it "Ghosted" (or anything you like)
      - Click **Create**

   e. Configure OAuth consent screen:
      - Go to **OAuth consent screen**
      - Add your email as a test user
      - Add the following scopes:
        - `https://www.googleapis.com/auth/gmail.readonly`
        - `https://www.googleapis.com/auth/gmail.modify`
        - `https://mail.google.com/`

   f. Copy your **Client ID** and **Client Secret**

4. **Configure OAuth credentials in Ghosted**

   After launching the app, go to **Settings** (⌘,) → **OAuth Setup** tab and paste your Client ID and Client Secret.

5. **Run in development mode**
   ```bash
   npm run dev
   ```

6. **Connect your Gmail account**

   Click "Connect Gmail Account" and follow the OAuth flow in your browser.

## 🏗️ Building

### Development Build

```bash
npm run dev
```

This starts Vite dev server with hot reload. The app will automatically reload when you make changes.

### Production Build

```bash
npm run build
```

This creates a production build and generates a `.dmg` installer in the `release` folder.

### Build Configuration

The app uses `electron-builder` for packaging. Configuration is in `package.json` under the `build` key.

## 📁 Project Structure

```
ghosted/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # App entry point, global hotkey
│   │   ├── window.ts      # Window management
│   │   └── gmail-auth.ts  # Gmail OAuth & API
│   ├── renderer/          # React UI (renderer process)
│   │   ├── App.tsx        # Main app component
│   │   ├── components/    # React components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── EmailList.tsx
│   │   │   ├── EmailDetail.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── FirstRun.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── styles/        # CSS styles
│   │   ├── utils/         # Utilities
│   │   └── types.ts       # TypeScript types
│   └── preload/           # Preload scripts
│       └── index.ts       # IPC bridge
├── index.html             # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 Development

### Tech Stack

- **Electron** - Desktop app framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Gmail API** - Email operations
- **Keytar** - Secure credential storage (macOS Keychain)

### Key Features Implementation

#### Window Management

The app creates a frameless, transparent window with vibrancy effects (frosted glass):

```typescript
{
  width: 680,
  height: 500,
  frame: false,
  transparent: true,
  vibrancy: 'under-window',
  visualEffectState: 'active'
}
```

#### Global Hotkey

Registered in `src/main/index.ts`:

```typescript
globalShortcut.register('CommandOrControl+Shift+E', () => {
  toggleWindow()
})
```

#### OAuth Flow

1. User clicks "Connect Gmail"
2. System browser opens with Google OAuth consent
3. User grants permissions
4. Browser redirects to `http://localhost:3000/oauth/callback?code=...`
5. User manually copies the code and pastes it back (or use deep linking)
6. App exchanges code for tokens
7. Tokens stored securely in macOS Keychain via `keytar`

#### Email Operations

All Gmail operations are in `src/main/gmail-auth.ts`:

- **List emails**: `gmail.users.messages.list()`
- **Get email**: `gmail.users.messages.get()`
- **Mark as read**: `gmail.users.messages.modify()` with `removeLabelIds: ['UNREAD']`
- **Archive**: Remove 'INBOX' label
- **Delete**: `gmail.users.messages.trash()`

## 🎨 UI Design

The UI is designed to match Raycast's aesthetic:

- **Colors**: Dark translucent background (`rgba(28, 28, 30, 0.88)`)
- **Blur**: 40px backdrop blur with 180% saturation
- **Shadows**: Deep shadows (`0 24px 48px rgba(0,0,0,0.6)`)
- **Border**: Subtle white border (`0.5px rgba(255, 255, 255, 0.1)`)
- **Corners**: 14px border radius
- **Fonts**: SF Pro (system font)
- **Accent**: Apple Blue (#007AFF)

### Animation Philosophy

All animations run at 60fps using Framer Motion:

- **Selection**: Spring animation (stiffness: 400, damping: 30)
- **Transitions**: 150-200ms with ease-out
- **Hover**: Scale 1.02 with shadow
- **Settings**: Slide-in from right (spring animation)

## 🔒 Security

- **No hardcoded credentials**: Users provide their own OAuth credentials
- **Secure storage**: Tokens stored in macOS Keychain via `keytar`
- **Context isolation**: Renderer process cannot access Node.js APIs directly
- **Preload script**: Exposes only necessary IPC methods
- **OAuth 2.0**: Industry-standard authentication
- **Token refresh**: Automatic token refresh before expiry

## 🐛 Debugging

### Enable DevTools

Uncomment this line in `src/main/window.ts`:

```typescript
win.webContents.openDevTools({ mode: 'detach' })
```

### Console Logging

The app uses emoji prefixes for logs:

- 🔄 Operations starting
- ✅ Success
- ❌ Errors
- 📧 Email actions
- 📡 API calls

### Common Issues

1. **"OAuth credentials not configured"**
   - Go to Settings → OAuth Setup and enter your Client ID and Secret

2. **"Connection Lost"**
   - Check your internet connection
   - Token might be expired - try disconnecting and reconnecting

3. **Global hotkey not working**
   - Another app might be using ⌘⇧E
   - Check Console for "Global shortcut registration failed"

4. **App won't build**
   - Make sure you have Xcode Command Line Tools: `xcode-select --install`
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📝 TODO

- [ ] Add email composition
- [ ] Multiple account support
- [ ] Email threading
- [ ] Snooze functionality
- [ ] Labels and filters
- [ ] Search filters (from, to, date range)
- [ ] Attachments support
- [ ] Code signing for distribution
- [ ] Auto-update mechanism
- [ ] Email notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Raycast** - UI/UX inspiration
- **Gmail API** - Email operations
- **Electron** - Cross-platform desktop framework
- **React** - UI library
- **Framer Motion** - Animations

## 💬 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Made with ❤️ and ☕️

**Note**: This is a personal project and is not affiliated with Google, Gmail, or Raycast.
