import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Draw from './pages/Draw'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'

function App() {
  const { user, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (!user) {
    return <Login />
  }

  return (
    <div className={`min-h-screen theme-${user.theme}`}>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/draw" element={<Draw />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App