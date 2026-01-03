import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiGlobe, FiSend, FiArrowLeft, FiBookOpen, FiHeart, FiStar } from 'react-icons/fi'
import { useFestivalBySlug } from '../hooks/useFestivals'
import LoadingSpinner from '../components/LoadingSpinner'

const festivalEmojis = {
  'diwali': '🪔',
  'christmas': '🎄',
  'eid-al-fitr': '🌙',
  'holi': '🎨',
  'chinese-new-year': '🧧',
  'thanksgiving': '🦃',
  'easter': '🐰',
  'navratri': '💃',
  'hanukkah': '🕎',
  'new-year': '🎆',
  'raksha-bandhan': '🎀',
  'valentines-day': '💝',
}

const festivalGradients = {
  'diwali': 'from-orange-500 via-yellow-500 to-red-500',
  'christmas': 'from-red-600 via-green-600 to-red-600',
  'eid-al-fitr': 'from-emerald-500 via-teal-500 to-cyan-500',
  'holi': 'from-pink-500 via-purple-500 to-indigo-500',
  'chinese-new-year': 'from-red-600 via-orange-500 to-yellow-500',
  'thanksgiving': 'from-orange-500 via-amber-500 to-yellow-600',
  'easter': 'from-pink-400 via-purple-400 to-indigo-400',
  'navratri': 'from-red-500 via-pink-500 to-purple-500',
  'hanukkah': 'from-blue-500 via-indigo-500 to-purple-500',
  'new-year': 'from-purple-600 via-pink-500 to-red-500',
  'raksha-bandhan': 'from-pink-500 via-rose-500 to-red-500',
  'valentines-day': 'from-red-500 via-pink-500 to-rose-500',
}

function FestivalDetail() {
  const { slug } = useParams()
  const { data: festival, isLoading, error } = useFestivalBySlug(slug)

  const emoji = festivalEmojis[slug] || '🎉'
  const gradient = festivalGradients[slug] || 'from-purple-600 to-pink-600'

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !festival) {
    return (
      <div className="max-w-7xl mx-auto container-padding py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Festival Not Found</h1>
        <Link to="/festivals" className="btn-primary">
          <FiArrowLeft className="mr-2" />
          Back to Festivals
        </Link>
      </div>
    )
  }

  const sections = [
    { key: 'description', title: 'About', icon: FiBookOpen, content: festival.description },
    { key: 'story_history', title: 'History & Story', icon: FiBookOpen, content: festival.story_history },
    { key: 'cultural_significance', title: 'Cultural Significance', icon: FiHeart, content: festival.cultural_significance },
    { key: 'traditions', title: 'Traditions & Celebrations', icon: FiStar, content: festival.traditions },
  ].filter(s => s.content)

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className={`bg-gradient-to-br ${gradient} text-white relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Floating Emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl sm:text-5xl opacity-20"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto container-padding py-10 sm:py-16 md:py-20 relative z-10">
          {/* Back Button */}
          <Link
            to="/festivals"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <FiArrowLeft className="mr-2" />
            All Festivals
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Main Emoji */}
            <motion.div
              className="text-5xl sm:text-6xl md:text-7xl mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {emoji}
            </motion.div>

            <h1 className="heading-1 mb-3 sm:mb-4">{festival.name}</h1>
            
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-white/90 text-sm sm:text-base">
              {festival.typical_month && (
                <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-full">
                  <FiCalendar className="mr-2" />
                  {festival.typical_month}
                </span>
              )}
              {festival.religion_culture && (
                <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-full">
                  <FiGlobe className="mr-2" />
                  {festival.religion_culture}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto container-padding py-6 sm:py-8 md:py-12">
        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${gradient} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-center text-white mb-8 sm:mb-12 shadow-xl -mt-8 sm:-mt-12 relative z-10`}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
            Send {festival.name} Wishes
          </h2>
          <p className="mb-4 sm:mb-6 text-white/90 text-sm sm:text-base px-2">
            Create personalized greeting cards for your loved ones
          </p>
          <Link to={`/create-wish?festival=${festival.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors inline-flex items-center"
            >
              <FiSend className="mr-2" />
              Create Wish
            </motion.button>
          </Link>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mr-3`}>
                  <section.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {section.content}
              </p>
            </motion.section>
          ))}

          {/* Quotes Section */}
          {festival.quotes?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mr-3`}>
                  <span className="text-white text-sm sm:text-base">"</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-gray-900">
                  Inspirational Quotes
                </h2>
              </div>
              <div className="grid gap-3 sm:gap-4">
                {festival.quotes.slice(0, 5).map((quote, i) => (
                  <motion.blockquote
                    key={quote.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`border-l-4 border-purple-500 pl-3 sm:pl-4 py-2 bg-purple-50/50 rounded-r-lg`}
                  >
                    <p className="text-gray-700 italic text-sm sm:text-base">"{quote.quote_text}"</p>
                    {quote.author && (
                      <footer className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                        - {quote.author}
                      </footer>
                    )}
                  </motion.blockquote>
                ))}
              </div>
            </motion.section>
          )}

          {/* Images Gallery */}
          {festival.images?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-gray-900 mb-4 sm:mb-6">
                Image Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {festival.images.slice(0, 6).map((image) => (
                  <motion.div
                    key={image.id}
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || festival.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  )
}

export default FestivalDetail
