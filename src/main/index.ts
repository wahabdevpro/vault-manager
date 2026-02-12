import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { createTray } from './tray'
import { registerIpcHandlers } from './ipc-handlers'

const isDev = !app.isPackaged

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    // width: 400,
    // height: 700,
    // maxWidth: 400,
    // minHeight: 500,
    show: false,
    backgroundColor: '#1a1a2e',
    autoHideMenuBar: true,
    icon: join(__dirname, '../../resources/icon.ico'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.webContents.focus()
  })

  mainWindow.on('show', () => {
    mainWindow?.webContents.focus()
  })

  mainWindow.on('close', (event) => {
    if (!(app as Record<string, unknown>).isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()
  if (mainWindow) {
    createTray(mainWindow)
  }
})

app.on('before-quit', () => {
  ;(app as Record<string, unknown>).isQuitting = true
})

app.on('window-all-closed', () => {
  // Keep app alive for tray
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
