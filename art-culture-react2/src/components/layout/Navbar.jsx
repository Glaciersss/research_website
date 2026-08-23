import { useState, useEffect } from 'react'

const navItems = [
  { href: '#home', label: '首页' },
  { href: '#about', label: '关于我们' },
  { href: '#research', label: '研究方向' },
  { href: '#projects', label: '学术成果' },
  { href: '#team', label: '团队成员' },
  { href: '#news', label: '新闻动态' },
  { href: '#contact', label: '联系我们' },
]

function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      highlightCurrentSection()
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const highlightCurrentSection = () => {
    const sections = document.querySelectorAll('section')
    let current = 'home'

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.clientHeight

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id')
      }
    })

    setActiveSection(current)
  }

  const handleNav = (e, targetId) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(targetId)
    } else {
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-rice-paper bg-opacity-95 shadow-md z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-3'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/logo.svg"
            alt="艺术与文化智能计算"
            className="h-20 mr-3"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 ml-auto">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className={`nav-link text-lg ${
                activeSection === item.href.substring(1) ? 'active-nav' : ''
              } text-ink-black hover:text-cinnabar`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-ink-black focus:outline-none"
        >
          <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-rice-paper border-t border-gray-200">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                className="py-2 text-lg text-ink-black hover:text-cinnabar"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
