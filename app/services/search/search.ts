const TMDB_ACCESS_TOKEN = import.meta.env.VITE_API_TOKEN
const TMDB_API_KEY = import.meta.env.VITE_API_KEY

export async function multiSearch(query: string, page = 1) {
  const url = new URL(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}`)
  url.searchParams.set('query', query.trim())
  url.searchParams.set('page', String(page))

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
  })
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}
