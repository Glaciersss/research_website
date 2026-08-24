import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import FloatingBlobs from '../common/FloatingBlobs'
import ScrollReveal from '../common/ScrollReveal'

const FALLBACK_IMAGES = [
  'https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/3485e18b22fe4d5e91205b69ecb95afc~tplv-a9rns2rl98-image.image?rcl=20251026135537B60115FDD75F0328FA88&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1764050163&x-signature=jP5zKu8iWLdYfyLzwKYSmYJSCOA%3D',
]

function ImageGallery() {
  const [images, setImages] = useState([])
  const [current, setCurrent] = useState(0)
  const [imageSizes, setImageSizes] = useState({})

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

  const getIndex = useCallback(
    (offset) => ((current + offset) % list.length + list.length) % list.length,
    [current, list.length]
  )

  const getAspectRatio = useCallback(
    (index) => {
      const size = imageSizes[index]
      if (!size?.width || !size?.height) return 4 / 5
      return size.width / size.height
    },
    [imageSizes]
  )

  const rememberImageSize = useCallback((index, event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    if (!naturalWidth || !naturalHeight) return

    setImageSizes((prev) => {
      const existing = prev[index]
      if (existing?.width === naturalWidth && existing?.height === naturalHeight) {
        return prev
      }

      return {
        ...prev,
        [index]: { width: naturalWidth, height: naturalHeight },
      }
    })
  }, [])

  const cards =
    list.length > 1
      ? [
          { offset: -2, left: -370, top: '42%', height: 220, maxWidth: 220, rotateY: 50, scale: 0.9, opacity: 0.32, zIndex: 1, translateZ: -220, hiddenOnMobile: true },
          { offset: -1, left: -155, top: '32%', height: 320, maxWidth: 320, rotateY: 34, scale: 0.96, opacity: 0.72, zIndex: 8, translateZ: -40 },
          { offset: 0, left: 95, top: '15%', height: 500, maxWidth: 820, rotateY: 0, scale: 1, opacity: 1, zIndex: 20, translateZ: 180 },
          { offset: 1, left: 870, top: '32%', height: 320, maxWidth: 320, rotateY: -34, scale: 0.96, opacity: 0.72, zIndex: 8, translateZ: -40 },
          { offset: 2, left: 1195, top: '42%', height: 220, maxWidth: 220, rotateY: -50, scale: 0.9, opacity: 0.32, zIndex: 1, translateZ: -220, hiddenOnMobile: true },
        ]
      : [{ offset: 0, left: 95, top: '15%', height: 500, maxWidth: 820, rotateY: 0, scale: 1, opacity: 1, zIndex: 20, translateZ: 180 }]

  return (
    <div className="w-full space-y-3">
      <div
        className="relative w-full max-w-[1000px] mx-auto h-[340px] md:h-[540px] overflow-visible -translate-y-[30px]"
        style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
      >
        {cards.map((card) => {
          const imageIndex = getIndex(card.offset)
          const naturalWidth = Math.round(card.height * getAspectRatio(imageIndex))
          const width = Math.min(naturalWidth, card.maxWidth)

          return (
            <motion.button
              key={`${imageIndex}-${card.offset}`}
              type="button"
              onClick={() => goTo(imageIndex)}
              initial={false}
              animate={{
                top: card.top,
                left: card.left,
                width,
                height: card.height,
                opacity: card.opacity,
                scale: card.scale,
                rotateY: card.rotateY,
                translateZ: card.translateZ,
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute -translate-y-1/2 -translate-x-1/2 rounded-[2rem] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.18)] ${
                card.hiddenOnMobile ? 'hidden md:block' : 'block'
              } ${card.offset === 0 ? 'cursor-default' : 'cursor-pointer'}`}
              style={{
                zIndex: card.zIndex,
                transformStyle: 'preserve-3d',
              }}
              whileHover={
                card.offset === 0
                  ? undefined
                  : { scale: card.scale + 0.03, opacity: Math.min(card.opacity + 0.12, 1) }
              }
            >
              <img
                src={list[imageIndex]}
                alt={`展示 ${imageIndex + 1}`}
                onLoad={(event) => rememberImageSize(imageIndex, event)}
                className="w-full h-full object-contain bg-transparent"
              />
              <div
                className={`absolute inset-0 ${
                  card.offset === 0
                    ? 'bg-gradient-to-t from-black/10 via-transparent to-white/5'
                    : 'bg-gradient-to-t from-black/18 via-transparent to-white/5'
                }`}
              />
            </motion.button>
          )
        })}
      </div>

      {list.length > 1 && (
        <div className="flex items-center justify-center mt-0">
          <div className="flex justify-center gap-2 translate-y-[120px]">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 h-2.5 bg-coral'
                    : 'w-2.5 h-2.5 bg-stone/25 hover:bg-stone/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
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
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-4">近期成果</h2>
            <div className="w-20 h-1 bg-warm-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        <div className="w-full max-w-[1240px] mx-auto">
          <ScrollReveal direction="right" delay={0.3}>
            <div className="relative flex justify-center">
              <div className="relative w-full flex justify-center">
                <ImageGallery />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
