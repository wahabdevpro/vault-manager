import React from 'react'
import { useAppContext } from '../../context/AppContext'
import ListItem from '../ListItem/ListItem'
import BreadcrumbPath from '../BreadcrumbPath/BreadcrumbPath'
import styles from './ListView.module.css'

export default function ListView(): React.ReactElement {
  const {
    currentChildren,
    isSearching,
    searchResults,
    openContextMenu
  } = useAppContext()

  const handleBackgroundContextMenu = (e: React.MouseEvent): void => {
    if ((e.target as HTMLElement).closest(`.${styles.listItemWrapper}`)) return
    e.preventDefault()
    openContextMenu(e.clientX, e.clientY, null)
  }

  if (isSearching) {
    if (searchResults.length === 0) {
      return (
        <div className={styles.listView} onContextMenu={handleBackgroundContextMenu}>
          <div className={styles.empty}>No results found</div>
        </div>
      )
    }

    return (
      <div className={styles.listView} onContextMenu={handleBackgroundContextMenu}>
        {searchResults.map((result) => (
          <div key={result.node.id} className={styles.listItemWrapper}>
            <ListItem node={result.node} />
            {result.path.length > 0 && <BreadcrumbPath path={result.path} />}
          </div>
        ))}
      </div>
    )
  }

  if (currentChildren.length === 0) {
    return (
      <div className={styles.listView} onContextMenu={handleBackgroundContextMenu}>
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>No items yet</div>
          <div className={styles.emptyHint}>Right-click to create a group or item</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.listView} onContextMenu={handleBackgroundContextMenu}>
      {currentChildren.map((node) => (
        <div key={node.id} className={styles.listItemWrapper}>
          <ListItem node={node} />
        </div>
      ))}
    </div>
  )
}
