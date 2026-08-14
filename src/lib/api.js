export const TMDB_KEY = import.meta.env.VITE_TMDB_KEY
export const EMBED_API_KEY = import.meta.env.VITE_EMBED_API_KEY
export const EMBED_BASE = 'https://api.codespecters.com'
export const IMG_BASE = 'https://image.tmdb.org/t/p/w300'
export const IMG_BASE_LG = 'https://image.tmdb.org/t/p/w780'

async function tmdbFetch(path) {
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`https://api.themoviedb.org/3${path}${sep}api_key=${TMDB_KEY}`)
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

export function formatRating(rating) {
  if (!rating) return null
  return parseFloat(rating).toFixed(1)
}

export function getYear(dateStr) {
  return (dateStr || '').slice(0, 4)
}
