import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const line1 = '艺术与文化'
const line2 = '智能计算'

const scatterPositions = (count) =>
  Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 400,
    rotate: (Math.random() - 0.5) * 180,
  }))

const line1Scatter = scatterPositions(line1.length)
const line2Scatter = scatterPositions(line2.length)

function generateCharParticles(charIndex, totalChars, isLine1) {
  const count = 6
  const totalWidth = totalChars * 9
  const startX = 50 - totalWidth / 2 + charIndex * 9 + 4.5
  const centerY = isLine1 ? 42 : 58

  return Array.from({ length: count }, (_, i) => {
    const fromLeft = Math.random() > 0.5
    return {
      startXpct: fromLeft ? -10 - Math.random() * 15 : 110 + Math.random() * 15,
      startYpct: 20 + Math.random() * 60,
      endXpct: startX + (Math.random() - 0.5) * 6,
      endYpct: centerY + (Math.random() - 0.5) * 5,
      size: Math.random() * 5 + 3,
      color: isLine1
        ? (i % 2 === 0 ? '#e8785a' : '#c9a452')
        : (i % 2 === 0 ? '#5e8ab8' : '#5d9e8f'),
      delay: Math.random() * 0.3,
    }
  })
}

function AnimatedChar({ char, index, scatter, lineIndex, gradientClass, gradientStyle }) {
  const baseDelay = lineIndex === 0 ? 1.8 : 2.1

  return (
    <motion.span
      className={`inline-block ${gradientClass}`}
      style={{ willChange: 'auto', ...gradientStyle }}
      initial={{
        opacity: 0,
        x: scatter.x,
        y: scatter.y,
        rotate: scatter.rotate,
        filter: 'blur(8px)',
        scale: 0.3,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        filter: 'blur(0px)',
        scale: 1,
      }}
      transition={{
        duration: 1.2,
        delay: baseDelay + index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}

export default function Hero() {
  const line1Chars = useMemo(() => line1.split(''), [])
  const line2Chars = useMemo(() => line2.split(''), [])
  const line1Particles = useMemo(
    () => line1Chars.map((_, ci) => generateCharParticles(ci, line1.length, true)),
    [line1Chars]
  )
  const line2Particles = useMemo(
    () => line2Chars.map((_, ci) => generateCharParticles(ci, line2.length, false)),
    [line2Chars]
  )
  const [vw, setVw] = useState(19)
  const [vh, setVh] = useState(11)

  useEffect(() => {
    setVw(window.innerWidth / 100)
    setVh(window.innerHeight / 100)
  }, [])

  const warmStyle = {
    background: 'linear-gradient(135deg, #e8785a, #f4a88e, #c9a452)',
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  }

  const coolStyle = {
    background: 'linear-gradient(135deg, #5e8ab8, #8db4d8, #5d9e8f, #8fc4b8)',
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  }

  function smoothScroll(e, targetId) {
    e.preventDefault()
    const el = document.querySelector(targetId)
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5efe8] via-[#faf7f2] to-[#faf7f2]" />

      <div className="absolute top-1/3 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-accent/8 blur-[100px]" />
      <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-blue-accent/8 blur-[100px]" />

      {line1Particles.flat().map((p, i) => {
        const sx = (p.startXpct - p.endXpct) * vw
        const sy = (p.startYpct - p.endYpct) * vh

        return (
          <motion.div
            key={`p1-${i}`}
            className="pointer-events-none absolute z-[1] rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: `${p.endXpct}%`,
              top: `${p.endYpct}%`,
            }}
            initial={{ x: sx, y: sy, opacity: 0, scale: 0 }}
            animate={{
              x: 0,
              y: 0,
              opacity: [0, 0.9, 0.6, 0],
              scale: [0, 1.3, 0.7, 0],
            }}
            transition={{ duration: 1.5, delay: p.delay, ease: 'easeInOut' }}
          />
        )
      })}

      {line2Particles.flat().map((p, i) => {
        const sx = (p.startXpct - p.endXpct) * vw
        const sy = (p.startYpct - p.endYpct) * vh

        return (
          <motion.div
            key={`p2-${i}`}
            className="pointer-events-none absolute z-[1] rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: `${p.endXpct}%`,
              top: `${p.endYpct}%`,
            }}
            initial={{ x: sx, y: sy, opacity: 0, scale: 0 }}
            animate={{
              x: 0,
              y: 0,
              opacity: [0, 0.9, 0.6, 0],
              scale: [0, 1.3, 0.7, 0],
            }}
            transition={{ duration: 1.5, delay: p.delay + 0.15, ease: 'easeInOut' }}
          />
        )
      })}

      <div className="container relative z-[2] mx-auto px-4 text-center">
        <motion.h1 className="mb-8 font-display text-7xl leading-tight tracking-[0.02em] md:text-9xl lg:text-[10rem]">
          {line1Chars.map((char, i) => (
            <AnimatedChar
              key={`l1-${i}`}
              char={char}
              index={i}
              scatter={line1Scatter[i]}
              lineIndex={0}
              gradientClass="text-gradient-warm"
              gradientStyle={warmStyle}
            />
          ))}
          <br />
          {line2Chars.map((char, i) => (
            <AnimatedChar
              key={`l2-${i}`}
              char={char}
              index={i}
              scatter={line2Scatter[i]}
              lineIndex={1}
              gradientClass="text-gradient-cool"
              gradientStyle={coolStyle}
            />
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mx-auto mb-10 max-w-2xl text-2xl tracking-wider text-stone md:text-4xl"
        >
          智能理解文化，数据洞察文明
        </motion.p>
      </div>

      <motion.a
        href="#about"
        onClick={(e) => smoothScroll(e, '#about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
        className="absolute bottom-8 left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-2 text-ash transition-colors hover:text-coral"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl uppercase tracking-widest"
        >
          向下探索
        </motion.span>
        <motion.i
          className="fa fa-chevron-down"
          animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.a>
    </section>
  )
}
