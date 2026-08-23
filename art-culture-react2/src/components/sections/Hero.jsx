import { useState, useEffect, useCallback } from 'react'

const FALLBACK_BGS = [
  "url('https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/3485e18b22fe4d5e91205b69ecb95afc~tplv-a9rns2rl98-image.image?rcl=20251026135537B60115FDD75F0328FA88&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1764050163&x-signature=jP5zKu8iWLdYfyLzwKYSmYJSCOA%3D')"
]

function Hero() {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/api/public/hero-bg')
      .then(res => res.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          setImages(data.images)
        }
      })
      .catch(() => {})
  }, [])

  const bgs = images.length > 0 ? images : FALLBACK_BGS

  const prev = useCallback(() => {
    setCurrentIndex(i => (i === 0 ? bgs.length - 1 : i - 1))
  }, [bgs.length])

  const next = useCallback(() => {
    setCurrentIndex(i => (i === bgs.length - 1 ? 0 : i + 1))
  }, [bgs.length])

  // Auto-rotate
  useEffect(() => {
    if (bgs.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [bgs.length, next])

  const smoothScroll = (e, targetId) => {
    e.preventDefault()
    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
    >
      {bgs.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: typeof bg === 'string' ? `url(${bg})` : `url(${bg})`,
            opacity: index === currentIndex ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

      {/* Arrows */}
      {bgs.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl w-12 h-12 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
          >
            &#8249;
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl w-12 h-12 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
          >
            &#8250;
          </button>
        </>
      )}

      {/* Dots */}
      {bgs.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {bgs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 z-10 text-center" data-aos="fade-up">
        <h1 className="text-5xl md:text-7xl font-display text-white mb-6 text-shadow">
          艺术与文化智能计算
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto text-shadow">
          智能理解文化，数据洞察文明
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="#about"
            onClick={(e) => smoothScroll(e, '#about')}
            className="bg-cinnabar text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all scroll-effect"
          >
            了解更多
          </a>
          <a
            href="#research"
            onClick={(e) => smoothScroll(e, '#research')}
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded hover:bg-white hover:text-ink-black transition-all scroll-effect"
          >
            研究方向
          </a>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10">
        <a
          href="#about"
          onClick={(e) => smoothScroll(e, '#about')}
          className="flex flex-col items-center"
        >
          <span className="mb-2">向下滚动</span>
          <i className="fa fa-chevron-down"></i>
        </a>
      </div>
    </section>
  )
}

export default Hero
