import React, { useState } from 'react'
import { TreeNode } from '../../types'
import { useAppContext } from '../../context/AppContext'
import styles from './GroupForm.module.css'

interface GroupFormProps {
  mode: 'create' | 'edit'
  targetNode?: TreeNode | null
}

export default function GroupForm({ mode, targetNode }: GroupFormProps): React.ReactElement {
  const { currentGroupId, closeModal, updateData } = useAppContext()
  const [name, setName] = useState(mode === 'edit' && targetNode ? targetNode.name : '')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!name.trim()) return

    let newData
    if (mode === 'create') {
      newData = await window.api.createGroup(currentGroupId, name.trim())
    } else if (targetNode) {
      newData = await window.api.updateNode(targetNode.id, { name: name.trim() })
    }
    if (newData) {
      updateData(newData)
    }
    closeModal()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Group Name</label>
        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name..."
          autoFocus
        />
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={closeModal}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton} disabled={!name.trim()}>
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  )
}
