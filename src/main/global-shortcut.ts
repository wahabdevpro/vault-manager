import { globalShortcut, BrowserWindow } from 'electron'
import { loadSettings } from './settings-store'

let currentAccelerator: string | null = null

function toggleWindow(mainWindow: BrowserWindow): void {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
    mainWindow.webContents.focus()
  }
}

export function registerGlobalShortcut(mainWindow: BrowserWindow): boolean {
  const accelerator = loadSettings().globalShortcut
  return registerShortcutWithAccelerator(mainWindow, accelerator)
}

export function registerShortcutWithAccelerator(
  mainWindow: BrowserWindow,
  accelerator: string
): boolean {
  unregisterGlobalShortcut()

  try {
    const success = globalShortcut.register(accelerator, () => {
      toggleWindow(mainWindow)
    })

    if (success) {
      currentAccelerator = accelerator
    } else {
      console.error(`Failed to register global shortcut: ${accelerator}`)
    }

    return success
  } catch (err) {
    console.error(`Error registering global shortcut: ${accelerator}`, err)
    return false
  }
}

export function unregisterGlobalShortcut(): void {
  if (currentAccelerator) {
    globalShortcut.unregister(currentAccelerator)
    currentAccelerator = null
  }
}
