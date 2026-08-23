import { motion } from 'framer-motion'

export default function GlassCard({
  children,
  className = '',
  hover = true,
  intense = false,
  accent = false,
  onClick,
  as = 'div',
}) {
  const Component = motion[as] || motion.div
  const base = intense ? 'glass-intense' : 'glass'
  const hoverClass = hover ? 'glass-hover' : ''
  const accentClass = accent ? 'glass-border-accent' : ''

  return (
    <Component
      className={`${base} ${hoverClass} ${accentClass} transition-all duration-500 ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined}
    >
      {children}
    </Component>
  )
}
