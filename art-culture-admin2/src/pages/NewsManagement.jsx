import { useState, useEffect } from 'react'
import { newsAPI, uploadAPI, teamAPI } from '../services/api'

function NewsManagement() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [allMembers, setAllMembers] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: '活动日历',
    date: '',
    image_url: '',
    related_project_ids: '',
    related_member_ids: '',
  })

  useEffect(() => {
    loadNews()
    teamAPI.getAll().then(res => setAllMembers(res.data || [])).catch(() => {})
  }, [])

  const loadNews = async () => {
    setLoading(true)
    try {
      const response = await newsAPI.getAll()
      setNews(response.data.items)
    } catch (error) {
      console.error('Failed to load news:', error)
    }
    setLoading(false)
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        content: item.content,
        type: item.type,
        date: item.date ? item.date.split('T')[0] : '',
        image_url: item.image_url || '',
        related_project_ids: item.related_project_ids || '',
        related_member_ids: item.related_member_ids || '',
      })
    } else {
      setEditingItem(null)
      setFormData({
        title: '',
        content: '',
        type: '活动日历',
        date: new Date().toISOString().split('T')[0],
        image_url: '',
        related_project_ids: '',
        related_member_ids: '',
      })
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
      const images = getImageArray(formData.image_url)
      images.push(response.data.url)
      setFormData({ ...formData, image_url: JSON.stringify(images) })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('图片上传失败')
    }
    setUploading(false)
  }

  const removeImage = index => {
    const images = getImageArray(formData.image_url)
    images.splice(index, 1)
    setFormData({ ...formData, image_url: images.length > 0 ? JSON.stringify(images) : '' })
  }

  const addImageUrl = () => {
    const images = getImageArray(formData.image_url)
    const input = document.getElementById('manual-image-url')
    if (input && input.value.trim()) {
      images.push(input.value.trim())
      setFormData({ ...formData, image_url: JSON.stringify(images) })
      input.value = ''
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      if (editingItem) {
        await newsAPI.update(editingItem.id, formData)
      } else {
        await newsAPI.create(formData)
      }
      handleCloseModal()
      loadNews()
    } catch (error) {
      console.error('Failed to save news:', error)
      alert('保存失败: ' + (error.response?.data?.error || '未知错误'))
    }
  }

  const handleDelete = async id => {
    if (!confirm('确定要删除这条新闻吗？')) return

    try {
      await newsAPI.delete(id)
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
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          添加新闻
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>类型</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>{item.date?.split('T')[0]}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleOpenModal(item)} style={{ marginRight: '10px' }}>
                    编辑
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ width: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingItem ? '编辑新闻' : '添加新闻'}</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '15px' }}>标题 *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '15px' }}>类型 *</label>
                <select className="input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="活动日历">活动日历</option>
                  <option value="研究成果">研究成果</option>
                  <option value="展览活动">展览活动</option>
                  <option value="团队动态">团队动态</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '15px' }}>日期 *</label>
                <input
                  type="date"
                  className="input"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '15px' }}>内容 *</label>
                <textarea
                  className="input"
                  rows="10"
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '15px' }}>配图（可上传多张）</label>
                {getImageArray(formData.image_url).map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', display: 'inline-block', marginRight: '8px', marginBottom: '8px' }}>
                    <img
                      src={url}
                      alt={`配图 ${idx + 1}`}
                      style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: '#c1272d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '15px',
                        cursor: 'pointer',
                        lineHeight: '20px',
                        textAlign: 'center',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <span style={{ marginLeft: '10px' }}>上传中...</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input id="manual-image-url" type="text" className="input" placeholder="或输入图片 URL 后点击添加" style={{ flex: 1 }} />
                  <button type="button" className="btn btn-secondary" onClick={addImageUrl}>
                    添加
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '15px' }}>关联论文</label>
                {getRelatedPapers().map((paper, idx) => (
                  <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', marginBottom: '8px', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => removeRelatedPaper(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '8px',
                        background: '#c1272d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '15px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                    <input
                      type="text"
                      className="input"
                      placeholder="论文标题"
                      value={paper.title}
                      onChange={e => updateRelatedPaper(idx, 'title', e.target.value)}
                      style={{ marginBottom: '6px', fontSize: '15px' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <input
                        type="text"
                        className="input"
                        placeholder="作者"
                        value={paper.authors}
                        onChange={e => updateRelatedPaper(idx, 'authors', e.target.value)}
                        style={{ flex: 1, fontSize: '15px' }}
                      />
                      <input
                        type="text"
                        className="input"
                        placeholder="日期"
                        value={paper.date}
                        onChange={e => updateRelatedPaper(idx, 'date', e.target.value)}
                        style={{ width: '120px', fontSize: '15px' }}
                      />
                    </div>
                    <input
                      type="url"
                      className="input"
                      placeholder="DOI 链接（可选）"
                      value={paper.link}
                      onChange={e => updateRelatedPaper(idx, 'link', e.target.value)}
                      style={{ fontSize: '15px' }}
                    />
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addRelatedPaper} style={{ fontSize: '15px' }}>
                  + 添加论文
                </button>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '15px' }}>关联成员</label>
                <div style={{ maxHeight: '120px', overflow: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                  {allMembers.map(m => {
                    const selected = formData.related_member_ids ? formData.related_member_ids.split(',').map(Number) : []
                    return (
                      <label key={m.id} style={{ display: 'inline-block', marginRight: '12px', marginBottom: '4px', fontSize: '15px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selected.includes(m.id)}
                          onChange={e => {
                            let ids = formData.related_member_ids ? formData.related_member_ids.split(',').map(Number).filter(Boolean) : []
                            if (e.target.checked) ids.push(m.id)
                            else ids = ids.filter(i => i !== m.id)
                            setFormData({ ...formData, related_member_ids: ids.join(',') })
                          }}
                        />
                        {' '}{m.name} ({m.role})
                      </label>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsManagement
