import React, { useEffect, useRef } from 'react'
import { useAppContext } from '../../context/AppContext'
import {
  PlusIcon,
  FolderIcon,
  DocumentIcon,
  EditIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '../Icons/Icons'
import styles from './ContextMenu.module.css'

export default function ContextMenu(): React.ReactElement | null {
  const {
    contextMenu,
    closeContextMenu,
    openModal,
    updateData,
    currentChildren
  } = useAppContext()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contextMenu.isOpen) return

    const handleClick = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu()
      }
    }
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') closeContextMenu()
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [contextMenu.isOpen, closeContextMenu])

  if (!contextMenu.isOpen) return null

  const { x, y, targetNode } = contextMenu

  const menuWidth = 200
  const menuHeight = targetNode ? 260 : 100
  const clampedX = Math.min(x, window.innerWidth - menuWidth - 8)
  const clampedY = Math.min(y, window.innerHeight - menuHeight - 8)

  const handleCreateGroup = (): void => {
    closeContextMenu()
    openModal('create-group')
  }

  const handleCreateItem = (): void => {
    closeContextMenu()
    openModal('create-item')
  }

  const handleEdit = (): void => {
    if (!targetNode) return
    closeContextMenu()
    if (targetNode.type === 'group') {
      openModal('edit-group', targetNode)
    } else {
      openModal('edit-item', targetNode)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!targetNode) return
    closeContextMenu()
    const confirmed = window.confirm(
      `Are you sure you want to delete "${targetNode.name}"?${targetNode.type === 'group' ? ' This will also delete all items inside it.' : ''}`
    )
    if (confirmed) {
      const newData = await window.api.deleteNode(targetNode.id)
      updateData(newData)
    }
  }

  const handleMoveUp = async (): Promise<void> => {
    if (!targetNode) return
    closeContextMenu()
    const newData = await window.api.reorderNode(targetNode.id, 'up')
    updateData(newData)
  }

  const handleMoveDown = async (): Promise<void> => {
    if (!targetNode) return
    closeContextMenu()
    const newData = await window.api.reorderNode(targetNode.id, 'down')
    updateData(newData)
  }

  const targetIndex = targetNode
    ? currentChildren.findIndex((n) => n.id === targetNode.id)
    : -1
  const isFirst = targetIndex === 0
  const isLast = targetIndex === currentChildren.length - 1

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      style={{ left: clampedX, top: clampedY }}
    >
      <button className={styles.menuItem} onClick={handleCreateGroup}>
        <FolderIcon size={16} />
        <span>Create Group</span>
      </button>
      <button className={styles.menuItem} onClick={handleCreateItem}>
        <DocumentIcon size={16} />
        <span>Create Item</span>
      </button>

      {targetNode && (
        <>
          <div className={styles.separator} />
          <button className={styles.menuItem} onClick={handleEdit}>
            <EditIcon size={16} />
            <span>Edit</span>
          </button>
          <button className={`${styles.menuItem} ${styles.danger}`} onClick={handleDelete}>
            <TrashIcon size={16} />
            <span>Delete</span>
          </button>
          <div className={styles.separator} />
          <button
            className={styles.menuItem}
            onClick={handleMoveUp}
            disabled={isFirst}
          >
            <ArrowUpIcon size={16} />
            <span>Move Up</span>
          </button>
          <button
            className={styles.menuItem}
            onClick={handleMoveDown}
            disabled={isLast}
          >
            <ArrowDownIcon size={16} />
            <span>Move Down</span>
          </button>
        </>
      )}
    </div>
  )
}
