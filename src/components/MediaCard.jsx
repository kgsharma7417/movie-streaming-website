import React from 'react'
import { posterUrl, formatRating, getYear, ratingColor } from '../lib/api.js'
import styles from './MediaCard.module.css'

export default function MediaCard({ item, type = 'movie', onClick, selected, index = 0, viewMode = 'grid' }) {
  const title = type === 'movie' ? item.title : item.name
  const date = type === 'movie' ? item.release_date : item.first_air_date
  const year = getYear(date)
  const rating = formatRating(item.vote_average)
  const poster = posterUrl(item.poster_path)
  const overview = item.overview?.slice(0, 120)

  const cardClass = `${styles.card} ${selected ? styles.selected : ''} ${viewMode === 'list' ? styles.listCard : ''}`

  return (
    <div
      className={cardClass}
      onClick={() => onClick(item)}
      style={{ '--delay': `${index * 0.04}s` }}
    >
      <div className={styles.poster}>
        {poster
          ? <img src={poster} alt={title} loading="lazy" />
          : <div className={styles.noPoster}>{title?.slice(0, 2)}</div>
        }
        <div className={styles.hoverOverlay}>
          <span className={styles.playIcon}>▶</span>
        </div>
      </div>
      <div className={styles.info}>
        {rating && (
          <span className={styles.rating} style={{ color: ratingColor(item.vote_average) }}>
            ★ {rating}
          </span>
        )}
        <div className={styles.title}>{title}</div>
        {year && <div className={styles.year}>{year}</div>}
        {viewMode === 'list' && overview && (
          <p className={styles.listOverview}>{overview}…</p>
        )}
      </div>
    </div>
  )
}
