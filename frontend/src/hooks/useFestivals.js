import { useQuery } from '@tanstack/react-query'
import { festivalApi } from '../services/api'

export function useFestivals(params) {
  return useQuery({
    queryKey: ['festivals', params],
    queryFn: () => festivalApi.getAll(params).then((res) => res.data),
  })
}

export function useFestival(id) {
  return useQuery({
    queryKey: ['festival', id],
    queryFn: () => festivalApi.getById(id).then((res) => res.data),
    enabled: !!id,
  })
}

export function useFestivalBySlug(slug) {
  return useQuery({
    queryKey: ['festival-slug', slug],
    queryFn: () => festivalApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  })
}

export function useRandomContent(festivalId, relationshipId) {
  return useQuery({
    queryKey: ['random-content', festivalId, relationshipId],
    queryFn: () =>
      festivalApi.getRandomContent(festivalId, relationshipId).then((res) => res.data),
    enabled: !!festivalId,
    staleTime: 0, // Always fetch fresh for randomness
    cacheTime: 0,
  })
}
