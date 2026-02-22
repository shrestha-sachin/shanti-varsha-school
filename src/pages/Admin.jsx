import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, Calendar, LogOut, Edit, Trash2, Plus, X, CheckCircle, AlertCircle,
  LayoutDashboard, Newspaper, FileText, Users, Image, Settings, ChevronRight,
  Pin, Eye, EyeOff, TrendingUp, BookOpen, Search
} from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────
const NOTICE_CATEGORIES = ['General', 'Exam', 'Event', 'Urgent', 'Meeting']
const EVENT_TYPES = ['Academic', 'Exam', 'Event', 'Meeting', 'Holiday', 'Sports']
const NEWS_CATEGORIES = ['School News', 'Academic', 'Sports', 'Arts', 'Achievement', 'Community']
const ARTICLE_TAGS = ['Education', 'Tips', 'Announcement', 'Achievement', 'Community', 'Technology']

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || initial }
    catch { return initial }
  })
  const set = (v) => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(v))
    window.dispatchEvent(new Event(key + 'Updated'))
  }
  return [value, set]
}

function Toast({ msg }) {
  if (!msg.text) return null
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-fade-in-up text-sm font-semibold ${msg.type === 'success'
        ? 'bg-success-light border-success/40 text-green-800'
        : 'bg-danger-light border-danger/40 text-red-800'
      }`}>
      {msg.type === 'success' ? <CheckCircle className="h-5 w-5 text-success" /> : <AlertCircle className="h-5 w-5 text-danger" />}
      {msg.text}
    </div>
  )
}

function SectionIcon({ icon: Icon, className = '' }) {
  return (
    <div className={`bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl flex-shrink-0 ${className}`}>
      <Icon className="h-6 w-6 text-gold" />
    </div>
  )
}

function EmptyState({ message = 'No items yet.' }) {
  return <p className="text-gray-400 text-center py-12 text-sm italic">{message}</p>
}

// ── NOTICE TAB ────────────────────────────────────────────────────────────────
function NoticesTab({ toast }) {
  const [notices, setNotices] = useLocalStorage('schoolNotices', [])
  const [form, setForm] = useState({ title: '', date: today(), category: 'General', description: '', pinned: false })
  const [editing, setEditing] = useState(null)

  function today() { return new Date().toISOString().split('T')[0] }

  const save = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast({ type: 'error', text: 'Title is required.' }); return }
    if (editing) {
      setNotices(notices.map(n => n.id === editing.id ? { ...editing, ...form } : n))
      toast({ type: 'success', text: 'Notice updated!' })
      setEditing(null)
    } else {
      setNotices([...notices, { id: Date.now(), ...form }])
      toast({ type: 'success', text: 'Notice added!' })
    }
    setForm({ title: '', date: today(), category: 'General', description: '', pinned: false })
  }

  const startEdit = (n) => { setEditing(n); setForm({ title: n.title, date: n.date, category: n.category || 'General', description: n.description || '', pinned: !!n.pinned }) }
  const del = (id) => { if (confirm('Delete this notice?')) { setNotices(notices.filter(n => n.id !== id)); toast({ type: 'success', text: 'Deleted.' }) } }
  const cancel = () => { setEditing(null); setForm({ title: '', date: today(), category: 'General', description: '', pinned: false }) }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Bell} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Notice' : 'Add New Notice'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Notice Title *</label>
            <input className="input-modern" placeholder="e.g. Exam Schedule Released" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div>
            <label className="label-modern">Category</label>
            <select className="input-modern" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {NOTICE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Description (optional)</label>
            <textarea className="input-modern resize-none" rows={3} placeholder="Brief description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="pinned" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} className="w-4 h-4 accent-gold" />
            <label htmlFor="pinned" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1.5">
              <Pin className="h-4 w-4 text-amber-500" /> Pin this notice to top
            </label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1">
              <Plus className="h-4 w-4" /> {editing ? 'Update Notice' : 'Add Notice'}
            </button>
            {editing && (
              <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2">
                <X className="h-4 w-4" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">All Notices ({notices.length})</h3>
        {notices.length === 0 ? <EmptyState message="No notices yet. Add your first notice above." /> : (
          <div className="space-y-3">
            {[...notices].sort((a, b) => { if (a.pinned && !b.pinned) return -1; if (!a.pinned && b.pinned) return 1; return new Date(b.date) - new Date(a.date) }).map(n => (
              <div key={n.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {n.pinned && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Pin className="h-2.5 w-2.5" />Pinned</span>}
                    <span className={`badge ${n.category === 'Exam' ? 'badge-exam' : n.category === 'Event' ? 'badge-event' : n.category === 'Urgent' ? 'badge-urgent' : n.category === 'Meeting' ? 'badge-meeting' : 'badge-general'}`}>{n.category || 'General'}</span>
                  </div>
                  <p className="font-semibold text-navy text-sm truncate">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(n.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => startEdit(n)} className="p-2 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => del(n.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── NEWS TAB ──────────────────────────────────────────────────────────────────
function NewsTab({ toast }) {
  const [news, setNews] = useLocalStorage('schoolNews', [])
  const [form, setForm] = useState({ title: '', category: 'School News', content: '', imageUrl: '', date: new Date().toISOString().split('T')[0], published: true })
  const [editing, setEditing] = useState(null)

  const save = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast({ type: 'error', text: 'Title is required.' }); return }
    if (editing) {
      setNews(news.map(n => n.id === editing.id ? { ...editing, ...form } : n))
      toast({ type: 'success', text: 'News updated!' })
      setEditing(null)
    } else {
      setNews([...news, { id: Date.now(), ...form }])
      toast({ type: 'success', text: 'News article added!' })
    }
    setForm({ title: '', category: 'School News', content: '', imageUrl: '', date: new Date().toISOString().split('T')[0], published: true })
  }

  const startEdit = (n) => { setEditing(n); setForm({ title: n.title, category: n.category, content: n.content, imageUrl: n.imageUrl || '', date: n.date, published: n.published !== false }) }
  const del = (id) => { if (confirm('Delete this news article?')) { setNews(news.filter(n => n.id !== id)); toast({ type: 'success', text: 'Deleted.' }) } }
  const cancel = () => { setEditing(null); setForm({ title: '', category: 'School News', content: '', imageUrl: '', date: new Date().toISOString().split('T')[0], published: true }) }
  const togglePublish = (id) => setNews(news.map(n => n.id === id ? { ...n, published: !n.published } : n))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Newspaper} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit News Article' : 'Add News Article'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Headline *</label>
            <input className="input-modern" placeholder="e.g. School Wins Regional Award" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Category</label>
            <select className="input-modern" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {NEWS_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-modern">Published Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Image URL (optional)</label>
            <input className="input-modern" placeholder="https://example.com/image.jpg" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Content *</label>
            <textarea className="input-modern resize-none" rows={5} placeholder="Write the full news article content here..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="news-published" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 accent-gold" />
            <label htmlFor="news-published" className="text-sm font-medium text-gray-700 cursor-pointer">Publish immediately</label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" /> {editing ? 'Update Article' : 'Publish Article'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">All News Articles ({news.length})</h3>
        {news.length === 0 ? <EmptyState message="No news articles yet." /> : (
          <div className="space-y-3">
            {[...news].sort((a, b) => new Date(b.date) - new Date(a.date)).map(n => (
              <div key={n.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-news text-[11px]">{n.category}</span>
                    {!n.published && <span className="badge text-[11px] bg-gray-100 text-gray-500">Draft</span>}
                  </div>
                  <p className="font-semibold text-navy text-sm truncate">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(n.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => togglePublish(n.id)} className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-all" title={n.published ? 'Unpublish' : 'Publish'}>
                    {n.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => startEdit(n)} className="p-2 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => del(n.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── ARTICLES TAB ──────────────────────────────────────────────────────────────
function ArticlesTab({ toast }) {
  const [articles, setArticles] = useLocalStorage('schoolArticles', [])
  const [form, setForm] = useState({ title: '', author: '', tags: '', body: '', date: new Date().toISOString().split('T')[0], published: true })
  const [editing, setEditing] = useState(null)

  const save = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast({ type: 'error', text: 'Title is required.' }); return }
    if (editing) {
      setArticles(articles.map(a => a.id === editing.id ? { ...editing, ...form } : a))
      toast({ type: 'success', text: 'Article updated!' }); setEditing(null)
    } else {
      setArticles([...articles, { id: Date.now(), ...form }])
      toast({ type: 'success', text: 'Article published!' })
    }
    setForm({ title: '', author: '', tags: '', body: '', date: new Date().toISOString().split('T')[0], published: true })
  }

  const startEdit = (a) => { setEditing(a); setForm({ title: a.title, author: a.author || '', tags: a.tags || '', body: a.body || '', date: a.date, published: a.published !== false }) }
  const del = (id) => { if (confirm('Delete this article?')) { setArticles(articles.filter(a => a.id !== id)); toast({ type: 'success', text: 'Deleted.' }) } }
  const cancel = () => { setEditing(null); setForm({ title: '', author: '', tags: '', body: '', date: new Date().toISOString().split('T')[0], published: true }) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={FileText} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Article' : 'Write New Article'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Article Title *</label>
            <input className="input-modern" placeholder="e.g. Tips for Better Study Habits" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Author</label>
            <input className="input-modern" placeholder="e.g. Principal Name" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} />
          </div>
          <div>
            <label className="label-modern">Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Tags (comma separated)</label>
            <input className="input-modern" placeholder="e.g. Education, Tips, Achievement" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Article Body *</label>
            <textarea className="input-modern resize-none" rows={7} placeholder="Write your article content here..." value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} required />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" />{editing ? 'Update Article' : 'Publish Article'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">All Articles ({articles.length})</h3>
        {articles.length === 0 ? <EmptyState message="No articles yet." /> : (
          <div className="space-y-3">
            {[...articles].sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.author ? `By ${a.author} · ` : ''}{new Date(a.date).toLocaleDateString()}</p>
                  {a.tags && <p className="text-xs text-gold mt-1 truncate">{a.tags}</p>}
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => startEdit(a)} className="p-2 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => del(a.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── CALENDAR TAB ──────────────────────────────────────────────────────────────
function CalendarTab({ toast }) {
  const [events, setEvents] = useLocalStorage('schoolCalendarEvents', [])
  const [form, setForm] = useState({ title: '', date: new Date().toISOString().split('T')[0], type: 'Academic', description: '' })
  const [editing, setEditing] = useState(null)

  const save = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast({ type: 'error', text: 'Title is required.' }); return }
    if (editing) {
      setEvents(events.map(ev => ev.id === editing.id ? { ...editing, ...form } : ev))
      toast({ type: 'success', text: 'Event updated!' }); setEditing(null)
    } else {
      setEvents([...events, { id: Date.now(), ...form }])
      toast({ type: 'success', text: 'Event added!' })
    }
    setForm({ title: '', date: new Date().toISOString().split('T')[0], type: 'Academic', description: '' })
  }

  const startEdit = (ev) => { setEditing(ev); setForm({ title: ev.title, date: ev.date, type: ev.type, description: ev.description || '' }) }
  const del = (id) => { if (confirm('Delete this event?')) { setEvents(events.filter(ev => ev.id !== id)); toast({ type: 'success', text: 'Deleted.' }) } }
  const cancel = () => { setEditing(null); setForm({ title: '', date: new Date().toISOString().split('T')[0], type: 'Academic', description: '' }) }

  const typeColors = { Exam: 'badge-exam', Event: 'badge-event', Academic: 'badge-academic', Meeting: 'badge-meeting', Holiday: 'badge-event', Sports: 'badge-sports' }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Calendar} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Event' : 'Add Calendar Event'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Event Title *</label>
            <input className="input-modern" placeholder="e.g. Annual Sports Day" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div>
            <label className="label-modern">Type</label>
            <select className="input-modern" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
              {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Description (optional)</label>
            <textarea className="input-modern resize-none" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" />{editing ? 'Update Event' : 'Add Event'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">All Events ({events.length})</h3>
        {events.length === 0 ? <EmptyState message="No events yet." /> : (
          <div className="space-y-3">
            {[...events].sort((a, b) => new Date(a.date) - new Date(b.date)).map(ev => (
              <div key={ev.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${typeColors[ev.type] || 'badge-academic'} text-[11px]`}>{ev.type}</span>
                  </div>
                  <p className="font-semibold text-navy text-sm truncate">{ev.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(ev.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => startEdit(ev)} className="p-2 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => del(ev.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── STAFF TAB ─────────────────────────────────────────────────────────────────
function StaffTab({ toast }) {
  const [staff, setStaff] = useLocalStorage('schoolStaff', [])
  const [form, setForm] = useState({ name: '', role: 'Teacher', subject: '', bio: '', photoUrl: '', pin: '', isActive: true })
  const [editing, setEditing] = useState(null)

  const save = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast({ type: 'error', text: 'Name is required.' }); return }
    if (editing) {
      setStaff(staff.map(s => s.id === editing.id ? { ...editing, ...form } : s))
      toast({ type: 'success', text: 'Staff updated!' }); setEditing(null)
    } else {
      setStaff([...staff, { id: Date.now(), ...form }])
      toast({ type: 'success', text: 'Staff member added!' })
    }
    setForm({ name: '', role: 'Teacher', subject: '', bio: '', photoUrl: '', pin: '', isActive: true })
  }

  const startEdit = (s) => { setEditing(s); setForm({ name: s.name, role: s.role, subject: s.subject || '', bio: s.bio || '', photoUrl: s.photoUrl || '', pin: s.pin || '', isActive: s.isActive !== false }) }
  const del = (id) => { if (confirm('Delete this staff member?')) { setStaff(staff.filter(s => s.id !== id)); toast({ type: 'success', text: 'Deleted.' }) } }
  const cancel = () => { setEditing(null); setForm({ name: '', role: 'Teacher', subject: '', bio: '', photoUrl: '', pin: '', isActive: true }) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Users} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-modern">Full Name *</label>
            <input className="input-modern" placeholder="e.g. Ram Kumar Shrestha" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Role</label>
            <select className="input-modern" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              {['Teacher', 'Principal', 'Vice Principal', 'Staff', 'Librarian', 'Lab Assistant', 'Admin Staff'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label-modern">Subject (for teachers)</label>
            <input className="input-modern" placeholder="e.g. Mathematics" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
          </div>
          <div>
            <label className="label-modern">Staff PIN (for portal login)</label>
            <input className="input-modern" type="password" placeholder="4–6 digit PIN" maxLength={6} value={form.pin} onChange={e => setForm(p => ({ ...p, pin: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Photo URL (optional)</label>
            <input className="input-modern" placeholder="https://example.com/photo.jpg" value={form.photoUrl} onChange={e => setForm(p => ({ ...p, photoUrl: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Bio (optional)</label>
            <textarea className="input-modern resize-none" rows={3} placeholder="Short biography..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" />{editing ? 'Update Staff' : 'Add Staff Member'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">All Staff ({staff.length})</h3>
        {staff.length === 0 ? <EmptyState message="No staff members added yet." /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map(s => (
              <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/30 to-navy/20 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-gold/20">
                  {s.photoUrl ? <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} /> : <Users className="h-6 w-6 text-navy" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm truncate">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.role}{s.subject ? ` · ${s.subject}` : ''}</p>
                  {s.pin && <p className="text-xs text-gold mt-0.5">Portal PIN set ✓</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(s)} className="p-1.5 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => del(s.id)} className="p-1.5 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── GALLERY TAB ───────────────────────────────────────────────────────────────
function GalleryTab({ toast }) {
  const [galleries, setGalleries] = useLocalStorage('schoolGallery', [])
  const [form, setForm] = useState({ album: '', imageUrl: '', caption: '', date: new Date().toISOString().split('T')[0] })
  const [editing, setEditing] = useState(null)
  const [albums, setAlbums] = useState([])
  const [newAlbum, setNewAlbum] = useState('')

  useEffect(() => {
    const unique = [...new Set(galleries.map(g => g.album).filter(Boolean))]
    setAlbums(unique)
  }, [galleries])

  const save = (e) => {
    e.preventDefault()
    if (!form.imageUrl.trim()) { toast({ type: 'error', text: 'Image URL is required.' }); return }
    if (editing) {
      setGalleries(galleries.map(g => g.id === editing.id ? { ...editing, ...form } : g))
      toast({ type: 'success', text: 'Updated!' }); setEditing(null)
    } else {
      setGalleries([...galleries, { id: Date.now(), ...form }])
      toast({ type: 'success', text: 'Image added to gallery!' })
    }
    setForm({ album: '', imageUrl: '', caption: '', date: new Date().toISOString().split('T')[0] })
  }

  const startEdit = (g) => { setEditing(g); setForm({ album: g.album, imageUrl: g.imageUrl, caption: g.caption || '', date: g.date }) }
  const del = (id) => { if (confirm('Delete this image?')) { setGalleries(galleries.filter(g => g.id !== id)); toast({ type: 'success', text: 'Deleted.' }) } }
  const cancel = () => { setEditing(null); setForm({ album: '', imageUrl: '', caption: '', date: new Date().toISOString().split('T')[0] }) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Image} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Image' : 'Add Gallery Image'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Image URL *</label>
            <input className="input-modern" placeholder="https://example.com/photo.jpg" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Album</label>
            <div className="flex gap-2">
              <select className="input-modern flex-1" value={form.album} onChange={e => setForm(p => ({ ...p, album: e.target.value }))}>
                <option value="">No Album</option>
                {albums.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex gap-2 mt-2">
              <input className="input-modern flex-1" placeholder="Or type new album name" value={newAlbum} onChange={e => setNewAlbum(e.target.value)} />
              <button type="button" onClick={() => { if (newAlbum.trim()) { setForm(p => ({ ...p, album: newAlbum.trim() })); setNewAlbum('') } }} className="px-3 py-2 bg-gold/10 text-gold rounded-xl border border-gold/30 text-sm font-medium hover:bg-gold/20 transition-all">Use</button>
            </div>
          </div>
          <div>
            <label className="label-modern">Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Caption (optional)</label>
            <input className="input-modern" placeholder="Describe the image..." value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" />{editing ? 'Update Image' : 'Add to Gallery'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">Gallery ({galleries.length} images)</h3>
        {galleries.length === 0 ? <EmptyState message="No images yet." /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleries.map(g => (
              <div key={g.id} className="group relative rounded-xl overflow-hidden border border-gray-100 aspect-square bg-gray-50">
                <img src={g.imageUrl} alt={g.caption || 'Gallery'} className="w-full h-full object-cover" onError={e => { e.target.src = ''; e.target.parentElement.classList.add('bg-gray-100') }} />
                <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-2">
                  {g.caption && <p className="text-white text-xs text-center leading-tight">{g.caption}</p>}
                  {g.album && <span className="badge badge-news text-[10px]">{g.album}</span>}
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => startEdit(g)} className="p-1.5 bg-white/20 hover:bg-gold/80 rounded-lg transition-all"><Edit className="h-3.5 w-3.5 text-white" /></button>
                    <button onClick={() => del(g.id)} className="p-1.5 bg-white/20 hover:bg-danger/80 rounded-lg transition-all"><Trash2 className="h-3.5 w-3.5 text-white" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── SETTINGS TAB ──────────────────────────────────────────────────────────────
function SettingsTab({ toast }) {
  const [settings, setSettings] = useLocalStorage('schoolSettings', {
    name: 'Shanti Varsha Angreji Ma. Vi.',
    address: 'Vyas-5, Chapaghat, Damauli, Tanahun',
    phone: '+977-XXXXXXXX',
    email: 'info@shantivarsha.edu.np',
    facebook: '#',
    instagram: '#',
    youtube: '#',
    established: '2065',
  })

  const save = (e) => {
    e.preventDefault()
    setSettings({ ...settings })
    toast({ type: 'success', text: 'Settings saved!' })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <SectionIcon icon={Settings} />
        <h3 className="font-display font-bold text-navy text-xl">School Settings</h3>
      </div>
      <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['School Name', 'name', 'Shanti Varsha Angreji Ma. Vi.'],
          ['Address', 'address', 'Vyas-5, Chapaghat, Damauli'],
          ['Phone', 'phone', '+977-XXXXXXXX'],
          ['Email', 'email', 'info@shantivarsha.edu.np'],
          ['Established Year', 'established', '2065'],
          ['Facebook URL', 'facebook', 'https://facebook.com/...'],
          ['Instagram URL', 'instagram', 'https://instagram.com/...'],
          ['YouTube URL', 'youtube', 'https://youtube.com/...'],
        ].map(([label, field, placeholder]) => (
          <div key={field}>
            <label className="label-modern">{label}</label>
            <input className="input-modern" placeholder={placeholder} value={settings[field] || ''} onChange={e => setSettings(p => ({ ...p, [field]: e.target.value }))} />
          </div>
        ))}
        <div className="md:col-span-2 mt-2">
          <button type="submit" className="btn-gold w-full sm:w-auto px-10">Save Settings</button>
        </div>
      </form>
    </div>
  )
}

// ── DASHBOARD TAB ─────────────────────────────────────────────────────────────
function DashboardTab() {
  const notices = JSON.parse(localStorage.getItem('schoolNotices') || '[]')
  const news = JSON.parse(localStorage.getItem('schoolNews') || '[]')
  const articles = JSON.parse(localStorage.getItem('schoolArticles') || '[]')
  const events = JSON.parse(localStorage.getItem('schoolCalendarEvents') || '[]')
  const staff = JSON.parse(localStorage.getItem('schoolStaff') || '[]')
  const gallery = JSON.parse(localStorage.getItem('schoolGallery') || '[]')

  const stats = [
    { label: 'Notices', value: notices.length, icon: Bell, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    { label: 'News Articles', value: news.length, icon: Newspaper, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700' },
    { label: 'Articles', value: articles.length, icon: FileText, color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50', text: 'text-sky-700' },
    { label: 'Calendar Events', value: events.length, icon: Calendar, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { label: 'Staff Members', value: staff.length, icon: Users, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-700' },
    { label: 'Gallery Images', value: gallery.length, icon: Image, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-700' },
  ]

  const recentNotices = [...notices].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
  const upcomingEvents = [...events].filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, text }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 border border-white shadow-sm hover:shadow-card transition-all card-hover`}>
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${color} mb-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className={`text-3xl font-display font-bold ${text}`}>{value}</div>
            <div className="text-gray-500 text-xs mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="font-display font-bold text-navy text-base mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-gold" />Recent Notices</h3>
          {recentNotices.length === 0 ? <EmptyState message="No notices yet." /> : (
            <div className="space-y-2">
              {recentNotices.map(n => (
                <div key={n.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm font-medium text-navy truncate">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(n.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="font-display font-bold text-navy text-base mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" />Upcoming Events</h3>
          {upcomingEvents.length === 0 ? <EmptyState message="No upcoming events." /> : (
            <div className="space-y-2">
              {upcomingEvents.map(ev => (
                <div key={ev.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy truncate">{ev.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(ev.date).toLocaleDateString()}</p>
                  </div>
                  <span className="badge badge-academic text-[10px] ml-2 whitespace-nowrap">{ev.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── MAIN ADMIN COMPONENT ──────────────────────────────────────────────────────
function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toast, setToast] = useState({ type: '', text: '' })

  useEffect(() => {
    if (toast.text) {
      const t = setTimeout(() => setToast({ type: '', text: '' }), 3500)
      return () => clearTimeout(t)
    }
  }, [toast])

  const showToast = (msg) => setToast(msg)

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUsername')
    navigate('/login')
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const currentTab = tabs.find(t => t.id === activeTab)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toast msg={toast} />

      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-navy-darker to-navy min-h-screen sticky top-0 shadow-2xl">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gold/20 p-2 rounded-xl">
              <LayoutDashboard className="h-6 w-6 text-gold" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-sm">Admin Panel</p>
              <p className="text-gold/70 text-xs">SVS School</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`admin-sidebar-link ${activeTab === id ? 'active' : ''}`}>
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <button onClick={handleLogout} className="admin-sidebar-link text-red-400 hover:bg-red-500/20 hover:text-red-300 w-full">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {currentTab && <currentTab.icon className="h-5 w-5 text-gold" />}
            <h1 className="font-display font-bold text-navy text-xl">{currentTab?.label || 'Admin'}</h1>
          </div>

          {/* Mobile tab switcher */}
          <div className="lg:hidden">
            <select
              className="input-modern py-1.5 text-sm"
              value={activeTab}
              onChange={e => setActiveTab(e.target.value)}
            >
              {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>

          <button onClick={handleLogout} className="hidden lg:flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </header>

        {/* Content */}
        <main className="p-6 max-w-5xl">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'notices' && <NoticesTab toast={showToast} />}
          {activeTab === 'news' && <NewsTab toast={showToast} />}
          {activeTab === 'articles' && <ArticlesTab toast={showToast} />}
          {activeTab === 'calendar' && <CalendarTab toast={showToast} />}
          {activeTab === 'staff' && <StaffTab toast={showToast} />}
          {activeTab === 'gallery' && <GalleryTab toast={showToast} />}
          {activeTab === 'settings' && <SettingsTab toast={showToast} />}
        </main>
      </div>
    </div>
  )
}

export default Admin
