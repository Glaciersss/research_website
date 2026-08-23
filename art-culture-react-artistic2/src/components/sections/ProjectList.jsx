import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import GlassCard from '../common/GlassCard'
import TiltCard from '../common/TiltCard'
import MagneticButton from '../common/MagneticButton'
import ScrollReveal, { StaggerItem } from '../common/ScrollReveal'

const typeLabels = { publication: '学术论文', project: '研究项目', teaching: '专业课程' }

function getFirstImage(url) {
  if (!url) return null
  try { const arr = JSON.parse(url); return arr[0] || null } catch { return url }
}

export default function ProjectList({ onBack, onSelectProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getProjects('all', 1, 100).then((res) => setProjects(res?.items || [])).catch(() => {}).finally(() => setLoading(false)) }, [])

  if (loading) {
    return (
      <section className="min-h-screen bg-rice-paper pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="skeleton h-10 w-32 mb-12" />
          <div className="space-y-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-28 w-full rounded-2xl" />)}
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-rice-paper pt-28 pb-20">
      <div className="container mx-auto px-4">
        <MagneticButton
          onClick={onBack}
          className="mb-10 px-5 py-2.5 rounded-full border border-accent/20 text-accent hover:text-white hover:bg-accent-gradient transition-all text-base flex items-center gap-2"
        >
          <i className="fa fa-arrow-left" /> 返回主页
        </MagneticButton>

        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display text-gradient mb-4">全部学术成果</h2>
            <div className="w-20 h-1 bg-gold-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        <ScrollReveal staggerChildren>
          <div className="space-y-4">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <TiltCard tiltDegree={2}>
                  <GlassCard hover onClick={() => onSelectProject?.(project.id)} className="p-6 cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base px-3 py-1 rounded-full bg-cinnabar/15 text-cinnabar">
                        {typeLabels[project.type] || project.type}
                      </span>
                      {project.year && <span className="text-stone/40 text-base">{project.year}</span>}
                    </div>
                    <div className="flex gap-5">
                      {getFirstImage(project.figure_url) && (
                        <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img src={getFirstImage(project.figure_url)} alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-display text-gradient-warm mb-2 group-hover:translate-x-1 transition-transform">
                          {project.title}
                        </h3>
                        {project.authors && <p className="text-stone/60 text-base mb-1">{project.authors}</p>}
                        <p className="text-stone/40 text-base line-clamp-2">
                          {(project.abstract || '').substring(0, 100)}{(project.abstract || '').length > 100 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </TiltCard>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </motion.section>
  )
}
