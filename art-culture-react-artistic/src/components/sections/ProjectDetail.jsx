import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import GlassCard from '../common/GlassCard'
import MagneticButton from '../common/MagneticButton'
import ScrollReveal from '../common/ScrollReveal'

export default function ProjectDetail({ projectId, onBack, onSelectMember }) {
  const [project, setProject] = useState(null)
  const [relatedMembers, setRelatedMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProject() }, [projectId])

  async function loadProject() {
    setLoading(true)
    try {
      const data = await api.getProjectById(projectId)
      setProject(data)
      if (data.related_member_ids) {
        const res = await fetch(`/api/team/batch?ids=${data.related_member_ids}`)
        const members = await res.json()
        setRelatedMembers(members || [])
      }
    } catch {}
    setLoading(false)
  }

  const typeLabels = { publication: '学术论文', project: '研究项目', teaching: '专业课程' }
  const keywords = project?.keywords ? project.keywords.split(',').map((k) => k.trim()) : []
  const detailParagraphs = project?.detail_content ? project.detail_content.split('\n').filter((p) => p.trim()) : []
  const images = (() => { try { return JSON.parse(project?.figure_url) } catch { return project?.figure_url ? [project.figure_url] : [] } })()

  if (loading) {
    return (
      <section className="min-h-screen bg-rice-paper pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="skeleton h-10 w-32 mb-8" />
          <div className="glass p-8 rounded-2xl space-y-4">
            <div className="skeleton h-7 w-24" />
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-40 w-full mt-4" />
          </div>
        </div>
      </section>
    )
  }

  if (!project) {
    return (
      <section className="min-h-screen bg-rice-paper pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center text-stone/50">成果信息未找到</div>
      </section>
    )
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-rice-paper pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <MagneticButton
          onClick={onBack}
          className="mb-10 px-5 py-2.5 rounded-full border border-accent/20 text-accent hover:text-white hover:bg-accent-gradient transition-all text-base flex items-center gap-2"
        >
          <i className="fa fa-arrow-left" /> 返回学术成果
        </MagneticButton>

        <GlassCard intense accent className="p-8 md:p-10">
          {/* Title area */}
          <ScrollReveal>
            <span className="inline-block text-base px-3 py-1 rounded-full bg-cinnabar/15 text-cinnabar mb-5">
              {typeLabels[project.type] || project.type}
            </span>
            <h1 className="text-3xl md:text-4xl font-display text-gradient-warm mb-4">{project.title}</h1>
            {project.authors && <p className="text-stone mb-3">{project.authors}</p>}
            {relatedMembers.length > 0 && (
              <p className="text-stone mb-4">
                {relatedMembers.map((m, i) => (
                  <span key={m.id}>
                    <button onClick={() => onSelectMember?.(m.id)} className="text-cinnabar hover:underline">{m.name}</button>
                    {i < relatedMembers.length - 1 && <span className="mx-1 text-stone/30">,</span>}
                  </span>
                ))}
              </p>
            )}
            {(project.pdf_url || project.code_url || project.link) && (
              <div className="flex flex-wrap gap-3 mt-4">
                {project.pdf_url && (
                  <a href={project.pdf_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass text-cinnabar hover:bg-cinnabar/10 transition-all text-base">
                    <i className="fa fa-file-pdf-o" /> PDF
                  </a>
                )}
                {project.code_url && (
                  <a href={project.code_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass text-teal hover:bg-teal/10 transition-all text-base">
                    <i className="fa fa-code" /> Code
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass text-accent hover:bg-accent/10 transition-all text-base">
                    <i className="fa fa-external-link" /> DOI
                  </a>
                )}
              </div>
            )}
          </ScrollReveal>

          {/* Abstract */}
          {project.abstract && (
            <ScrollReveal delay={0.1}>
              <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="text-lg font-display text-gradient mb-4">Abstract</h2>
                <p className="text-stone/70 leading-relaxed text-justify text-base">{project.abstract}</p>
              </div>
            </ScrollReveal>
          )}

          {/* Type & Publication + Keywords */}
          <ScrollReveal delay={0.15}>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {project.type && (
                  <div className="mb-4">
                    <h2 className="text-base font-medium text-stone/50 mb-2">Type</h2>
                    <p className="text-ink text-base">{typeLabels[project.type]}</p>
                  </div>
                )}
                {project.publication_info && (
                  <div>
                    <h2 className="text-base font-medium text-stone/50 mb-2">Publication</h2>
                    <p className="text-ink text-base">{project.publication_info}</p>
                  </div>
                )}
              </div>
              {keywords.length > 0 && (
                <div>
                  <h2 className="text-base font-medium text-stone/50 mb-3">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((kw, i) => (
                      <span key={i} className="text-base px-3 py-1.5 rounded-full bg-white/10 text-stone/70">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Images */}
          {images.length > 0 && (
            <ScrollReveal delay={0.2}>
              <div className="mt-8">
                <div className={images.length === 1 ? 'max-w-2xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                  {images.map((url, i) => (
                    <img key={i} src={url} alt={`${project.title} - ${i + 1}`} className="w-full rounded-xl" />
                  ))}
                </div>
                {project.figure_caption && (
                  <p className="text-center text-stone/40 text-base mt-4">{project.figure_caption}</p>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Detail content */}
          {detailParagraphs.length > 0 && (
            <ScrollReveal delay={0.25}>
              <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="text-xl font-display text-gradient mb-5">详细内容</h2>
                <div className="space-y-4">
                  {detailParagraphs.map((p, i) => (
                    <p key={i} className="text-stone/70 leading-relaxed text-base text-justify">{p}</p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Citation */}
          {project.citation && (
            <ScrollReveal delay={0.3}>
              <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="text-xl font-display text-gradient mb-4">Citation</h2>
                <GlassCard className="p-5 bg-white/5 font-mono text-stone/60 text-base leading-relaxed">
                  {project.citation}
                </GlassCard>
              </div>
            </ScrollReveal>
          )}
        </GlassCard>
      </div>
    </motion.section>
  )
}
