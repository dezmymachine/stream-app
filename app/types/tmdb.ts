export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  runtime: number
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  budget: number
  revenue: number
  production_companies: { name: string }[]
  genre_ids: number[]
  genres: { name: string }[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface Trending {
  media_type: string
  backdrop_path: string | null
  id: number
  overview: string
  poster_path: string | null
  title?: string
  name?: string
  release_date: string
  vote_average: number
  adult: boolean
  first_air_date: string
}

export interface TvShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  number_of_seasons: number
  number_of_episodes: number
  tagline: string
  genres: { name: string }[]
  seasons: { name: string }[]
  original_name: string
  popularity: number
  origin_country: string[]
}

export interface Person {
  id: number
  name: string
  profile_path: string | null
  adult: boolean
  known_for: (Movie | TvShow)[]
  known_for_department: string
  popularity: number
}

export type SearchResult =
  | (Movie & { media_type: "movie" })
  | (TvShow & { media_type: "tv" })
  | (Person & { media_type: "person" })

export interface TrendingResponse {
  page: number
  results: (Movie | TvShow)[]
  total_pages: number
  total_results: number
}

export interface SearchResponse {
  page: number
  results: SearchResult[]
  total_pages: number
  total_results: number
}
