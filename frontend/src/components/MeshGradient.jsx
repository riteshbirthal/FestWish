import { motion } from 'framer-motion'

function MeshGradient({ className = '', variant = 'purple' }) {
  const gradients = {
    purple: {
      color1: 'rgba(147, 51, 234, 0.3)',
      color2: 'rgba(236, 72, 153, 0.3)',
      color3: 'rgba(59, 130, 246, 0.2)',
      color4: 'rgba(168, 85, 247, 0.25)',
    },
    festive: {
      color1: 'rgba(251, 146, 60, 0.3)',
      color2: 'rgba(250, 204, 21, 0.3)',
      color3: 'rgba(239, 68, 68, 0.2)',
      color4: 'rgba(236, 72, 153, 0.25)',
    },
    ocean: {
      color1: 'rgba(59, 130, 246, 0.3)',
      color2: 'rgba(20, 184, 166, 0.3)',
      color3: 'rgba(99, 102, 241, 0.2)',
      color4: 'rgba(139, 92, 246, 0.25)',
    },
  }

  const colors = gradients[variant] || gradients.purple

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Mesh gradient using multiple overlapping radial gradients */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(at 40% 20%, ${colors.color1} 0px, transparent 50%),
            radial-gradient(at 80% 0%, ${colors.color2} 0px, transparent 50%),
            radial-gradient(at 0% 50%, ${colors.color3} 0px, transparent 50%),
            radial-gradient(at 80% 50%, ${colors.color4} 0px, transparent 50%),
            radial-gradient(at 0% 100%, ${colors.color1} 0px, transparent 50%),
            radial-gradient(at 80% 100%, ${colors.color2} 0px, transparent 50%),
            radial-gradient(at 0% 0%, ${colors.color3} 0px, transparent 50%)
          `,
        }}
        animate={{
          backgroundPosition: [
            '0% 0%, 100% 0%, 0% 100%, 100% 100%, 0% 50%, 100% 50%, 50% 0%',
            '100% 100%, 0% 100%, 100% 0%, 0% 0%, 100% 50%, 0% 50%, 50% 100%',
            '0% 0%, 100% 0%, 0% 100%, 100% 100%, 0% 50%, 100% 50%, 50% 0%',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Additional floating orbs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            background: `radial-gradient(circle, ${Object.values(colors)[i]} 0%, transparent 70%)`,
            filter: 'blur(40px)',
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

      {/* Glass noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

export default MeshGradient
