import React from 'react'
import styles from './ViewToggle.module.css'

export default function ViewToggle({ view, onChange }) {
  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.btn} ${view === 'grid' ? styles.active : ''}`}
        onClick={() => onChange('grid')}
        aria-label="Grid view"
        title="Grid view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      </button>
      <button
        className={`${styles.btn} ${view === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
        aria-label="List view"
        title="List view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1.5" width="14" height="3" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="1" y="6.5" width="14" height="3" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="1" y="11.5" width="14" height="3" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      </button>
    </div>
  )
}
