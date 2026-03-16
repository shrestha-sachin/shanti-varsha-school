import { useState, useEffect } from 'react'
import { Bell, Search, Filter, Calendar, Pin, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['All', 'General', 'Exam', 'Event', 'Urgent', 'Meeting']
const BADGE_MAP = {
  General: 'badge-general', Exam: 'badge-exam', Event: 'badge-event',
  Urgent: 'badge-urgent', Meeting: 'badge-meeting',
}
const BORDER_MAP = {
  General: 'border-l-cat-general', Exam: 'border-l-cat-exam',
  Event: 'border-l-cat-event', Urgent: 'border-l-cat-urgent', Meeting: 'border-l-cat-academic',
}

const PAGE_SIZE = 8

function Notices() {
  const [notices, setNotices] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await supabase.from('school_notices')
        .select('*')
        .order('pinned', { ascending: false })
        .order('date', { ascending: false })
      if (data) setNotices(data)
    }
    fetchNotices()
  }, [])

  const filtered = notices.filter(n => {
    const matchCat = category === 'All' || n.category === category
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || (n.description || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (v) => { setSearch(v); setPage(1) }
  const handleCategory = (c) => { setCategory(c); setPage(1) }

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Hero */}
      <section className="page-hero py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 animate-fade-in-up">
            <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
              <Bell className="h-8 w-8 text-white animate-pulse-slow" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl md:text-5xl">Notice Board</h1>
              <p className="text-gold-light text-sm mt-1">Important announcements and updates</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="input-modern pl-10"
                placeholder="Search notices..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-gray-400" />
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${category === cat
                      ? 'bg-gradient-to-r from-navy to-gold text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gold/50 hover:text-navy'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-500 text-sm">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} notice{filtered.length !== 1 ? 's' : ''}
            {search && <> matching "<strong className="text-navy">{search}</strong>"</>}
          </p>
        </div>

        {paged.length === 0 ? (
          <div className="text-center py-24">
            <Bell className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No notices found.</p>
            {(search || category !== 'All') && (
              <button onClick={() => { handleSearch(''); handleCategory('All') }} className="mt-3 text-gold font-semibold text-sm hover:underline">Clear filters</button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {paged.map((notice, i) => {
              const cat = notice.category || 'General'
              return (
                <div
                  key={notice.id}
                  className={`group bg-white border-l-4 ${BORDER_MAP[cat] || BORDER_MAP.General} p-5 rounded-r-2xl border border-gray-100 hover:border-gold/20 hover:shadow-card transition-all duration-300 animate-fade-in-up relative overflow-hidden`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {notice.pinned && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-cat-urgent bg-amber-50 border border-cat-urgent/20 px-2 py-0.5 rounded-full">
                            <Pin className="h-2.5 w-2.5" /> Pinned
                          </span>
                        )}
                        <span className={`badge ${BADGE_MAP[cat] || 'badge-general'} text-[11px]`}>{cat}</span>
                      </div>
                      <h3 className="font-display font-bold text-navy text-lg mb-2 leading-snug group-hover:text-gold transition-colors">
                        {notice.title}
                      </h3>
                      {notice.description && (
                        <p className="text-gray-500 text-sm leading-relaxed">{notice.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs whitespace-nowrap flex-shrink-0 bg-gray-50 px-3 py-1.5 rounded-full">
                      <Calendar className="h-3.5 w-3.5" />
                      {fmtDate(notice.date)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-gold/50 hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === p
                    ? 'bg-gradient-to-r from-navy to-gold text-white shadow-md'
                    : 'border border-gray-200 hover:border-gold/50 hover:text-navy text-gray-600'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-gold/50 hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notices
