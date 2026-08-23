import { useState, useEffect } from 'react'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 bg-cinnabar text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50 ${
        visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <i className="fa fa-chevron-up"></i>
    </button>
  )
}

export default BackToTop
