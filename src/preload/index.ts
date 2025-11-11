import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Window controls
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  quitApp: () => ipcRenderer.invoke('quit-app'),

  // Window events
  onWindowShown: (callback: () => void) => {
    ipcRenderer.on('window-shown', callback)
    return () => ipcRenderer.removeListener('window-shown', callback)
  },
  onWindowWillHide: (callback: () => void) => {
    ipcRenderer.on('window-will-hide', callback)
    return () => ipcRenderer.removeListener('window-will-hide', callback)
  },
  onDeepLink: (callback: (url: string) => void) => {
    ipcRenderer.on('deep-link', (_event, url) => callback(url))
    return () => ipcRenderer.removeAllListeners('deep-link')
  },

  // Gmail API
  gmail: {
    startAuth: () => ipcRenderer.invoke('gmail-auth-start'),
    handleCallback: (code: string) => ipcRenderer.invoke('gmail-auth-callback', code),
    getAccount: () => ipcRenderer.invoke('gmail-get-account'),
    disconnect: () => ipcRenderer.invoke('gmail-disconnect'),
    listMessages: (maxResults?: number) => ipcRenderer.invoke('gmail-list-messages', maxResults),
    getMessage: (messageId: string) => ipcRenderer.invoke('gmail-get-message', messageId),
    modifyMessage: (messageId: string, addLabels?: string[], removeLabels?: string[]) =>
      ipcRenderer.invoke('gmail-modify-message', messageId, addLabels, removeLabels),
    deleteMessage: (messageId: string) => ipcRenderer.invoke('gmail-delete-message', messageId),
    saveCredentials: (clientId: string, clientSecret: string) =>
      ipcRenderer.invoke('gmail-save-credentials', clientId, clientSecret),
    getCredentials: () => ipcRenderer.invoke('gmail-get-credentials'),
  },
})

// Type definitions for TypeScript
export interface ElectronAPI {
  hideWindow: () => Promise<void>
  getAppVersion: () => Promise<string>
  quitApp: () => Promise<void>
  onWindowShown: (callback: () => void) => () => void
  onWindowWillHide: (callback: () => void) => () => void
  onDeepLink: (callback: (url: string) => void) => () => void
  gmail: {
    startAuth: () => Promise<{ success: boolean; error?: string }>
    handleCallback: (code: string) => Promise<{ success: boolean; email?: string; error?: string }>
    getAccount: () => Promise<{ connected: boolean; email?: string }>
    disconnect: () => Promise<{ success: boolean; error?: string }>
    listMessages: (maxResults?: number) => Promise<{ success: boolean; messages: any[]; error?: string }>
    getMessage: (messageId: string) => Promise<{ success: boolean; message?: any; error?: string }>
    modifyMessage: (messageId: string, addLabels?: string[], removeLabels?: string[]) => Promise<{ success: boolean; error?: string }>
    deleteMessage: (messageId: string) => Promise<{ success: boolean; error?: string }>
    saveCredentials: (clientId: string, clientSecret: string) => Promise<{ success: boolean; error?: string }>
    getCredentials: () => Promise<{ success: boolean; clientId: string; clientSecret: string }>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
