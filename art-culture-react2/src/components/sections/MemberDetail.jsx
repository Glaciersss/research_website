import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function MemberDetail({ memberId, onBack, onSelectProject }) {
  const [member, setMember] = useState(null)
  const [linkedProjects, setLinkedProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMember()
  }, [memberId])

  const parseAchievementIds = (achievements) => {
    if (!achievements) return []
    try {
      const parsed = JSON.parse(achievements)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const loadMember = async () => {
    setLoading(true)
    try {
      const data = await api.getMemberById(memberId)
      setMember(data)

      const ids = parseAchievementIds(data.achievements)
      if (ids.length > 0) {
        try {
          const projectsData = await api.getProjectsBatch(ids.join(','))
          setLinkedProjects(Array.isArray(projectsData) ? projectsData : [])
        } catch {}
      } else {
        setLinkedProjects([])
      }
    } catch (error) {
      console.error('Failed to load member:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <section className="py-20 bg-ink-wash bg-opacity-30 min-h-screen">
        <div className="container mx-auto px-4 text-center">加载中...</div>
      </section>
    )
  }

  if (!member) {
    return (
      <section className="py-20 bg-ink-wash bg-opacity-30 min-h-screen">
        <div className="container mx-auto px-4 text-center">成员信息未找到</div>
      </section>
    )
  }

  const getCategoryLabel = (cat) => {
    if (cat === 'faculty') return '导师'
    if (cat === '在读生') return '在读生'
    if (cat === '毕业生' || cat === 'student') return '毕业生'
    if (cat === 'researcher') return '在读生'
    return cat
  }

  return (
    <section className="py-20 bg-ink-wash bg-opacity-30 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="mb-8 px-4 py-2 text-sepia border border-sepia rounded hover:bg-sepia hover:text-white transition-all"
        >
          <i className="fa fa-arrow-left mr-2"></i>返回团队列表
        </button>

        <div className="ink-wash-card p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-rice-paper shadow-lg mx-auto"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-ink-wash flex items-center justify-center border-4 border-rice-paper shadow-lg mx-auto">
                  <i className="fa fa-user text-6xl text-gray-400"></i>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-display text-sepia mb-2">{member.name}</h2>
              <p className="text-cinnabar text-lg mb-2">{member.role}</p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">类别：</span>
                {getCategoryLabel(member.category)}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">研究方向：</span>{member.research || '暂无'}
              </p>
              {member.email && (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">邮箱：</span>
                  <a href={`mailto:${member.email}`} className="text-cinnabar hover:underline">{member.email}</a>
                </p>
              )}
              {member.website && (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">个人网站：</span>
                  <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-cinnabar hover:underline">{member.website}</a>
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-rice-paper pt-6 mb-6">
            <h3 className="text-xl font-display text-sepia mb-4">个人介绍</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {member.bio || '暂无介绍'}
            </p>
          </div>

          <div className="border-t border-rice-paper pt-6">
            <h3 className="text-xl font-display text-sepia mb-4">已有成果</h3>
            {linkedProjects.length > 0 ? (
              <ul className="space-y-3">
                {linkedProjects.map(project => (
                  <li key={project.id}>
                    <button
                      onClick={() => onSelectProject && onSelectProject(project.id)}
                      className="text-left w-full p-3 rounded border border-gray-200 hover:border-cinnabar hover:bg-rice-paper transition-all"
                    >
                      <span className="text-sepia text-base">{project.title}</span>
                      {project.authors && (
                        <span className="text-gray-500 text-sm ml-2">— {project.authors}</span>
                      )}
                      {project.year && (
                        <span className="text-gray-400 text-sm ml-2">({project.year})</span>
                      )}
                      <span className="text-cinnabar text-sm float-right mt-1">
                        查看详情 <i className="fa fa-arrow-right ml-1"></i>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {(() => {
                  try { JSON.parse(member.achievements); return '暂无关联成果' }
                  catch { return member.achievements || '暂无成果' }
                })()}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MemberDetail
