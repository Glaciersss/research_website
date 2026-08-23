import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import GlassCard from '../common/GlassCard'
import ScrollReveal, { StaggerItem } from '../common/ScrollReveal'
import MagneticButton from '../common/MagneticButton'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getEventDay(d) {
  if (!d) return ''
  return new Date(d).getDate().toString()
}

function getEventDate(d, time) {
  if (!d) return ''
  const date = new Date(d)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${time || ''}`
}

export default function News({ onSelectNews, onViewAllNews }) {
  const [newsList, setNewsList] = useState([])
  const [notices, setNotices] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([api.getNews(1, 100), api.getNotices(), api.getEvents()])
      .then(([newsRes, n, e]) => {
        setNewsList(newsRes?.items || [])
        setNotices(n || [])
        setEvents(e || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayedNews = newsList.slice(0, 3)

  if (loading) {
    return (
      <section id="news" className="py-24 bg-rice-paper">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display text-gradient mb-4">新闻动态</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass p-6 rounded-2xl">
                  <div className="skeleton h-4 w-20 mb-3" />
                  <div className="skeleton h-6 w-3/4 mb-3" />
                  <div className="skeleton h-4 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="glass p-6 rounded-2xl">
                <div className="skeleton h-5 w-20 mb-4" />
                <div className="skeleton h-4 w-full mb-2" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="news" className="relative py-24 md:py-32 bg-rice-paper">
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-4">新闻动态</h2>
            <div className="w-20 h-1 bg-accent-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News list */}
          <div className="lg:col-span-2">
            <ScrollReveal staggerChildren>
              <div className="space-y-5">
                {displayedNews.map((news) => (
                  <StaggerItem key={news.id}>
                    <GlassCard
                      hover
                      onClick={() => onSelectNews?.(news.id)}
                      className="p-6 cursor-pointer group flex gap-5"
                      accent
                    >
                      <div className="hidden sm:block w-px bg-gradient-to-b from-cinnabar to-transparent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl px-3 py-1 rounded-full bg-cinnabar/15 text-cinnabar">
                            {news.type}
                          </span>
                          <span className="text-xl text-stone/50">{formatDate(news.date)}</span>
                        </div>
                        <h3 className="text-3xl font-display text-gradient-warm mb-2 group-hover:translate-x-1 transition-transform">
                          {news.title}
                        </h3>
                        <p className="text-stone/70 text-xl leading-relaxed">
                          {(news.content || '').substring(0, 150)}...
                        </p>
                        <span className="inline-flex items-center gap-1 text-cinnabar text-xl mt-3 group-hover:gap-2 transition-all">
                          阅读更多 <i className="fa fa-arrow-right text-xl" />
                        </span>
                      </div>
                    </GlassCard>
                  </StaggerItem>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notices */}
            <ScrollReveal direction="right" delay={0.2}>
              <GlassCard className="p-6">
                <h3 className="text-2xl font-display text-gradient mb-5 flex items-center gap-2">
                  <i className="fa fa-bullhorn text-cinnabar" />
                  通知公告
                </h3>
                <ul className="space-y-3">
                  {notices.map((n) => (
                    <li key={n.id}>
                      <a
                        href={n.link || '#'}
                        className="block p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <p className="text-ink/80 text-xl mb-1">{n.title}</p>
                        <p className="text-stone/40 text-xl">{formatDate(n.date)}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </ScrollReveal>

            {/* Events */}
            <ScrollReveal direction="right" delay={0.3}>
              <GlassCard className="p-6">
                <h3 className="text-2xl font-display text-gradient mb-5 flex items-center gap-2">
                  <i className="fa fa-calendar text-teal" />
                  投稿日历
                </h3>
                <ul className="space-y-3">
                  {events.map((evt) => (
                    <li key={evt.id}>
                      <a href="#" className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <span className="w-10 h-10 rounded-xl bg-teal/15 text-teal flex items-center justify-center text-xl font-bold flex-shrink-0">
                          {getEventDay(evt.date)}
                        </span>
                        <div>
                          <p className="text-ink/80 text-xl mb-0.5">{evt.title}</p>
                          <p className="text-stone/40 text-xl">
                            {getEventDate(evt.date, evt.time)}
                            {evt.location ? ` · ${evt.location}` : ''}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>

        {newsList.length > 3 && (
          <div className="text-center mt-14">
            <MagneticButton
              onClick={() => onViewAllNews?.()}
              className="px-8 py-3 rounded-full border border-accent/30 text-accent hover:text-white hover:bg-accent-gradient transition-all text-xl font-medium"
            >
              查看更多新闻动态
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  )
}
