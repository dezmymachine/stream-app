import type { Route } from './+types/movie-page'
import { Play, Star, X } from 'lucide-react'
import { getMovieDetails } from '~/services/movie_details'
import type { Movie } from '~/types/tmdb'
import { useState } from 'react'

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { data } = await getMovieDetails(Number(params.id))
  return data
}

export function HydrateFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <div className="h-5 w-32 animate-pulse rounded bg-neutral-800" />
    </div>
  )
}

//how do I dynamically set the title

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AltFlix" },
    { name: "description", content: "Stream all your fav movies and tv shows anywhere and on any device for free!" },
  ];
}

export default function MovieDetails({ loaderData }: Route.ComponentProps) {
  const movie: Movie = loaderData

  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const imdbId = loaderData.imdb_id

  return (
    <main className="relative min-h-screen bg-black text-white">
      <section className="relative h-[70vh] md:h-[80vh]">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie?.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 px-4 text-center md:items-start md:text-left">
            <button
              onClick={openModal}
              className="group flex mx-auto h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110 active:scale-100"
            >
              <Play size={36} className="translate-x-1" fill="black" />
            </button>            <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="text-sm font-medium">{movie.release_date.slice(0, 4)}</span>
              <span className="text-white/50">•</span>
              <span className="text-sm font-medium">{movie.runtime} min</span>
              <span className="text-white/50">•</span>
              {movie.genres.map((g: any) => (
                <span
                  key={g.id}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" size={20} fill="currentColor" />
              <span className="text-lg font-semibold">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-white/60">({movie.vote_count} votes)</span>
            </div>


          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-6 py-12 md:px-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="mb-6 text-lg leading-relaxed text-white/90">
              {movie?.overview}
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <strong className="text-white/70">Release&nbsp;Date</strong>
              <p>{movie.release_date}</p>
            </div>
            <div>
              <strong className="text-white/70">Budget</strong>
              <p>${movie.budget.toLocaleString()}</p>
            </div>
            <div>
              <strong className="text-white/70">Revenue</strong>
              <p>${movie.revenue.toLocaleString()}</p>
            </div>
            <div>
              <strong className="text-white/70">Production</strong>
              <p>{movie.production_companies.map((p: any) => p.name).join(', ')}</p>
            </div>
          </div>
        </div>
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
              src={`https://vidsrc.to/embed/movie/${imdbId}`}
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
