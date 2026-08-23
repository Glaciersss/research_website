import { useState, useEffect } from 'react'
import { noticesAPI } from '../services/api'

function NoticesManagement() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    date: '',
  })

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    setLoading(true)
    try {
      const response = await noticesAPI.getAll()
      setNotices(response.data)
    } catch (error) {
      console.error('Failed to load notices:', error)
    }
    setLoading(false)
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        link: item.link || '',
        date: item.date ? item.date.split('T')[0] : '',
      })
    } else {
      setEditingItem(null)
      setFormData({
        title: '',
        link: '',
        date: new Date().toISOString().split('T')[0],
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      if (editingItem) {
        await noticesAPI.update(editingItem.id, formData)
      } else {
        await noticesAPI.create(formData)
      }
      handleCloseModal()
      loadNotices()
    } catch (error) {
      console.error('Failed to save notice:', error)
      alert('保存失败: ' + (error.response?.data?.error || '未知错误'))
    }
  }

  const handleDelete = async id => {
    if (!confirm('确定要删除这条通知公告吗？')) return

    try {
      await noticesAPI.delete(id)
      loadNotices()
    } catch (error) {
      console.error('Failed to delete notice:', error)
      alert('删除失败')
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>通知公告管理</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          添加通知
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>链接</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {notices.map(notice => (
              <tr key={notice.id}>
                <td>{notice.title}</td>
                <td>{notice.link || '-'}</td>
                <td>{notice.date?.split('T')[0]}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleOpenModal(notice)} style={{ marginRight: '10px' }}>
                    编辑
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(notice.id)}>
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
          <div className="card" style={{ width: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingItem ? '编辑通知' : '添加通知'}</h3>

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
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '15px' }}>链接</label>
                <input
                  type="url"
                  className="input"
                  value={formData.link}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                />
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

export default NoticesManagement
