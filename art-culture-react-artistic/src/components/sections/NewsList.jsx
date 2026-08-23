import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import GlassCard from '../common/GlassCard'
import TiltCard from '../common/TiltCard'
import MagneticButton from '../common/MagneticButton'
import ScrollReveal, { StaggerItem } from '../common/ScrollReveal'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function NewsList({ onBack, onSelectNews }) {
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getNews(1, 100).then((res) => setNewsList(res?.items || [])).catch(() => {}).finally(() => setLoading(false)) }, [])

  if (loading) {
    return (
      <section className="min-h-screen bg-rice-paper pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="skeleton h-10 w-32 mb-12" />
          <div className="space-y-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 w-full rounded-2xl" />)}
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
            <h2 className="text-4xl font-display text-gradient mb-4">全部新闻动态</h2>
            <div className="w-20 h-1 bg-accent-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        <ScrollReveal staggerChildren>
          <div className="space-y-4">
            {newsList.map((news) => (
              <StaggerItem key={news.id}>
                <TiltCard tiltDegree={2}>
                  <GlassCard hover onClick={() => onSelectNews?.(news.id)} className="p-6 cursor-pointer group" accent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base px-3 py-1 rounded-full bg-cinnabar/15 text-cinnabar">{news.type}</span>
                      <span className="text-stone/40 text-base">{formatDate(news.date)}</span>
                    </div>
                    <h3 className="text-xl font-display text-gradient-warm mb-2 group-hover:translate-x-1 transition-transform">
                      {news.title}
                    </h3>
                    <p className="text-stone/50 text-base">
                      {(news.content || '').substring(0, 150)}...
                    </p>
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
