/**
 * Static festival quotes
 * Organized by festival slug
 */
import quotesData from './quotes.json'

export const QUOTES = quotesData

/**
 * Get random quote for a festival
 */
export function getRandomQuote(festivalSlug) {
  const festivalQuotes = QUOTES[festivalSlug]
  if (!festivalQuotes || festivalQuotes.length === 0) return null

  const randomIndex = Math.floor(Math.random() * festivalQuotes.length)
  return festivalQuotes[randomIndex]
}

/**
 * Get all quotes for a festival
 */
export function getAllQuotes(festivalSlug) {
  return QUOTES[festivalSlug] || []
}

/**
 * Check if quotes exist for a festival
 */
export function hasQuotes(festivalSlug) {
  return getAllQuotes(festivalSlug).length > 0
}
