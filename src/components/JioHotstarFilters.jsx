import React from 'react'
import { currentLang } from '../lib/api.js'
import styles from './JioHotstarFilters.module.css'

export const SUB_FILTERS = [
  {
    id: 'serials',
    label: {
      'en-US': 'TV Serials 📺',
      'hi-IN': 'टीवी सीरियल्स 📺'
    },
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&auto=format&fit=crop&q=80',
    color: '#E50914'
  },
  {
    id: 'news',
    label: {
      'en-US': 'News 📰',
      'hi-IN': 'समाचार न्यूज़ 📰'
    },
    image: 'https://images.unsplash.com/photo-1495020689067-958852a6565d?w=300&auto=format&fit=crop&q=80',
    color: '#00A8E1'
  },
  {
    id: 'latest_2026',
    label: {
      'en-US': 'New 2026 🌟',
      'hi-IN': 'नया 2026 🌟'
    },
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
    color: '#00D8FF'
  },
  {
    id: 'indian_movies',
    label: {
      'en-US': 'Indian Movies 🇮🇳',
      'hi-IN': 'भारतीय फिल्में 🇮🇳'
    },
    image: 'https://images.unsplash.com/photo-1598897349388-2ff77ff18b45?w=300&auto=format&fit=crop&q=80',
    color: '#FFA500'
  },
  {
    id: 'old_movies',
    label: {
      'en-US': 'Old Classics ⏳',
      'hi-IN': 'पुरानी फिल्में ⏳'
    },
    image: 'https://images.unsplash.com/photo-1478720143022-385f700d3d31?w=300&auto=format&fit=crop&q=80',
    color: '#FFA500'
  }
]

export default function JioHotstarFilters({ active, onChange }) {
  const activeLang = currentLang === 'hi-IN' ? 'hi-IN' : 'en-US'

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrap}>
        <div className={styles.row}>
          {SUB_FILTERS.map(item => {
            const isSelected = active === item.id
            const labelText = item.label[activeLang] || item.label['en-US']
            return (
              <button
                key={item.id}
                className={`${styles.card} ${isSelected ? styles.activeCard : ''}`}
                style={{
                  '--brand-color': item.color,
                  backgroundImage: `url(${item.image})`
                }}
                onClick={() => onChange(isSelected ? null : item.id)}
              >
                <div className={styles.overlay}>
                  <span className={styles.title}>{labelText}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
