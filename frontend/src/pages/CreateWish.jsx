import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiSend, FiRefreshCw, FiUser, FiMessageSquare, FiChevronDown } from 'react-icons/fi'
import { useFestivals, useRandomContent } from '../hooks/useFestivals'
import { wishApi } from '../services/api'
import RelationshipSelect from '../components/RelationshipSelect'
import CardPreview from '../components/CardPreview'
import LoadingSpinner from '../components/LoadingSpinner'

function CreateWish() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    festivalId: searchParams.get('festival') || '',
    relationshipId: '',
    recipientName: '',
    customMessage: '',
  })

  const [step, setStep] = useState(1)

  const { data: festivalsData, isLoading: loadingFestivals } = useFestivals()
  const festivals = festivalsData?.festivals || []

  const {
    data: randomContent,
    isLoading: loadingContent,
    refetch: refetchContent,
  } = useRandomContent(formData.festivalId, formData.relationshipId)

  const createWishMutation = useMutation({
    mutationFn: (data) => wishApi.create(data),
    onSuccess: (response) => {
      const wishId = response.data.wish.id
      toast.success('Wish created successfully!')
      navigate(`/wish/${wishId}/preview`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create wish')
    },
  })

  const selectedFestival = festivals.find((f) => f.id === formData.festivalId)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.festivalId) {
      toast.error('Please select a festival')
      return
    }
    if (!formData.relationshipId) {
      toast.error('Please select a relationship')
      return
    }

    createWishMutation.mutate({
      festival_id: formData.festivalId,
      relationship_id: formData.relationshipId,
      recipient_name: formData.recipientName || null,
      custom_message: formData.customMessage || null,
    })
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries(['random-content'])
    refetchContent()
  }

  const handleDownload = () => {
    toast('Create the wish first to download the card')
  }

  const previewMessage =
    formData.customMessage ||
    randomContent?.message?.message_text ||
    'Your personalized message will appear here...'

  // Auto-advance step when selections are made
  useEffect(() => {
    if (formData.festivalId && step === 1) setStep(2)
  }, [formData.festivalId])

  useEffect(() => {
    if (formData.relationshipId && step === 2) setStep(3)
  }, [formData.relationshipId])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto container-padding py-6 sm:py-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="heading-1 mb-2 sm:mb-3">Create Your Wish</h1>
            <p className="text-purple-100 text-sm sm:text-base md:text-lg px-2">
              Design a personalized greeting card in just a few steps
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-6 sm:py-8 md:py-12">
        {/* Progress Steps - Mobile */}
        <div className="flex justify-center mb-6 sm:mb-8 md:hidden">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-0.5 ${step > s ? 'bg-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 lg:order-1"
          >
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Festival Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="label flex items-center">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mr-2">1</span>
                    Select Festival <span className="text-red-500 ml-1">*</span>
                  </label>
                  {loadingFestivals ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <select
                      value={formData.festivalId}
                      onChange={(e) =>
                        setFormData({ ...formData, festivalId: e.target.value })
                      }
                      className="select-field"
                      required
                    >
                      <option value="">Choose a festival</option>
                      {festivals.map((festival) => (
                        <option key={festival.id} value={festival.id}>
                          {festival.name}
                        </option>
                      ))}
                    </select>
                  )}
                </motion.div>

                {/* Relationship Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="label flex items-center">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mr-2">2</span>
                    Select Relationship <span className="text-red-500 ml-1">*</span>
                  </label>
                  <RelationshipSelect
                    value={formData.relationshipId}
                    onChange={(value) =>
                      setFormData({ ...formData, relationshipId: value })
                    }
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                    Choose your relationship with the recipient
                  </p>
                </motion.div>

                {/* Recipient Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="label flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs mr-2">
                      <FiUser className="w-3 h-3" />
                    </span>
                    Recipient Name
                    <span className="text-gray-400 text-xs ml-2">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                    placeholder="Enter recipient's name"
                    className="input-field"
                  />
                </motion.div>

                {/* Custom Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="label flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs mr-2">
                      <FiMessageSquare className="w-3 h-3" />
                    </span>
                    Custom Message
                    <span className="text-gray-400 text-xs ml-2">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.customMessage}
                    onChange={(e) =>
                      setFormData({ ...formData, customMessage: e.target.value })
                    }
                    placeholder="Leave empty for auto-generated message"
                    rows={3}
                    className="input-field resize-none"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                    Leave empty to use our curated messages
                  </p>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    type="submit"
                    disabled={createWishMutation.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full flex items-center justify-center text-base"
                  >
                    {createWishMutation.isPending ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <FiSend className="mr-2" />
                    )}
                    Create Wish
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-1 lg:order-2"
          >
            <div className="lg:sticky lg:top-24">
              <CardPreview
                imageUrl={randomContent?.image?.image_url}
                message={previewMessage}
                recipientName={formData.recipientName}
                quote={randomContent?.quote}
                festivalName={selectedFestival?.name || 'Festival'}
                onRefresh={handleRefresh}
                onDownload={handleDownload}
                isLoading={loadingContent}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CreateWish
