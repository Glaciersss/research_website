import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import { statsAPI } from '../services/api'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await statsAPI.get()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/news', label: '新闻动态' },
    { path: '/projects', label: '学术成果' },
    { path: '/team', label: '团队成员' },
    { path: '/notices', label: '通知公告' },
    { path: '/events', label: '活动日历' },
    { path: '/hero-settings', label: '首页大图设置' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: '250px',
          background: '#2c3e50',
          color: 'white',
          padding: '20px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>管理后台</h3>
          <p style={{ fontSize: '15px', opacity: 0.7 }}>欢迎，{user?.name || user?.username}</p>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'block',
                padding: '12px 20px',
                color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.7)',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '8px 0',
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: '15px',
              marginBottom: '10px',
            }}
          >
            查看门户网站
          </a>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            退出登录
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {stats && (
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderBottom: '1px solid #e0e0e0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '20px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '33px', fontWeight: 'bold', color: '#1976d2' }}>
                {stats.news_count}
              </div>
              <div style={{ fontSize: '15px', color: '#666' }}>新闻数量</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '33px', fontWeight: 'bold', color: '#388e3c' }}>
                {stats.projects_count}
              </div>
              <div style={{ fontSize: '15px', color: '#666' }}>学术成果</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '33px', fontWeight: 'bold', color: '#f57c00' }}>
                {stats.team_members_count}
              </div>
              <div style={{ fontSize: '15px', color: '#666' }}>团队成员</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '33px', fontWeight: 'bold', color: '#d32f2f' }}>
                {stats.unread_messages_count}
              </div>
              <div style={{ fontSize: '15px', color: '#666' }}>未读留言</div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, padding: '30px', overflow: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
