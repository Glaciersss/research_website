import { motion } from 'framer-motion'

const variants = {
  up: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
  once = true,
  staggerChildren,
}) {
  const v = variants[direction] || variants.up

  return (
    <motion.div
      className={className}
      variants={staggerChildren ? { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } } : undefined}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      transition={staggerChildren ? undefined : { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {staggerChildren ? (
        children
      ) : (
        <motion.div className="h-full" variants={v} transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
    >
      {children}
    </motion.div>
  )
}
