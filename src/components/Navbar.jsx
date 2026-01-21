import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, GraduationCap, LogOut } from 'lucide-react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin is logged in
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)

    // Listen for storage changes
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem('adminLoggedIn') === 'true'
      setIsLoggedIn(loggedIn)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUsername')
    setIsLoggedIn(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/notices', label: 'Notices' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-xl backdrop-blur-sm animate-fade-in border-b border-gold/20" style={{ backgroundColor: 'rgba(13, 71, 161, 0.98)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-auto min-h-[64px] md:min-h-[80px] py-2">
          {/* Logo and School Name with Address */}
          <div 
            onClick={() => {
              window.location.href = '/'
            }}
            className="flex items-center space-x-2 sm:space-x-3 group min-w-0 flex-shrink-0 cursor-pointer"
          >
            {/* Use SVS logo with circular white background - always circular */}
            {!logoError ? (
              <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                <img 
                  src="/logos/SVS logo.png" 
                  alt="SVS School Logo" 
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-gold" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold whitespace-nowrap group-hover:text-gold transition-colors leading-tight">
                Shanti Varsha Angreji Ma. Vi.
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 group-hover:text-gold/80 transition-colors leading-tight truncate">
                Vyas-5, Chapaghat, Damauli, Tanahun
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap magnetic ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-gold to-gold-light text-white shadow-lg shadow-gold/30 animate-glow'
                    : 'text-gray-200 hover:text-gold hover:bg-white/10 hover:scale-105'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full animate-shimmer-effect"></span>
                )}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  to="/admin"
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive('/admin')
                      ? 'bg-gold text-white shadow-lg shadow-gold/30'
                      : 'text-gray-200 hover:text-gold hover:bg-white/10'
                  }`}
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 xl:px-4 py-2 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-red-600/80 transition-all duration-300 flex items-center space-x-1 shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive('/login')
                    ? 'bg-gold text-white shadow-lg shadow-gold/30'
                    : 'text-gray-200 hover:text-gold hover:bg-white/10'
                }`}
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile/Tablet menu button */}
          <button
            className="lg:hidden text-white hover:text-gold transition-all duration-300 p-2 rounded-lg hover:bg-white/10 ml-2 flex-shrink-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <Menu className="h-6 w-6 sm:h-7 sm:w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Navigation */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-navy/98 backdrop-blur-sm border-t border-gold/20 shadow-xl">
          <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-6 space-y-1.5 sm:space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-gold text-white shadow-lg shadow-gold/30'
                    : 'text-gray-200 hover:text-gold hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                    isActive('/admin')
                      ? 'bg-gold text-white shadow-lg shadow-gold/30'
                      : 'text-gray-200 hover:text-gold hover:bg-white/10'
                  }`}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-gray-200 hover:text-white hover:bg-red-600/80 transition-all duration-300 flex items-center space-x-2 shadow-md"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`block px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                  isActive('/login')
                    ? 'bg-gold text-white shadow-lg shadow-gold/30'
                    : 'text-gray-200 hover:text-gold hover:bg-white/10'
                }`}
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
