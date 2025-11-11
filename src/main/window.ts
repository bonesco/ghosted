import { BrowserWindow } from 'electron'
import path from 'path'

export function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 680,
    height: 500,
    minWidth: 680,
    minHeight: 500,
    maxWidth: 680,
    maxHeight: 500,
    center: true,
    frame: false,              // Frameless like Raycast
    transparent: true,         // For blur effect
    vibrancy: 'under-window',  // macOS blur effect
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    backgroundColor: '#00000000',
    hasShadow: true,
    roundedCorners: true,
    resizable: false,          // Fixed size like Raycast
    skipTaskbar: false,        // Show in dock
    alwaysOnTop: false,
    show: false,               // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,  // Required for keytar
    },
  })

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    // Open DevTools in development
    // win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  // Show when ready to prevent visual flash
  win.once('ready-to-show', () => {
    console.log('✅ Window ready')
  })

  // Handle window blur (when focus is lost)
  win.on('blur', () => {
    // Optionally hide on blur (Raycast-like behavior)
    // Uncomment if you want this behavior:
    // win.webContents.send('window-blur')
  })

  return win
}
