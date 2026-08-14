import React, { useState, useEffect, useRef } from 'react'
import { api, movieEmbedUrl, tvEmbedUrl, formatRating, getYear } from '../lib/api.js'
import HeroBanner from '../components/HeroBanner.jsx'
import ContentRow from '../components/ContentRow.jsx'
import Player from '../components/Player.jsx'
import MediaGrid from '../components/MediaGrid.jsx'
import PlatformFilter from '../components/PlatformFilter.jsx'
import JioHotstarFilters from '../components/JioHotstarFilters.jsx'
import styles from './Movies.module.css'

// Genre IDs for specific rows
const GENRE_ROWS = [
  { id: 28, name: 'Action Movies' },
  { id: 35, name: 'Comedies' },
  { id: 878, name: 'Sci-Fi & Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thrillers' },
]

function persist(key, val) {
  try { sessionStorage.setItem(key, JSON.stringify(val)) } catch {}
}
function hydrate(key) {
  try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null }
}

export default function Movies() {
  const savedQuery = hydrate('mv_query') || ''
  const savedPlayer = hydrate('mv_player')

  const [query, setQuery] = useState(savedQuery)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(!!savedQuery)
  const [searchLoading, setSearchLoading] = useState(false)
  const [player, setPlayer] = useState(savedPlayer)

  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [activeSubFilter, setActiveSubFilter] = useState(null)
  const [platformResults, setPlatformResults] = useState([])
  const [platformLoading, setPlatformLoading] = useState(false)

  // Row data
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [genreRows, setGenreRows] = useState({})
  const [loading, setLoading] = useState(true)
  const [heroItem, setHeroItem] = useState(null)

  // Reset sub-filter when platform changes
  useEffect(() => {
    setActiveSubFilter(null)
  }, [selectedPlatform])

  // Fetch movies/TV shows for selected watch platform and sub-category
  useEffect(() => {
    if (!selectedPlatform) {
      setPlatformResults([])
      return
    }
    setPlatformLoading(true)
    let fetchPromise

    const isJioHotstar = selectedPlatform.id === 'hotstar' || selectedPlatform.id === 'jio'

    if (isJioHotstar && activeSubFilter) {
      if (activeSubFilter === 'serials') {
        fetchPromise = api.discoverTV([], 'popularity.desc', 1, selectedPlatform.providerId)
      } else if (activeSubFilter === 'news') {
        fetchPromise = api.discoverTV([10763], 'popularity.desc', 1, selectedPlatform.providerId)
      } else if (activeSubFilter === 'latest_2026') {
        fetchPromise = api.discoverMovies([], 'popularity.desc', 1, selectedPlatform.providerId, { primary_release_year: 2026 })
      } else if (activeSubFilter === 'indian_movies') {
        fetchPromise = api.discoverMovies([], 'popularity.desc', 1, selectedPlatform.providerId, { with_original_language: 'hi|te|ta|ml|kn|pa|bn' })
      } else if (activeSubFilter === 'old_movies') {
        fetchPromise = api.discoverMovies([], 'popularity.desc', 1, selectedPlatform.providerId, {
          with_original_language: 'hi',
          'release_date.lte': '2000-01-01'
        })
      }
    } else {
      fetchPromise = api.discoverMovies([], 'popularity.desc', 1, selectedPlatform.providerId)
    }

    fetchPromise
      .then(d => setPlatformResults(d.results || []))
      .finally(() => setPlatformLoading(false))
  }, [selectedPlatform, activeSubFilter])

  const playerAnchorRef = useRef(null)
  const searchInputRef = useRef(null)

  // Load all rows on mount
  useEffect(() => {
    Promise.all([
      api.trendingMovies(),
      api.discoverMovies([], 'vote_average.desc'),
    ]).then(([trendData, topData]) => {
      const t = trendData.results || []
      setTrending(t)
      setTopRated(topData.results || [])
      // Pick random hero from top 5 trending
      if (t.length) setHeroItem(t[Math.floor(Math.random() * Math.min(5, t.length))])
    }).finally(() => setLoading(false))

    // Load genre rows
    GENRE_ROWS.forEach(g => {
      api.discoverMovies([g.id], 'popularity.desc')
        .then(d => {
          setGenreRows(prev => ({ ...prev, [g.id]: d.results || [] }))
        })
        .catch(() => {})
    })

    // Restore search
    if (savedQuery) {
      setSearchLoading(true)
      api.searchMovies(savedQuery)
        .then(d => setSearchResults(d.results || []))
        .finally(() => setSearchLoading(false))
    }
  }, [])

  async function search(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) { clearSearch(); return }
    setIsSearching(true)
    setSearchLoading(true)
    setSearchResults([])
    setSelectedPlatform(null)
    persist('mv_query', q)
    const d = await api.searchMovies(q)
    setSearchResults(d.results || [])
    setSearchLoading(false)
  }

  function clearSearch() {
    setQuery('')
    setIsSearching(false)
    setSearchResults([])
    persist('mv_query', '')
    searchInputRef.current?.focus()
  }

  function playMovie(item) {
    const isTV = !item.title && !!item.name
    const p = {
      src: isTV ? tvEmbedUrl(item.id, 1, 1) : movieEmbedUrl(item.id),
      title: isTV ? item.name : item.title,
      year: getYear(isTV ? item.first_air_date : item.release_date),
      rating: formatRating(item.vote_average),
      overview: item.overview?.slice(0, 220),
      selectedId: item.id,
      id: item.id,
      type: isTV ? 'tv' : 'movie',
      season: isTV ? 1 : undefined,
      episode: isTV ? 1 : undefined,
    }
    setPlayer(p)
    persist('mv_player', p)
    setTimeout(() => {
      playerAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  function closePlayer() {
    setPlayer(null)
    persist('mv_player', null)
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      {heroItem && !player && !isSearching && (
        <HeroBanner item={heroItem} type="movie" onPlay={playMovie} onInfo={playMovie} />
      )}

      {/* Player */}
      {player && (
        <div ref={playerAnchorRef} className={styles.playerSection}>
          <Player {...player} onClose={closePlayer} />
        </div>
      )}

      {/* Search bar */}
      <div className={styles.searchSection}>
        <form className={styles.searchForm} onSubmit={search}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              ref={searchInputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies…"
              className={styles.searchInput}
            />
            {query && (
              <button type="button" className={styles.clearBtn} onClick={clearSearch}>✕</button>
            )}
          </div>
        </form>
      </div>

      {/* Platforms filter */}
      {!isSearching && (
        <PlatformFilter selected={selectedPlatform} onChange={setSelectedPlatform} />
      )}

      {/* JioHotstar Sub-filters */}
      {!isSearching && selectedPlatform && (selectedPlatform.id === 'hotstar' || selectedPlatform.id === 'jio') && (
        <JioHotstarFilters active={activeSubFilter} onChange={setActiveSubFilter} />
      )}

      {/* Search results OR platform filter results OR browse rows */}
      {isSearching ? (
        <div className={styles.searchResults}>
          <h2 className={styles.searchTitle}>
            Results for "{query}"
            <button className={styles.backBtn} onClick={clearSearch}>← Back to browse</button>
          </h2>
          <MediaGrid
            items={searchResults}
            type="movie"
            loading={searchLoading}
            onSelect={playMovie}
            selectedId={player?.selectedId}
          />
        </div>
      ) : selectedPlatform ? (
        <div className={styles.searchResults}>
          <h2 className={styles.searchTitle}>
            {selectedPlatform.name} {activeSubFilter ? `(${activeSubFilter === 'serials' ? 'Serials' : activeSubFilter === 'news' ? 'News' : activeSubFilter === 'latest_2026' ? '2026' : activeSubFilter === 'indian_movies' ? 'Indian Movies' : 'Old Classics'})` : 'Movies'}
            <button className={styles.backBtn} onClick={() => setSelectedPlatform(null)}>← Back to browse</button>
          </h2>
          <MediaGrid
            items={platformResults}
            type={activeSubFilter === 'serials' || activeSubFilter === 'news' ? 'tv' : 'movie'}
            loading={platformLoading}
            onSelect={playMovie}
            selectedId={player?.selectedId}
          />
        </div>
      ) : (
        <div className={styles.rows}>
          <ContentRow
            title="Trending Now"
            items={trending}
            type="movie"
            onPlay={playMovie}
            loading={loading}
            delay={0}
          />
          <ContentRow
            title="Continue Watching"
            items={trending.slice(5, 15)}
            type="movie"
            onPlay={playMovie}
            loading={loading}
            delay={0.1}
            showProgress
          />
          <ContentRow
            title="Top Rated"
            items={topRated}
            type="movie"
            onPlay={playMovie}
            loading={loading}
            delay={0.2}
          />
          {GENRE_ROWS.map((g, i) => (
            <ContentRow
              key={g.id}
              title={g.name}
              items={genreRows[g.id] || []}
              type="movie"
              onPlay={playMovie}
              loading={!genreRows[g.id]}
              delay={0.3 + i * 0.08}
            />
          ))}
        </div>
      )}
    </div>
  )
}
