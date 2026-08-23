import { useState, useEffect } from 'react'
import { projectsAPI, uploadAPI, teamAPI } from '../services/api'

function ProjectsManagement() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [allMembers, setAllMembers] = useState([])
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'publication',
    authors: '',
    year: '',
    link: '',
    abstract: '',
    keywords: '',
    figure_url: '',
    figure_caption: '',
    publication_info: '',
    citation: '',
    detail_content: '',
    related_member_ids: '',
    pdf_url: '',
    code_url: '',
  })

  useEffect(() => {
    loadProjects()
    teamAPI.getAll().then(res => setAllMembers(res.data || [])).catch(() => {})
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await projectsAPI.getAll()
      setProjects((response.data.items || []).filter(item => item.type !== 'teaching'))
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
    setLoading(false)
  }

  const emptyForm = () => ({
    title: '',
    description: '',
    type: 'publication',
    authors: '',
    year: '',
    link: '',
    abstract: '',
    keywords: '',
    figure_url: '',
    figure_caption: '',
    publication_info: '',
    citation: '',
    detail_content: '',
    related_member_ids: '',
    pdf_url: '',
    code_url: '',
  })

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        description: item.description,
        type: item.type,
        authors: item.authors || '',
        year: item.year || '',
        link: item.link || '',
        abstract: item.abstract || '',
        keywords: item.keywords || '',
        figure_url: item.figure_url || '',
        figure_caption: item.figure_caption || '',
        publication_info: item.publication_info || '',
        citation: item.citation || '',
        detail_content: item.detail_content || '',
        related_member_ids: item.related_member_ids || '',
        pdf_url: item.pdf_url || '',
        code_url: item.code_url || '',
      })
    } else {
      setEditingItem(null)
      setFormData(emptyForm())
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const getImageArray = url => {
    if (!url) return []
    try {
      return JSON.parse(url)
    } catch {
      return url ? [url] : []
    }
  }

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const response = await uploadAPI.uploadImage(file)
      const images = getImageArray(formData.figure_url)
      images.push(response.data.url)
      setFormData({ ...formData, figure_url: JSON.stringify(images) })
    } catch (error) {
      console.error('Upload failed:', error)
      const msg = error.response?.data?.error || error.message
      alert('图片上传失败: ' + msg)
    }
    setUploading(false)
  }

  const removeFigureImage = index => {
    const images = getImageArray(formData.figure_url)
    images.splice(index, 1)
    setFormData({ ...formData, figure_url: images.length > 0 ? JSON.stringify(images) : '' })
  }

  const addFigureUrl = () => {
    const images = getImageArray(formData.figure_url)
    const input = document.getElementById('manual-figure-url')
    if (input && input.value.trim()) {
      images.push(input.value.trim())
      setFormData({ ...formData, figure_url: JSON.stringify(images) })
      input.value = ''
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const data = { ...formData, year: formData.year ? parseInt(formData.year) : null }
      if (editingItem) {
        await projectsAPI.update(editingItem.id, data)
      } else {
        await projectsAPI.create(data)
      }
      handleCloseModal()
      loadProjects()
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('保存失败: ' + (error.response?.data?.error || '未知错误'))
    }
  }

  const handleDelete = async id => {
    if (!confirm('确定要删除这个成果吗？')) return
    try {
      await projectsAPI.delete(id)
      loadProjects()
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('删除失败')
    }
  }

  const getTypeLabel = type => {
    const labels = { publication: '学术论文', project: '研究项目' }
    return labels[type] || type
  }

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>学术成果管理</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          添加成果
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>类型</th>
              <th>作者/负责人</th>
              <th>年份</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{getTypeLabel(project.type)}</td>
                <td>{project.authors || '-'}</td>
                <td>{project.year || '-'}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleOpenModal(project)} style={{ marginRight: '10px' }}>
                    编辑
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(project.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '650px', maxHeight: '85vh', overflow: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingItem ? '编辑成果' : '添加成果'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>标题 *</label>
                <input type="text" className="input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>类型 *</label>
                <select className="input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="publication">学术论文</option>
                  <option value="project">研究项目</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>作者/负责人</label>
                <input type="text" className="input" value={formData.authors} onChange={e => setFormData({ ...formData, authors: e.target.value })} placeholder="多个作者用逗号分隔" />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>年份</label>
                  <input type="number" className="input" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} placeholder="2024" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>链接 (DOI等)</label>
                  <input type="url" className="input" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>出版信息</label>
                <input type="text" className="input" value={formData.publication_info} onChange={e => setFormData({ ...formData, publication_info: e.target.value })} placeholder="期刊/会议名称等" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>摘要</label>
                <textarea className="input" rows="6" value={formData.abstract} onChange={e => setFormData({ ...formData, abstract: e.target.value })} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>关键词</label>
                <input type="text" className="input" value={formData.keywords} onChange={e => setFormData({ ...formData, keywords: e.target.value })} placeholder="多个关键词用逗号分隔" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>论文配图（可上传多张）</label>
                {getImageArray(formData.figure_url).map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', display: 'inline-block', marginRight: '8px', marginBottom: '8px' }}>
                    <img src={url} alt={`配图 ${idx + 1}`} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                    <button type="button" onClick={() => removeFigureImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c1272d', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '15px', cursor: 'pointer', lineHeight: '20px', textAlign: 'center' }}>×</button>
                  </div>
                ))}
                <div style={{ marginTop: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <span style={{ marginLeft: '10px' }}>上传中...</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input id="manual-figure-url" type="text" className="input" placeholder="或输入图片 URL 后点击添加" style={{ flex: 1 }} />
                  <button type="button" className="btn btn-secondary" onClick={addFigureUrl}>添加</button>
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>配图说明</label>
                <input type="text" className="input" value={formData.figure_caption} onChange={e => setFormData({ ...formData, figure_caption: e.target.value })} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>PDF 文件</label>
                {formData.pdf_url && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', color: '#1976d2' }}>已上传: {formData.pdf_url.split('/').pop()}</span>
                    <button type="button" onClick={() => setFormData({ ...formData, pdf_url: '' })} style={{ marginLeft: '8px', background: '#c1272d', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '15px', cursor: 'pointer' }}>×</button>
                  </div>
                )}
                <input type="file" accept="application/pdf" onChange={async e => {
                  const file = e.target.files[0]
                  if (!file) return
                  setUploadingPdf(true)
                  try {
                    const response = await uploadAPI.uploadPdf(file)
                    setFormData({ ...formData, pdf_url: response.data.url })
                  } catch (err) {
                    console.error('PDF upload failed:', err)
                    alert('PDF 上传失败')
                  }
                  setUploadingPdf(false)
                }} disabled={uploadingPdf} />
                {uploadingPdf && <span style={{ marginLeft: '10px', fontSize: '15px' }}>上传中...</span>}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>Code 网址</label>
                  <input type="url" className="input" value={formData.code_url} onChange={e => setFormData({ ...formData, code_url: e.target.value })} placeholder="https://github.com/..." />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>DOI 网址</label>
                  <input type="url" className="input" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://doi.org/..." />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>引用格式</label>
                <textarea className="input" rows="3" value={formData.citation} onChange={e => setFormData({ ...formData, citation: e.target.value })} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>详细内容（研究背景、方法、结果等）</label>
                <textarea className="input" rows="10" value={formData.detail_content} onChange={e => setFormData({ ...formData, detail_content: e.target.value })} placeholder="支持换行段落，用于详情页展示研究背景、方法、结果等内容" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>关联成员</label>
                <div style={{ maxHeight: '120px', overflow: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                  {allMembers.map(m => {
                    const selected = formData.related_member_ids ? formData.related_member_ids.split(',').map(Number) : []
                    return (
                      <label key={m.id} style={{ display: 'inline-block', marginRight: '12px', marginBottom: '4px', fontSize: '16px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selected.includes(m.id)} onChange={e => {
                          let ids = formData.related_member_ids ? formData.related_member_ids.split(',').map(Number).filter(Boolean) : []
                          if (e.target.checked) ids.push(m.id)
                          else ids = ids.filter(i => i !== m.id)
                          setFormData({ ...formData, related_member_ids: ids.join(',') })
                        }} />
                        {' '}{m.name} ({m.role})
                      </label>
                    )
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>取消</button>
                <button type="submit" className="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsManagement
