/*import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { Play } from 'lucide-react'
import { Badge } from './ui/badge'
import { Link } from 'react-router'
import { getAllTrending } from '~/services/trending'

const fetchTrending = async () => {
  const { data } = await getAllTrending()
  return data.results.slice(0, 6)
}

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { isPending, isError, data: movies = [] } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending,
  })

  useEffect(() => {
    if (!movies.length || isPaused) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % movies.length)
    }, 5000)
    return () => clearInterval(intervalRef.current!)
  }, [movies.length, isPaused])

  const next = () => setCurrentIndex((p) => (p + 1) % movies.length)
  const prev = () =>
    setCurrentIndex((p) => (p - 1 + movies.length) % movies.length)

  if (isPending || isError) return <Skeleton />

  const active = movies[currentIndex]
  if (!active) return null

  const year = new Date(
    active.release_date || active.first_air_date || ''
  ).getFullYear()

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={`https://image.tmdb.org/t/p/original${active.backdrop_path}`}
          alt={active.title || active.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex h-full w-full items-end pb-[15vh] lg:pb-[10vh]">
        <div className="container mx-auto flex w-full flex-col gap-4 px-6 text-white md:px-12 lg:max-w-7xl lg:px-16">
          <Badge className='bg-transparent border border-white'>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {active.media_type}
            </span>
          </Badge>

          <h1 className="text-3xl font-bold md:text-5xl lg:text-7xl">
            {active.title || active.name}
          </h1>

          <p className="max-w-xl text-sm line-clamp-3 leading-relaxed text-white/90 md:text-base">
            {active.overview}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <span>{year}</span>
            <span className="text-white/50">•</span>
            <span>{active.adult ? '18+' : 'PG'}</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            {active.media_type === 'tv' && (
              <Link to={`/tv/${active.id}`}>
                <button className="apple-button bg-white text-black">
                  <Play size={18} fill="black" />
                  Play
                </button>
              </Link>
            )}
            {active.media_type === 'movie' && (
              <Link to={`/movie/${active.id}`}>
                <button className="apple-button bg-white text-black">
                  <Play size={18} fill="black" />
                  Play
                </button>
              </Link>
            )}

          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="apple-arrow left-4"
        aria-label="Previous"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button onClick={next} className="apple-arrow right-4" aria-label="Next">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          {movies.map((_: any, idx: any) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              aria-label={`Go to ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}*/

/*const Skeleton = () => (
  <div className="flex h-screen w-full items-center justify-center bg-neutral-900">
    <div className="h-5 w-32 animate-pulse rounded bg-neutral-700" />
  </div>
)*/

import useSWR from 'swr'
import { useState, useEffect, useRef } from 'react'
import { Play } from 'lucide-react'
import { Badge } from './ui/badge'
import { Link } from 'react-router'
import { getAllTrending } from '~/services/trending'

const fetcher = async () => {
  const { data } = await getAllTrending()
  return data.results.slice(0, 6)
}

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { data: movies = [], error, isLoading } = useSWR('trending', fetcher, {
    revalidateOnFocus: false,
  })

  // Preload first image
  useEffect(() => {
    if (movies.length > 0) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = `https://image.tmdb.org/t/p/original/${movies[0].backdrop_path}`
      document.head.appendChild(link)
      return () => link.remove()
    }
  }, [movies])

  // Slideshow interval
  useEffect(() => {
    if (!movies.length || isPaused) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % movies.length)
      setImageLoaded(false) // Reset for next image
    }, 5000)
    return () => clearInterval(intervalRef.current!)
  }, [movies.length, isPaused])

  const next = () => {
    setCurrentIndex((p) => (p + 1) % movies.length)
    setImageLoaded(false)
  }
  const prev = () => {
    setCurrentIndex((p) => (p - 1 + movies.length) % movies.length)
    setImageLoaded(false)
  }

  if (isLoading || error) return <Skeleton />

  const active = movies[currentIndex]
  if (!active) return null

  const year = new Date(
    active.release_date || active.first_air_date || ''
  ).getFullYear()

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={`https://image.tmdb.org/t/p/original/${active.backdrop_path}`}
          alt={active.title || active.name}
          className={`h-full w-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          draggable={false}
          loading="eager"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex h-full w-full items-end pb-[15vh] lg:pb-[10vh]">
        <div className="container mx-auto flex w-full flex-col gap-4 px-6 text-white md:px-12 lg:max-w-7xl lg:px-16">
          <Badge className='bg-transparent border border-white'>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {active.media_type}
            </span>
          </Badge>

          <h1 className="text-3xl font-bold md:text-5xl lg:text-7xl">
            {active.title || active.name}
          </h1>

          <p className="max-w-xl text-sm line-clamp-3 leading-relaxed text-white/90 md:text-base">
            {active.overview}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <span>{year}</span>
            <span className="text-white/50">•</span>
            <span>{active.adult ? '18+' : 'PG'}</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            {active.media_type === 'tv' && (
              <Link to={`/tv/${active.id}`}>
                <button className="apple-button bg-white text-black">
                  <Play size={18} fill="black" />
                  Play
                </button>
              </Link>
            )}
            {active.media_type === 'movie' && (
              <Link to={`/movie/${active.id}`}>
                <button className="apple-button bg-white text-black">
                  <Play size={18} fill="black" />
                  Play
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="apple-arrow left-4"
        aria-label="Previous"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button onClick={next} className="apple-arrow right-4" aria-label="Next">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          {movies.map((_: any, idx: any) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              aria-label={`Go to ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const Skeleton = () => (
  <div className="flex h-screen w-full items-center justify-center bg-neutral-900">
    <div className="h-5 w-32 animate-pulse rounded bg-neutral-700" />
  </div>
)
