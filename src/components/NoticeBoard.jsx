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
      <div className="bg-white rounded-2xl shadow-xl p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
            <Bell className="h-7 w-7 text-gold animate-pulse-slow" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">
            Notice Board
          </h2>
        </div>
        <p className="text-gray-500 text-center py-12 text-lg">No notices available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
      <div className="flex items-center space-x-4 mb-10">
        <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
          <Bell className="h-7 w-7 text-gold animate-pulse-slow" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-navy bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">
          Notice Board
        </h2>
      </div>
      <div className="space-y-4">
        {displayNotices.map((notice, index) => (
          <div
            key={notice.id}
            className="group relative border-l-4 border-gold bg-gradient-to-r from-gray-50 via-white to-gray-50/50 p-6 rounded-r-2xl hover:shadow-xl transition-all duration-500 transform hover:-translate-x-2 hover:scale-[1.02] animate-fade-in-up overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Animated border effect */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors duration-300">
                {notice.title}
              </h3>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5 text-gold group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm md:text-base font-medium">{formatDate(notice.date)}</span>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-gold/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse-slow transition-opacity duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NoticeBoard
