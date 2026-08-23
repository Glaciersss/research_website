import { useState, useEffect, useRef } from 'react'
import { uploadAPI } from '../services/api'
import api from '../services/api'

function HeroSettings() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const response = await api.get('/admin/settings/hero-bg')
      setImages(response.data.images || [])
    } catch (error) {
      console.error('Failed to load hero images:', error)
    }
  }

  const handleFileSelect = async e => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: '仅支持 PNG 和 JPG 格式' })
      return
    }

    if (file.size > 40 * 1024 * 1024) {
      setMessage({ type: 'error', text: '文件大小不能超过 40MB' })
      return
    }

    setUploading(true)
    setMessage(null)
    try {
      const response = await uploadAPI.uploadImage(file)
      const uploadedUrl = response.data.url
      setImages(prev => [...prev, uploadedUrl])
      setMessage({ type: 'success', text: '图片上传成功，请点击保存按钮生效' })
    } catch (error) {
      setMessage({ type: 'error', text: '图片上传失败: ' + (error.response?.data?.error || error.message) })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = index => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await api.put('/admin/settings/hero-bg', { images })
      setMessage({ type: 'success', text: '大图设置已保存并生效' })
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败: ' + (error.response?.data?.error || error.message) })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await api.put('/admin/settings/hero-bg', { images: [] })
      setImages([])
      setMessage({ type: 'success', text: '已重置，将使用默认背景' })
    } catch (error) {
      setMessage({ type: 'error', text: '重置失败: ' + (error.response?.data?.error || error.message) })
    } finally {
      setSaving(false)
    }
  }

  const style = {
    page: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      fontSize: '26px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '30px',
      paddingBottom: '15px',
      borderBottom: '2px solid #1976d2',
    },
    section: {
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '20px',
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '20px',
    },
    previewItem: {
      position: 'relative',
      height: '140px',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#f0f0f0',
    },
    previewImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    removeBtn: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'rgba(211, 47, 47, 0.85)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      lineHeight: '24px',
      textAlign: 'center',
      padding: 0,
    },
    placeholder: {
      color: '#999',
      fontSize: '15px',
      textAlign: 'center',
      padding: '40px 0',
    },
    uploadArea: {
      border: '2px dashed #ccc',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.3s',
    },
    fileInput: {
      display: 'none',
    },
    btn: {
      padding: '10px 24px',
      borderRadius: '4px',
      border: 'none',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'opacity 0.3s',
      marginRight: '12px',
    },
    btnPrimary: {
      background: '#1976d2',
      color: 'white',
    },
    btnDanger: {
      background: '#d32f2f',
      color: 'white',
    },
    message: {
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '16px',
      fontSize: '15px',
    },
    messageSuccess: {
      background: '#e8f5e9',
      color: '#2e7d32',
    },
    messageError: {
      background: '#ffebee',
      color: '#c62828',
    },
    info: {
      fontSize: '15px',
      color: '#666',
      marginTop: '12px',
    },
    tip: {
      fontSize: '15px',
      color: '#888',
      marginTop: '8px',
    },
  }

  return (
    <div style={style.page}>
      <h2 style={style.title}>首页大图设置（可多张轮播）</h2>

      {message && (
        <div
          style={{
            ...style.message,
            ...(message.type === 'success' ? style.messageSuccess : style.messageError),
          }}
        >
          {message.text}
        </div>
      )}

      <div style={style.section}>
        <h3 style={style.sectionTitle}>当前图片列表（共 {images.length} 张）</h3>
        {images.length > 0 ? (
          <div style={style.previewGrid}>
            {images.map((url, index) => (
              <div key={index} style={style.previewItem}>
                <img src={url} alt={`大图 ${index + 1}`} style={style.previewImg} />
                <button style={style.removeBtn} onClick={() => handleRemove(index)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={style.placeholder}>暂未上传图片，将使用默认背景</div>
        )}
        <div style={style.tip}>轮播顺序即图片展示顺序，先上传的会先播放。点击右上角 × 可移除单张图片。</div>
      </div>

      <div style={style.section}>
        <h3 style={style.sectionTitle}>上传新图片</h3>
        <div
          style={style.uploadArea}
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#1976d2')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#ccc')}
        >
          <div style={{ fontSize: '41px', marginBottom: '12px' }}>🖼</div>
          <div style={{ fontSize: '17px', color: '#333', marginBottom: '8px' }}>
            {uploading ? '上传中...' : '点击选择图片或拖拽到此处'}
          </div>
          <div style={{ fontSize: '15px', color: '#999' }}>支持 PNG、JPG 格式，建议尺寸 1920×1080，最大 40MB</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            style={style.fileInput}
            disabled={uploading}
          />
        </div>
        <div style={style.tip}>可多次上传，多张图片将自动轮播。</div>
      </div>

      <div style={style.section}>
        <h3 style={style.sectionTitle}>操作</h3>
        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...style.btn,
              ...style.btnPrimary,
              opacity: saving ? 0.5 : 1,
            }}
          >
            {saving ? '保存中...' : '保存设置'}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            style={{
              ...style.btn,
              ...style.btnDanger,
              opacity: saving ? 0.5 : 1,
            }}
          >
            重置为默认背景
          </button>
        </div>
        <div style={style.info}>保存后将立即生效，刷新网站首页即可看到更新后的背景图片。</div>
      </div>
    </div>
  )
}

export default HeroSettings
