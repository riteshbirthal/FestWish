/**
 * Static relationship data
 * Imported from database - contains all relationship types
 */
import relationshipsData from './relationships.json'

export const RELATIONSHIPS = relationshipsData

/**
 * Get relationship by ID
 */
export function getRelationshipById(id) {
  return RELATIONSHIPS.find(r => r.id === id)
}

/**
 * Get relationships by category
 */
export function getRelationshipsByCategory(category) {
  if (!category) return RELATIONSHIPS
  return RELATIONSHIPS.filter(r => r.category === category)
}

/**
 * Get all unique categories
 */
export function getAllCategories() {
  return [...new Set(RELATIONSHIPS.map(r => r.category).filter(Boolean))]
}

/**
 * Get relationship by name
 */
export function getRelationshipByName(name) {
  return RELATIONSHIPS.find(r => r.name.toLowerCase() === name.toLowerCase())
}
