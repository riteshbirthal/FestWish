/**
 * Static message templates
 * Organized by festival slug -> relationship name -> messages array
 */
import messageTemplatesData from './messageTemplates.json'

export const MESSAGE_TEMPLATES = messageTemplatesData

/**
 * Get random message for festival and relationship
 */
export function getRandomMessage(festivalSlug, relationshipName) {
  const festivalMessages = MESSAGE_TEMPLATES[festivalSlug]
  if (!festivalMessages) return null

  const relationshipMessages = festivalMessages[relationshipName]
  if (!relationshipMessages || relationshipMessages.length === 0) return null

  const randomIndex = Math.floor(Math.random() * relationshipMessages.length)
  return relationshipMessages[randomIndex]
}

/**
 * Get all messages for a festival-relationship combination
 */
export function getAllMessages(festivalSlug, relationshipName) {
  return MESSAGE_TEMPLATES[festivalSlug]?.[relationshipName] || []
}

/**
 * Get messages by tone
 */
export function getMessagesByTone(festivalSlug, relationshipName, tone) {
  const messages = getAllMessages(festivalSlug, relationshipName)
  return messages.filter(m => m.tone === tone)
}

/**
 * Get available tones for a festival-relationship combination
 */
export function getAvailableTones(festivalSlug, relationshipName) {
  const messages = getAllMessages(festivalSlug, relationshipName)
  return [...new Set(messages.map(m => m.tone))]
}

/**
 * Check if messages exist for a combination
 */
export function hasMessages(festivalSlug, relationshipName) {
  return getAllMessages(festivalSlug, relationshipName).length > 0
}
