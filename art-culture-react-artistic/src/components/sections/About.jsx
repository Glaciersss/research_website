import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingBlobs from '../common/FloatingBlobs'
import ScrollReveal from '../common/ScrollReveal'

const FALLBACK_IMAGES = [
  'https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/3485e18b22fe4d5e91205b69ecb95afc~tplv-a9rns2rl98-image.image?rcl=20251026135537B60115FDD75F0328FA88&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1764050163&x-signature=jP5zKu8iWLdYfyLzwKYSmYJSCOA%3D',
]

function ImageGallery() {
  const [images, setImages] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch('/api/public/hero-bg')
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) setImages(data.images)
      })
      .catch(() => {})
  }, [])

  const list = images.length > 0 ? images : FALLBACK_IMAGES

  const goTo = useCallback((i) => setCurrent(((i % list.length) + list.length) % list.length), [list.length])
  const next = useCallback(() => setCurrent((i) => (i + 1) % list.length), [list.length])

  useEffect(() => {
    if (list.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [list.length, next])

  return (
    <div className="space-y-4">
      {/* Main display */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <img
              src={list[current]}
              alt={`展示 ${current + 1}`}
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Subtle inner gradient for depth */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {list.length > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-all z-10"
            >
              &#8249;
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-all z-10"
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {list.length > 1 && (
        <div className="flex gap-2 justify-center">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                i === current
                  ? 'w-16 h-12 ring-2 ring-cinnabar ring-offset-2 ring-offset-rice-paper'
                  : 'w-12 h-10 opacity-60 hover:opacity-90'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Dots indicator */}
      <div className="flex justify-center gap-2">
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-2.5 bg-coral'
                : 'w-2.5 h-2.5 bg-stone/25 hover:bg-stone/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-rice-paper overflow-hidden">
      <FloatingBlobs />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-4">关于我们</h2>
            <div className="w-20 h-1 bg-warm-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <ScrollReveal direction="left" delay={0.2}>
            <h3 className="text-2xl font-display text-gradient-warm mb-6">研究团队简介</h3>
            <p className="text-stone mb-6 leading-relaxed text-xl">
              艺术与文化智能计算团队致力于将人工智能技术与艺术文化研究相结合，探索数字化时代文化遗产保护、传承与创新的新方法与新途径。
            </p>
            <p className="text-stone mb-6 leading-relaxed text-xl">
              团队汇聚了来自计算机科学、艺术史、文化遗产、数字媒体等多个领域的专家学者，形成了跨学科、多元化的研究力量。我们的研究领域涵盖计算机视觉、自然语言处理、机器学习在艺术与文化领域的应用等多个方面。
            </p>
            <div className="flex items-center mt-8 gap-5">
              <img src="/logo.svg" alt="Logo" className="h-16" />
              <div>
                <p className="italic text-ink/70 text-xl">&ldquo;智能赋能文化，科技传承艺术&rdquo;</p>
                <p className="text-right mt-1 text-cinnabar text-lg">— 团队宗旨</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — elegant image gallery */}
          <ScrollReveal direction="right" delay={0.3}>
            <div className="relative">
              {/* Decorative background shape */}
              <div className="absolute -inset-4 bg-gradient-to-br from-cinnabar/5 via-accent/5 to-teal/5 rounded-3xl blur-sm" />
              <div className="relative p-4">
                <ImageGallery />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
