import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { motion } from 'framer-motion'
import TiltCard from '../common/TiltCard'
import GlassCard from '../common/GlassCard'
import ScrollReveal, { StaggerItem } from '../common/ScrollReveal'
import MagneticButton from '../common/MagneticButton'

const filterOptions = [
  { value: 'all', label: '全部成果' },
  { value: 'publication', label: '学术论文' },
  { value: 'project', label: '研究项目' },
  { value: 'teaching', label: '专业课程' },
]

const typeLabels = { publication: '学术论文', project: '研究项目', teaching: '专业课程' }

function getFirstImage(url) {
  if (!url) return null
  try {
    const arr = JSON.parse(url)
    return arr[0] || null
  } catch {
    return url
  }
}

export default function Projects({ onSelectProject, onViewAllProjects }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    setLoading(true)
    api
      .getProjects(activeFilter)
      .then((res) => setProjects(res?.items || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeFilter])

  const displayedProjects = projects.slice(0, 3)

  return (
    <section id="projects" className="relative py-24 md:py-32 bg-rice-paper">
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-4">学术成果</h2>
            <div className="w-20 h-1 bg-gold-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`relative px-5 py-2 rounded-full text-xl font-medium transition-all duration-300 ${
                activeFilter === opt.value
                  ? 'text-white'
                  : 'text-stone/70 hover:text-ink'
              }`}
            >
              {activeFilter === opt.value && (
                <motion.div
                  layoutId="filter-active"
                  className="absolute inset-0 bg-accent-gradient rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-6 rounded-2xl">
                <div className="skeleton h-5 w-20 mb-4" />
                <div className="skeleton h-6 w-full mb-3" />
                <div className="skeleton h-40 w-full mb-4" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollReveal staggerChildren>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((project) => (
                <StaggerItem key={project.id}>
                  <TiltCard tiltDegree={4}>
                    <GlassCard
                      hover
                      onClick={() => onSelectProject?.(project.id)}
                      className="h-full flex flex-col overflow-hidden cursor-pointer group"
                    >
                      <div className="p-6 flex flex-col flex-1">
                        <span className="inline-block text-xl px-3 py-1 rounded-full bg-cinnabar/20 text-cinnabar mb-4 w-fit">
                          {typeLabels[project.type] || project.type}
                        </span>
                        <h3 className="text-3xl font-display text-gradient-warm mb-4">{project.title}</h3>
                        {getFirstImage(project.figure_url) && (
                          <div className="overflow-hidden rounded-xl mb-4">
                            <img
                              src={getFirstImage(project.figure_url)}
                              alt={project.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <p className="text-stone/70 text-xl mb-4 flex-1">
                          {(project.abstract || '').substring(0, 80)}
                          {(project.abstract || '').length > 80 ? '...' : ''}
                        </p>
                        <div className="flex justify-between items-center text-xl text-stone/50 pt-4 border-t border-white/10">
                          {project.authors && <span>{project.authors}</span>}
                          {project.year && <span>{project.year}</span>}
                        </div>
                      </div>
                      <div className="px-6 pb-5">
                        <span className="text-cinnabar text-xl flex items-center gap-1 group-hover:gap-2 transition-all">
                          查看详情 <i className="fa fa-arrow-right" />
                        </span>
                      </div>
                    </GlassCard>
                  </TiltCard>
                </StaggerItem>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* View more */}
        {projects.length > 3 && (
          <div className="text-center mt-14">
            <MagneticButton
              onClick={() => onViewAllProjects?.()}
              className="px-8 py-3 rounded-full border border-accent/30 text-accent hover:text-white hover:bg-accent-gradient transition-all text-xl font-medium"
            >
              查看更多学术成果
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  )
}
