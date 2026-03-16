import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, GraduationCap, LogOut, Bell, ChevronDown } from 'lucide-react'
import { supabase } from '../supabaseClient'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [noticeCount, setNoticeCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('adminLoggedIn') === 'true'
    const role = localStorage.getItem('userRole') || (localStorage.getItem('adminLoggedIn') === 'true' ? 'admin' : '')
    setIsLoggedIn(loggedIn)
    setUserRole(role)

    const updateNoticeCount = async () => {
      const { count } = await supabase.from('school_notices').select('*', { count: 'exact', head: true })
      if (count !== null) setNoticeCount(count)
    }
    updateNoticeCount()

    const handleStorage = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('adminLoggedIn') === 'true'
      const role = localStorage.getItem('userRole') || (localStorage.getItem('adminLoggedIn') === 'true' ? 'admin' : '')
      setIsLoggedIn(loggedIn)
      setUserRole(role)
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('userRole')
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUsername')
    setIsLoggedIn(false)
    setUserRole('')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/notices', label: 'Notices', badge: noticeCount > 0 },
    { path: '/news', label: 'News' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? 'glass-nav shadow-2xl shadow-navy/30'
        : 'bg-navy border-b border-gold/20'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-auto min-h-[68px] md:min-h-[80px] py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            {!logoError ? (
              <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-gold/30 transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                <img
                  src="/logos/SVS logo.png"
                  alt="SVS School Logo"
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-navy" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm md:text-base lg:text-lg font-bold text-white whitespace-nowrap group-hover:text-gold transition-colors duration-300 leading-tight font-display">
                Shanti Varsha Angreji Ma. Vi.
              </span>
              <span className="text-[10px] sm:text-xs text-white/70 leading-tight truncate">
                Vyas-5, Chapaghat, Damauli, Tanahun
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive(link.path)
                  ? 'bg-gradient-to-r from-gold to-gold-light text-white shadow-lg shadow-gold/30'
                  : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
              >
                {link.label}
                {link.badge && !isActive(link.path) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full animate-pulse-slow" />
                )}
                {isActive(link.path) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white/60 rounded-full" />
                )}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  to={userRole === 'admin' ? '/admin' : userRole === 'teacher' ? '/staff' : '/student'}
                  className={`px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive('/admin') || isActive('/staff') || isActive('/student')
                    ? 'bg-gold text-white shadow-lg shadow-gold/30'
                    : 'text-gold hover:text-white hover:bg-gold/20 border border-gold/30'
                    }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 xl:px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-red-600/70 transition-all duration-300 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="relative group">
                <button
                  className={`px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center gap-1.5 ${isActive('/login')
                    ? 'bg-gold text-white border-gold shadow-lg'
                    : 'text-gray-300 border-white/20 hover:text-gold hover:border-gold/50 hover:bg-white/5'
                    }`}
                >
                  Login <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <Link to="/login" state={{ role: 'student' }} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gold transition-colors">Student Login</Link>
                  <Link to="/login" state={{ role: 'teacher' }} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gold transition-colors">Teacher Login</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link to="/login" state={{ role: 'admin' }} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gold transition-colors">Admin Login</Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white hover:text-gold transition-all duration-300 p-2 rounded-xl hover:bg-white/10 ml-2 flex-shrink-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen
              ? <X className="h-6 w-6" />
              : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="glass-nav border-t border-gold/20 shadow-2xl">
          <div className="px-4 pt-3 pb-5 space-y-1.5">
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(link.path)
                  ? 'bg-gradient-to-r from-gold to-gold-light text-white shadow-lg'
                  : 'text-gray-200 hover:text-gold hover:bg-white/10'
                  }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span>{link.label}</span>
                {link.badge && !isActive(link.path) && (
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse-slow" />
                )}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 mt-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to={userRole === 'admin' ? '/admin' : userRole === 'teacher' ? '/staff' : '/student'}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium mb-1.5 transition-all duration-300 ${isActive('/admin') || isActive('/staff') || isActive('/student') ? 'bg-gold text-white' : 'text-gold hover:bg-gold/20'
                      }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-red-600/70 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <div className="space-y-1 bg-white/5 rounded-xl border border-white/10 p-2">
                  <div className="text-[10px] font-bold text-gray-400 px-3 uppercase tracking-wider mb-2 mt-1">Select Login Module</div>
                  <Link to="/login" state={{ role: 'student' }} onClick={() => setIsOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-gold transition-colors">
                    Student Login <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                  </Link>
                  <Link to="/login" state={{ role: 'teacher' }} onClick={() => setIsOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-gold transition-colors">
                    Teacher Login <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                  </Link>
                  <div className="border-t border-white/10 my-1 mx-2"></div>
                  <Link to="/login" state={{ role: 'admin' }} onClick={() => setIsOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gold hover:bg-white/10 transition-colors">
                    Admin Login <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
