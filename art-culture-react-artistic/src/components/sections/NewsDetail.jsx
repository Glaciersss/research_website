import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import GlassCard from '../common/GlassCard'
import MagneticButton from '../common/MagneticButton'
import ScrollReveal from '../common/ScrollReveal'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function parseJson(raw) {
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

export default function NewsDetail({ newsId, onBack, onSelectMember }) {
  const [news, setNews] = useState(null)
  const [relatedProjects, setRelatedProjects] = useState([])
  const [relatedMembers, setRelatedMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadNews() }, [newsId])

  async function loadNews() {
    setLoading(true)
    try {
      const data = await api.getNewsById(newsId)
      setNews(data)
      setRelatedProjects(parseJson(data.related_project_ids))
      if (data.related_member_ids) {
        const res = await fetch(`/api/team/batch?ids=${data.related_member_ids}`)
        const members = await res.json()
        setRelatedMembers(members || [])
      }
    } catch {}
    setLoading(false)
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-rice-paper pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="skeleton h-10 w-32 mb-8" />
          <div className="glass p-8 rounded-2xl space-y-4">
            <div className="flex gap-3"><div className="skeleton h-6 w-20" /><div className="skeleton h-6 w-32" /></div>
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-60 w-full" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      </section>
    )
  }

  if (!news) {
    return (
      <section className="min-h-screen bg-rice-paper pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center text-stone/50">新闻未找到</div>
      </section>
    )
  }

  const images = parseJson(news.image_url).length > 0 ? parseJson(news.image_url) : (news.image_url ? [news.image_url] : [])

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-rice-paper pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <MagneticButton
          onClick={onBack}
          className="mb-10 px-5 py-2.5 rounded-full border border-accent/20 text-accent hover:text-white hover:bg-accent-gradient transition-all text-base flex items-center gap-2"
        >
          <i className="fa fa-arrow-left" /> 返回新闻动态
        </MagneticButton>

        <GlassCard intense accent className="p-8 md:p-10">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-base px-3 py-1 rounded-full bg-cinnabar/15 text-cinnabar">{news.type}</span>
              <span className="text-stone/40 text-base">{formatDate(news.date)}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display text-gradient-warm mb-6">{news.title}</h1>

            {relatedMembers.length > 0 && (
              <div className="mb-8">
                <span className="text-stone/40 text-base mr-2">作者：</span>
                {relatedMembers.map((m, i) => (
                  <span key={m.id}>
                    <button onClick={() => onSelectMember?.(m.id)} className="text-cinnabar hover:underline text-base">{m.name}</button>
                    {i < relatedMembers.length - 1 && <span className="text-stone/20 mx-1">,</span>}
                  </span>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* Images */}
          {images.length > 0 && (
            <ScrollReveal delay={0.1}>
              <div className={`mb-10 ${images.length === 1 ? 'max-w-2xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
                {images.map((url, i) => (
                  <img key={i} src={url} alt={`配图${i + 1}`} className="w-full rounded-xl" />
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Content */}
          <ScrollReveal delay={0.15}>
            <div className="text-stone/70 leading-relaxed whitespace-pre-wrap text-base mb-10">{news.content}</div>
          </ScrollReveal>

          {/* Related papers */}
          {relatedProjects.length > 0 && (
            <ScrollReveal delay={0.2}>
              <div className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-display text-gradient mb-6">相关论文</h2>
                <div className="space-y-3">
                  {relatedProjects.map((p, i) => (
                    <GlassCard key={i} className="p-4">
                      <h3 className="text-base font-display text-gradient-warm mb-2">{p.title}</h3>
                      <div className="flex flex-wrap gap-4 text-stone/40 text-base mb-2">
                        {p.authors && <span>{p.authors}</span>}
                        {p.date && <span>{p.date}</span>}
                      </div>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center text-cinnabar text-base hover:underline gap-1">
                          <i className="fa fa-external-link" /> DOI
                        </a>
                      )}
                    </GlassCard>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </GlassCard>
      </div>
    </motion.section>
  )
}
