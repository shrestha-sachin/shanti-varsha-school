import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, Calendar, LogOut, Edit, Trash2, Plus, X, CheckCircle, AlertCircle,
  LayoutDashboard, Newspaper, FileText, Users, Image, Settings, ChevronRight,
  Pin, Eye, EyeOff, TrendingUp, BookOpen, Search, Award, GraduationCap, Phone, MapPin, Upload, Download
} from 'lucide-react'
import { supabase } from '../supabaseClient'

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
  const [notices, setNotices] = useState([])
  const [form, setForm] = useState({ title: '', date: today(), category: 'General', description: '', pinned: false })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchNotices = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_notices').select('*').order('pinned', { ascending: false }).order('date', { ascending: false })
    if (data) setNotices(data)
    setLoading(false)
  }

  useEffect(() => { fetchNotices() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast({ type: 'error', text: 'Title is required.' })
    
    const payload = { ...form }
    if (editing) {
      const { error } = await supabase.from('school_notices').update(payload).eq('id', editing.id)
      if (!error) toast({ type: 'success', text: 'Notice updated!' })
      setEditing(null)
    } else {
      const { error } = await supabase.from('school_notices').insert([payload])
      if (!error) toast({ type: 'success', text: 'Notice added!' })
    }
    setForm({ title: '', date: today(), category: 'General', description: '', pinned: false })
    fetchNotices()
  }

  const startEdit = (n) => { setEditing(n); setForm({ title: n.title, date: n.date, category: n.category || 'General', description: n.description || '', pinned: !!n.pinned }) }
  const del = async (id) => { if (confirm('Delete this notice?')) { await supabase.from('school_notices').delete().eq('id', id); toast({ type: 'success', text: 'Deleted.' }); fetchNotices() } }
  const cancel = () => { setEditing(null); setForm({ title: '', date: today(), category: 'General', description: '', pinned: false }) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Bell} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Notice' : 'Add New Notice'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Notice Title *</label>
            <input className="input-modern" placeholder="Headline" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
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
            <button type="submit" className="btn-gold w-full">{editing ? 'Update' : 'Add'} Notice</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">Active Notices ({notices.length})</h3>
        {loading ? <EmptyState message="Loading..." /> : notices.length === 0 ? <EmptyState message="Zero notices in database." /> : (
          <div className="space-y-3">
            {notices.map(n => (
              <div key={n.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                <div>
                   <p className="font-semibold text-navy text-sm">{n.title}</p>
                   <p className="text-xs text-gray-400">{n.date}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => startEdit(n)} className="p-2 text-navy hover:bg-gold/10 rounded-lg"><Edit className="h-4 w-4" /></button>
                   <button onClick={() => del(n.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg"><Trash2 className="h-4 w-4" /></button>
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
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', category: 'School News', content: '', image_url: '', date: today(), published: true })
  const [editing, setEditing] = useState(null)

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchNews = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_news').select('*').order('date', { ascending: false })
    if (data) setNews(data)
    setLoading(false)
  }

  useEffect(() => { fetchNews() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast({ type: 'error', text: 'Title is required.' })
    
    if (editing) {
      const { error } = await supabase.from('school_news').update(form).eq('id', editing.id)
      if (!error) toast({ type: 'success', text: 'News updated!' })
      setEditing(null)
    } else {
      const { error } = await supabase.from('school_news').insert([form])
      if (!error) toast({ type: 'success', text: 'News article added!' })
    }
    setForm({ title: '', category: 'School News', content: '', image_url: '', date: today(), published: true })
    fetchNews()
  }

  const startEdit = (n) => { setEditing(n); setForm({ title: n.title, category: n.category, content: n.content || '', image_url: n.image_url || '', date: n.date, published: !!n.published }) }
  const del = async (id) => { if (confirm('Delete this article?')) { await supabase.from('school_news').delete().eq('id', id); toast({ type: 'success', text: 'Deleted.' }); fetchNews() } }
  const cancel = () => { setEditing(null); setForm({ title: '', category: 'School News', content: '', image_url: '', date: today(), published: true }) }
  const togglePublish = async (n) => {
    const { error } = await supabase.from('school_news').update({ published: !n.published }).eq('id', n.id)
    if (!error) fetchNews()
  }

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
            <input className="input-modern" placeholder="https://example.com/image.jpg" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} />
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
        {loading ? <EmptyState message="Loading..." /> : news.length === 0 ? <EmptyState message="No news articles yet." /> : (
          <div className="space-y-3">
            {news.map(n => (
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
                  <button onClick={() => togglePublish(n)} className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-all" title={n.published ? 'Unpublish' : 'Publish'}>
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
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', author: '', tags: '', body: '', date: today(), published: true })
  const [editing, setEditing] = useState(null)

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchArticles = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_articles').select('*').order('date', { ascending: false })
    if (data) setArticles(data)
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast({ type: 'error', text: 'Title is required.' })
    if (editing) {
      const { error } = await supabase.from('school_articles').update(form).eq('id', editing.id)
      if (!error) toast({ type: 'success', text: 'Article updated!' })
      setEditing(null)
    } else {
      const { error } = await supabase.from('school_articles').insert([form])
      if (!error) toast({ type: 'success', text: 'Article published!' })
    }
    setForm({ title: '', author: '', tags: '', body: '', date: today(), published: true })
    fetchArticles()
  }

  const startEdit = (a) => { setEditing(a); setForm({ title: a.title, author: a.author || '', tags: a.tags || '', body: a.body || '', date: a.date, published: !!a.published }) }
  const del = async (id) => { if (confirm('Delete this article?')) { await supabase.from('school_articles').delete().eq('id', id); toast({ type: 'success', text: 'Deleted.' }); fetchArticles() } }
  const cancel = () => { setEditing(null); setForm({ title: '', author: '', tags: '', body: '', date: today(), published: true }) }

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
        {loading ? <EmptyState message="Loading..." /> : articles.length === 0 ? <EmptyState message="No articles yet." /> : (
          <div className="space-y-3">
            {articles.map(a => (
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
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', date: today(), type: 'Academic', description: '' })
  const [editing, setEditing] = useState(null)

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchEvents = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_events').select('*').order('date', { ascending: true })
    if (data) setEvents(data)
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast({ type: 'error', text: 'Title is required.' })
    if (editing) {
      const { error } = await supabase.from('school_events').update(form).eq('id', editing.id)
      if (!error) toast({ type: 'success', text: 'Event updated!' })
      setEditing(null)
    } else {
      const { error } = await supabase.from('school_events').insert([form])
      if (!error) toast({ type: 'success', text: 'Event added!' })
    }
    setForm({ title: '', date: today(), type: 'Academic', description: '' })
    fetchEvents()
  }

  const startEdit = (ev) => { setEditing(ev); setForm({ title: ev.title, date: ev.date, type: ev.type || 'Academic', description: ev.description || '' }) }
  const del = async (id) => { if (confirm('Delete this event?')) { await supabase.from('school_events').delete().eq('id', id); toast({ type: 'success', text: 'Deleted.' }); fetchEvents() } }
  const cancel = () => { setEditing(null); setForm({ title: '', date: today(), type: 'Academic', description: '' }) }

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
        {loading ? <EmptyState message="Loading..." /> : events.length === 0 ? <EmptyState message="No events yet." /> : (
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
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ id: '', name: '', role: 'Teacher', subject: '', photoUrl: '', pin: '' })
  const [editing, setEditing] = useState(null)

  const fetchStaff = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_staff').select('*').order('name')
    if (data) setStaff(data)
    setLoading(false)
  }

  useEffect(() => { fetchStaff() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.id) return toast({ type: 'error', text: 'Name and ID required' })
    
    const payload = { ...form }
    if (editing) {
      const { error } = await supabase.from('school_staff').update(payload).eq('id', editing.id)
      if (!error) toast({ type: 'success', text: 'Staff updated!' })
      setEditing(null)
    } else {
      const { error } = await supabase.from('school_staff').insert([payload])
      if (error) return toast({ type: 'error', text: 'Error adding staff (check ID uniqueness)' })
      toast({ type: 'success', text: 'Staff added!' })
    }
    setForm({ id: '', name: '', role: 'Teacher', subject: '', photoUrl: '', pin: '' })
    fetchStaff()
  }

  const del = async (id) => { if (confirm('Remove staff?')) { await supabase.from('school_staff').delete().eq('id', id); toast({ type: 'success', text: 'Removed.' }); fetchStaff() } }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">Manage Staff</h3>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <input className="input-modern" placeholder="Staff ID (e.g. T-001)" value={form.id} onChange={e => setForm({...form, id: e.target.value})} disabled={!!editing} required />
           <input className="input-modern" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
           <input className="input-modern" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
           <input className="input-modern" placeholder="PIN for Login" value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} required />
           <button type="submit" className="btn-gold md:col-span-2">Save Staff Member</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {staff.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
               <div>
                  <p className="font-bold text-navy">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.role} · {s.subject}</p>
                  <p className="text-[10px] font-mono text-gray-400 mt-1">ID: {s.id} · PIN: {s.pin}</p>
               </div>
               <button onClick={() => del(s.id)} className="text-danger p-2 hover:bg-danger/10 rounded-lg"><Trash2 className="h-4 w-4" /></button>
            </div>
         ))}
      </div>
    </div>
  )
}

// ── GALLERY TAB ───────────────────────────────────────────────────────────────
function GalleryTab({ toast }) {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ album: '', image_url: '', caption: '', date: today() })
  const [editing, setEditing] = useState(null)
  const [albums, setAlbums] = useState([])
  const [newAlbum, setNewAlbum] = useState('')

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchGallery = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_gallery').select('*').order('date', { ascending: false })
    if (data) {
      setGalleries(data)
      const unique = [...new Set(data.map(g => g.album).filter(Boolean))]
      setAlbums(unique)
    }
    setLoading(false)
  }

  useEffect(() => { fetchGallery() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.image_url.trim()) return toast({ type: 'error', text: 'Image URL is required.' })
    if (editing) {
      const { error } = await supabase.from('school_gallery').update(form).eq('id', editing.id)
      if (!error) toast({ type: 'success', text: 'Updated!' })
      setEditing(null)
    } else {
      const { error } = await supabase.from('school_gallery').insert([form])
      if (!error) toast({ type: 'success', text: 'Image added to gallery!' })
    }
    setForm({ album: '', image_url: '', caption: '', date: today() })
    fetchGallery()
  }

  const startEdit = (g) => { setEditing(g); setForm({ album: g.album || '', image_url: g.image_url, caption: g.caption || '', date: g.date }) }
  const del = async (id) => { if (confirm('Delete this image?')) { await supabase.from('school_gallery').delete().eq('id', id); toast({ type: 'success', text: 'Deleted.' }); fetchGallery() } }
  const cancel = () => { setEditing(null); setForm({ album: '', image_url: '', caption: '', date: today() }) }

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
            <input className="input-modern" placeholder="https://example.com/photo.jpg" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} required />
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
        {loading ? <EmptyState message="Loading..." /> : galleries.length === 0 ? <EmptyState message="No images yet." /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleries.map(g => (
              <div key={g.id} className="group relative rounded-xl overflow-hidden border border-gray-100 aspect-square bg-gray-50">
                <img src={g.image_url} alt={g.caption || 'Gallery'} className="w-full h-full object-cover" onError={e => { e.target.src = ''; e.target.parentElement.classList.add('bg-gray-100') }} />
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
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
       const [ {count: stCount}, {count: nCount}, {count: sCount} ] = await Promise.all([
          supabase.from('class_students').select('*', { count: 'exact', head: true }),
          supabase.from('school_notices').select('*', { count: 'exact', head: true }),
          supabase.from('school_staff').select('*', { count: 'exact', head: true })
       ])
       setStats([
          { label: 'Students', value: stCount || 0, icon: GraduationCap, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
          { label: 'Notices', value: nCount || 0, icon: Bell, color: 'from-amber-500 to-amber-600', bg: 'bg-green-50', text: 'text-amber-600' },
          { label: 'Staff members', value: sCount || 0, icon: Users, color: 'from-navy to-navy-darker', bg: 'bg-gray-100', text: 'text-navy' }
       ])
       setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <h3 className="font-display font-bold text-navy text-base mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-gold" />Overview</h3>
          <p className="text-sm text-gray-500">Welcome to the Admin Command Center. All data is now live on Supabase.</p>
        </div>
      </div>
    </div>
  )
}

// ── MAIN ADMIN COMPONENT ──────────────────────────────────────────────────────
// ── RESULTS TAB ──────────────────────────────────────────────────────────────
function ResultsTab() {
  const publishedResults = JSON.parse(localStorage.getItem('publishedResults') || 'null')

  const resetResults = () => {
    if (confirm("Are you sure you want to unpublish the class 10 grades?")) {
      localStorage.removeItem('publishedResults')
      window.dispatchEvent(new Event('publishedResultsUpdated'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Class Results Management</h2>
          <p className="text-sm text-gray-500">Monitor grade publication statuses by teachers.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-lg text-navy mb-4">Class 10 Status (Mr. Hari Sharma)</h3>
        {publishedResults ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-800">Results Published for {publishedResults.term}!</p>
              <p className="text-sm text-green-700">All students can now view and download their NEB gradesheets.</p>
            </div>
            <button onClick={resetResults} className="text-red-600 font-medium text-sm hover:underline">Revoke Publish</button>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
            <p className="font-semibold text-orange-800">Pending Publish</p>
            <p className="text-sm text-orange-700">Class teacher is currently working on grades finalizing.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── STUDENTS TAB ─────────────────────────────────────────────────────────────
function StudentsTab({ toast }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', rollNo: '', dob: '', address: '', parentContact: '', grade: '', parentName: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterGrade, setFilterGrade] = useState('All')

  const fetchStudents = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('class_students').select('*').order('id')
    if (error) toast({ type: 'error', text: 'Error fetching students' })
    else setStudents(data.map(s => ({
       id: s.id, name: s.name, rollNo: s.roll_no, dob: s.dob, address: s.address, parentContact: s.parent_contact, 
       username: s.username, password: s.password, grade: s.grade || '', parentName: s.parent_name || ''
    })))
    setLoading(false)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const startEdit = (s) => { setEditing(s); setForm(s); }
  const cancel = () => { setEditing(null); setForm({ id: '', name: '', rollNo: '', dob: '', address: '', parentContact: '', grade: '', parentName: '' }); }
  
  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.id) return toast({ type: 'error', text: 'Name and ID required' })
    
    const generateCreds = (name, id) => {
      const username = name.trim().toLowerCase().replace(/\s+/g, '.')
      const pass = Math.random().toString(36).slice(-8)
      return { username, pass }
    }

    const payload = {
       id: form.id,
       name: form.name,
       roll_no: form.rollNo,
       dob: form.dob,
       address: form.address,
       parent_contact: form.parentContact,
       grade: form.grade,
       parent_name: form.parentName
    }

    if (!editing) {
       const { username, pass } = generateCreds(form.name, form.id)
       payload.username = username
       payload.password = pass
    }

    if (editing) {
      const { error } = await supabase.from('class_students').update(payload).eq('id', editing.id)
      if (error) {
         console.error('Supabase Update Error:', error)
         return toast({ type: 'error', text: `Failed to update: ${error.message}` })
      }
      toast({ type: 'success', text: 'Student updated!' })
    } else {
      const { error } = await supabase.from('class_students').insert([payload])
      if (error) {
         console.error('Supabase Insert Error:', error)
         if (error.code === '23505') return toast({ type: 'error', text: 'Student ID already exists' })
         return toast({ type: 'error', text: `Failed: ${error.message}` })
      }
      toast({ type: 'success', text: 'Student enrolled!' })
    }
    cancel()
    fetchStudents()
  }

  const del = async (id) => {
    if (confirm("Remove this student completely?")) {
      const { error } = await supabase.from('class_students').delete().eq('id', id)
      if (error) return toast({ type: 'error', text: 'Failed to delete student' })
      toast({ type: 'success', text: 'Student removed' })
      fetchStudents()
    }
  }

  const downloadTemplate = () => {
    const headers = "Student ID,Full Name,Roll No,DOB,Parent Contact,Address\nSVS-2081-XXXX,Template Name,10,2065-01-01 B.S.,+977-9800000000,Vyas-1"
    const blob = new Blob([headers], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = "students_upload_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
    toast({ type: 'success', text: 'Template downloaded successfully' })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    toast({ type: 'success', text: `Processing file: ${file.name}...` })
    
    const reader = new FileReader()
    reader.onload = async (event) => {
       const text = event.target.result
       // super basic CSV parser for demo purposes
       const rows = text.split('\n').map(row => row.split(','))
       const payload = []
       // skip headers safely by starting at i=1
       for (let i = 1; i < rows.length; i++) {
          const cols = rows[i]
          if (cols.length >= 2 && cols[0].trim()) {
             payload.push({
                id: cols[0].trim(),
                name: cols[1]?.trim() || 'Unknown',
                roll_no: cols[2]?.trim() || '',
                dob: cols[3]?.trim() || '',
                parent_contact: cols[4]?.trim() || '',
                address: cols[5]?.trim() || ''
             })
          }
       }
       if (payload.length > 0) {
          const { error } = await supabase.from('class_students').upsert(payload, { onConflict: 'id' })
          if (error) {
              toast({ type: 'error', text: 'Database error importing students.' })
          } else {
              toast({ type: 'success', text: `Successfully imported ${payload.length} students!` })
              fetchStudents()
          }
       } else {
          toast({ type: 'error', text: 'No valid rows found in file.' })
       }
    }
    reader.readAsText(file)
    e.target.value = '' // reset
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
           <SectionIcon icon={GraduationCap} />
           <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Student Details' : 'Enroll New Student'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
             <label className="label-modern">Student ID *</label>
             <input className="input-modern" placeholder="e.g. SVS-2081-0045" value={form.id} onChange={e => setForm({...form, id: e.target.value})} disabled={!!editing} required />
           </div>
           <div>
             <label className="label-modern">Full Name *</label>
             <input className="input-modern" placeholder="e.g. Ramesh Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
           </div>
           <div>
             <label className="label-modern">Roll No</label>
             <input className="input-modern" placeholder="e.g. 18" value={form.rollNo} onChange={e => setForm({...form, rollNo: e.target.value})} />
           </div>
           <div>
             <label className="label-modern">Grade / Class</label>
             <select className="input-modern" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
                <option value="">Select Grade</option>
                {['Nursery', 'L.K.G', 'U.K.G', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
                   <option key={g} value={g}>Class {g}</option>
                ))}
             </select>
           </div>
           <div>
             <label className="label-modern">Parent's Name</label>
             <input className="input-modern" placeholder="e.g. Hari Prasad" value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} />
           </div>
           <div>
             <label className="label-modern">Parent Contact</label>
             <input className="input-modern" placeholder="e.g. +977-98..." value={form.parentContact} onChange={e => setForm({...form, parentContact: e.target.value})} />
           </div>
           <div className="md:col-span-2">
             <label className="label-modern">Address</label>
             <input className="input-modern" placeholder="e.g. Vyas-4" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
           </div>
           <div className="md:col-span-3 flex justify-end gap-3 mt-2">
             {editing && <button type="button" onClick={cancel} className="btn-secondary">Cancel</button>}
             <button type="submit" className="btn-gold">{editing ? 'Save Changes' : 'Enroll Student'}</button>
           </div>
        </form>
      </div>

      {/* Bulk Options */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
         <div>
            <h3 className="font-display font-bold text-navy text-lg mb-1">Bulk Operations</h3>
            <p className="text-sm text-gray-500">Upload multiple students via Excel/CSV spreadsheet format.</p>
         </div>
         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button onClick={downloadTemplate} className="btn-secondary whitespace-nowrap">
               <Download className="w-4 h-4 mr-2" /> Download Template
            </button>
            <label className="btn-gold cursor-pointer whitespace-nowrap">
               <Upload className="w-4 h-4 mr-2" /> Upload Excel File
               <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="hidden" onChange={handleFileUpload} />
            </label>
         </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <h3 className="font-display font-bold text-navy text-lg">Student Roster</h3>
               <span className="text-xs font-bold bg-navy/10 text-navy px-3 py-1 rounded-full">{loading ? 'Loading...' : `${students.length} Total`}</span>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or ID..." 
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <select 
                 className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                 value={filterGrade}
                 onChange={(e) => setFilterGrade(e.target.value)}
               >
                  <option value="All">All Classes</option>
                  {['Nursery', 'L.K.G', 'U.K.G', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
                    <option key={g} value={g}>Class {g}</option>
                  ))}
               </select>
            </div>
         </div>
         {loading ? <div className="p-10 text-center text-gray-400">Loading safely from Supabase Database...</div> : students.length === 0 ? <EmptyState message="No students enrolled yet." /> : (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-100">
                     <tr>
                        <th className="px-6 py-3 font-semibold text-gray-700">Student Info</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Parent Details</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {students
                       .filter(s => {
                          const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase())
                          const matchesGrade = filterGrade === 'All' || s.grade === filterGrade
                          return matchesSearch && matchesGrade
                       })
                       .map(s => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                           <td className="px-6 py-4">
                              <p className="font-bold text-navy">{s.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className="text-[10px] font-bold bg-gold/10 text-gold-dark px-1.5 py-0.5 rounded">Class {s.grade || 'N/A'}</span>
                                 <span className="text-xs text-gray-500">ID: {s.id} | Roll: {s.rollNo}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <p className="text-xs font-semibold text-gray-700">{s.parentName || 'Unknown Parent'}</p>
                              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400"/> {s.parentContact}</p>
                           </td>
                           <td className="px-6 py-4 text-right space-x-2">
                              <button onClick={() => startEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="h-4 w-4" /></button>
                              <button onClick={() => del(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  )
}

// ── MAIN ADMIN PORTAL ────────────────────────────────────────────────────────
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
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'results', label: 'Results', icon: Award },
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
            <div className="bg-white p-1 rounded-lg">
              <img src="/logos/SVS logo.png" alt="SVS Logo" className="h-8 w-8 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-display font-bold text-sm truncate">SVS Admin</p>
              <p className="text-gold/70 text-[10px] uppercase tracking-wider font-semibold">Management</p>
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
          {activeTab === 'students' && <StudentsTab toast={showToast} />}
          {activeTab === 'notices' && <NoticesTab toast={showToast} />}
          {activeTab === 'news' && <NewsTab toast={showToast} />}
          {activeTab === 'results' && <ResultsTab />}
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
