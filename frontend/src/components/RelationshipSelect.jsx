import { motion, AnimatePresence } from 'framer-motion'
import { useRelationships } from '../hooks/useRelationships'

function RelationshipSelect({ value, onChange, className = '' }) {
  const { data, isLoading, error } = useRelationships()

  if (isLoading) {
    return (
      <div className={`select-field bg-gray-50 ${className}`}>
        <span className="text-gray-400">Loading relationships...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`select-field border-red-300 bg-red-50 ${className}`}>
        <span className="text-red-500">Error loading relationships</span>
      </div>
    )
  }

  const relationships = data?.relationships || []

  // Group by category
  const grouped = relationships.reduce((acc, rel) => {
    const category = rel.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(rel)
    return acc
  }, {})

  const categoryLabels = {
    family: '👨‍👩‍👧‍👦 Family',
    romantic: '💕 Romantic',
    friends: '🤝 Friends',
    professional: '💼 Professional',
    other: '🌟 Other',
  }

  const categoryOrder = ['family', 'romantic', 'friends', 'professional', 'other']

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`select-field ${className}`}
      required
    >
      <option value="">Select Relationship</option>
      {categoryOrder.map((category) => {
        const rels = grouped[category]
        if (!rels || rels.length === 0) return null
        return (
          <optgroup key={category} label={categoryLabels[category] || category}>
            {rels.map((rel) => (
              <option key={rel.id} value={rel.id}>
                {rel.display_name}
              </option>
            ))}
          </optgroup>
        )
      })}
    </select>
  )
}

export default RelationshipSelect
