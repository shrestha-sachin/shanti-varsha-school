import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'

  if (!isLoggedIn) {
    // Redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
