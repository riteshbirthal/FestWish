import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiDownload, FiShare2, FiArrowLeft, FiImage, FiCheck, FiCopy } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { wishApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

function WishPreview() {
  const { wishId } = useParams()
  const [copied, setCopied] = useState(false)

  const { data: wish, isLoading, refetch } = useQuery({
    queryKey: ['wish', wishId],
    queryFn: () => wishApi.getById(wishId).then((res) => res.data),
  })

  const generateCardMutation = useMutation({
    mutationFn: () => wishApi.generateCard(wishId),
    onSuccess: () => {
      refetch()
      toast.success('Card generated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to generate card')
    },
  })

  const handleDownload = async () => {
    if (!wish?.generated_card_url) {
      toast.error('Please generate the card first')
      return
    }

    try {
      // Trigger download by opening the download endpoint
      const downloadUrl = `${import.meta.env.VITE_API_URL}/wishes/${wishId}/download`
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `festwish_${wishId}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Downloading card...')
    } catch (error) {
      toast.error('Failed to download card')
    }
  }

  // Generate the public shareable URL
  const shareUrl = `${window.location.origin}/wish/${wishId}/view`

  const handleShare = async () => {
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
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(wish?.final_message || '')
    toast.success('Message copied!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!wish) {
    return (
      <div className="max-w-2xl mx-auto container-padding py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Wish Not Found</h1>
        <Link to="/create-wish" className="btn-primary">
          Create a new wish
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto container-padding py-6 sm:py-8 md:py-12">
        {/* Back Link */}
        <Link
          to="/create-wish"
          className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6 sm:mb-8 text-sm sm:text-base"
        >
          <FiArrowLeft className="mr-2" />
          Create Another Wish
        </Link>

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
          >
            <FiCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
            Your Wish is Ready!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Generate your greeting card and download or share it
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Your Greeting Card</h2>
            
            {wish.generated_card_url ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={wish.generated_card_url}
                  alt="Generated greeting card"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <div className="aspect-[4/5] rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiImage className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300 mb-3 sm:mb-4" />
                </motion.div>
                <p className="text-gray-600 text-center text-sm sm:text-base px-2">
                  Click "Generate Card" to create your greeting card
                </p>
              </div>
            )}

            {/* Generate Button */}
            {!wish.generated_card_url && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generateCardMutation.mutate()}
                disabled={generateCardMutation.isPending}
                className="btn-primary w-full mt-4 flex items-center justify-center"
              >
                {generateCardMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiImage className="mr-2" />
                    Generate Card
                  </>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Details & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Message Card */}
            <div className="card">
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <h3 className="text-base sm:text-lg font-semibold">Your Message</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyMessage}
                  className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Copy message"
                >
                  <FiCopy className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {wish.final_message}
              </p>
              {wish.recipient_name && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                  To: {wish.recipient_name}
                </p>
              )}
            </div>

            {/* Actions Card */}
            <div className="card">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={!wish.generated_card_url}
                  className={`w-full flex items-center justify-center py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    wish.generated_card_url
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiDownload className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Download Card
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full flex items-center justify-center py-2.5 sm:py-3 px-4 rounded-lg font-medium border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-all text-sm sm:text-base"
                >
                  {copied ? <FiCheck className="mr-2" /> : <FiShare2 className="mr-2" />}
                  {copied ? 'Copied!' : 'Share'}
                </motion.button>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Coming Soon</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3">
                Send your wishes directly via:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">
                  WhatsApp
                </span>
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
                  Email
                </span>
                <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
                  SMS
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default WishPreview
