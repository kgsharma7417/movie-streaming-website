import React from 'react'
import MediaCard from './MediaCard.jsx'
import styles from './MediaGrid.module.css'

export default function MediaGrid({ items, type, onSelect, selectedId, loading, viewMode = 'grid' }) {
  if (loading) {
    return (
      <div className={viewMode === 'list' ? styles.list : styles.grid}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={viewMode === 'list' ? styles.skeletonList : styles.skeleton} />
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return <p className={styles.empty}>No results found.</p>
  }

  return (
    <div className={viewMode === 'list' ? styles.list : styles.grid}>
      {items.map((item, i) => (
        <MediaCard
          key={item.id}
          item={item}
          type={type}
          onClick={onSelect}
          selected={item.id === selectedId}
          index={i}
          viewMode={viewMode}
        />
      ))}
    </div>
  )
}
