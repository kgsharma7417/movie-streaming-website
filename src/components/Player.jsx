import React, { useState, useEffect, useRef } from 'react'
import styles from './Player.module.css'

export default function Player({ src, title, year, rating, overview, badge, id, type, season, episode, onClose }) {
  const [isTheater, setIsTheater] = useState(false)

  if (!src) return null

  const [clickThrough, setClickThrough] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const clickTimerRef = useRef(null)

  const handleOverlayClick = () => {
    setClickThrough(true)
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => {
      setClickThrough(false)
    }, 6000)
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(max-width: 768px)').matches ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0)
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    }
  }, [])

  const [activeServer, setActiveServer] = useState(0)

  // Reset to default premium server when content changes
  useEffect(() => {
    setActiveServer(0)
  }, [id])

  // Alternate backup servers to support fallback streams
  const servers = [
    { name: 'Server 1 (VidLink)', src: id ? (type === 'movie' ? `https://vidlink.pro/movie/${id}?primaryColor=e50914&autoplay=false` : `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=e50914&autoplay=false`) : src },
    { name: 'Server 2 (Vidsrc)', src: id ? (type === 'movie' ? `https://vidsrc.to/embed/movie/${id}` : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`) : src },
    { name: 'Server 3 (SuperEmbed)', src: id ? (type === 'movie' ? `https://multiembed.to/yt.php?video_id=${id}&tmdb=1` : `https://multiembed.to/yt.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`) : src },
    { name: 'Server 4 (Embed.su)', src: id ? (type === 'movie' ? `https://embed.su/embed/movie/${id}` : `https://embed.su/embed/tv/${id}/${season}/${episode}`) : src }
  ]

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
          {/* Custom Player Branding */}
          <div className={styles.playerBrand}>
            <span className={styles.brandDot}></span>
            <span className={styles.brandText}>KGVIEW PLAYER</span>
          </div>

          {/* Action buttons */}
          <div className={styles.actionSection}>
            <select
              value={activeServer}
              onChange={(e) => setActiveServer(Number(e.target.value))}
              className={styles.serverSelect}
              title="Change Streaming Server"
            >
              {servers.map((srv, idx) => (
                <option key={idx} value={idx}>
                  {srv.name}
                </option>
              ))}
            </select>

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
          <div
            className={styles.playerBox}
            onMouseLeave={() => setClickThrough(false)}
          >
            <iframe
              src={activeSrc}
              allowFullScreen
              allow="encrypted-media; fullscreen; picture-in-picture"
              title={title}
            />
            {/* Transparent overlay to allow page scrolling on mobile/desktop */}
            <div
              className={`${styles.scrollOverlay} ${clickThrough ? styles.overlayDisabled : ''}`}
              onClick={handleOverlayClick}
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
