import React, { useState, useEffect, useRef } from 'react'
import Movies from './pages/Movies.jsx'
import TV from './pages/TV.jsx'
import Footer from './components/Footer.jsx'
import { api } from './lib/api.js'
import styles from './App.module.css'

function clearMovieSession() {
  ['mv_query', 'mv_player'].forEach(k => sessionStorage.removeItem(k))
}

export default function App() {
  const [tab, setTab] = useState(() => sessionStorage.getItem('cs_tab') || 'movies')
  const [homeKey, setHomeKey] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lang, setLang] = useState(() => api.getLanguage())
  const searchInputRef = useRef(null)
  const profileRef = useRef(null)

  function toggleLanguage() {
    const nextLang = lang === 'hi-IN' ? 'en-US' : 'hi-IN'
    api.setLanguage(nextLang)
    setLang(nextLang)
    window.location.reload()
  }

  // Scroll listener for header
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    function onClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  function goTab(t) {
    setTab(t)
    sessionStorage.setItem('cs_tab', t)
    setMobileMenuOpen(false)
  }

  function goHome() {
    clearMovieSession()
    setTab('movies')
    sessionStorage.setItem('cs_tab', 'movies')
    setHomeKey(k => k + 1)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const NAV_ITEMS = [
    { key: 'movies', label: 'Home', action: goHome },
    { key: 'movies', label: 'Movies', action: () => goTab('movies') },
    { key: 'tv', label: 'TV Shows', action: () => goTab('tv') },
  ]

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerLeft}>
          {/* Hamburger (mobile) */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`} />
          </button>

          {/* Logo */}
          <button className={styles.logo} onClick={goHome} aria-label="Go to home">
            CINESCOPE
          </button>

          {/* Nav links (desktop) */}
          <nav className={styles.nav}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                className={`${styles.navLink} ${tab === item.key ? styles.navLinkActive : ''}`}
                onClick={item.action}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.headerRight}>
          {/* Search */}
          <div className={`${styles.searchBox} ${searchOpen ? styles.searchOpen : ''}`}>
            <button
              className={styles.searchToggle}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
            </button>
            {searchOpen && (
              <input
                ref={searchInputRef}
                className={styles.searchInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres"
                onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
              />
            )}
          </div>

          {/* Notification bell */}
          <button className={styles.iconBtn} aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>

          {/* Language Switcher */}
          <button className={styles.langBtn} onClick={toggleLanguage} aria-label="Toggle language">
            <span className={styles.langGlobe}>🌐</span>
            <span className={styles.langText}>{lang === 'hi-IN' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Profile */}
          <div className={styles.profileWrap} ref={profileRef}>
            <button
              className={styles.profileBtn}
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className={styles.avatar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/>
                </svg>
              </div>
              <span className={`${styles.profileArrow} ${profileOpen ? styles.profileArrowUp : ''}`}>▾</span>
            </button>
            {profileOpen && (
              <div className={styles.profileDropdown}>
                <button className={styles.profileOption}>Manage Profiles</button>
                <button className={styles.profileOption}>Account</button>
                <hr className={styles.profileDivider} />
                <button className={styles.profileOption}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className={`${styles.mobileNavLink} ${tab === item.key ? styles.mobileNavLinkActive : ''}`}
              onClick={item.action}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className={styles.main} key={`${tab}-${homeKey}`}>
        {tab === 'movies' ? <Movies key={homeKey} /> : <TV />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
