import React, { useMemo } from 'react'
import { TreeNode, ItemNode } from '../../types'
import { useAppContext } from '../../context/AppContext'
import { FolderIcon, DocumentIcon, ChevronRightIcon } from '../Icons/Icons'
import styles from './ListItem.module.css'

const ITEM_COLORS = [
  'rgba(79, 195, 247, 0.08)',   // blue
  'rgba(129, 199, 132, 0.08)',  // green
  'rgba(255, 183, 77, 0.08)',   // orange
  'rgba(186, 104, 200, 0.08)',  // purple
  'rgba(240, 98, 146, 0.08)',   // pink
  'rgba(255, 213, 79, 0.08)',   // yellow
  'rgba(77, 208, 225, 0.08)',   // cyan
  'rgba(255, 138, 101, 0.08)',  // deep orange
  'rgba(149, 117, 205, 0.08)',  // deep purple
  'rgba(100, 181, 246, 0.08)',  // light blue
]

const ITEM_BORDER_COLORS = [
  'rgba(79, 195, 247, 0.18)',
  'rgba(129, 199, 132, 0.18)',
  'rgba(255, 183, 77, 0.18)',
  'rgba(186, 104, 200, 0.18)',
  'rgba(240, 98, 146, 0.18)',
  'rgba(255, 213, 79, 0.18)',
  'rgba(77, 208, 225, 0.18)',
  'rgba(255, 138, 101, 0.18)',
  'rgba(149, 117, 205, 0.18)',
  'rgba(100, 181, 246, 0.18)',
]

function hashId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

interface ListItemProps {
  node: TreeNode
}

export default function ListItem({ node }: ListItemProps): React.ReactElement {
  const { navigateInto, openContextMenu, copiedItemId, showCopied, showToast } = useAppContext()

  const colorIndex = useMemo(() => hashId(node.id) % ITEM_COLORS.length, [node.id])

  const handleClick = async (): Promise<void> => {
    if (node.type === 'group') {
      navigateInto(node.id)
    } else {
      const item = node as ItemNode
      await window.api.copyToClipboard(item.content)
      showCopied(node.id)
      showToast('Copied to clipboard!')
    }
  }

  const handleContextMenu = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    openContextMenu(e.clientX, e.clientY, node)
  }

  const isCopied = copiedItemId === node.id
  const itemStyle = isCopied
    ? undefined
    : {
        backgroundColor: ITEM_COLORS[colorIndex],
        borderColor: ITEM_BORDER_COLORS[colorIndex]
      }

  return (
    <div
      className={`${styles.item} ${isCopied ? styles.copied : ''}`}
      style={itemStyle}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      role="button"
      tabIndex={0}
      title={node.type === 'item' ? (node as ItemNode).content : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleClick()
      }}
    >
      <div className={styles.icon}>
        {node.type === 'group' ? (
          <FolderIcon size={20} className={styles.folderIcon} />
        ) : (
          <DocumentIcon size={20} className={styles.itemIcon} />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{node.name}</div>
        {node.type === 'item' && (node as ItemNode).description && (
          <div className={styles.description}>{(node as ItemNode).description}</div>
        )}
      </div>
      {node.type === 'group' && (
        <ChevronRightIcon size={16} className={styles.chevron} />
      )}
    </div>
  )
}
