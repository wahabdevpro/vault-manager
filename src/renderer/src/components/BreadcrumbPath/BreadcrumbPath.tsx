import React from 'react'
import styles from './BreadcrumbPath.module.css'

interface BreadcrumbPathProps {
  path: string[]
}

export default function BreadcrumbPath({ path }: BreadcrumbPathProps): React.ReactElement {
  return (
    <div className={styles.breadcrumb}>
      {path.map((name, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.arrow}>&rarr;</span>}
          <span className={styles.segment}>{name}</span>
        </React.Fragment>
      ))}
    </div>
  )
}
