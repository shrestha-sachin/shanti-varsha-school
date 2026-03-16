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
import StudentPortal from './pages/StudentPortal'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
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
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['admin', 'student']}>
                  <StudentPortal />
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
        <Footer />
      </div>
    </Router>
  )
}

export default App
