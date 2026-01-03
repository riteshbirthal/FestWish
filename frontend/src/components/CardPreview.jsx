import { motion } from 'framer-motion'
import { FiDownload, FiRefreshCw, FiStar } from 'react-icons/fi'

const festivalGradients = {
  'Diwali': 'from-orange-400 via-yellow-500 to-red-500',
  'Christmas': 'from-red-500 via-green-600 to-red-500',
  'Eid al-Fitr': 'from-emerald-400 via-teal-500 to-cyan-500',
  'Holi': 'from-pink-400 via-purple-500 to-indigo-500',
  'Chinese New Year': 'from-red-500 via-orange-500 to-yellow-500',
  'Thanksgiving': 'from-orange-400 via-amber-500 to-yellow-600',
  'Easter': 'from-pink-300 via-purple-400 to-indigo-400',
  'Navratri': 'from-red-400 via-pink-500 to-purple-500',
  'Hanukkah': 'from-blue-400 via-indigo-500 to-purple-500',
  'New Year': 'from-purple-500 via-pink-500 to-red-500',
  'Raksha Bandhan': 'from-pink-400 via-rose-500 to-red-400',
  "Valentine's Day": 'from-red-400 via-pink-500 to-rose-500',
  'Durga Puja': 'from-red-500 via-orange-500 to-yellow-500',
  'Ganesh Chaturthi': 'from-orange-400 via-red-500 to-pink-500',
  'Onam': 'from-yellow-400 via-orange-400 to-red-400',
  'Pongal': 'from-yellow-500 via-orange-500 to-red-500',
  'Baisakhi': 'from-orange-400 via-yellow-500 to-green-500',
  'Eid al-Adha': 'from-emerald-500 via-teal-500 to-cyan-500',
  'Makar Sankranti': 'from-orange-400 via-yellow-400 to-blue-400',
  'Lohri': 'from-orange-500 via-red-500 to-yellow-500',
  'Dussehra': 'from-red-500 via-orange-500 to-yellow-500',
  'Karwa Chauth': 'from-red-400 via-pink-500 to-purple-500',
  'Janmashtami': 'from-blue-500 via-purple-500 to-pink-500',
  'Chhath Puja': 'from-orange-500 via-yellow-500 to-red-500',
  'Festival': 'from-purple-400 to-pink-500',
}

function CardPreview({
  imageUrl,
  message,
  recipientName,
  quote,
  festivalName,
  onRefresh,
  onDownload,
  isLoading,
}) {
  const gradient = festivalGradients[festivalName] || festivalGradients['Festival']

  return (
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <FiStar className="text-purple-500" />
          Card Preview
        </h3>
        <div className="flex space-x-1 sm:space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Get different content"
          >
            <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDownload}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Download card"
          >
            <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>

      <motion.div 
        className="relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Background Image or Gradient */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={festivalName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />
            </div>
            
            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-white/20 text-4xl sm:text-6xl"
                  style={{
                    left: `${15 + i * 20}%`,
                    top: `${10 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          {recipientName && (
            <motion.p 
              className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Dear {recipientName},
            </motion.p>
          )}
          
          <motion.p 
            className="text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4 line-clamp-4"
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message || 'Your personalized message will appear here...'}
          </motion.p>
          
          {quote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="border-l-2 border-yellow-400 pl-2 sm:pl-3"
            >
              <p className="text-xs sm:text-sm italic text-yellow-300 line-clamp-2">
                "{quote.quote_text}"
              </p>
              {quote.author && (
                <p className="text-xs mt-1 opacity-80">
                  - {quote.author}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Festival Badge */}
        <motion.div 
          className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-white text-xs sm:text-sm font-medium">{festivalName}</span>
        </motion.div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </motion.div>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
        Click refresh to see different content
      </p>
    </motion.div>
  )
}

export default CardPreview
