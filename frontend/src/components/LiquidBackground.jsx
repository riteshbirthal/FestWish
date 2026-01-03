import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function LiquidBackground({ variant = 'default' }) {
  const canvasRef = useRef(null)

  // Color schemes for different variants
  const colorSchemes = {
    default: [
      { r: 147, g: 51, b: 234 },   // Purple
      { r: 236, g: 72, b: 153 },   // Pink
      { r: 59, g: 130, b: 246 },   // Blue
      { r: 168, g: 85, b: 247 },   // Violet
    ],
    festive: [
      { r: 251, g: 146, b: 60 },   // Orange
      { r: 250, g: 204, b: 21 },   // Yellow
      { r: 239, g: 68, b: 68 },    // Red
      { r: 236, g: 72, b: 153 },   // Pink
    ],
    calm: [
      { r: 59, g: 130, b: 246 },   // Blue
      { r: 99, g: 102, b: 241 },   // Indigo
      { r: 139, g: 92, b: 246 },   // Violet
      { r: 20, g: 184, b: 166 },   // Teal
    ],
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    const colors = colorSchemes[variant] || colorSchemes.default

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const drawBlob = (x, y, radius, color, phase) => {
      ctx.beginPath()
      
      const points = 6
      const angleStep = (Math.PI * 2) / points
      
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep + phase
        const r = radius + Math.sin(angle * 3 + time * 0.02) * (radius * 0.3)
        const px = x + Math.cos(angle) * r
        const py = y + Math.sin(angle) * r
        
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          const prevAngle = (i - 1) * angleStep + phase
          const prevR = radius + Math.sin(prevAngle * 3 + time * 0.02) * (radius * 0.3)
          const prevX = x + Math.cos(prevAngle) * prevR
          const prevY = y + Math.sin(prevAngle) * prevR
          
          const cpX = (prevX + px) / 2 + Math.sin(time * 0.01 + i) * 20
          const cpY = (prevY + py) / 2 + Math.cos(time * 0.01 + i) * 20
          
          ctx.quadraticCurveTo(cpX, cpY, px, py)
        }
      }
      
      ctx.closePath()
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5)
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`)
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`)
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)
      
      ctx.fillStyle = gradient
      ctx.fill()
    }

    const animate = () => {
      time++
      
      // Clear with slight opacity for trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw multiple blobs
      const blobs = [
        { 
          x: canvas.width * 0.3 + Math.sin(time * 0.008) * 100, 
          y: canvas.height * 0.3 + Math.cos(time * 0.006) * 80,
          radius: Math.min(canvas.width, canvas.height) * 0.25,
          color: colors[0],
          phase: time * 0.005
        },
        { 
          x: canvas.width * 0.7 + Math.cos(time * 0.007) * 120, 
          y: canvas.height * 0.4 + Math.sin(time * 0.009) * 100,
          radius: Math.min(canvas.width, canvas.height) * 0.3,
          color: colors[1],
          phase: time * 0.004 + 1
        },
        { 
          x: canvas.width * 0.5 + Math.sin(time * 0.005) * 80, 
          y: canvas.height * 0.7 + Math.cos(time * 0.008) * 90,
          radius: Math.min(canvas.width, canvas.height) * 0.28,
          color: colors[2],
          phase: time * 0.006 + 2
        },
        { 
          x: canvas.width * 0.2 + Math.cos(time * 0.006) * 60, 
          y: canvas.height * 0.6 + Math.sin(time * 0.007) * 70,
          radius: Math.min(canvas.width, canvas.height) * 0.2,
          color: colors[3],
          phase: time * 0.007 + 3
        },
      ]

      blobs.forEach(blob => {
        drawBlob(blob.x, blob.y, blob.radius, blob.color, blob.phase)
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [variant])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      
      {/* Canvas for liquid animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-60"
        style={{ filter: 'blur(60px)' }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glass shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ width: '50%' }}
      />
    </div>
  )
}

export default LiquidBackground
