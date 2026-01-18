/**
 * Static festival data
 * Imported from database - contains all festival information
 */
import festivalsData from './festivals.json'

export const FESTIVALS = festivalsData

/**
 * Get festival by ID
 */
export function getFestivalById(id) {
  return FESTIVALS.find(f => f.id === id)
}

/**
 * Get festival by slug
 */
export function getFestivalBySlug(slug) {
  return FESTIVALS.find(f => f.slug === slug)
}

/**
 * Get festivals by culture/religion
 */
export function getFestivalsByCulture(culture) {
  return FESTIVALS.filter(f => f.religion_culture === culture)
}

/**
 * Get all unique cultures
 */
export function getAllCultures() {
  return [...new Set(FESTIVALS.map(f => f.religion_culture).filter(Boolean))]
}

/**
 * Search festivals by name or description
 */
export function searchFestivals(query) {
  const lowerQuery = query.toLowerCase()
  return FESTIVALS.filter(f => 
    f.name.toLowerCase().includes(lowerQuery) ||
    f.description?.toLowerCase().includes(lowerQuery)
  )
}
