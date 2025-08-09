import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon, X, Clock, TrendingUp } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

const TMDB_API_KEY = import.meta.env.VITE_API_KEY
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_API_TOKEN

// Type definitions
interface TMDBSearchResult {
  id: number
  title?: string
  name?: string
  media_type: 'movie' | 'tv' | 'person'
  release_date?: string
  first_air_date?: string
  poster_path?: string
}

interface TMDBResponse {
  results: TMDBSearchResult[]
  total_pages: number
  total_results: number
}

interface SearchResult {
  id: number
  title: string
  type: 'movie' | 'tv'
  year?: number
  poster_path?: string
}

async function multiSearch(query: string, page = 1): Promise<TMDBResponse> {
  const url = new URL(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}`)
  url.searchParams.set('query', query.trim())
  url.searchParams.set('page', String(page))

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
  })
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

async function fetchTrending(): Promise<TMDBResponse> {
  const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`, {
    headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
  })
  if (!res.ok) throw new Error('Failed to fetch trending')
  return res.json()
}

export default function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const { data: trendingData } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending,
    staleTime: 60 * 60 * 1000, // 1 hour
  })

  const trending = (trendingData?.results ?? [])
    .slice(0, 8)
    .map((r: TMDBSearchResult) => r.title || r.name)
    .filter((title): title is string => Boolean(title))

  /* recent searches (persist if you like) */
  const [recentSearches] = useState(['Foundation', 'The Morning Show', 'Ted Lasso', 'Severance'])

  /* keyboard & scroll lock */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && close()
    if (isOpen) {
      document.addEventListener('keydown', esc)
      document.body.style.overflow = 'hidden'
      inputRef.current?.focus()
    }
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  /* debounced search */
  useEffect(() => {
    if (!query.trim()) return setResults([])

    const id = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data = await multiSearch(query)
        const mapped: SearchResult[] = data.results
          .filter((r: TMDBSearchResult) => r.media_type === 'movie' || r.media_type === 'tv')
          .map((r: TMDBSearchResult) => ({
            id: r.id,
            title: r.title || r.name || 'Unknown Title',
            type: r.media_type === 'movie' ? 'movie' : 'tv',
            year: Number((r.release_date || r.first_air_date || '').slice(0, 4)) || undefined,
            poster_path: r.poster_path,
          }))
        setResults(mapped)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(id)
  }, [query])

  const open = () => setIsOpen(true)
  const close = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  const handleSelect = (r: SearchResult) => {
    navigate(`/${r.type}/${r.id}`)
    close()
  }

  /* ---------- render ---------- */
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={open}
        className={cn('h-9 w-9 p-0 text-white/80 hover:text-white hover:bg-white/10', className)}
        aria-label="Open search"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          className={cn(
            'fixed inset-0 z-50 bg-black/95 backdrop-blur-md transition-all duration-300',
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          )}
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="container mx-auto px-4 py-8 h-full">
            {/* header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1 max-w-2xl">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for movies, TV shows, and more..."
                  className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  onKeyDown={(e) => e.key === 'Enter' && results[0] && handleSelect(results[0])}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                className="h-10 w-10 p-0 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)] overflow-hidden">
              {/* main */}
              <div className="lg:col-span-2 overflow-y-auto">
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  </div>
                )}

                {query && results.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-6">
                      Search Results for "{query}"
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {results.map((r) => (
                        <div
                          key={`${r.type}-${r.id}`}
                          className="group cursor-pointer transition-transform hover:scale-105"
                          onClick={() => handleSelect(r)}
                        >
                          <div className="aspect-[2/3] bg-neutral-800 rounded-md overflow-hidden mb-2">
                            <img
                              src={
                                r.poster_path
                                  ? `https://image.tmdb.org/t/p/w92${r.poster_path}`
                                  : '/placeholder.svg'
                              }
                              alt={r.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="text-sm font-medium line-clamp-2">{r.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="text-xs bg-white/20">
                              {r.type === 'movie' ? 'Movie' : 'TV'}
                            </Badge>
                            {r.year && <span className="text-white/60 text-xs">{r.year}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {query && !isLoading && results.length === 0 && (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-white/60">Try searching for something else</p>
                  </div>
                )}

                {!query && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-white/80" />
                        <h3 className="text-xl font-semibold">Trending Now</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trending.map((t: string) => (
                          <Button
                            key={t}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setQuery(t)
                              inputRef.current?.focus()
                            }}
                            className="border-white/20 text-white hover:bg-white/10 rounded-full"
                          >
                            {t}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {recentSearches.length > 0 && (
                      <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="h-4 w-4 text-white/80" />
                          <h4 className="font-semibold">Recent Searches</h4>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setQuery(s)
                                inputRef.current?.focus()
                              }}
                              className="block w-full text-left text-white/80 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* sidebar */}
              <div className="hidden lg:block space-y-6">
                <h4 className="font-semibold mb-4">Quick Filters</h4>
                {['Movies', 'TV Shows', 'New Releases', 'Top Rated'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setQuery(f)
                      inputRef.current?.focus()
                    }}
                    className="block w-full text-left text-white/80 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
