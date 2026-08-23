import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BackToTop from './components/common/BackToTop'
import CustomCursor from './components/common/CustomCursor'
import TornEdge from './components/common/TornEdge'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Research from './components/sections/Research'
import Projects from './components/sections/Projects'
import Team from './components/sections/Team'
import News from './components/sections/News'
import Contact from './components/sections/Contact'
import MemberDetail from './components/sections/MemberDetail'
import ProjectDetail from './components/sections/ProjectDetail'
import NewsDetail from './components/sections/NewsDetail'
import ProjectList from './components/sections/ProjectList'
import NewsList from './components/sections/NewsList'

const ParticleBackground = lazy(() => import('./components/effects/ParticleBackground'))

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

export default function App() {
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedNewsId, setSelectedNewsId] = useState(null)
  const [showAllNews, setShowAllNews] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)

  // Lenis smooth scroll
  useEffect(() => {
    let lenis
    async function initLenis() {
      const Lenis = (await import('lenis')).default
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }
    initLenis()
    return () => lenis?.destroy()
  }, [])

  // Scroll to top when detail views open
  useEffect(() => {
    if (selectedMemberId || selectedProjectId || selectedNewsId || showAllNews || showAllProjects) {
      window.scrollTo(0, 0)
    }
  }, [selectedMemberId, selectedProjectId, selectedNewsId, showAllNews, showAllProjects])

  function backToSection(sectionId) {
    setSelectedMemberId(null)
    setSelectedProjectId(null)
    setSelectedNewsId(null)
    setShowAllNews(false)
    setShowAllProjects(false)
    setTimeout(() => {
      const el = document.querySelector(sectionId)
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
    }, 100)
  }

  function goBackToMain() {
    setSelectedMemberId(null)
    setSelectedProjectId(null)
    setSelectedNewsId(null)
    setShowAllNews(false)
    setShowAllProjects(false)
  }

  function selectMemberFromDetail(memberId) {
    setSelectedProjectId(null)
    setSelectedNewsId(null)
    setSelectedMemberId(memberId)
    window.scrollTo(0, 0)
  }

  const isDetailView = selectedMemberId || selectedProjectId || selectedNewsId || showAllProjects || showAllNews

  const renderDetailView = () => {
    if (selectedMemberId) {
      return (
        <motion.div key="member-detail" variants={pageVariants} initial="initial" animate="animate" exit="exit"
          className="bg-cream text-ink font-body text-base">
          <Navbar onNavigate={backToSection} />
          <MemberDetail memberId={selectedMemberId} onBack={() => backToSection('#team')}
            onSelectProject={(id) => { setSelectedMemberId(null); setSelectedProjectId(id) }} />
          <Footer />
          <BackToTop />
        </motion.div>
      )
    }
    if (selectedProjectId) {
      return (
        <motion.div key="project-detail" variants={pageVariants} initial="initial" animate="animate" exit="exit"
          className="bg-rice-paper text-ink-black font-body text-base">
          <Navbar onNavigate={backToSection} />
          <ProjectDetail projectId={selectedProjectId} onBack={() => backToSection('#projects')}
            onSelectMember={selectMemberFromDetail} />
          <Footer />
          <BackToTop />
        </motion.div>
      )
    }
    if (selectedNewsId) {
      return (
        <motion.div key="news-detail" variants={pageVariants} initial="initial" animate="animate" exit="exit"
          className="bg-rice-paper text-ink-black font-body text-base">
          <Navbar onNavigate={backToSection} />
          <NewsDetail newsId={selectedNewsId} onBack={() => backToSection('#news')}
            onSelectMember={selectMemberFromDetail} />
          <Footer />
          <BackToTop />
        </motion.div>
      )
    }
    if (showAllProjects) {
      return (
        <motion.div key="project-list" variants={pageVariants} initial="initial" animate="animate" exit="exit"
          className="bg-rice-paper text-ink-black font-body text-base">
          <Navbar onNavigate={backToSection} />
          <ProjectList onBack={goBackToMain}
            onSelectProject={(id) => { setShowAllProjects(false); setSelectedProjectId(id) }} />
          <Footer />
          <BackToTop />
        </motion.div>
      )
    }
    if (showAllNews) {
      return (
        <motion.div key="news-list" variants={pageVariants} initial="initial" animate="animate" exit="exit"
          className="bg-rice-paper text-ink-black font-body text-base">
          <Navbar onNavigate={backToSection} />
          <NewsList onBack={goBackToMain}
            onSelectNews={(id) => { setShowAllNews(false); setSelectedNewsId(id) }} />
          <Footer />
          <BackToTop />
        </motion.div>
      )
    }
    return null
  }

  return (
    <>
      <CustomCursor />
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      <AnimatePresence mode="wait">
        {isDetailView ? (
          renderDetailView()
        ) : (
          <motion.div key="main" variants={pageVariants} initial="initial" animate="animate" exit="exit"
            className="relative bg-rice-paper text-ink-black font-body text-base">
            <Navbar />
            <Hero />
            <About />
            <TornEdge upperColor="#f0ece6" lowerColor="#faf7f2" />
            <Research />
            <TornEdge upperColor="#faf7f2" lowerColor="#f0ece6" />
            <Projects
              onSelectProject={setSelectedProjectId}
              onViewAllProjects={() => setShowAllProjects(true)}
            />
            <TornEdge upperColor="#f0ece6" lowerColor="#faf7f2" />
            <Team onSelectMember={setSelectedMemberId} />
            <TornEdge upperColor="#faf7f2" lowerColor="#f0ece6" />
            <News
              onSelectNews={setSelectedNewsId}
              onViewAllNews={() => setShowAllNews(true)}
            />
            <Contact />
            <Footer />
            <BackToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
