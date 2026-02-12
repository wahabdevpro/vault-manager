import React, { useState } from 'react'
import { LockIcon } from '../Icons/Icons'
import styles from './PasswordScreen.module.css'

interface PasswordScreenProps {
  mode: 'setup' | 'unlock'
  onAuthenticated: () => void
}

export default function PasswordScreen({
  mode,
  onAuthenticated
}: PasswordScreenProps): React.ReactElement {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Password is required')
      return
    }

    if (mode === 'setup') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }

      setLoading(true)
      const result = await window.api.setupPassword(password)
      setLoading(false)

      if (result.success) {
        onAuthenticated()
      } else {
        setError(result.error || 'Failed to setup password')
      }
    } else {
      setLoading(true)
      const result = await window.api.unlock(password)
      setLoading(false)

      if (result.success) {
        onAuthenticated()
      } else {
        setError('Wrong password')
        setPassword('')
      }
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.iconWrapper}>
          <LockIcon size={40} />
        </div>

        <h1 className={styles.title}>
          {mode === 'setup' ? 'Set Master Password' : 'Unlock Vault'}
        </h1>

        <p className={styles.subtitle}>
          {mode === 'setup'
            ? 'Create a strong password to encrypt your data. There is no recovery if you forget it.'
            : 'Enter your password to decrypt your data.'}
        </p>

        <div className={styles.fields}>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'setup' ? 'Create password...' : 'Enter password...'}
            autoFocus
            disabled={loading}
          />

          {mode === 'setup' && (
            <input
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password..."
              disabled={loading}
            />
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading
            ? 'Processing...'
            : mode === 'setup'
              ? 'Set Password & Continue'
              : 'Unlock'}
        </button>

        {mode === 'setup' && (
          <div className={styles.warning}>
            No recovery option. If you forget your password, all data is permanently lost.
          </div>
        )}
      </form>
    </div>
  )
}
