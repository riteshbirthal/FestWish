import { useQuery } from '@tanstack/react-query'
import { relationshipApi } from '../services/api'

export function useRelationships(category) {
  return useQuery({
    queryKey: ['relationships', category],
    queryFn: () => relationshipApi.getAll(category).then((res) => res.data),
  })
}

export function useRelationshipCategories() {
  return useQuery({
    queryKey: ['relationship-categories'],
    queryFn: () => relationshipApi.getCategories().then((res) => res.data),
  })
}
