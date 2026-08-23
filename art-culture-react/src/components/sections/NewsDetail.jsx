import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function NewsDetail({ newsId, onBack, onSelectMember }) {
  const [news, setNews] = useState(null)
  const [relatedProjects, setRelatedProjects] = useState([])
  const [relatedMembers, setRelatedMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadNews() }, [newsId])

  const parseRelatedPapers = (raw) => {
    if (!raw) return []
    try { return JSON.parse(raw) } catch { return [] }
  }

  const loadNews = async () => {
    setLoading(true)
    try {
      const data = await api.getNewsById(newsId)
      setNews(data)
      setRelatedProjects(data.related_project_ids ? parseRelatedPapers(data.related_project_ids) : [])
      if (data.related_member_ids) {
        const res = await fetch(`/api/team/batch?ids=${data.related_member_ids}`)
        const members = await res.json()
        setRelatedMembers(members || [])
      }
    } catch (error) {
      console.error('Failed to load news:', error)
    }
    setLoading(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <section className="py-20 bg-rice-paper min-h-screen">
        <div className="container mx-auto px-4 text-center">加载中...</div>
      </section>
    )
  }

  if (!news) {
    return (
      <section className="py-20 bg-rice-paper min-h-screen">
        <div className="container mx-auto px-4 text-center">新闻未找到</div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-rice-paper min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={onBack}
          className="mb-8 px-4 py-2 text-sepia border border-sepia rounded hover:bg-sepia hover:text-white transition-all">
          <i className="fa fa-arrow-left mr-2"></i>返回新闻动态
        </button>

        <div className="ink-wash-card p-8" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-cinnabar bg-opacity-20 text-cinnabar text-sm px-3 py-1 rounded-full">{news.type}</span>
            <span className="text-gray-500 text-sm">{formatDate(news.date)}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-sepia mb-6">{news.title}</h1>

          {relatedMembers.length > 0 && (
            <div className="mb-6">
              <span className="text-sm text-gray-500 mr-2">作者：</span>
              {relatedMembers.map((m, i) => (
                <span key={m.id}>
                  <button onClick={() => onSelectMember && onSelectMember(m.id)}
                    className="text-cinnabar hover:underline">{m.name}</button>
                  {i < relatedMembers.length - 1 && <span className="text-gray-400 mx-1">,</span>}
                </span>
              ))}
            </div>
          )}

          {(() => {
            const images = (() => { try { return JSON.parse(news.image_url) } catch { return news.image_url ? [news.image_url] : [] } })()
            return images.length > 0 && (
              <div className={`mb-8 ${images.length === 1 ? 'max-w-2xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
                {images.map((url, i) => (
                  <img key={i} src={url} alt={`${news.title} - 配图${i + 1}`} className="w-full h-auto rounded shadow-lg" />
                ))}
              </div>
            )
          })()}

          <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap mb-8">{news.content}</div>

          {relatedProjects.length > 0 && (
            <div className="border-t border-rice-paper pt-8">
              <h2 className="text-2xl font-display text-sepia mb-6">相关论文</h2>
              <div className="space-y-4">
                {relatedProjects.map((p, i) => (
                  <div key={i} className="bg-rice-paper p-4 rounded border border-gray-200">
                    <h3 className="text-lg font-title text-sepia mb-2">{p.title}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mb-2">
                      {p.authors && <span>{p.authors}</span>}
                      {p.date && <span>{p.date}</span>}
                    </div>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center text-cinnabar hover:underline text-sm">
                        <i className="fa fa-external-link mr-1"></i> DOI
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewsDetail
