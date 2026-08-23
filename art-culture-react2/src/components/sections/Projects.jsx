import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function Projects({ onSelectProject, onViewAllProjects }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    loadProjects()
  }, [activeFilter])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await api.getProjects(activeFilter)
      setProjects(response?.items || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
    setLoading(false)
  }

const filterOptions = [
  { value: 'all', label: '全部成果' },
  { value: 'publication', label: '学术论文' },
  { value: 'project', label: '研究项目' },
  { value: 'teaching', label: '教学活动' }
]

const getTypeLabel = (type) => {
  const labels = {
    publication: '学术论文',
    project: '研究项目',
    teaching: '教学活动'
  }
  return labels[type] || type
}

const getFirstImage = (figureUrl) => {
  if (!figureUrl) return null
  try { const arr = JSON.parse(figureUrl); return arr[0] || null } catch { return figureUrl }
}

const filteredProjects = projects.filter(project =>
  activeFilter === 'all' || project.type === activeFilter
)

const displayedProjects = filteredProjects.slice(0, 3)

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-rice-paper">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-display text-sepia mb-4">学术成果</h2>
            <div className="w-24 h-1 bg-cinnabar mx-auto"></div>
          </div>
          <div className="text-center">加载中...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-rice-paper">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-display text-sepia mb-4">学术成果</h2>
          <div className="w-24 h-1 bg-cinnabar mx-auto"></div>
        </div>

        {/* 成果筛选 */}
        <div className="flex flex-wrap justify-center mb-12 gap-4" data-aos="fade-up">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeFilter === option.value
                  ? 'bg-sepia text-white hover:bg-opacity-90'
                  : 'bg-gray-200 text-ink-black hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 成果展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-item cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
              onClick={() => onSelectProject && onSelectProject(project.id)}
            >
              <div className="ink-wash-card h-full flex flex-col">
                <div className="p-6">
                  <span className="inline-block bg-cinnabar bg-opacity-20 text-cinnabar text-xs px-3 py-1 rounded-full mb-4">
                    {getTypeLabel(project.type)}
                  </span>
                  <h3 className="text-xl font-title text-sepia mb-3">
                    {project.title}
                  </h3>
                  {getFirstImage(project.figure_url) && (
                    <div className="overflow-hidden rounded mb-4">
                      <img
                        src={getFirstImage(project.figure_url)}
                        alt={project.title}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  <p className="text-gray-700 mb-4">{(project.abstract || project.description || '').substring(0, 80)}{(project.abstract || project.description || '').length > 80 ? '...' : ''}</p>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    {project.authors && <span>{project.authors}</span>}
                    {project.year && <span>{project.year}</span>}
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-200 p-6">
                  <span className="text-cinnabar hover:underline flex items-center">
                    查看详情 <i className="fa fa-arrow-right ml-2"></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多按钮 */}
        {filteredProjects.length > 3 && (
          <div className="text-center mt-12">
            <button
              onClick={() => onViewAllProjects && onViewAllProjects()}
              className="bg-transparent border border-sepia text-sepia px-6 py-3 rounded hover:bg-sepia hover:text-white transition-all scroll-effect"
            >
              查看更多学术成果
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects
