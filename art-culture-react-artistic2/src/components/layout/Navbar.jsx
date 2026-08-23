import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { href: '#home', label: '首页' },
  { href: '#about', label: '关于我们' },
  { href: '#research', label: '研究方向' },
  { href: '#projects', label: '学术成果' },
  { href: '#team', label: '团队成员' },
  { href: '#news', label: '新闻动态' },
  { href: '#contact', label: '联系我们' },
]

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
      const sections = document.querySelectorAll('section')
      let current = 'home'
      sections.forEach((section) => {
        const top = section.offsetTop - 120
        const h = section.clientHeight
        if (window.scrollY >= top && window.scrollY < top + h) {
          current = section.getAttribute('id')
        }
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleNav(e, targetId) {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(targetId)
    } else {
      const el = document.querySelector(targetId)
      if (el) {
        window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-2 bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
          : 'py-3 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" onClick={(e) => handleNav(e, '#home')} className="flex items-center">
          <motion.img
            src="/logo.svg"
            alt="艺术与文化智能计算"
            className="h-16 md:h-20"
            whileHover={{ scale: 1.05 }}
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1)
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                className={`relative px-4 py-2 text-xl font-medium rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-coral'
                    : 'text-stone hover:text-ink'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-coral/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-ink"
        >
          <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
          </motion.div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border/50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNav(e, item.href)}
                  className={`py-3 px-4 rounded-xl text-xl transition-all ${
                    activeSection === item.href.substring(1)
                      ? 'bg-coral/10 text-coral'
                      : 'text-stone hover:bg-warm-gray hover:text-ink'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
