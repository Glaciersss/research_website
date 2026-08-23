import { useState, useEffect } from 'react'
import { teamAPI, uploadAPI, projectsAPI } from '../services/api'

function TeamManagement() {
  const [members, setMembers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState([])
  const [sortChanged, setSortChanged] = useState(false)
  const [dragId, setDragId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: '在读生',
    research: '',
    email: '',
    website: '',
    avatar: '',
    bio: '',
    achievements: ''
  })

  useEffect(() => {
    loadMembers()
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll(1, 200)
      setProjects(response.data?.items || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const loadMembers = async () => {
    setLoading(true)
    try {
      const response = await teamAPI.getAll()
      setMembers(response.data)
    } catch (error) {
      console.error('Failed to load members:', error)
    }
    setLoading(false)
  }

  const parseAchievements = (achievements) => {
    if (!achievements) return []
    try { return JSON.parse(achievements) } catch { return [] }
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      const ids = parseAchievements(item.achievements)
      setSelectedProjects(ids)
      setFormData({
        name: item.name,
        role: item.role,
        category: item.category,
        research: item.research || '',
        email: item.email || '',
        website: item.website || '',
        avatar: item.avatar || '',
        bio: item.bio || '',
        achievements: item.achievements || ''
      })
    } else {
      setEditingItem(null)
      setSelectedProjects([])
      setFormData({
        name: '',
        role: '',
        category: '在读生',
        research: '',
        email: '',
        website: '',
        avatar: '',
        bio: '',
        achievements: ''
      })
    }
    setShowModal(true)
  }

  const toggleProject = (projectId) => {
    setSelectedProjects(prev => {
      const next = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
      setFormData(fd => ({...fd, achievements: JSON.stringify(next)}))
      return next
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadAPI.uploadImage(file)
      setFormData({...formData, avatar: response.data.url})
    } catch (error) {
      console.error('Upload failed:', error)
      const msg = error.response?.data?.error || error.response?.data?.msg || '未知错误'
      alert('图片上传失败: ' + msg)
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingItem) {
        await teamAPI.update(editingItem.id, formData)
      } else {
        await teamAPI.create(formData)
      }
      handleCloseModal()
      loadMembers()
    } catch (error) {
      console.error('Failed to save member:', error)
      alert('保存失败: ' + (error.response?.data?.error || '未知错误'))
    }
  }

  const getDefaultFormData = () => ({
    name: '',
    role: '',
    category: '在读生',
    research: '',
    email: '',
    website: '',
    avatar: '',
    bio: '',
    achievements: ''
  })

  const handleDragStart = (e, memberId) => {
    setDragId(memberId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    if (dragId == null || dragId === targetId) return

    const items = [...members]
    const dragIdx = items.findIndex(m => m.id === dragId)
    const targetIdx = items.findIndex(m => m.id === targetId)
    if (dragIdx === -1 || targetIdx === -1) return

    const [removed] = items.splice(dragIdx, 1)
    items.splice(targetIdx, 0, removed)
    setMembers(items)
    setSortChanged(true)
    setDragId(null)
  }

  const handleSaveSort = async () => {
    try {
      const items = members.map((m, i) => ({ id: m.id, sort_order: i }))
      await teamAPI.updateSort(items)
      setSortChanged(false)
    } catch (error) {
      console.error('Failed to save sort:', error)
      alert('保存排序失败')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个成员吗？')) return

    try {
      await teamAPI.delete(id)
      loadMembers()
    } catch (error) {
      console.error('Failed to delete member:', error)
      alert('删除失败')
    }
  }

  const getCategoryLabel = (category) => {
    const labels = {
      faculty: '导师',
      '在读生': '在读生',
      '毕业生': '毕业生'
    }
    return labels[category] || category
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>团队成员管理</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {sortChanged && (
            <button className="btn btn-success" onClick={handleSaveSort}>
              保存排序
            </button>
          )}
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            添加成员
          </button>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>
        提示：拖拽最左侧手柄可调整成员显示顺序，修改后请点击"保存排序"
      </p>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>姓名</th>
              <th>职位</th>
              <th>类别</th>
              <th>研究方向</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}
                draggable
                onDragStart={(e) => handleDragStart(e, member.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, member.id)}
                style={{
                  opacity: dragId === member.id ? 0.5 : 1,
                  cursor: 'move'
                }}
              >
                <td style={{ textAlign: 'center', color: '#ccc', fontSize: '18px', cursor: 'grab' }}>
                  ⋮⋮
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {member.avatar && (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          marginRight: '10px',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    {member.name}
                  </div>
                </td>
                <td>{member.role}</td>
                <td>{getCategoryLabel(member.category)}</td>
                <td>{member.research || '-'}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={(e) => { e.stopPropagation(); handleOpenModal(member) }}
                    style={{ marginRight: '10px' }}
                  >
                    编辑
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => { e.stopPropagation(); handleDelete(member.id) }}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>
              {editingItem ? '编辑成员' : '添加成员'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  头像
                </label>
                {formData.avatar && (
                  <img
                    src={formData.avatar}
                    alt="Preview"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '10px'
                    }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <span style={{ marginLeft: '10px' }}>上传中...</span>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  姓名 *
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  职位 *
                </label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="">请选择职位</option>
                  <option value="教授">教授</option>
                  <option value="助理教授">助理教授</option>
                  <option value="讲师">讲师</option>
                  <option value="特聘研究员">特聘研究员</option>
                  <option value="研究员">研究员</option>
                  <option value="助理研究员">助理研究员</option>
                  <option value="博士研究生">博士研究生</option>
                  <option value="硕士研究生">硕士研究生</option>
                  <option value="本科生">本科生</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  类别 *
                </label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="faculty">导师</option>
                  <option value="在读生">在读生</option>
                  <option value="毕业生">毕业生</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  研究方向
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.research}
                  onChange={(e) => setFormData({...formData, research: e.target.value})}
                  placeholder="例如：中国传统绘画大模型"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  邮箱
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  个人网站
                </label>
                <input
                  type="url"
                  className="input"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  自我介绍
                </label>
                <textarea
                  className="input"
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="个人简介、学术背景等"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  已有成果（选择关联的学术成果）
                </label>
                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '8px',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {projects.length === 0 && (
                    <span style={{ color: '#999', fontSize: '13px' }}>暂无可选学术成果</span>
                  )}
                  {projects.map(project => (
                    <label key={project.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 0',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}>
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => toggleProject(project.id)}
                        style={{ marginRight: '8px' }}
                      />
                      <span>{project.title}</span>
                    </label>
                  ))}
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

export default TeamManagement
