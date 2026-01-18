import { useMemo } from 'react'
import * as React from 'react'
import { 
  FESTIVALS, 
  getFestivalById, 
  getFestivalBySlug 
} from '../data/festivals'
import { getRandomMessage } from '../data/messageTemplates'
import { getRandomQuote } from '../data/quotes'
import { getRelationshipById } from '../data/relationships'

/**
 * Get all festivals (instant, no API call)
 */
export function useFestivals(params) {
  const data = useMemo(() => {
    let filtered = [...FESTIVALS]
    
    // Apply filters if provided
    if (params?.culture) {
      filtered = filtered.filter(f => f.religion_culture === params.culture)
    }
    if (params?.month) {
      filtered = filtered.filter(f => f.typical_month === params.month)
    }
    
    return {
      festivals: filtered,
      total: filtered.length
    }
  }, [params])

  return {
    data,
    isLoading: false,
    error: null
  }
}

/**
 * Get festival by ID (instant)
 */
export function useFestival(id) {
  const data = useMemo(() => {
    if (!id) return null
    return getFestivalById(id)
  }, [id])

  return {
    data,
    isLoading: false,
    error: data ? null : new Error('Festival not found')
  }
}

/**
 * Get festival by slug (instant)
 */
export function useFestivalBySlug(slug) {
  const data = useMemo(() => {
    if (!slug) return null
    const festival = getFestivalBySlug(slug)
    
    // Add quotes and images arrays for backward compatibility
    if (festival) {
      return {
        ...festival,
        quotes: [],  // Quotes handled separately now
        images: festival.image_url ? [{ id: '1', image_url: festival.image_url, alt_text: festival.name }] : []
      }
    }
    return null
  }, [slug])

  return {
    data,
    isLoading: false,
    error: data ? null : new Error('Festival not found')
  }
}

/**
 * Get random content (message, quote, image) - client-side randomization
 * Uses state to allow triggering new random content
 */
export function useRandomContent(festivalId, relationshipId) {
  const [refreshKey, setRefreshKey] = React.useState(0)
  
  const data = useMemo(() => {
    if (!festivalId) return null
    
    const festival = getFestivalById(festivalId)
    if (!festival) return null
    
    // Get random message if relationship provided
    let message = null
    if (relationshipId) {
      const relationship = getRelationshipById(relationshipId)
      if (relationship) {
        const randomMsg = getRandomMessage(festival.slug, relationship.name)
        if (randomMsg) {
          message = {
            message_text: randomMsg.text,
            tone: randomMsg.tone
          }
        }
      }
    }
    
    // Get random quote
    const randomQuoteData = getRandomQuote(festival.slug)
    const quote = randomQuoteData ? {
      quote_text: randomQuoteData.text,
      author: randomQuoteData.author
    } : null
    
    // Get image
    const image = festival.image_url ? {
      image_url: festival.image_url,
      alt_text: festival.name
    } : null
    
    return {
      message,
      quote,
      image
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [festivalId, relationshipId, refreshKey])

  // Function to trigger new random content
  const refetch = React.useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return {
    data,
    isLoading: false,
    error: null,
    refetch
  }
}
