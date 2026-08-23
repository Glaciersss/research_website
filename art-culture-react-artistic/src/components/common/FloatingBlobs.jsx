import { motion } from 'framer-motion'

const blobs = [
  { size: 300, x: '10%', y: '20%', color: 'rgba(232,120,90,0.06)', duration: 20, delay: 0 },
  { size: 200, x: '80%', y: '10%', color: 'rgba(93,158,143,0.06)', duration: 25, delay: 3 },
  { size: 250, x: '60%', y: '70%', color: 'rgba(94,138,184,0.05)', duration: 22, delay: 5 },
  { size: 180, x: '30%', y: '80%', color: 'rgba(201,164,82,0.06)', duration: 18, delay: 1 },
]

export default function FloatingBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
