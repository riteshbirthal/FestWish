import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const GlassCard = forwardRef(({ 
  children, 
  className = '', 
  hover = true,
  blur = 'md',
  opacity = 70,
  border = true,
  glow = false,
  ...props 
}, ref) => {
  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  }

  const baseClasses = `
    bg-white/${opacity} 
    ${blurValues[blur] || blurValues.md}
    rounded-2xl sm:rounded-3xl
    ${border ? 'border border-white/30' : ''}
    shadow-[0_8px_32px_rgba(0,0,0,0.08)]
    ${glow ? 'shadow-[0_0_40px_rgba(147,51,234,0.15)]' : ''}
    transition-all duration-300
  `

  if (hover) {
    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${className}`}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div ref={ref} className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  )
})

GlassCard.displayName = 'GlassCard'

export default GlassCard
