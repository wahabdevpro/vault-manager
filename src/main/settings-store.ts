import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs'
import { join } from 'path'

export interface AppSettings {
  globalShortcut: string
}

const DEFAULT_SETTINGS: AppSettings = {
  globalShortcut: 'Ctrl+Shift+V'
}

function getSettingsFile(): string {
  const basePath = app.isPackaged ? join(app.getPath('exe'), '..') : app.getAppPath()
  return join(basePath, 'vault-manager-settings.json')
}

export function loadSettings(): AppSettings {
  try {
    const settingsFile = getSettingsFile()
    if (existsSync(settingsFile)) {
      const raw = readFileSync(settingsFile, 'utf-8')
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    }
  } catch (err) {
    console.error('Failed to load settings:', err)
  }
  return { ...DEFAULT_SETTINGS }
}

export function saveSettings(settings: AppSettings): void {
  const settingsFile = getSettingsFile()
  const tmpFile = settingsFile + '.tmp'
  writeFileSync(tmpFile, JSON.stringify(settings, null, 2), 'utf-8')
  renameSync(tmpFile, settingsFile)
}

export function setSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): AppSettings {
  const settings = loadSettings()
  settings[key] = value
  saveSettings(settings)
  return settings
}
