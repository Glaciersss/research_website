import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function NewsList({ onBack, onSelectNews }) {
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadNews() }, [])

  const loadNews = async () => {
    setLoading(true)
    try {
      const res = await api.getNews(1, 100)
      setNewsList(res?.items || [])
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

  return (
    <section className="py-20 bg-rice-paper min-h-screen">
      <div className="container mx-auto px-4">
        <button onClick={onBack}
          className="mb-8 px-4 py-2 text-sepia border border-sepia rounded hover:bg-sepia hover:text-white transition-all">
          <i className="fa fa-arrow-left mr-2"></i>返回主页
        </button>

        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-display text-sepia mb-4">全部新闻动态</h2>
          <div className="section-underline mx-auto"></div>
        </div>

        <div className="space-y-6">
          {newsList.map((news, index) => (
            <div key={news.id} className="ink-wash-card cursor-pointer" data-aos="fade-up" data-aos-delay={(index + 1) * 50}
              onClick={() => onSelectNews && onSelectNews(news.id)}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-cinnabar bg-opacity-20 text-cinnabar text-sm px-3 py-1 rounded-full">{news.type}</span>
                  <span className="text-gray-500 text-base">{formatDate(news.date)}</span>
                </div>
                <h3 className="text-2xl font-display text-sepia mb-2">{news.title}</h3>
                <p className="text-gray-700 text-base">{news.content?.substring(0, 150)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsList
