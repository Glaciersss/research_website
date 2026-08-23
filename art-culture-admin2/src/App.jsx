import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewsManagement from './pages/NewsManagement'
import ProjectsManagement from './pages/ProjectsManagement'
import TeamManagement from './pages/TeamManagement'
import NoticesManagement from './pages/NoticesManagement'
import EventsManagement from './pages/EventsManagement'
import HeroSettings from './pages/HeroSettings'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>鍔犺浇涓?..</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      >
        <Route index element={<NewsManagement />} />
        <Route path="news" element={<NewsManagement />} />
        <Route path="projects" element={<ProjectsManagement />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="notices" element={<NoticesManagement />} />
        <Route path="events" element={<EventsManagement />} />
        <Route path="hero-settings" element={<HeroSettings />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  )
}

export default App

