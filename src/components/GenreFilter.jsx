import React, { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api.js'
import styles from './GenreFilter.module.css'

export default function GenreFilter({ type = 'movie', selected = [], onChange }) {
  const [genres, setGenres] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    const fetcher = type === 'movie' ? api.movieGenres : api.tvGenres
    fetcher().then(data => setGenres(data.genres || [])).catch(() => {})
  }, [type])

  function toggle(id) {
    if (selected.includes(id)) {
      onChange(selected.filter(g => g !== id))
    } else {
      onChange([...selected, id])
    }
  }

  function clearAll() {
    onChange([])
  }

  if (!genres.length) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>Genres</span>
        {selected.length > 0 && (
          <button className={styles.clearBtn} onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>
      <div className={styles.scrollWrap} ref={scrollRef}>
        <div className={styles.chips}>
          {genres.map(g => (
            <button
              key={g.id}
              className={`${styles.chip} ${selected.includes(g.id) ? styles.active : ''}`}
              onClick={() => toggle(g.id)}
            >
              {g.name}
              {selected.includes(g.id) && <span className={styles.checkmark}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
