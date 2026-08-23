import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ children, className = '', tiltDegree = 5, glare = false }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltDegree, -tiltDegree]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltDegree, tiltDegree]), {
    stiffness: 200,
    damping: 20,
  })

  const glareX = useTransform(mouseX, [0, 1], ['-50%', '150%'])
  const glareY = useTransform(mouseY, [0, 1], ['-50%', '150%'])

  function handleMouseMove(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mousePX = (e.clientX - rect.left) / width
    const mousePY = (e.clientY - rect.top) / height
    x.set(mousePX - 0.5)
    y.set(mousePY - 0.5)
    mouseX.set(mousePX)
    mouseY.set(mousePY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden"
          style={{ borderRadius: 'inherit' }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
              left: glareX,
              top: glareY,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
