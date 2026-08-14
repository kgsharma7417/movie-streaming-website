import React, { useState, useRef, useCallback } from 'react'
import { posterUrl, formatRating, getYear, ratingColor } from '../lib/api.js'
import styles from './RowCard.module.css'

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w500'

export default function RowCard({ item, type = 'movie', onPlay, onInfo, progress }) {
  const [expanded, setExpanded] = useState(false)
  const hoverTimer = useRef(null)

  const title = type === 'movie' ? item.title : item.name
  const date = type === 'movie' ? item.release_date : item.first_air_date
  const year = getYear(date)
  const rating = formatRating(item.vote_average)
  const ratingPct = item.vote_average ? Math.round(item.vote_average * 10) : null
  const backdrop = item.backdrop_path ? `${BACKDROP_BASE}${item.backdrop_path}` : null
  const poster = posterUrl(item.poster_path)
  const image = backdrop || poster

  const handleMouseEnter = useCallback(() => {
    hoverTimer.current = setTimeout(() => setExpanded(true), 250)
  }, [])

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimer.current)
    setExpanded(false)
  }, [])

  return (
    <div
      className={`${styles.cardWrap} ${expanded ? styles.expanded : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.card}>
        {/* Thumbnail */}
        <div className={styles.thumbnail}>
          {image ? (
            <img src={image} alt={title} loading="lazy" />
          ) : (
            <div className={styles.placeholder}>
              <span>{title?.slice(0, 2)}</span>
            </div>
          )}
          <div className={styles.titleOverlay}>
            <div className={styles.titleOverlayText}>{title}</div>
          </div>
          {/* Progress bar for "Continue Watching" */}
          {progress != null && (
            <div className={styles.progressWrap}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* Expanded info panel */}
        {expanded && (
          <div className={styles.infoPanel}>
            <div className={styles.buttonRow}>
              <button
                className={styles.iconBtnPrimary}
                onClick={(e) => { e.stopPropagation(); onPlay && onPlay(item) }}
                title="Play"
              >
                ▶
              </button>
              <button className={styles.iconBtn} title="Add to My List">+</button>
              <button className={styles.iconBtn} title="Like">👍</button>
              <div className={styles.spacer} />
              <button
                className={styles.iconBtn}
                onClick={(e) => { e.stopPropagation(); onInfo && onInfo(item) }}
                title="More Info"
              >
                ⌄
              </button>
            </div>
            <div className={styles.metaRow}>
              {ratingPct && (
                <span className={styles.matchPct} style={{ color: ratingPct >= 70 ? 'var(--green)' : ratingPct >= 50 ? '#fff' : '#999' }}>
                  {ratingPct}% Match
                </span>
              )}
              {year && <span className={styles.metaBadge}>{year}</span>}
              {rating && <span className={styles.metaRating}>★ {rating}</span>}
            </div>
            <div className={styles.titleText}>{title}</div>
          </div>
        )}
      </div>
    </div>
  )
}
