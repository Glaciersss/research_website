import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function ProjectList({ onBack, onSelectProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const res = await api.getProjects('all', 1, 100)
      setProjects(res?.items || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
    setLoading(false)
  }

  const getTypeLabel = (type) => {
    const labels = { publication: '学术论文', project: '研究项目', teaching: '教学活动' }
    return labels[type] || type
  }

  const getFirstImage = (figureUrl) => {
    if (!figureUrl) return null
    try { const arr = JSON.parse(figureUrl); return arr[0] || null } catch { return figureUrl }
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
          <h2 className="text-4xl font-display text-sepia mb-4">全部学术成果</h2>
          <div className="w-24 h-1 bg-cinnabar mx-auto"></div>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={project.id} className="ink-wash-card cursor-pointer" data-aos="fade-up" data-aos-delay={(index + 1) * 50}
              onClick={() => onSelectProject && onSelectProject(project.id)}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-cinnabar bg-opacity-20 text-cinnabar text-sm px-3 py-1 rounded-full">{getTypeLabel(project.type)}</span>
                  {project.year && <span className="text-gray-500 text-base">{project.year}</span>}
                </div>
                <div className="flex gap-4">
                  {getFirstImage(project.figure_url) && (
                    <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded">
                      <img src={getFirstImage(project.figure_url)} alt={project.title}
                        className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl text-sepia mb-2" style={{ fontFamily: "Arial, 'Ma Shan Zheng', cursive" }}>{project.title}</h3>
                    {project.authors && <p className="text-gray-600 text-base mb-1">{project.authors}</p>}
                    <p className="text-gray-700 text-base">{(project.abstract || '').substring(0, 100)}{(project.abstract || '').length > 100 ? '...' : ''}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectList
