import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { FiDownload, FiShare2, FiHeart, FiGift, FiCopy, FiCheck } from 'react-icons/fi'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import { wishApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const festivalEmojis = {
  'Diwali': ['🪔', '✨', '🎆', '🎇', '💫'],
  'Christmas': ['🎄', '🎅', '⭐', '🎁', '❄️'],
  'Eid al-Fitr': ['🌙', '✨', '🕌', '⭐', '🎉'],
  'Holi': ['🎨', '🌈', '💜', '💙', '💚'],
  'Chinese New Year': ['🧧', '🐉', '🎊', '🏮', '✨'],
  'Thanksgiving': ['🦃', '🍂', '🌽', '🥧', '🍁'],
  'Easter': ['🐰', '🥚', '🌷', '🐣', '🌸'],
  'Navratri': ['💃', '🪘', '✨', '🔱', '🌺'],
  'Hanukkah': ['🕎', '✡️', '💙', '✨', '🕯️'],
  'New Year': ['🎆', '🎉', '🥂', '✨', '🎊'],
  'Raksha Bandhan': ['🎀', '💝', '👫', '✨', '🌺'],
  "Valentine's Day": ['💝', '❤️', '💕', '🌹', '💖'],
  'Durga Puja': ['🔱', '🌺', '✨', '🙏', '💫'],
  'Ganesh Chaturthi': ['🐘', '🙏', '✨', '🌺', '💫'],
  'Onam': ['🌸', '🎭', '🚣', '✨', '🌺'],
  'Pongal': ['🍚', '☀️', '🐄', '✨', '🌾'],
  'Baisakhi': ['🌾', '💃', '🪘', '✨', '🎉'],
  'Eid al-Adha': ['🕋', '🌙', '✨', '🐑', '🎉'],
  'Makar Sankranti': ['🪁', '☀️', '✨', '🌾', '🎉'],
  'Lohri': ['🔥', '🌾', '💃', '✨', '🎉'],
  'Dussehra': ['🏹', '🔥', '✨', '⚔️', '🎉'],
  'Karwa Chauth': ['🌙', '💑', '✨', '🙏', '💝'],
  'Janmashtami': ['🦚', '🪈', '✨', '🙏', '💙'],
  'Chhath Puja': ['☀️', '🙏', '✨', '🌅', '💫'],
}

const festivalGradients = {
  'Diwali': 'from-orange-500 via-yellow-500 to-red-500',
  'Christmas': 'from-red-600 via-green-600 to-red-600',
  'Eid al-Fitr': 'from-emerald-500 via-teal-500 to-cyan-500',
  'Holi': 'from-pink-500 via-purple-500 to-indigo-500',
  'Chinese New Year': 'from-red-600 via-orange-500 to-yellow-500',
  'Thanksgiving': 'from-orange-500 via-amber-500 to-yellow-600',
  'Easter': 'from-pink-400 via-purple-400 to-indigo-400',
  'Navratri': 'from-red-500 via-pink-500 to-purple-500',
  'Hanukkah': 'from-blue-500 via-indigo-500 to-purple-500',
  'New Year': 'from-purple-600 via-pink-500 to-red-500',
  'Raksha Bandhan': 'from-pink-500 via-rose-500 to-red-500',
  "Valentine's Day": 'from-red-500 via-pink-500 to-rose-500',
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
}

function WishView() {
  const { wishId } = useParams()
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  const { data: wish, isLoading, error } = useQuery({
    queryKey: ['wish-view', wishId],
    queryFn: () => wishApi.getById(wishId).then((res) => res.data),
  })

  // Trigger confetti on load
  useEffect(() => {
    if (wish && showConfetti) {
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#9333ea', '#ec4899', '#f59e0b', '#10b981']
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#9333ea', '#ec4899', '#f59e0b', '#10b981']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()
      setShowConfetti(false)
    }
  }, [wish, showConfetti])

  const handleShare = async () => {
    const shareUrl = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Festival Wish from FestWish',
          text: wish?.final_message,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (wish?.generated_card_url) {
      window.open(wish.generated_card_url, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white/80 mt-4">Loading your wish...</p>
        </div>
      </div>
    )
  }

  if (error || !wish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">Wish Not Found</h1>
          <p className="text-white/70 mb-6">This wish may have been removed or the link is invalid.</p>
          <Link to="/" className="btn-primary">
            Create Your Own Wish
          </Link>
        </div>
      </div>
    )
  }

  // Get festival info (we'd need to fetch this, but for now use defaults)
  const festivalName = 'Festival' // This would come from the wish data
  const emojis = festivalEmojis[festivalName] || ['🎉', '✨', '💫', '🌟', '🎊']
  const gradient = festivalGradients[festivalName] || 'from-purple-600 via-pink-600 to-purple-600'

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Emojis */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-4xl opacity-30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -50,
            }}
            animate={{
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            {emojis[i % emojis.length]}
          </motion.div>
        ))}

        {/* Glowing Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-white/10 blur-3xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
            }}
            animate={{
              x: [
                `${20 + i * 15}vw`,
                `${50 - i * 10}vw`,
                `${20 + i * 15}vw`,
              ],
              y: [
                `${10 + i * 20}vh`,
                `${60 - i * 15}vh`,
                `${10 + i * 20}vh`,
              ],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            className="text-4xl sm:text-6xl mb-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {emojis[0]}
          </motion.div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">
            You've Received a Wish!
          </h1>
          {wish.recipient_name && (
            <p className="text-white/80 text-lg sm:text-xl">
              Dear {wish.recipient_name}
            </p>
          )}
        </motion.div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="w-full max-w-lg"
        >
          {/* Generated Card Image */}
          {wish.generated_card_url ? (
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-6">
              <img
                src={wish.generated_card_url}
                alt="Festival Greeting Card"
                className="w-full"
              />
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2, delay: 1 }}
              />
            </div>
          ) : (
            /* Message Card if no image */
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 border border-white/30">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed text-center font-medium"
              >
                "{wish.final_message}"
              </motion.p>
            </div>
          )}

          {/* Message (if card exists, show message below) */}
          {wish.generated_card_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 border border-white/20"
            >
              <p className="text-white/90 text-center leading-relaxed">
                {wish.final_message}
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            {wish.generated_card_url && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-purple-600 py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <FiDownload className="w-5 h-5" />
                Download Card
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md text-white py-3 px-6 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all"
            >
              {copied ? <FiCheck className="w-5 h-5" /> : <FiShare2 className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Share'}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="text-white/70 mb-4 text-sm sm:text-base">
            Want to send your own festival wishes?
          </p>
          <Link to="/create-wish">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white py-2.5 px-5 rounded-full font-medium border border-white/30 hover:bg-white/30 transition-all text-sm sm:text-base"
            >
              <FiGift className="w-4 h-4" />
              Create Your Wish
            </motion.button>
          </Link>
        </motion.div>

        {/* Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 sm:mt-8"
        >
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors">
            <FiHeart className="w-4 h-4" />
            <span className="text-sm">Made with FestWish</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default WishView
