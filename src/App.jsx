import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Notices from './pages/Notices'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Calendar from './pages/Calendar'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Admin from './pages/Admin'
import StaffPortal from './pages/StaffPortal'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import ActivityDetail from './pages/ActivityDetail'


import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff')

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTimestamp')
      if (loginTime) {
        const timePassed = Date.now() - parseInt(loginTime, 10)
        // 4 hours in milliseconds = 4 * 60 * 60 * 1000 = 14,400,000
        if (timePassed > 14400000) {
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('username')
          localStorage.removeItem('userRole')
          localStorage.removeItem('adminLoggedIn')
          localStorage.removeItem('adminUsername')
          localStorage.removeItem('loginTimestamp')
          sessionStorage.removeItem('staffPortalUser')
          window.dispatchEvent(new Event('storage'))
          
          if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff')) {
            navigate('/login')
          }
        }
      }
    }
    
    checkSession()
    const interval = setInterval(checkSession, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [location.pathname, navigate])

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <StaffPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}

export default App
