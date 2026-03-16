import { useState, useEffect } from 'react'
import { Calendar, Bell, Pin, ChevronRight, Search } from 'lucide-react'
import { supabase } from '../supabaseClient'

const CATEGORY_STYLES = {
  General: { badge: 'badge-general', border: 'border-l-cat-general' },
  Exam: { badge: 'badge-exam', border: 'border-l-cat-exam' },
  Event: { badge: 'badge-event', border: 'border-l-cat-event' },
  Urgent: { badge: 'badge-urgent', border: 'border-l-cat-urgent' },
  Meeting: { badge: 'badge-meeting', border: 'border-l-cat-academic' },
}

function NoticeBoard({ limit = null, showSearch = false }) {
  const [notices, setNotices] = useState([])

  const loadNotices = async () => {
    const { data } = await supabase.from('school_notices')
      .select('*')
      .order('pinned', { ascending: false })
      .order('date', { ascending: false })
    if (data) setNotices(data)
  }

  useEffect(() => {
    loadNotices()
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
                      <span className="flex items-center gap-1 text-[10px] font-bold text-cat-urgent bg-amber-50 border border-cat-urgent/20 px-2 py-0.5 rounded-full">
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
