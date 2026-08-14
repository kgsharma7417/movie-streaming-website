import React from 'react'
import { backdropUrl, formatRating, getYear } from '../lib/api.js'
import styles from './HeroBanner.module.css'

export default function HeroBanner({ item, type = 'movie', onPlay, onInfo }) {
  if (!item) return null

  const title = type === 'movie' ? item.title : item.name
  const date = type === 'movie' ? item.release_date : item.first_air_date
  const year = getYear(date)
  const rating = formatRating(item.vote_average)
  const backdrop = backdropUrl(item.backdrop_path)
  const overview = item.overview?.slice(0, 200)

  if (!backdrop) return null

  return (
    <div className={styles.hero}>
      {/* Background image */}
      <div 
        className={styles.imageWrap} 
        onClick={() => onPlay && onPlay(item)}
        style={{ cursor: 'pointer' }}
      >
        <img src={backdrop} alt={title} className={styles.image} />
        <div className={styles.gradientBottom} />
        <div className={styles.gradientLeft} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {overview && <p className={styles.overview}>{overview}…</p>}

        <div className={styles.buttons}>
          <button
            className={styles.btnPlay}
            onClick={() => onPlay && onPlay(item)}
          >
            <span className={styles.btnIcon}>▶</span>
            Play
          </button>
          <button
            className={styles.btnInfo}
            onClick={() => onInfo && onInfo(item)}
          >
            <span className={styles.btnIcon}>ⓘ</span>
            More Info
          </button>
        </div>

        <div className={styles.badges}>
          {rating && <span className={styles.badge}>★ {rating}</span>}
          {year && <span className={styles.badge}>{year}</span>}
          <span className={styles.maturityBadge}>16+</span>
        </div>
      </div>
    </div>
  )
}
