import React, { useState } from 'react'
import styles from './Player.module.css'

export default function Player({ src, title, year, rating, overview, badge, id, type, season, episode, onClose }) {
  const [isTheater, setIsTheater] = useState(false)

  if (!src) return null

  // Use VidLink by default for dual audio, subtitles, and ad-blocking
  const activeSrc = id
    ? (type === 'movie'
        ? `https://vidlink.pro/embed/movie/${id}`
        : `https://vidlink.pro/embed/tv/${id}/${season}/${episode}`)
    : src

  return (
    <>
      {/* Theater mode dark overlay backdrop */}
      {isTheater && (
        <div className={styles.theaterOverlay} onClick={() => setIsTheater(false)} />
      )}

      <div className={`${styles.wrap} ${isTheater ? styles.theaterMode : ''}`}>
        {/* Player Controls Header */}
        <div className={styles.controlHeader}>
          {/* Custom Player Branding */}
          <div className={styles.playerBrand}>
            <span className={styles.brandDot}></span>
            <span className={styles.brandText}>CINESCOPE PLAYER</span>
          </div>

          {/* Action buttons */}
          <div className={styles.actionSection}>
            <button
              className={`${styles.actionBtn} ${isTheater ? styles.activeAction : ''}`}
              onClick={() => setIsTheater(!isTheater)}
              title="Toggle Theater Mode"
            >
              🎬 {isTheater ? 'Normal' : 'Theater'}
            </button>
            {onClose && (
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close player">✕</button>
            )}
          </div>
        </div>

        {/* Video Area with Ambient Glow */}
        <div className={styles.videoContainer}>
          <div className={styles.ambientGlow} />
          <div className={styles.playerBox}>
            <iframe
              src={activeSrc}
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              title={title}
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            />
          </div>
        </div>

        {/* Details Meta Box */}
        <div className={styles.metaCard}>
          <div className={styles.metaInfo}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.pills}>
              {year && <span className={styles.pill}>📅 {year}</span>}
              {rating && <span className={`${styles.pill} ${styles.gold}`}>★ {rating}</span>}
              {badge && <span className={`${styles.pill} ${styles.badge}`}>{badge}</span>}
            </div>
            {overview && <p className={styles.overview}>{overview}</p>}
          </div>
        </div>
      </div>
    </>
  )
}
