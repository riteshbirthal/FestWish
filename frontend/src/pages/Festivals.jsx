import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { useFestivals } from '../hooks/useFestivals'
import FestivalCard from '../components/FestivalCard'
import LoadingSpinner from '../components/LoadingSpinner'

function Festivals() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCulture, setSelectedCulture] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { data, isLoading, error } = useFestivals()

  const festivals = data?.festivals || []
  const cultures = [...new Set(festivals.map((f) => f.religion_culture).filter(Boolean))]

  const filteredFestivals = festivals.filter((festival) => {
    const matchesSearch =
      festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCulture = !selectedCulture || festival.religion_culture === selectedCulture
    return matchesSearch && matchesCulture
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCulture('')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto container-padding py-8 sm:py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="heading-1 mb-3 sm:mb-4">Explore Festivals</h1>
            <p className="text-purple-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
              Discover celebrations from around the world and their rich cultural heritage
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-6 sm:py-8">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          {/* Mobile: Stacked layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search festivals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 sm:pl-12"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-secondary flex items-center justify-center"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filter
              {selectedCulture && (
                <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                  1
                </span>
              )}
            </button>

            {/* Culture Filter (Desktop) */}
            <div className="hidden sm:block relative min-w-[200px]">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCulture}
                onChange={(e) => setSelectedCulture(e.target.value)}
                className="select-field pl-12"
              >
                <option value="">All Cultures</option>
                {cultures.map((culture) => (
                  <option key={culture} value={culture}>
                    {culture}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden mt-3 overflow-hidden"
              >
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="label">Culture/Religion</label>
                  <select
                    value={selectedCulture}
                    onChange={(e) => {
                      setSelectedCulture(e.target.value)
                      setShowFilters(false)
                    }}
                    className="select-field"
                  >
                    <option value="">All Cultures</option>
                    {cultures.map((culture) => (
                      <option key={culture} value={culture}>
                        {culture}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          {(searchTerm || selectedCulture) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap items-center gap-2 mt-4"
            >
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-2">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCulture && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                  {selectedCulture}
                  <button onClick={() => setSelectedCulture('')} className="ml-2">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 mb-4"
        >
          Showing {filteredFestivals.length} festival{filteredFestivals.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Festival Grid */}
        {isLoading ? (
          <LoadingSpinner className="py-20" size="lg" />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-red-600">Error loading festivals. Please try again.</p>
          </motion.div>
        ) : filteredFestivals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="text-6xl sm:text-7xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No festivals found</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {filteredFestivals.map((festival, index) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <FestivalCard festival={festival} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Festivals
