import React from 'react'
import styles from './PlatformFilter.module.css'

export const PLATFORMS = [
  {
    id: 'netflix',
    name: 'Netflix',
    providerId: '8',
    logo: 'https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
    color: '#E50914',
    bg: '#141414',
  },
  {
    id: 'prime',
    name: 'Prime Video',
    providerId: '119',
    logo: 'https://image.tmdb.org/t/p/original/pvske1MyAoymrs5bguRfVqYiM9a.jpg',
    color: '#00A8E1',
    bg: '#0F172A',
  },
  {
    id: 'hotstar',
    name: 'Disney+ Hotstar',
    providerId: '2336', // Unified JioHotstar TMDB ID
    logo: 'https://image.tmdb.org/t/p/original/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg',
    color: '#00D8FF',
    bg: '#0C111A',
  },
  {
    id: 'jio',
    name: 'JioCinema',
    providerId: '2336', // Unified JioHotstar TMDB ID
    logo: 'https://image.tmdb.org/t/p/original/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg',
    color: '#D4145A',
    bg: '#0E0E0E',
  },
  {
    id: 'zee5',
    name: 'ZEE5',
    providerId: '232',
    logo: 'https://image.tmdb.org/t/p/original/gP67NRy1ShUJilrzMsbOmEmdmcv.jpg',
    color: '#8230C6',
    bg: '#180D2C',
  },
  {
    id: 'sonyliv',
    name: 'Sony LIV',
    providerId: '237',
    logo: 'https://image.tmdb.org/t/p/original/3973zlBbBXdXxaWqRWzGG2GYxbT.jpg',
    color: '#FFA500',
    bg: '#0E1428',
  },
  {
    id: 'discovery',
    name: 'Discovery+',
    providerId: '510',
    logo: 'https://image.tmdb.org/t/p/original/eMTnWwNVtThkjvQA6zwxaoJG9NE.jpg',
    color: '#1E90FF',
    bg: '#0D0D0D',
  }
]

export default function PlatformFilter({ selected, onChange }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>Stream on Platforms</span>
        {selected && (
          <button className={styles.clearBtn} onClick={() => onChange(null)}>
            Clear Filter ✕
          </button>
        )}
      </div>
      <div className={styles.scrollWrap}>
        <div className={styles.platformRow}>
          {PLATFORMS.map(platform => {
            const isSelected = selected && selected.id === platform.id
            return (
              <button
                key={platform.id}
                className={`${styles.card} ${isSelected ? styles.active : ''}`}
                style={{
                  '--brand-color': platform.color,
                  '--brand-bg': platform.bg,
                }}
                onClick={() => onChange(isSelected ? null : platform)}
                aria-label={`Filter by ${platform.name}`}
              >
                <div className={styles.logoWrap}>
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className={styles.logo}
                    loading="lazy"
                  />
                </div>
                <span className={styles.name}>{platform.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
