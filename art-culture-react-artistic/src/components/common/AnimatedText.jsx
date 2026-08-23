import { motion } from 'framer-motion'

export default function AnimatedText({
  children,
  className = '',
  variant = 'gradient',
  gradientClass = 'text-gradient',
  as: Tag = 'h2',
}) {
  if (variant === 'gradient') {
    return (
      <Tag className={`${gradientClass} ${className}`}>
        {children}
      </Tag>
    )
  }

  if (variant === 'reveal') {
    const text = typeof children === 'string' ? children : ''
    const chars = text.split('')

    return (
      <Tag className={className}>
        {chars.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { delay: i * 0.03, duration: 0.5 },
            }}
            viewport={{ once: true }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Tag>
    )
  }

  return <Tag className={className}>{children}</Tag>
}
