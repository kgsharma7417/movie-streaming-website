import React, { useRef, useState, useEffect } from 'react'
import RowCard from './RowCard.jsx'
import styles from './ContentRow.module.css'

export default function ContentRow({ title, items, type = 'movie', onPlay, onInfo, loading, delay = 0, showProgress = false }) {
  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const [hovered, setHovered] = useState(false)

  function updateArrows() {
    const el = scrollRef.current
    if (!el) return
    setShowLeft(el.scrollLeft > 20)
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    return () => el.removeEventListener('scroll', updateArrows)
  }, [items])

  function scroll(dir) {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  // Skeleton loading
  if (loading) {
    return (
      <div className={styles.row} style={{ animationDelay: `${delay}s` }}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.scrollContainer}>
          <div className={styles.scrollInner}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) return null

  return (
    <div
      className={styles.row}
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.scrollWrap}>
        {/* Left arrow */}
        {showLeft && hovered && (
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => scroll('left')}>
            ‹
          </button>
        )}

        <div className={styles.scrollContainer} ref={scrollRef}>
          <div className={styles.scrollInner}>
            {items.map((item, i) => (
              <RowCard
                key={item.id}
                item={item}
                type={type}
                onPlay={onPlay}
                onInfo={onInfo}
                progress={showProgress ? Math.floor(Math.random() * 80 + 10) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Right arrow */}
        {showRight && hovered && (
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => scroll('right')}>
            ›
          </button>
        )}
      </div>
    </div>
  )
}
