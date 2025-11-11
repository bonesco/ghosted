import { app, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron'
import path from 'path'
import { createWindow } from './window'
import { setupGmailAuth } from './gmail-auth'

// Disable hardware acceleration for better performance on some Macs
app.disableHardwareAcceleration()

let mainWindow: BrowserWindow | null = null

// Handle creating/removing shortcuts on macOS when installing/uninstalling
if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'Ghosted',
    applicationVersion: '1.0.0',
    copyright: 'MIT License',
  })
}

app.whenReady().then(() => {
  console.log('🚀 Ghosted is launching...')

  // Create the main window
  mainWindow = createWindow()

  // Set up Gmail authentication handlers
  setupGmailAuth(mainWindow)

  // Register global hotkey: ⌘⇧E (Cmd+Shift+E)
  const ret = globalShortcut.register('CommandOrControl+Shift+E', () => {
    console.log('⌨️  Global hotkey triggered: ⌘⇧E')
    toggleWindow()
  })

  if (!ret) {
    console.log('❌ Global shortcut registration failed')
  } else {
    console.log('✅ Global hotkey registered: ⌘⇧E')
  }

  // Hide on startup (user will invoke with hotkey)
  if (mainWindow) {
    mainWindow.hide()
  }

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })
})

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Cleanup shortcuts before quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// Toggle window visibility with fade animation
function toggleWindow() {
  if (!mainWindow) {
    mainWindow = createWindow()
    return
  }

  if (mainWindow.isVisible()) {
    // Hide with fade out
    console.log('🫥 Hiding window...')
    mainWindow.webContents.send('window-will-hide')

    // Small delay for fade animation
    setTimeout(() => {
      mainWindow?.hide()
    }, 100)
  } else {
    // Show and center on the screen with active cursor
    console.log('👀 Showing window...')

    // Get the display where the cursor is currently located
    const cursorPoint = screen.getCursorScreenPoint()
    const activeDisplay = screen.getDisplayNearestPoint(cursorPoint)

    // Center window on the active display
    const { width, height } = activeDisplay.workAreaSize
    const { x, y } = activeDisplay.workArea

    const windowWidth = 680
    const windowHeight = 500

    const centerX = x + Math.floor((width - windowWidth) / 2)
    const centerY = y + Math.floor((height - windowHeight) / 2)

    mainWindow.setPosition(centerX, centerY)
    mainWindow.show()
    mainWindow.focus()

    // Tell renderer to focus search bar
    mainWindow.webContents.send('window-shown')
  }
}

// IPC handlers
ipcMain.handle('hide-window', () => {
  if (mainWindow) {
    mainWindow.hide()
  }
})

ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('quit-app', () => {
  app.quit()
})

// Handle external URLs (for OAuth callback)
app.on('open-url', (event, url) => {
  event.preventDefault()
  console.log('🔗 Opening URL:', url)

  if (mainWindow && url.startsWith('ghosted://')) {
    mainWindow.webContents.send('deep-link', url)
  }
})

// Set as default protocol handler for ghosted://
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('ghosted', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('ghosted')
}
