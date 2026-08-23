import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 500, damping: 30 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 30 })
  const trailX = useSpring(cursorX, { stiffness: 150, damping: 20 })
  const trailY = useSpring(cursorY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    setIsTouch(!matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (isTouch) return

    function onMouseMove(e) {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    function onMouseOver(e) {
      const target = e.target
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]') ||
        target.closest('.glass-hover')
      ) {
        setIsHovering(true)
      }
    }

    function onMouseOut(e) {
      const target = e.target
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]') ||
        target.closest('.glass-hover')
      ) {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [isTouch, cursorX, cursorY])

  if (isTouch) return null

  return (
    <>
      {/* Trail ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1.5px solid rgba(232,120,90,0.4)',
          boxShadow: '0 0 20px rgba(232,120,90,0.15)',
        }}
        animate={{
          width: isHovering ? 50 : 40,
          height: isHovering ? 50 : 40,
          borderColor: isHovering ? 'rgba(232,120,90,0.7)' : 'rgba(232,120,90,0.4)',
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'linear-gradient(135deg, #e8785a, #c9a452)',
          boxShadow: '0 0 10px rgba(232,120,90,0.5)',
        }}
      />
    </>
  )
}
