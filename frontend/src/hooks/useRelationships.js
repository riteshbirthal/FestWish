import { useMemo } from 'react'
import { 
  RELATIONSHIPS, 
  getRelationshipsByCategory,
  getAllCategories 
} from '../data/relationships'

/**
 * Get all relationships (instant, no API call)
 * Optionally filter by category
 */
export function useRelationships(category) {
  const data = useMemo(() => {
    const relationships = getRelationshipsByCategory(category)
    return {
      relationships,
      total: relationships.length
    }
  }, [category])

  return {
    data,
    isLoading: false,
    error: null
  }
}

/**
 * Get all relationship categories
 */
export function useRelationshipCategories() {
  const data = useMemo(() => {
    return {
      categories: getAllCategories()
    }
  }, [])

  return {
    data,
    isLoading: false,
    error: null
  }
}
