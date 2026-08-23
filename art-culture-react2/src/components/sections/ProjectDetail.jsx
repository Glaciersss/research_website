import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function ProjectDetail({ projectId, onBack, onSelectMember }) {
  const [project, setProject] = useState(null)
  const [relatedMembers, setRelatedMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProject() }, [projectId])

  const loadProject = async () => {
    setLoading(true)
    try {
      const data = await api.getProjectById(projectId)
      setProject(data)
      if (data.related_member_ids) {
        const res = await fetch(`/api/team/batch?ids=${data.related_member_ids}`)
        const members = await res.json()
        setRelatedMembers(members || [])
      }
    } catch (error) {
      console.error('Failed to load project:', error)
    }
    setLoading(false)
  }

  const getTypeLabel = (type) => {
    const labels = { publication: '学术论文', project: '研究项目', teaching: '教学活动' }
    return labels[type] || type
  }

  if (loading) {
    return (
      <section className="py-20 bg-rice-paper min-h-screen">
        <div className="container mx-auto px-4 text-center">加载中...</div>
      </section>
    )
  }

  if (!project) {
    return (
      <section className="py-20 bg-rice-paper min-h-screen">
        <div className="container mx-auto px-4 text-center">成果信息未找到</div>
      </section>
    )
  }

  const keywords = project.keywords ? project.keywords.split(',').map(k => k.trim()) : []
  const detailParagraphs = project.detail_content
    ? project.detail_content.split('\n').filter(p => p.trim())
    : []

  return (
    <section className="py-20 bg-rice-paper min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={onBack}
          className="mb-8 px-4 py-2 text-sepia border border-sepia rounded hover:bg-sepia hover:text-white transition-all">
          <i className="fa fa-arrow-left mr-2"></i>返回学术成果
        </button>

        {/* 标题和作者 */}
        <div className="mb-8" data-aos="fade-up">
          <span className="inline-block bg-cinnabar bg-opacity-20 text-cinnabar text-sm px-3 py-1 rounded-full mb-4">
            {getTypeLabel(project.type)}
          </span>
          <h1 className="text-3xl md:text-4xl font-title text-sepia mb-4">{project.title}</h1>
          {project.authors && (
            <p className="text-gray-700 text-lg mb-2">{project.authors}</p>
          )}
          {relatedMembers.length > 0 && (
            <p className="text-gray-700 text-lg mb-2">
              {relatedMembers.map((m, i) => (
                <span key={m.id}>
                  <button onClick={() => onSelectMember && onSelectMember(m.id)}
                    className="text-cinnabar hover:underline">{m.name}</button>
                  {i < relatedMembers.length - 1 && <span className="text-gray-400 mx-1">,</span>}
                </span>
              ))}
            </p>
          )}
          <div className="flex gap-3 mt-4">
            {project.pdf_url && (
              <a href={project.pdf_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 bg-cinnabar text-white rounded hover:bg-opacity-90 transition-all text-sm font-bold">
                <i className="fa fa-file-pdf-o"></i> PDF
              </a>
            )}
            {project.code_url && (
              <a href={project.code_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 bg-cinnabar text-white rounded hover:bg-opacity-90 transition-all text-sm font-bold">
                <i className="fa fa-code"></i> Code
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 bg-cinnabar text-white rounded hover:bg-opacity-90 transition-all text-sm font-bold">
                <i className="fa fa-external-link"></i> DOI
              </a>
            )}
          </div>
        </div>

        {/* 摘要 */}
        {project.abstract && (
          <div className="mb-8" data-aos="fade-up">
            <h2 className="text-xl font-bold text-sepia mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Abstract</h2>
            <p className="text-gray-700 text-lg leading-relaxed text-justify">{project.abstract}</p>
          </div>
        )}

        {/* 类型和出版信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" data-aos="fade-up">
          <div>
            {project.type && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-sepia mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Type</h2>
                <p className="text-gray-700 text-lg">{getTypeLabel(project.type)}</p>
              </div>
            )}
            {project.publication_info && (
              <div>
                <h2 className="text-xl font-bold text-sepia mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Publication</h2>
                <p className="text-gray-700 text-lg">{project.publication_info}</p>
              </div>
            )}
          </div>
          {keywords.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-sepia mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => (
                  <span key={i} className="bg-gray-200 text-ink-black text-lg px-3 py-1 rounded-full">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 配图 */}
        {(() => {
          const images = (() => { try { return JSON.parse(project.figure_url) } catch { return project.figure_url ? [project.figure_url] : [] } })()
          return images.length > 0 && (
            <div className="mb-8" data-aos="fade-up">
              <div className="ink-wash-card p-4">
                <div className={images.length === 1 ? 'max-w-2xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                  {images.map((url, i) => (
                    <img key={i} src={url} alt={`${project.title} - 配图${i + 1}`}
                      className="w-full h-auto rounded" />
                  ))}
                </div>
                {project.figure_caption && (
                  <p className="text-center text-gray-600 mt-4 text-sm">{project.figure_caption}</p>
                )}
              </div>
            </div>
          )
        })()}

        {/* 详细内容 */}
        {detailParagraphs.length > 0 && (
          <div className="mb-8" data-aos="fade-up">
            <h2 className="text-2xl font-display text-sepia mb-4">详细内容</h2>
            <div className="ink-wash-card p-6">
              {detailParagraphs.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4 last:mb-0 text-justify">{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* 引用格式 */}
        {project.citation && (
          <div className="mb-8" data-aos="fade-up">
            <h2 className="text-2xl font-display text-sepia mb-4">Citation</h2>
            <div className="ink-wash-card p-6">
              <p className="text-gray-700 font-mono text-sm bg-black bg-opacity-5 p-4 rounded text-justify">{project.citation}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectDetail
