import React, { useState } from 'react'
import Movies from './pages/Movies.jsx'
import TV from './pages/TV.jsx'
import styles from './App.module.css'

function clearMovieSession() {
  ['mv_query', 'mv_player'].forEach(k => sessionStorage.removeItem(k))
}

export default function App() {
  const [tab, setTab] = useState(() => sessionStorage.getItem('cs_tab') || 'movies')
  const [homeKey, setHomeKey] = useState(0)

  function goTab(t) {
    setTab(t)
    sessionStorage.setItem('cs_tab', t)
  }

  function goHome() {
    clearMovieSession()
    setTab('movies')
    sessionStorage.setItem('cs_tab', 'movies')
    setHomeKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <button className={styles.logo} onClick={goHome} aria-label="Go to home">
          <span className={styles.logoAccent}>cine</span><span className={styles.logoDot}>·</span>scope
        </button>
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'movies' ? styles.active : ''}`}
            onClick={() => goTab('movies')}
          >
            Movies
          </button>
          <button
            className={`${styles.tab} ${tab === 'tv' ? styles.active : ''}`}
            onClick={() => goTab('tv')}
          >
            TV Series
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {tab === 'movies'
          ? <Movies key={homeKey} />
          : <TV />
        }
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()} All rights reserved{' '}
          <a
            href="https://www.codespecters.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Code Specter
          </a>
          {' '}| Digital Entertainment Democratized
        </p>
      </footer>
    </div>
  )
}
