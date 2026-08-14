import React, { useState, useEffect } from 'react'
import styles from './Player.module.css'

export default function Player({ src, title, year, rating, overview, badge, id, type, season, episode, onClose }) {
  const [isTheater, setIsTheater] = useState(false)
  const [activeServer, setActiveServer] = useState(0)

  // Alternate backup servers to support fallback streams and dual audio
  const servers = [
    { name: 'Server 1 (Primary)', src: src },
    { name: 'Server 2 (VidLink - Dual Audio)', src: type === 'movie' ? `https://vidlink.pro/embed/movie/${id}` : `https://vidlink.pro/embed/tv/${id}/${season}/${episode}` },
    { name: 'Server 3 (Vidsrc - HD)', src: type === 'movie' ? `https://vidsrc.to/embed/movie/${id}` : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` },
    { name: 'Server 4 (SuperEmbed)', src: type === 'movie' ? `https://multiembed.to/yt.php?video_id=${id}&tmdb=1` : `https://multiembed.to/yt.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}` },
    { name: 'Server 5 (Embed.su)', src: type === 'movie' ? `https://embed.su/embed/movie/${id}` : `https://embed.su/embed/tv/${id}/${season}/${episode}` }
  ]

  // Reset server selection when source content changes
  useEffect(() => {
    setActiveServer(0)
  }, [src, id])

  if (!src) return null

  const activeSrc = servers[activeServer]?.src || src

  return (
    <>
      {/* Theater mode dark overlay backdrop */}
      {isTheater && (
        <div className={styles.theaterOverlay} onClick={() => setIsTheater(false)} />
      )}

      <div className={`${styles.wrap} ${isTheater ? styles.theaterMode : ''}`}>
        {/* Player Controls Header */}
        <div className={styles.controlHeader}>
          {/* Server List */}
          <div className={styles.serverSection}>
            <span className={styles.serverLabel}>Select Server:</span>
            <div className={styles.serverList}>
              {servers.map((srv, idx) => (
                <button
                  key={srv.name}
                  className={`${styles.serverChip} ${activeServer === idx ? styles.activeServer : ''}`}
                  onClick={() => setActiveServer(idx)}
                >
                  {srv.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.actionSection}>
            <button
              className={`${styles.actionBtn} ${isTheater ? styles.activeAction : ''}`}
              onClick={() => setIsTheater(!isTheater)}
              title="Toggle Theater Mode"
            >
              🎬 {isTheater ? 'Normal Mode' : 'Theater Mode'}
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
