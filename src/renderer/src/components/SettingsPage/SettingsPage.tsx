import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeftIcon } from '../Icons/Icons'
import styles from './SettingsPage.module.css'

interface SettingsPageProps {
  onBack: () => void
}

function keyToAccelerator(e: KeyboardEvent): string | null {
  const parts: string[] = []

  if (e.ctrlKey) parts.push('Ctrl')
  if (e.shiftKey) parts.push('Shift')
  if (e.altKey) parts.push('Alt')
  if (e.metaKey) parts.push('Super')

  const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta']
  if (modifierKeys.includes(e.key)) return null

  if (parts.length === 0) return null

  const keyMap: Record<string, string> = {
    ' ': 'Space',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    Enter: 'Return',
    Backspace: 'Backspace',
    Delete: 'Delete',
    Escape: 'Escape',
    Tab: 'Tab'
  }

  const key = keyMap[e.key] || e.key.toUpperCase()
  parts.push(key)

  return parts.join('+')
}

export default function SettingsPage({ onBack }: SettingsPageProps): React.ReactElement {
  const [currentShortcut, setCurrentShortcut] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordedKeys, setRecordedKeys] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    window.api.getSettings().then((settings) => {
      setCurrentShortcut(settings.globalShortcut)
    })
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isRecording) return
      e.preventDefault()
      e.stopPropagation()

      const accelerator = keyToAccelerator(e)
      if (accelerator) {
        setRecordedKeys(accelerator)
      }
    },
    [isRecording]
  )

  useEffect(() => {
    if (isRecording) {
      document.addEventListener('keydown', handleKeyDown, true)
      return () => document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isRecording, handleKeyDown])

  const startRecording = (): void => {
    setIsRecording(true)
    setRecordedKeys('')
    setError('')
  }

  const cancelRecording = (): void => {
    setIsRecording(false)
    setRecordedKeys('')
    setError('')
  }

  const saveShortcut = async (): Promise<void> => {
    if (!recordedKeys) return

    setSaving(true)
    setError('')

    const result = await window.api.setShortcut(recordedKeys)

    setSaving(false)

    if (result.success) {
      setCurrentShortcut(recordedKeys)
      setIsRecording(false)
      setRecordedKeys('')
    } else {
      setError(result.error || 'Failed to register shortcut')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack} title="Go back">
          <ChevronLeftIcon size={22} />
        </button>
        <span className={styles.title}>Settings</span>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Global Shortcut</div>

          <div className={styles.shortcutRow}>
            <div className={styles.shortcutInfo}>
              <span className={styles.shortcutLabel}>Show / Hide</span>
              <span className={styles.shortcutDescription}>
                Toggle Vault Manager from anywhere
              </span>
            </div>
            {!isRecording ? (
              <kbd className={styles.kbd}>{currentShortcut || 'None'}</kbd>
            ) : null}
          </div>

          {!isRecording ? (
            <button
              className={styles.changeButton}
              onClick={startRecording}
              style={{ marginTop: 12 }}
            >
              Change shortcut
            </button>
          ) : (
            <div className={styles.recordingOverlay}>
              <div className={styles.recordingInput}>
                {recordedKeys ? (
                  <kbd className={styles.kbd}>{recordedKeys}</kbd>
                ) : (
                  <span className={styles.recordingPlaceholder}>
                    Press a key combination...
                  </span>
                )}
              </div>
              <div className={styles.recordingActions}>
                <button
                  className={styles.saveButton}
                  onClick={saveShortcut}
                  disabled={!recordedKeys || saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button className={styles.cancelButton} onClick={cancelRecording}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </div>
  )
}
