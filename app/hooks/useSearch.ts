import { useQuery } from '@tanstack/react-query'
import { multiSearch } from '~/services/search/search'

export function useSearch(q: string) {
  return useQuery({
    queryKey: ['search', q],
    queryFn: () => multiSearch(q),
    enabled: q.trim().length > 0,
    staleTime: 1000 * 60 * 3,
  })
}
