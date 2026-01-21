import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Lock, User, AlertCircle } from 'lucide-react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Default admin credentials (in production, this would be handled by a backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123', // In production, this should be hashed and stored securely
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    // Check credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Store login state
      localStorage.setItem('adminLoggedIn', 'true')
      localStorage.setItem('adminUsername', username)
      
      // Redirect to admin page or the page they were trying to access
      const from = location.state?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-2 border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                <Lock className="h-8 w-8 text-gold" />
              </div>
              <h2 className="text-3xl font-bold text-navy bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">Admin Login</h2>
            </div>
          
            <p className="text-center text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              Enter your credentials to access the admin dashboard
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
