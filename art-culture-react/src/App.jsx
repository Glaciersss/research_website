import { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BackToTop from './components/common/BackToTop'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Research from './components/sections/Research'
import Projects from './components/sections/Projects'
import Team from './components/sections/Team'
import News from './components/sections/News'
import Contact from './components/sections/Contact'
import MemberDetail from './components/sections/MemberDetail'
import ProjectDetail from './components/sections/ProjectDetail'
import ProjectList from './components/sections/ProjectList'
import NewsDetail from './components/sections/NewsDetail'
import NewsList from './components/sections/NewsList'

function App() {
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedNewsId, setSelectedNewsId] = useState(null)
  const [showAllNews, setShowAllNews] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)

  useEffect(() => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
      })
    }
  }, [])

  useEffect(() => {
    if (selectedMemberId || selectedProjectId || selectedNewsId || showAllNews || showAllProjects) {
      window.scrollTo(0, 0)
    }
  }, [selectedMemberId, selectedProjectId, selectedNewsId, showAllNews, showAllProjects])

  const backToSection = (sectionId) => {
    setSelectedMemberId(null)
    setSelectedProjectId(null)
    setSelectedNewsId(null)
    setShowAllNews(false)
    setShowAllProjects(false)
    setTimeout(() => {
      const el = document.querySelector(sectionId)
      if (el) {
        window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
      }
    }, 100)
  }

  const goBackToMain = () => {
    setSelectedMemberId(null)
    setSelectedProjectId(null)
    setSelectedNewsId(null)
    setShowAllNews(false)
    setShowAllProjects(false)
  }

  if (selectedMemberId) {
    return (
      <div className="bg-rice-paper text-ink-black font-serif text-lg">
        <Navbar onNavigate={backToSection} />
        <MemberDetail
          memberId={selectedMemberId}
          onBack={() => backToSection('#team')}
          onSelectProject={(id) => { setSelectedMemberId(null); setSelectedProjectId(id) }}
        />
        <Footer />
        <BackToTop />
      </div>
    )
  }

  const selectMemberFromDetail = (memberId) => {
    setSelectedProjectId(null)
    setSelectedNewsId(null)
    setSelectedMemberId(memberId)
    window.scrollTo(0, 0)
  }

  if (selectedProjectId) {
    return (
      <div className="bg-rice-paper text-ink-black font-serif text-lg">
        <Navbar onNavigate={backToSection} />
        <ProjectDetail
          projectId={selectedProjectId}
          onBack={() => backToSection('#projects')}
          onSelectMember={selectMemberFromDetail}
        />
        <Footer />
        <BackToTop />
      </div>
    )
  }

  if (selectedNewsId) {
    return (
      <div className="bg-rice-paper text-ink-black font-serif text-lg">
        <Navbar onNavigate={backToSection} />
        <NewsDetail
          newsId={selectedNewsId}
          onBack={() => backToSection('#news')}
          onSelectMember={selectMemberFromDetail}
        />
        <Footer />
        <BackToTop />
      </div>
    )
  }

  if (showAllProjects) {
    return (
      <div className="bg-rice-paper text-ink-black font-serif text-lg">
        <Navbar onNavigate={backToSection} />
        <ProjectList
          onBack={goBackToMain}
          onSelectProject={(id) => { setShowAllProjects(false); setSelectedProjectId(id) }}
        />
        <Footer />
        <BackToTop />
      </div>
    )
  }

  if (showAllNews) {
    return (
      <div className="bg-rice-paper text-ink-black font-serif text-lg">
        <Navbar onNavigate={backToSection} />
        <NewsList
          onBack={goBackToMain}
          onSelectNews={(id) => { setShowAllNews(false); setSelectedNewsId(id) }}
        />
        <Footer />
        <BackToTop />
      </div>
    )
  }

  return (
    <div className="bg-rice-paper text-ink-black font-serif text-lg">
      <Navbar />
      <Hero />
      <About />
      <Research />
      <Projects onSelectProject={setSelectedProjectId} onViewAllProjects={() => setShowAllProjects(true)} />
      <Team onSelectMember={setSelectedMemberId} />
      <News onSelectNews={setSelectedNewsId} onViewAllNews={() => setShowAllNews(true)} />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
