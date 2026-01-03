import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiGift, FiHeart, FiImage, FiDownload, FiArrowRight, FiStar } from 'react-icons/fi'
import { useFestivals } from '../hooks/useFestivals'
import FestivalCard from '../components/FestivalCard'
import LoadingSpinner from '../components/LoadingSpinner'

function Home() {
  const { data, isLoading } = useFestivals()

  const features = [
    {
      icon: FiGift,
      title: 'Choose a Festival',
      description: 'Browse festivals from different cultures worldwide',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FiHeart,
      title: 'Select Relationship',
      description: 'Pick your relationship for personalized messages',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: FiImage,
      title: 'Generate Card',
      description: 'Create beautiful greeting cards instantly',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      icon: FiDownload,
      title: 'Download & Share',
      description: 'Download and share with your loved ones',
      color: 'from-green-500 to-teal-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="overflow-hidden relative z-10">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-orange-400/10" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl sm:text-6xl opacity-20"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * 600 
              }}
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 4 + i, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: i * 0.5
              }}
            >
              {['🎉', '✨', '🎊', '🌟', '💫', '🎁'][i]}
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
              <span className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium">
                <FiStar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                Celebrate Every Festival
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-gray-900 mb-2 sm:mb-3 px-2 leading-tight mx-auto"
            >
              <span className="block text-center">Send Heartfelt</span>
              <span className="block text-center text-gradient-animated">Festival Wishes</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
            >
              Create beautiful, personalized greeting cards for every festival.
              Choose from thousands of messages tailored to your relationships.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4"
            >
              <Link to="/create-wish">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary w-full sm:w-auto text-base sm:text-lg flex items-center justify-center group"
                >
                  Create Your Wish
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/festivals">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary w-full sm:w-auto text-base sm:text-lg"
                >
                  Explore Festivals
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-16 max-w-lg mx-auto px-4"
            >
              {[
                { value: '12+', label: 'Festivals' },
                { value: '29', label: 'Relations' },
                { value: '7K+', label: 'Messages' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-purple-400 flex justify-center pt-2">
            <div className="w-1 h-2 bg-purple-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="heading-2 text-gray-900 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto px-4">
              Create personalized festival wishes in just four simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-4 sm:p-6"
              >
                <motion.div 
                  className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Festivals */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4"
          >
            <div>
              <h2 className="heading-2 text-gray-900 mb-2">Featured Festivals</h2>
              <p className="text-gray-600 text-sm sm:text-base">Explore celebrations from around the world</p>
            </div>
            <Link
              to="/festivals"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base flex items-center group"
            >
              View All
              <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {data?.festivals?.slice(0, 8).map((festival, index) => (
                <motion.div
                  key={festival.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FestivalCard festival={festival} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 sm:p-8 md:p-12 lg:p-16 text-center"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />
            </div>

            <div className="relative z-10">
              <motion.h2 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-3 sm:mb-4 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to Spread Joy?
              </motion.h2>
              <motion.p 
                className="text-sm sm:text-base md:text-xl text-purple-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Create your personalized festival wish in just a few clicks.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/create-wish">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg hover:bg-purple-50 transition-colors shadow-xl"
                  >
                    Start Creating
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
