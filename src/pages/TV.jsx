import React, { useState, useEffect, useRef } from 'react'
import { api, tvEmbedUrl, movieEmbedUrl, formatRating, getYear } from '../lib/api.js'
import HeroBanner from '../components/HeroBanner.jsx'
import ContentRow from '../components/ContentRow.jsx'
import Player from '../components/Player.jsx'
import SeasonPicker from '../components/SeasonPicker.jsx'
import MediaGrid from '../components/MediaGrid.jsx'
import PlatformFilter from '../components/PlatformFilter.jsx'
import JioHotstarFilters from '../components/JioHotstarFilters.jsx'
import styles from './TV.module.css'

// TV Genre IDs for specific rows
const TV_GENRE_ROWS = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 35, name: 'TV Comedies' },
  { id: 18, name: 'TV Dramas' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 968, name: 'Mystery' }
]

function persist(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)) } catch {} }
function hydrate(key) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null } }

export default function TV() {
  const savedQuery = hydrate('tv_query') || ''
  const savedPlayer = hydrate('tv_player')

  const [query, setQuery] = useState(savedQuery)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(!!savedQuery)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selected, setSelected] = useState(() => hydrate('tv_selected'))
  const [player, setPlayer] = useState(savedPlayer)
  const [showPicker, setShowPicker] = useState(false)

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

  // Fetch TV shows/movies for selected watch platform and sub-category
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
        fetchPromise = api.discoverTV([], 'popularity.desc', 1, selectedPlatform.providerId, { first_air_date_year: 2026 })
      } else if (activeSubFilter === 'indian_movies') {
        fetchPromise = api.discoverMovies([], 'popularity.desc', 1, selectedPlatform.providerId, { with_original_language: 'hi|te|ta|ml|kn|pa|bn' })
      } else if (activeSubFilter === 'old_movies') {
        fetchPromise = api.discoverMovies([], 'popularity.desc', 1, selectedPlatform.providerId, {
          with_original_language: 'hi',
          'release_date.lte': '2000-01-01'
        })
      }
    } else {
      fetchPromise = api.discoverTV([], 'popularity.desc', 1, selectedPlatform.providerId)
    }

    fetchPromise
      .then(d => setPlatformResults(d.results || []))
      .finally(() => setPlatformLoading(false))
  }, [selectedPlatform, activeSubFilter])

  const playerAnchorRef = useRef(null)
  const searchInputRef = useRef(null)
  const didRestore = useRef(false)

  // Load all rows on mount
  useEffect(() => {
    Promise.all([
      api.trendingTV(),
      api.discoverTV([], 'vote_average.desc'),
    ]).then(([trendData, topData]) => {
      const t = trendData.results || []
      setTrending(t)
      setTopRated(topData.results || [])
      // Pick random hero from top 5 trending
      if (t.length) setHeroItem(t[Math.floor(Math.random() * Math.min(5, t.length))])
    }).finally(() => setLoading(false))

    // Load genre rows
    TV_GENRE_ROWS.forEach(g => {
      api.discoverTV([g.id], 'popularity.desc')
        .then(d => {
          setGenreRows(prev => ({ ...prev, [g.id]: d.results || [] }))
        })
        .catch(() => {})
    })

    // Restore search
    if (savedQuery) {
      setSearchLoading(true)
      api.searchTV(savedQuery)
        .then(d => setSearchResults(d.results || []))
        .finally(() => setSearchLoading(false))
    }
  }, [])

  // Restore player state
  useEffect(() => {
    if (didRestore.current) return
    const savedPlayer = hydrate('tv_player')
    if (savedPlayer) {
      setPlayer(savedPlayer)
      setShowPicker(false)
      didRestore.current = true
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
    persist('tv_query', q)
    const d = await api.searchTV(q)
    setSearchResults(d.results || [])
    setSearchLoading(false)
  }

  function clearSearch() {
    setQuery('')
    setIsSearching(false)
    setSearchResults([])
    persist('tv_query', '')
    searchInputRef.current?.focus()
  }

  function selectShow(item) {
    const isTV = !item.title && (!!item.name || !!item.first_air_date)
    if (isTV) {
      setSelected(item)
      persist('tv_selected', item)
      setShowPicker(true)
      setPlayer(null)
      setTimeout(() => {
        document.getElementById('season-picker-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    } else {
      const p = {
        src: movieEmbedUrl(item.id),
        title: item.title,
        year: getYear(item.release_date),
        rating: formatRating(item.vote_average),
        overview: item.overview?.slice(0, 220),
        selectedId: item.id,
        id: item.id,
        type: 'movie',
      }
      setPlayer(p)
      persist('tv_player', p)
      setTimeout(() => {
        playerAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }

  function handlePlay(season, episode) {
    if (!selected) return
    const p = {
      src: tvEmbedUrl(selected.id, season, episode),
      title: selected.name,
      year: getYear(selected.first_air_date),
      rating: formatRating(selected.vote_average),
      overview: selected.overview?.slice(0, 220),
      badge: `S${season} · E${episode}`,
      selectedId: selected.id,
      id: selected.id,
      type: 'tv',
      season,
      episode,
    }
    setPlayer(p)
    persist('tv_player', p)
    setTimeout(() => {
      playerAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  function handleHeroPlay(item) {
    selectShow(item)
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      {heroItem && !player && !isSearching && (
        <HeroBanner item={heroItem} type="tv" onPlay={handleHeroPlay} onInfo={selectShow} />
      )}

      {/* Player */}
      {player && (
        <div ref={playerAnchorRef} className={styles.playerSection}>
          <Player {...player} onClose={() => { setPlayer(null); persist('tv_player', null) }} />
        </div>
      )}

      {/* Season Picker */}
      {selected && showPicker && !isSearching && (
        <div id="season-picker-anchor" className={styles.pickerSection}>
          <SeasonPicker show={selected} onPlay={handlePlay} />
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
              placeholder="Search TV series…"
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
            type="tv"
            loading={searchLoading}
            onSelect={selectShow}
            selectedId={selected?.id}
          />
        </div>
      ) : selectedPlatform ? (
        <div className={styles.searchResults}>
          <h2 className={styles.searchTitle}>
            {selectedPlatform.name} {activeSubFilter ? `(${activeSubFilter === 'serials' ? 'Serials' : activeSubFilter === 'news' ? 'News' : activeSubFilter === 'latest_2026' ? '2026' : activeSubFilter === 'indian_movies' ? 'Indian Movies' : 'Old Classics'})` : 'TV Shows'}
            <button className={styles.backBtn} onClick={() => setSelectedPlatform(null)}>← Back to browse</button>
          </h2>
          <MediaGrid
            items={platformResults}
            type={activeSubFilter === 'serials' || activeSubFilter === 'news' || !activeSubFilter ? 'tv' : 'movie'}
            loading={platformLoading}
            onSelect={selectShow}
            selectedId={selected?.id}
          />
        </div>
      ) : (
        <div className={styles.rows}>
          <ContentRow
            title="Trending TV Shows"
            items={trending}
            type="tv"
            onPlay={selectShow}
            onInfo={selectShow}
            loading={loading}
            delay={0}
          />
          <ContentRow
            title="Continue Watching"
            items={trending.slice(5, 15)}
            type="tv"
            onPlay={selectShow}
            onInfo={selectShow}
            loading={loading}
            delay={0.1}
            showProgress
          />
          <ContentRow
            title="Top Rated TV Shows"
            items={topRated}
            type="tv"
            onPlay={selectShow}
            onInfo={selectShow}
            loading={loading}
            delay={0.2}
          />
          {TV_GENRE_ROWS.map((g, i) => (
            <ContentRow
              key={g.id}
              title={g.name}
              items={genreRows[g.id] || []}
              type="tv"
              onPlay={selectShow}
              onInfo={selectShow}
              loading={!genreRows[g.id]}
              delay={0.3 + i * 0.08}
            />
          ))}
        </div>
      )}
    </div>
  )
}
