import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { ChevronLeftIcon, LockIcon } from '../Icons/Icons'
import styles from './Header.module.css'

export default function Header({ onLock }: { onLock: () => void }): React.ReactElement {
  const { navigationStack, currentPath, navigateBack, navigateToRoot, navigateToLevel } =
    useAppContext()
  const isAtRoot = navigationStack.length === 0
  const lastIndex = currentPath.length - 1

  return (
    <div className={styles.header}>
      <button
        className={`${styles.backButton} ${isAtRoot ? styles.hidden : ''}`}
        onClick={navigateBack}
        disabled={isAtRoot}
        title="Go back"
      >
        <ChevronLeftIcon size={22} />
      </button>
      <div className={styles.breadcrumb}>
        <span
          className={`${styles.breadcrumbItem} ${styles.clickable}`}
          onClick={navigateToRoot}
        >
          Vault Manager
        </span>
        {currentPath.map((name, i) => (
          <React.Fragment key={i}>
            <span className={styles.separator}>/</span>
            {i < lastIndex ? (
              <span
                className={`${styles.breadcrumbItem} ${styles.clickable}`}
                onClick={() => navigateToLevel(i + 1)}
              >
                {name}
              </span>
            ) : (
              <span className={styles.breadcrumbItem}>{name}</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <button className={styles.lockButton} onClick={onLock} title="Lock vault">
        <LockIcon size={18} />
      </button>
    </div>
  )
}
