export const TMDB_KEY = import.meta.env.VITE_TMDB_KEY
export const EMBED_API_KEY = import.meta.env.VITE_EMBED_API_KEY
export const EMBED_BASE = 'https://api.codespecters.com'
export const IMG_BASE = 'https://image.tmdb.org/t/p/w300'
export const IMG_BASE_LG = 'https://image.tmdb.org/t/p/w780'
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

export let currentLang = sessionStorage.getItem('cs_lang') || 'hi-IN'

async function tmdbFetch(path) {
  const sep = path.includes('?') ? '&' : '?'
  const langParam = path.includes('language=') ? '' : `&language=${currentLang}`
  const res = await fetch(`https://api.themoviedb.org/3${path}${sep}api_key=${TMDB_KEY}${langParam}`)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export const api = {
  trendingMovies: () => tmdbFetch('/trending/movie/week'),
  trendingTV: () => tmdbFetch('/trending/tv/week'),
  searchMovies: (q) => tmdbFetch(`/search/movie?query=${encodeURIComponent(q)}`),
  searchTV: (q) => tmdbFetch(`/search/tv?query=${encodeURIComponent(q)}`),
  movieDetails: (id) => tmdbFetch(`/movie/${id}`),
  tvDetails: (id) => tmdbFetch(`/tv/${id}`),
  seasonDetails: (id, season) => tmdbFetch(`/tv/${id}/season/${season}`),
  movieGenres: () => tmdbFetch('/genre/movie/list'),
  tvGenres: () => tmdbFetch('/genre/tv/list'),
  discoverMovies: (genreIds = [], sortBy = 'popularity.desc', page = 1, watchProviders = '', extraParams = {}) => {
    let path = `/discover/movie?sort_by=${sortBy}&page=${page}`
    if (genreIds.length) path += `&with_genres=${genreIds.join(',')}`
    if (watchProviders) path += `&with_watch_providers=${watchProviders}&watch_region=IN`
    Object.keys(extraParams).forEach(k => {
      path += `&${k}=${encodeURIComponent(extraParams[k])}`
    })
    return tmdbFetch(path)
  },
  discoverTV: (genreIds = [], sortBy = 'popularity.desc', page = 1, watchProviders = '', extraParams = {}) => {
    let path = `/discover/tv?sort_by=${sortBy}&page=${page}`
    if (genreIds.length) path += `&with_genres=${genreIds.join(',')}`
    if (watchProviders) path += `&with_watch_providers=${watchProviders}&watch_region=IN`
    Object.keys(extraParams).forEach(k => {
      path += `&${k}=${encodeURIComponent(extraParams[k])}`
    })
    return tmdbFetch(path)
  },
  setLanguage: (lang) => {
    currentLang = lang
    sessionStorage.setItem('cs_lang', lang)
  },
  getLanguage: () => currentLang,
}

export function movieEmbedUrl(tmdbId) {
  return `${EMBED_BASE}/embed/movie/${tmdbId}?apikey=${EMBED_API_KEY}`
}

export function tvEmbedUrl(tmdbId, season, episode) {
  return `${EMBED_BASE}/embed/tv/${tmdbId}/${season}/${episode}?apikey=${EMBED_API_KEY}`
}

export function posterUrl(path, large = false) {
  if (!path) return null
  return (large ? IMG_BASE_LG : IMG_BASE) + path
}

export function backdropUrl(path) {
  if (!path) return null
  return BACKDROP_BASE + path
}

export function formatRating(rating) {
  if (!rating) return null
  return parseFloat(rating).toFixed(1)
}

export function getYear(dateStr) {
  return (dateStr || '').slice(0, 4)
}

export function ratingColor(rating) {
  const r = parseFloat(rating)
  if (r >= 7) return 'var(--rating-good)'
  if (r >= 5) return 'var(--rating-mid)'
  return 'var(--rating-low)'
}

