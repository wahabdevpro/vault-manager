import React, { useState } from 'react'
import { TreeNode, ItemNode } from '../../types'
import { useAppContext } from '../../context/AppContext'
import styles from './ItemForm.module.css'

interface ItemFormProps {
  mode: 'create' | 'edit'
  targetNode?: TreeNode | null
}

export default function ItemForm({ mode, targetNode }: ItemFormProps): React.ReactElement {
  const { currentGroupId, closeModal, updateData } = useAppContext()
  const itemNode = mode === 'edit' && targetNode?.type === 'item' ? (targetNode as ItemNode) : null

  const [name, setName] = useState(itemNode?.name || '')
  const [description, setDescription] = useState(itemNode?.description || '')
  const [content, setContent] = useState(itemNode?.content || '')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    let newData
    if (mode === 'create') {
      newData = await window.api.createItem(
        currentGroupId,
        name.trim(),
        description.trim(),
        content.trim()
      )
    } else if (targetNode) {
      newData = await window.api.updateNode(targetNode.id, {
        name: name.trim(),
        description: description.trim(),
        content: content.trim()
      })
    }
    if (newData) {
      updateData(newData)
    }
    closeModal()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name..."
          autoFocus
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          Description <span className={styles.optional}>(optional)</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a short description..."
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Content</label>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the content to copy to clipboard..."
          rows={5}
        />
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={closeModal}>
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!name.trim() || !content.trim()}
        >
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  )
}
