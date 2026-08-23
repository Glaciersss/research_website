import { useState, useEffect } from 'react'
import { newsAPI, uploadAPI, teamAPI } from '../services/api'

const REGULAR_NEWS_TYPES = ['活动日历', '研究成果', '展览活动', '团队动态']

const emptyNewsForm = () => ({
  title: '',
  content: '',
  type: '活动日历',
  date: new Date().toISOString().split('T')[0],
  image_url: '',
  related_project_ids: '',
  related_member_ids: '',
  description: '',
  authors: '',
  year: '',
  link: '',
  abstract: '',
  keywords: '',
  figure_url: '',
  figure_caption: '',
  publication_info: '',
  pdf_url: '',
  code_url: '',
  citation: '',
  detail_content: '',
})

function NewsManagement() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [allMembers, setAllMembers] = useState([])
  const [formData, setFormData] = useState(emptyNewsForm())

  useEffect(() => {
    loadNews()
    teamAPI.getAll().then(res => setAllMembers(res.data || [])).catch(() => {})
  }, [])

  const sortItems = items =>
    [...items].sort((a, b) => {
      const aTime = a.source === 'teaching' ? new Date(`${a.year || 0}-12-31`).getTime() : new Date(a.date || 0).getTime()
      const bTime = b.source === 'teaching' ? new Date(`${b.year || 0}-12-31`).getTime() : new Date(b.date || 0).getTime()
      return bTime - aTime
    })

  const loadNews = async () => {
    setLoading(true)
    try {
      const [newsResponse, teachingResponse] = await Promise.all([newsAPI.getAll(), newsAPI.getTeachingAll()])
      const regularNews = (newsResponse.data.items || []).map(item => ({ ...item, source: 'news' }))
      const teachingNews = teachingResponse.data.items || []
      setNews(sortItems([...regularNews, ...teachingNews]))
    } catch (error) {
      console.error('Failed to load news:', error)
    }
    setLoading(false)
  }

  const isTeachingItem = formData.type === '教学活动'

  const handleOpenModal = item => {
    if (item) {
      setEditingItem(item)
      if (item.source === 'teaching') {
        setFormData({
          ...emptyNewsForm(),
          title: item.title,
          type: '教学活动',
          description: item.description || '',
          authors: item.authors || '',
          year: item.year || '',
          link: item.link || '',
          abstract: item.abstract || '',
          keywords: item.keywords || '',
          figure_url: item.figure_url || '',
          figure_caption: item.figure_caption || '',
          publication_info: item.publication_info || '',
          pdf_url: item.pdf_url || '',
          code_url: item.code_url || '',
          citation: item.citation || '',
          detail_content: item.detail_content || '',
          related_member_ids: item.related_member_ids || '',
        })
      } else {
        setFormData({
          ...emptyNewsForm(),
          title: item.title,
          content: item.content || '',
          type: item.type,
          date: item.date ? item.date.split('T')[0] : '',
          image_url: item.image_url || '',
          related_project_ids: item.related_project_ids || '',
          related_member_ids: item.related_member_ids || '',
        })
      }
    } else {
      setEditingItem(null)
      setFormData(emptyNewsForm())
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleTypeChange = value => {
    if (editingItem) {
      setFormData({ ...formData, type: value })
      return
    }
    if (value === '教学活动') {
      setFormData({
        ...emptyNewsForm(),
        title: formData.title,
        type: '教学活动',
        related_member_ids: formData.related_member_ids,
      })
    } else {
      setFormData({
        ...emptyNewsForm(),
        title: formData.title,
        type: value,
      })
    }
  }

  const getImageArray = url => {
    if (!url) return []
    try {
      return JSON.parse(url)
    } catch {
      return url ? [url] : []
    }
  }

  const getRelatedPapers = () => {
    if (!formData.related_project_ids) return []
    try {
      return JSON.parse(formData.related_project_ids)
    } catch {
      return []
    }
  }

  const addRelatedPaper = () => {
    const papers = getRelatedPapers()
    papers.push({ title: '', authors: '', date: '', link: '' })
    setFormData({ ...formData, related_project_ids: JSON.stringify(papers) })
  }

  const removeRelatedPaper = index => {
    const papers = getRelatedPapers()
    papers.splice(index, 1)
    setFormData({ ...formData, related_project_ids: papers.length > 0 ? JSON.stringify(papers) : '' })
  }

  const updateRelatedPaper = (index, field, value) => {
    const papers = getRelatedPapers()
    papers[index][field] = value
    setFormData({ ...formData, related_project_ids: JSON.stringify(papers) })
  }

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const response = await uploadAPI.uploadImage(file)
      const key = isTeachingItem ? 'figure_url' : 'image_url'
      const images = getImageArray(formData[key])
      images.push(response.data.url)
      setFormData({ ...formData, [key]: JSON.stringify(images) })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('图片上传失败')
    }
    setUploading(false)
  }

  const removeImage = index => {
    const key = isTeachingItem ? 'figure_url' : 'image_url'
    const images = getImageArray(formData[key])
    images.splice(index, 1)
    setFormData({ ...formData, [key]: images.length > 0 ? JSON.stringify(images) : '' })
  }

  const addImageUrl = () => {
    const key = isTeachingItem ? 'figure_url' : 'image_url'
    const inputId = isTeachingItem ? 'manual-figure-url' : 'manual-image-url'
    const images = getImageArray(formData[key])
    const input = document.getElementById(inputId)
    if (input && input.value.trim()) {
      images.push(input.value.trim())
      setFormData({ ...formData, [key]: JSON.stringify(images) })
      input.value = ''
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (isTeachingItem) {
        const data = {
          title: formData.title,
          description: formData.description,
          authors: formData.authors,
          year: formData.year ? parseInt(formData.year) : null,
          link: formData.link,
          abstract: formData.abstract,
          keywords: formData.keywords,
          figure_url: formData.figure_url,
          figure_caption: formData.figure_caption,
          publication_info: formData.publication_info,
          pdf_url: formData.pdf_url,
          code_url: formData.code_url,
          citation: formData.citation,
          detail_content: formData.detail_content,
          related_member_ids: formData.related_member_ids,
        }
        if (editingItem?.source === 'teaching') {
          await newsAPI.updateTeaching(editingItem.id, data)
        } else {
          await newsAPI.createTeaching(data)
        }
      } else {
        const data = {
          title: formData.title,
          content: formData.content,
          type: formData.type,
          date: formData.date,
          image_url: formData.image_url,
          related_project_ids: formData.related_project_ids,
          related_member_ids: formData.related_member_ids,
        }
        if (editingItem?.source === 'news') {
          await newsAPI.update(editingItem.id, data)
        } else {
          await newsAPI.create(data)
        }
      }
      handleCloseModal()
      loadNews()
    } catch (error) {
      console.error('Failed to save news:', error)
      alert('保存失败: ' + (error.response?.data?.error || '未知错误'))
    }
  }

  const handleDelete = async item => {
    const label = item.source === 'teaching' ? '教学活动' : '新闻'
    if (!confirm(`确定要删除这条${label}吗？`)) return
    try {
      if (item.source === 'teaching') {
        await newsAPI.deleteTeaching(item.id)
      } else {
        await newsAPI.delete(item.id)
      }
      loadNews()
    } catch (error) {
      console.error('Failed to delete news:', error)
      alert('删除失败')
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>新闻动态管理</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal(null)}>
          添加内容
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>类型</th>
              <th>日期/年份</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={`${item.source}-${item.id}`}>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>{item.source === 'teaching' ? item.year || '-' : item.date?.split('T')[0]}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleOpenModal(item)} style={{ marginRight: '10px' }}>
                    编辑
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item)}>
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
          <div className="card" style={{ width: '680px', maxHeight: '85vh', overflow: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>
              {editingItem ? `编辑${editingItem.source === 'teaching' ? '教学活动' : '新闻'}` : '添加内容'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>标题 *</label>
                <input type="text" className="input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>类型 *</label>
                {editingItem ? (
                  <input className="input" value={formData.type} disabled />
                ) : (
                  <select className="input" value={formData.type} onChange={e => handleTypeChange(e.target.value)}>
                    {REGULAR_NEWS_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                    <option value="教学活动">教学活动</option>
                  </select>
                )}
              </div>

              {isTeachingItem ? (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>作者/负责人</label>
                    <input type="text" className="input" value={formData.authors} onChange={e => setFormData({ ...formData, authors: e.target.value })} placeholder="多个作者用逗号分隔" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>年份</label>
                      <input type="number" className="input" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} placeholder="2026" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>链接</label>
                      <input type="url" className="input" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." />
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>简述</label>
                    <textarea className="input" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
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
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>配图（可上传多张）</label>
                    {getImageArray(formData.figure_url).map((url, idx) => (
                      <div key={idx} style={{ position: 'relative', display: 'inline-block', marginRight: '8px', marginBottom: '8px' }}>
                        <img src={url} alt={`配图 ${idx + 1}`} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                        <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c1272d', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '15px', cursor: 'pointer', lineHeight: '20px', textAlign: 'center' }}>×</button>
                      </div>
                    ))}
                    <div style={{ marginTop: '8px' }}>
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      {uploading && <span style={{ marginLeft: '10px' }}>上传中...</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input id="manual-figure-url" type="text" className="input" placeholder="或输入图片 URL 后点击添加" style={{ flex: 1 }} />
                      <button type="button" className="btn btn-secondary" onClick={addImageUrl}>添加</button>
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>配图说明</label>
                    <input type="text" className="input" value={formData.figure_caption} onChange={e => setFormData({ ...formData, figure_caption: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>出版信息</label>
                    <input type="text" className="input" value={formData.publication_info} onChange={e => setFormData({ ...formData, publication_info: e.target.value })} />
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
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>引用格式</label>
                      <textarea className="input" rows="3" value={formData.citation} onChange={e => setFormData({ ...formData, citation: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>详细内容</label>
                    <textarea className="input" rows="8" value={formData.detail_content} onChange={e => setFormData({ ...formData, detail_content: e.target.value })} />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>日期 *</label>
                    <input type="date" className="input" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>内容 *</label>
                    <textarea className="input" rows="10" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>配图（可上传多张）</label>
                    {getImageArray(formData.image_url).map((url, idx) => (
                      <div key={idx} style={{ position: 'relative', display: 'inline-block', marginRight: '8px', marginBottom: '8px' }}>
                        <img src={url} alt={`配图 ${idx + 1}`} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                        <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c1272d', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '15px', cursor: 'pointer', lineHeight: '20px', textAlign: 'center' }}>×</button>
                      </div>
                    ))}
                    <div style={{ marginTop: '8px' }}>
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      {uploading && <span style={{ marginLeft: '10px' }}>上传中...</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input id="manual-image-url" type="text" className="input" placeholder="或输入图片 URL 后点击添加" style={{ flex: 1 }} />
                      <button type="button" className="btn btn-secondary" onClick={addImageUrl}>添加</button>
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>关联论文</label>
                    {getRelatedPapers().map((paper, idx) => (
                      <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', marginBottom: '8px', position: 'relative' }}>
                        <button type="button" onClick={() => removeRelatedPaper(idx)} style={{ position: 'absolute', top: '4px', right: '8px', background: '#c1272d', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '15px', cursor: 'pointer' }}>×</button>
                        <input type="text" className="input" placeholder="论文标题" value={paper.title} onChange={e => updateRelatedPaper(idx, 'title', e.target.value)} style={{ marginBottom: '6px', fontSize: '15px' }} />
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input type="text" className="input" placeholder="作者" value={paper.authors} onChange={e => updateRelatedPaper(idx, 'authors', e.target.value)} style={{ flex: 1, fontSize: '15px' }} />
                          <input type="text" className="input" placeholder="日期" value={paper.date} onChange={e => updateRelatedPaper(idx, 'date', e.target.value)} style={{ width: '120px', fontSize: '15px' }} />
                        </div>
                        <input type="url" className="input" placeholder="DOI 链接（可选）" value={paper.link} onChange={e => updateRelatedPaper(idx, 'link', e.target.value)} style={{ fontSize: '15px' }} />
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary" onClick={addRelatedPaper} style={{ fontSize: '15px' }}>+ 添加论文</button>
                  </div>
                </>
              )}

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

export default NewsManagement
