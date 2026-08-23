import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function News({ onSelectNews, onViewAllNews }) {
  const [newsList, setNewsList] = useState([])
  const [notices, setNotices] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [newsRes, noticesRes, eventsRes] = await Promise.all([
        api.getNews(1, 100),
        api.getNotices(),
        api.getEvents()
      ])
      setNewsList(newsRes?.items || [])
      setNotices(noticesRes || [])
      setEvents(eventsRes || [])
    } catch (error) {
      console.error('Failed to load news data:', error)
    }
    setLoading(false)
  }

  const displayedNews = newsList.slice(0, 3)

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getEventDay = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.getDate().toString()
  }

  const getEventDate = (dateString, time) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日 ${time || ''}`
  }
  if (loading) {
    return (
      <section id="news" className="py-20 bg-rice-paper">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-display text-sepia mb-4">新闻动态</h2>
            <div className="section-underline mx-auto"></div>
          </div>
          <div className="text-center">加载中...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="news" className="py-20 bg-rice-paper">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-display text-sepia mb-4">新闻动态</h2>
          <div className="section-underline mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧新闻列表 */}
          <div className="lg:col-span-2">
            {displayedNews.map((news, index) => (
              <div key={news.id} className="ink-wash-card mb-8 cursor-pointer" data-aos="fade-up" data-aos-delay={(index + 1) * 100}
                onClick={() => onSelectNews && onSelectNews(news.id)}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="inline-block bg-cinnabar bg-opacity-20 text-cinnabar text-xs px-3 py-1 rounded-full">
                      {news.type}
                    </span>
                    <span className="text-gray-600 text-sm">{formatDate(news.date)}</span>
                  </div>
                  <h3 className="text-2xl font-display text-sepia mb-3">{news.title}</h3>
                  <p className="text-gray-700 mb-4">{news.content?.substring(0, 200)}...</p>
                  <a href="#" className="text-cinnabar hover:underline flex items-center">
                    阅读更多 <i className="fa fa-arrow-right ml-2"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 右侧边栏 */}
          <div>
            {/* 通知公告 */}
            <div className="ink-wash-card mb-8" data-aos="fade-up" data-aos-delay="400">
              <div className="p-6">
                <h3 className="text-xl font-display text-sepia mb-4">通知公告</h3>
                <ul className="space-y-4">
                  {notices.map(notice => (
                    <li key={notice.id}>
                      <a href={notice.link || '#'} className="flex items-start hover:bg-ink-wash hover:bg-opacity-30 p-2 rounded transition-all">
                        <span className="text-cinnabar mr-3 mt-1"><i className="fa fa-bullhorn"></i></span>
                        <div>
                          <p className="text-gray-800">{notice.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{formatDate(notice.date)}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 投稿日历 */}
            <div className="ink-wash-card" data-aos="fade-up" data-aos-delay="500">
              <div className="p-6">
                <h3 className="text-xl font-display text-sepia mb-4">投稿日历</h3>
                <ul className="space-y-4">
                  {events.map(event => (
                    <li key={event.id}>
                      <a href="#" className="flex items-start hover:bg-ink-wash hover:bg-opacity-30 p-2 rounded transition-all">
                        <span className="bg-cinnabar text-white text-xs w-8 h-8 rounded flex items-center justify-center mr-3 mt-1">
                          {getEventDay(event.date)}
                        </span>
                        <div>
                          <p className="text-gray-800">{event.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{getEventDate(event.date, event.time)}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {newsList.length > 3 && (
          <div className="text-center mt-12">
            <button
              onClick={() => onViewAllNews && onViewAllNews()}
              className="bg-transparent border border-sepia text-sepia px-6 py-3 rounded hover:bg-sepia hover:text-white transition-all scroll-effect"
            >
              查看更多新闻动态
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default News
