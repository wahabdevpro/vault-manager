import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { SearchIcon } from '../Icons/Icons'
import styles from './SearchBar.module.css'

export default function SearchBar(): React.ReactElement {
  const { searchQuery, setSearchQuery, groupsOnly, setGroupsOnly } = useAppContext()

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputWrapper}>
        <SearchIcon size={16} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.input}
          placeholder="Search or group->sub-> item"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className={styles.clearButton} onClick={() => setSearchQuery('')}>
            &times;
          </button>
        )}
      </div>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={groupsOnly}
          onChange={(e) => setGroupsOnly(e.target.checked)}
        />
        <span>Groups only</span>
      </label>
    </div>
  )
}
