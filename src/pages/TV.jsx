import React, { useState, useEffect, useRef } from 'react'
import { api, tvEmbedUrl, formatRating, getYear } from '../lib/api.js'
import MediaGrid from '../components/MediaGrid.jsx'
import Player from '../components/Player.jsx'
import SeasonPicker from '../components/SeasonPicker.jsx'
import styles from './TV.module.css'

function persist(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)) } catch {} }
function hydrate(key) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null } }

export default function TV() {
  const [query, setQuery] = useState(() => hydrate('tv_query') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(() => hydrate('tv_selected'))
  const [player, setPlayer] = useState(null)
  const [showPicker, setShowPicker] = useState(false)
  const playerAnchorRef = useRef(null)
  const didRestore = useRef(false)

  // Load trending or restore last search
  useEffect(() => {
    const savedQuery = hydrate('tv_query') || ''
    if (savedQuery) {
      api.searchTV(savedQuery)
        .then(d => setResults(d.results || []))
        .finally(() => setLoading(false))
    } else {
      api.trendingTV()
        .then(d => setResults(d.results || []))
        .finally(() => setLoading(false))
    }
  }, [])

  // If user had a show selected + episode playing on last visit, restore it
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
    if (!q) return
    setLoading(true)
    setResults([])
    persist('tv_query', q)
    const d = await api.searchTV(q)
    setResults(d.results || [])
    setLoading(false)
  }

  function selectShow(item) {
    setSelected(item)
    persist('tv_selected', item)
    setShowPicker(true)
    setPlayer(null)
    setTimeout(() => {
      document.getElementById('season-picker-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
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
    }
    setPlayer(p)
    persist('tv_player', p)
    setTimeout(() => {
      playerAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <div>
      <form className={styles.searchRow} onSubmit={search}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search TV series…"
          className={styles.input}
        />
        <button type="submit" className={styles.btn}>Search</button>
      </form>

      {player && (
        <div ref={playerAnchorRef}>
          <Player {...player} onClose={() => { setPlayer(null); persist('tv_player', null) }} />
        </div>
      )}

      {selected && showPicker && (
        <div id="season-picker-anchor">
          <SeasonPicker show={selected} onPlay={handlePlay} />
        </div>
      )}

      <p className={styles.sectionLabel}>{hydrate('tv_query') ? 'Results' : 'Trending Now'}</p>
      <MediaGrid
        items={results}
        type="tv"
        loading={loading}
        onSelect={selectShow}
        selectedId={selected?.id}
      />
    </div>
  )
}
