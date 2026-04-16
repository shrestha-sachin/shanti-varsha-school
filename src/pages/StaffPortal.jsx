import { useState, useEffect } from 'react'
import { Users, LogIn, LogOut, Bell, Calendar, Newspaper, User, Lock, BookOpen, Award, LayoutDashboard, GraduationCap, Edit, Save, CheckCircle, MapPin, Phone } from 'lucide-react'
import { supabase } from '../supabaseClient'

function StaffPortal() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [loggedIn, setLoggedIn] = useState(false)
    const [staffMember, setStaffMember] = useState(null)
    const [nameInput, setNameInput] = useState('')
    const [pinInput, setPinInput] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [publishStatus, setPublishStatus] = useState('')

    // Form states for results publishing
    const [studentId, setStudentId] = useState('')
    const [marks, setMarks] = useState({ math: '', science: '', english: '', nepali: '' })

    // Database states
    const [students, setStudents] = useState([])
    const [grades, setGrades] = useState({})
    const [editingStudent, setEditingStudent] = useState(null)
    const [notices, setNotices] = useState([])
    const [events, setEvents] = useState([])
    const [news, setNews] = useState([])
    const [allStaff, setAllStaff] = useState([])

    const fetchDB = async () => {
        const { data: gData } = await supabase.from('student_grades').select('*')
        if (gData) {
            const gMap = {}
            gData.forEach(g => gMap[g.student_id] = g)
            setGrades(gMap)
        }

        const { data: nData } = await supabase.from('school_notices').select('*').order('date', { ascending: false }).limit(5)
        if (nData) setNotices(nData)

        const { data: eData } = await supabase.from('school_events').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(5)
        if (eData) setEvents(eData)

        const { data: newsData } = await supabase.from('school_news').select('*').eq('published', true).order('date', { ascending: false }).limit(3)
        if (newsData) setNews(newsData)

        const { data: staffData } = await supabase.from('school_staff').select('*').order('name')
        if (staffData) setAllStaff(staffData)
    }

    useEffect(() => {
        if (loggedIn) fetchDB()
    }, [loggedIn])

    useEffect(() => {
        const isAuth = localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userRole') === 'teacher'
        const saved = sessionStorage.getItem('staffPortalUser')
        
        if (saved) { 
            setStaffMember(JSON.parse(saved)); setLoggedIn(true) 
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        
        const { data, error: fbError } = await supabase.from('school_staff').select('*').eq('name', nameInput.trim()).eq('pin', pinInput.trim()).maybeSingle()
        
        if (data) {
            setStaffMember(data)
            setLoggedIn(true)
            sessionStorage.setItem('staffPortalUser', JSON.stringify(data))
        } else {
            setError('Invalid credentials. Please contact the administrator.')
        }
        setLoading(false)
    }

    const handleLogout = () => {
        setLoggedIn(false)
        setStaffMember(null)
        sessionStorage.removeItem('staffPortalUser')
        setNameInput('')
        setPinInput('')
        setError('')
    }


    if (!loggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20 animate-fade-in">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden animate-scale-in">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-navy-darker to-navy p-6 sm:p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gold rounded-full blur-3xl" />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-white/20 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                </div>
                                <h1 className="font-display font-bold text-xl sm:text-2xl mb-1">Staff Portal</h1>
                                <p className="text-gold-light text-xs sm:text-sm">Shanti Varsha Angreji Ma. Vi.</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-6 sm:p-8">
                            <p className="text-gray-500 text-xs sm:text-sm mb-6 text-center">Enter your registered name and PIN to access the portal.</p>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="label-modern">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            className="input-modern pl-10"
                                            placeholder="Enter your name"
                                            value={nameInput}
                                            onChange={e => setNameInput(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label-modern">Staff PIN</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="password"
                                            className="input-modern pl-10"
                                            placeholder="Enter PIN"
                                            value={pinInput}
                                            onChange={e => setPinInput(e.target.value)}
                                            required
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className="bg-danger-light border border-danger/30 text-red-700 text-xs px-4 py-3 rounded-xl animate-fade-in font-medium">
                                        {error}
                                    </div>
                                )}
                                <button type="submit" disabled={loading} className="btn-gold w-full mt-2 py-3.5 text-base">
                                    {loading ? (
                                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in...</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><LogIn className="h-5 w-5" />Sign In</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in pb-12">
            {/* Banner */}
            <section className="bg-gradient-to-br from-navy-darker to-navy py-8 md:py-12 text-white border-b border-white/10 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 animate-fade-in-up">
                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md flex-shrink-0 border border-white/20 shadow-inner">
                            <Users className="h-7 w-7 text-white drop-shadow-md" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="font-display font-bold text-xl md:text-3xl tracking-tight truncate">Welcome, {staffMember?.name}!</h1>
                            <p className="text-gold-light text-[10px] sm:text-xs mt-1 font-bold bg-gold/10 inline-block px-3 py-1 rounded-full border border-gold/20 uppercase tracking-wider">{staffMember?.role}{staffMember?.subject ? ` · ${staffMember.subject}` : ''}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                            <LogOut className="h-4 w-4" /> Logout
                        </button>
                    </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-white text-navy border-gold' : 'bg-white/5 text-white/60 border-transparent hover:bg-white/10'}`}>
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Notices */}
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-gold/10 p-2.5 rounded-xl">
                                <Bell className="h-5 w-5 text-gold animate-pulse-slow" />
                            </div>
                            <h2 className="font-display font-bold text-navy text-lg">Latest Notices</h2>
                        </div>
                        {notices.length === 0 ? <p className="text-gray-400 text-sm">No notices.</p> : (
                            <div className="space-y-2.5">
                                {notices.map(n => (
                                    <div key={n.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`badge text-[10px] ${n.category === 'Urgent' ? 'badge-urgent' : n.category === 'Exam' ? 'badge-exam' : 'badge-general'}`}>{n.category}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-navy leading-snug">{n.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{new Date(n.date).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Events */}
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-cat-event/10 p-2.5 rounded-xl">
                                <Calendar className="h-5 w-5 text-cat-event" />
                            </div>
                            <h2 className="font-display font-bold text-navy text-lg">Upcoming Events</h2>
                        </div>
                        {events.length === 0 ? <p className="text-gray-400 text-sm">No upcoming events.</p> : (
                            <div className="space-y-2.5">
                                {events.map(ev => (
                                    <div key={ev.id} className="p-3 rounded-xl bg-cat-event/5 border border-cat-event/20">
                                        <p className="text-sm font-semibold text-navy leading-snug">{ev.title}</p>
                                        <p className="text-xs text-cat-event mt-0.5">{new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {ev.type}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* News */}
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-cat-news/10 p-2.5 rounded-xl">
                                <Newspaper className="h-5 w-5 text-cat-news" />
                            </div>
                            <h2 className="font-display font-bold text-navy text-lg">School News</h2>
                        </div>
                        {news.length === 0 ? <p className="text-gray-400 text-sm">No news yet.</p> : (
                            <div className="space-y-2.5">
                                {news.map(n => (
                                    <div key={n.id} className="p-3 rounded-xl bg-cat-news/5 border border-cat-news/20">
                                        <p className="text-sm font-semibold text-navy leading-snug">{n.title}</p>
                                        <p className="text-xs text-cat-news mt-0.5">{n.category} · {new Date(n.date).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>



                {/* Staff directory */}
                {allStaff.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mt-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-navy/10 p-2.5 rounded-xl">
                                <Users className="h-5 w-5 text-navy" />
                            </div>
                            <h2 className="font-display font-bold text-navy text-lg">Our Team</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {allStaff.map(s => (
                                <div key={s.id} className={`p-4 rounded-xl text-center border transition-all ${s.id === staffMember?.id ? 'bg-gold/10 border-gold/30' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy/20 to-gold/20 flex items-center justify-center mx-auto mb-2 border-2 border-white shadow-sm overflow-hidden">
                                        {(s.image_url || s.photo_url || s.image) ? (
                                            <img 
                                                src={`${s.image_url || s.photo_url || s.image}?t=${Date.now()}`} 
                                                alt={s.name} 
                                                className="w-full h-full object-cover" 
                                                onError={e => e.target.src = 'https://ui-avatars.com/api/?name='+encodeURIComponent(s.name)} 
                                            />
                                        ) : (
                                            <img src={'https://ui-avatars.com/api/?name='+encodeURIComponent(s.name)} alt={s.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <p className="text-xs font-bold text-navy truncate">{s.name}</p>
                                    <p className="text-[10px] text-gray-400 truncate">{s.role}</p>
                                    {s.id === staffMember?.id && <span className="text-[10px] text-gold font-bold">You</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                    </div>
                )}


            </div>
        </div>
    )
}

export default StaffPortal
