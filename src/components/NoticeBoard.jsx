import { useState, useEffect } from 'react'
import { Calendar, Bell, Pin, ChevronRight, Search } from 'lucide-react'

const CATEGORY_STYLES = {
  General: { badge: 'badge-general', border: 'border-l-indigo-500' },
  Exam: { badge: 'badge-exam', border: 'border-l-red-500' },
  Event: { badge: 'badge-event', border: 'border-l-emerald-500' },
  Urgent: { badge: 'badge-urgent', border: 'border-l-amber-500' },
  Meeting: { badge: 'badge-meeting', border: 'border-l-sky-500' },
}

function NoticeBoard({ limit = null, showSearch = false }) {
  const [notices, setNotices] = useState([])

  const loadNotices = () => {
    const stored = localStorage.getItem('schoolNotices')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Pinned first, then by date desc
      const sorted = parsed.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.date) - new Date(a.date)
      })
      setNotices(sorted)
    } else {
      const sampleNotices = [
        { id: 1, title: 'Welcome to the New Academic Session 2081', date: new Date().toISOString().split('T')[0], category: 'General', pinned: true, description: 'We warmly welcome all students and staff to the new academic session. May this year be filled with learning and success.' },
        { id: 2, title: 'Annual Sports Day Announcement', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], category: 'Event', pinned: false, description: 'Our annual sports day will be held on the school grounds. Students are encouraged to participate in various events.' },
        { id: 3, title: 'Half-Yearly Exam Schedule Released', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], category: 'Exam', pinned: false, description: 'The half-yearly examination schedule has been released. Please check the timetable and prepare accordingly.' },
      ]
      localStorage.setItem('schoolNotices', JSON.stringify(sampleNotices))
      setNotices(sampleNotices)
    }
  }

  useEffect(() => {
    loadNotices()
    const handler = () => loadNotices()
    window.addEventListener('storage', handler)
    window.addEventListener('noticeUpdated', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('noticeUpdated', handler)
    }
  }, [])

  const displayNotices = limit ? notices.slice(0, limit) : notices

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })

  if (displayNotices.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-10 border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl">
            <Bell className="h-7 w-7 text-gold animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-display font-bold section-heading">Notice Board</h2>
        </div>
        <p className="text-gray-400 text-center py-10 text-base">No notices available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-navy/[0.03] to-transparent">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-sm">
            <Bell className="h-7 w-7 text-gold animate-pulse-slow" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold section-heading">Notice Board</h2>
            <p className="text-gray-500 text-sm mt-0.5">{displayNotices.length} notice{displayNotices.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="p-6 md:p-8 space-y-3">
        {displayNotices.map((notice, index) => {
          const cat = CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General
          return (
            <div
              key={notice.id}
              className={`group relative border-l-4 ${cat.border} bg-gray-50 hover:bg-white p-5 rounded-r-2xl hover:shadow-card transition-all duration-300 hover:-translate-x-1 hover:translate-y-0 animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 rounded-r-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer-effect pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {notice.pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Pin className="h-2.5 w-2.5" /> Pinned
                      </span>
                    )}
                    {notice.category && (
                      <span className={`badge ${cat.badge} text-[11px]`}>{notice.category}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs whitespace-nowrap flex-shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(notice.date)}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-navy group-hover:text-gold transition-colors duration-300 leading-snug">
                  {notice.title}
                </h3>
                {notice.description && (
                  <p className="text-gray-500 text-sm mt-1.5 leading-relaxed line-clamp-2">
                    {notice.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NoticeBoard
