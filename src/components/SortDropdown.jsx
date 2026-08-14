import React, { useState, useRef, useEffect } from 'react'
import styles from './SortDropdown.module.css'

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Latest Release' },
  { value: 'original_title.asc', label: 'A → Z' },
  { value: 'original_title.desc', label: 'Z → A' },
]

const TV_SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'first_air_date.desc', label: 'Latest Release' },
  { value: 'name.asc', label: 'A → Z' },
  { value: 'name.desc', label: 'Z → A' },
]

export default function SortDropdown({ value, onChange, type = 'movie' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const options = type === 'movie' ? SORT_OPTIONS : TV_SORT_OPTIONS

  const current = options.find(o => o.value === value) || options[0]

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(val) {
    onChange(val)
    setOpen(false)
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        <span className={styles.triggerLabel}>Sort by</span>
        <span className={styles.triggerValue}>{current.label}</span>
        <span className={`${styles.arrow} ${open ? styles.arrowUp : ''}`}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map(o => (
            <button
              key={o.value}
              className={`${styles.option} ${o.value === value ? styles.optionActive : ''}`}
              onClick={() => select(o.value)}
            >
              {o.label}
              {o.value === value && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
