import { useState, useEffect } from 'react'
import { eventsAPI } from '../services/api'

function EventsManagement() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const response = await eventsAPI.getAll()
      setEvents(response.data)
    } catch (error) {
      console.error('Failed to load events:', error)
    }
    setLoading(false)
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        date: item.date ? item.date.split('T')[0] : '',
        time: item.time || '',
        location: item.location || '',
      })
    } else {
      setEditingItem(null)
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        location: '',
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
        await eventsAPI.update(editingItem.id, formData)
      } else {
        await eventsAPI.create(formData)
      }
      handleCloseModal()
      loadEvents()
    } catch (error) {
      console.error('Failed to save event:', error)
      alert('保存失败: ' + (error.response?.data?.error || '未知错误'))
    }
  }

  const handleDelete = async id => {
    if (!confirm('确定要删除这个活动吗？')) return

    try {
      await eventsAPI.delete(id)
      loadEvents()
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('删除失败')
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>活动日历管理</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          添加活动
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>日期</th>
              <th>时间</th>
              <th>地点</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.date?.split('T')[0]}</td>
                <td>{event.time || '-'}</td>
                <td>{event.location || '-'}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleOpenModal(event)} style={{ marginRight: '10px' }}>
                    编辑
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>
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
            <h3 style={{ marginBottom: '20px' }}>{editingItem ? '编辑活动' : '添加活动'}</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>标题 *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>日期 *</label>
                <input
                  type="date"
                  className="input"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>时间</label>
                <input
                  type="text"
                  className="input"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  placeholder="例如：14:00-16:00"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '17px' }}>地点</label>
                <input
                  type="text"
                  className="input"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="例如：浙江大学紫金港校区"
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

export default EventsManagement
