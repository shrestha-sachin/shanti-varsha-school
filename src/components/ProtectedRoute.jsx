import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation()
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('adminLoggedIn') === 'true'
  const userRole = localStorage.getItem('userRole') || (localStorage.getItem('adminLoggedIn') === 'true' ? 'admin' : '')

  if (!isLoggedIn) {
    // Redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect them to their respective dashboard if they try to access unauthorized pages
    let defaultPath = '/'
    if (userRole === 'admin') defaultPath = '/admin'
    if (userRole === 'teacher') defaultPath = '/staff'
    if (userRole === 'student') defaultPath = '/student'
    return <Navigate to={defaultPath} replace />
  }

  return children
}

export default ProtectedRoute
