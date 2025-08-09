import type { Route } from './+types/tv-page'
import { Play, Star, X } from 'lucide-react'
import type { TvShow } from '~/types/tmdb'
import { getTvDetails } from '~/services/movie_details'
import { useState } from 'react'

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { data } = await getTvDetails(Number(params.id))
  return data
}

export function HydrateFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <div className="h-5 w-32 animate-pulse rounded bg-neutral-800" />
    </div>
  )
}

export default function TvShowDetails({ loaderData }: Route.ComponentProps) {
  const show: TvShow = loaderData
  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const imdbId = loaderData.imdb_id

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative h-[70vh] md:h-[80vh]">
        <img
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
          alt={show.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 flex w-full items-end">
          <div className="container mx-auto max-w-7xl px-6 pb-16 md:px-12">
            <h1 className="text-4xl font-bold md:text-6xl">{show.name}</h1>
            <p className="mt-2 text-sm text-white/70">
              {show.first_air_date.slice(0, 4)} • {show.number_of_episodes} Episodes •{' '}
              {show.genres.map((g: any) => g.name).join(', ')}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={openModal}
                className="group flex h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110 active:scale-100"
              >
                <Play size={36} className="translate-x-1" fill="black" />
              </button>             </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-6 py-12 md:px-12">
        <p className="max-w-3xl text-lg leading-relaxed text-white/90">
          {show.overview}
        </p>

        {show.tagline && (
          <p className="mt-4 text-xl italic text-white/60">
            “{show.tagline}”
          </p>
        )}
      </section>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
            }}
          >
            <iframe
              src={`https://vidsrc.to/embed/tv/${show.id}`}
              allowFullScreen
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                outline: 'none',
              }}
            />
            <X
              size={32}
              color="white"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                cursor: 'pointer',
              }}
              onClick={closeModal}
            />
          </div>
        </div>
      )}
    </main>
  )
}
