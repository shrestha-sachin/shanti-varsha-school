import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Lock, User, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../supabaseClient'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  const roleTitle = location.state?.role 
    ? location.state.role.charAt(0).toUpperCase() + location.state.role.slice(1) + ' Login' 
    : 'Login Portal'

  // Credentials managed via secure environment variables (.env)
  const CREDENTIALS = {
    admin: { 
      username: import.meta.env.VITE_ADMIN_USER || 'admin', 
      password: import.meta.env.VITE_ADMIN_PASSWORD, 
      role: 'admin' 
    },
  }

  // Auto-fill disabled for security. User must manually input credentials.

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)
    // 2. Fallback to hardcoded roles for Demo/Admin
    const userRoleKey = Object.keys(CREDENTIALS).find(
      key => CREDENTIALS[key].username === username && CREDENTIALS[key].password === password
    )

    if (userRoleKey) {
      const user = CREDENTIALS[userRoleKey]
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', user.username)
      localStorage.setItem('userRole', user.role)
      setLoading(false)
      
      let defaultPath = '/admin'
      if (user.role === 'teacher') defaultPath = '/staff'
      const from = location.state?.from?.pathname || defaultPath
      navigate(from, { replace: true })
    } else {
      setLoading(false)
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-2 border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
          <div className="relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="bg-white p-2 rounded-2xl shadow-xl border-2 border-gold/20">
                <img src="/logos/SVS logo.png" alt="SVS Logo" className="h-20 w-20 object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-navy bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">{roleTitle}</h2>
            </div>
          
            <p className="text-center text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              Enter your credentials to access your dashboard
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 border-2 border-red-200 rounded-xl flex items-center space-x-2 animate-fade-in-up">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <label htmlFor="username" className="block text-sm font-semibold text-navy mb-2 flex items-center space-x-2">
                  <User className="h-4 w-4 text-gold" />
                  <span>Username</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-gold transition-colors" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 bg-gray-50/50 focus:bg-white group-hover:border-gold/50"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                <label htmlFor="password" className="block text-sm font-semibold text-navy mb-2 flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gold" />
                  <span>Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gold transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 bg-gray-50/50 focus:bg-white group-hover:border-gold/50"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-gold to-gold-light text-white py-4 px-4 rounded-xl font-bold hover:from-gold-light hover:to-gold transition-all duration-500 shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
