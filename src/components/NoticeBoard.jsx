import { useState, useEffect } from 'react'
import { Calendar, Bell } from 'lucide-react'

function NoticeBoard({ limit = null }) {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    // Load notices from localStorage
    const storedNotices = localStorage.getItem('schoolNotices')
    if (storedNotices) {
      const parsedNotices = JSON.parse(storedNotices)
      // Sort by date (newest first)
      const sortedNotices = parsedNotices.sort((a, b) => new Date(b.date) - new Date(a.date))
      setNotices(sortedNotices)
    } else {
      // Initialize with sample notices
      const sampleNotices = [
        {
          id: 1,
          title: 'Welcome to New Academic Session',
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: 2,
          title: 'Annual Sports Day Announcement',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        },
        {
          id: 3,
          title: 'Parent-Teacher Meeting Scheduled',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        },
      ]
      localStorage.setItem('schoolNotices', JSON.stringify(sampleNotices))
      setNotices(sampleNotices)
    }
  }, [])

  // Listen for storage changes (when admin adds new notice)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedNotices = localStorage.getItem('schoolNotices')
      if (storedNotices) {
        const parsedNotices = JSON.parse(storedNotices)
        const sortedNotices = parsedNotices.sort((a, b) => new Date(b.date) - new Date(a.date))
        setNotices(sortedNotices)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event (for same-tab updates)
    window.addEventListener('noticeUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('noticeUpdated', handleStorageChange)
    }
  }, [])

  const displayNotices = limit ? notices.slice(0, limit) : notices

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (displayNotices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gold/20 p-2 rounded-lg">
            <Bell className="h-6 w-6 text-gold" />
          </div>
          <h2 className="text-3xl font-bold text-navy">Notice Board</h2>
        </div>
        <p className="text-gray-500 text-center py-8">No notices available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gold/20 p-2 rounded-lg">
          <Bell className="h-6 w-6 text-gold" />
        </div>
        <h2 className="text-3xl font-bold text-navy">Notice Board</h2>
      </div>
      <div className="space-y-4">
        {displayNotices.map((notice) => (
          <div
            key={notice.id}
            className="border-l-4 border-gold bg-gradient-to-r from-gray-50 to-white p-5 rounded-r-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1"
          >
            <h3 className="text-lg font-bold text-navy mb-3">{notice.title}</h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium">{formatDate(notice.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NoticeBoard
