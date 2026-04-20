import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, LogIn, LogOut, Bell, Calendar, Newspaper, User, Lock, BookOpen, Award, LayoutDashboard, GraduationCap, Edit, Save, CheckCircle, MapPin, Phone, ExternalLink, Library, FileText, ChevronRight, Globe } from 'lucide-react'
import { supabase } from '../supabaseClient'

function StaffPortal() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('dashboard')
    const [activeGrade, setActiveGrade] = useState('Grade 10')
    const [activeSubject, setActiveSubject] = useState('All')
    const [loggedIn, setLoggedIn] = useState(false)
    const [staffMember, setStaffMember] = useState(null)
    const [idInput, setIdInput] = useState('')
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
    const [allCurriculum, setAllCurriculum] = useState([])

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

        try {
            const { data: cData, error } = await supabase.from('school_curriculum').select('*')
            if (!error && cData) setAllCurriculum(cData)
        } catch (e) {
            setAllCurriculum([])
        }
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
        
        const { data, error: fbError } = await supabase.from('school_staff').select('*').eq('id', idInput.trim()).eq('pin', pinInput.trim()).maybeSingle()
        
        if (data) {
            setStaffMember(data)
            setLoggedIn(true)
            sessionStorage.setItem('staffPortalUser', JSON.stringify(data))
            
            // Set global auth for Navbar and Watchdog
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('userRole', 'teacher')
            localStorage.setItem('username', data.name)
            localStorage.setItem('loginTimestamp', Date.now().toString())
            window.dispatchEvent(new Event('storage'))
        } else {
            setError('Invalid Staff ID or PIN. Please check your credentials.')
        }
        setLoading(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('username')
        localStorage.removeItem('userRole')
        localStorage.removeItem('loginTimestamp')
        window.dispatchEvent(new Event('storage')) // Force Navbar state sync globally
        setLoggedIn(false)
        setStaffMember(null)
        sessionStorage.removeItem('staffPortalUser')
        setIdInput('')
        setPinInput('')
        setError('')
        navigate('/')
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
                            <p className="text-gray-500 text-xs sm:text-sm mb-6 text-center">Enter your Staff ID and PIN to access the portal.</p>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="label-modern">Staff ID</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            className="input-modern pl-10"
                                            placeholder="e.g. TEA001"
                                            value={idInput}
                                            onChange={e => setIdInput(e.target.value)}
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
                        <button onClick={() => setActiveTab('curriculum')} className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'curriculum' ? 'bg-white text-navy border-gold' : 'bg-white/5 text-white/60 border-transparent hover:bg-white/10'}`}>
                            <Library className="w-4 h-4" /> Curriculum & Files
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

                {/* Educational Resources Section */}
                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-br from-navy to-navy-light p-2 rounded-xl">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="font-display font-bold text-navy text-xl">Educational Resources</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { 
                                name: 'NEB', 
                                full: 'National Examination Board',
                                desc: 'Grade 10 (SEE) & 12 board schedules, results & guidelines.', 
                                url: 'https://neb.gov.np', 
                                accent: 'bg-blue-500'
                            },
                            { 
                                name: 'CDC', 
                                full: 'Curriculum Development Centre',
                                desc: 'National curriculum frameworks, textbooks & official guides.', 
                                url: 'https://moecdc.gov.np', 
                                accent: 'bg-emerald-500'
                            },
                            { 
                                name: 'MOEST', 
                                full: 'Ministry of Education, Science and Tech.',
                                desc: 'Policy planning, scholarships & educational governance.', 
                                url: 'https://moest.gov.np', 
                                accent: 'bg-purple-500'
                            },
                            { 
                                name: 'TSC', 
                                full: 'Teacher Service Commission',
                                desc: 'Licensing, permanent appointments & career promotions.', 
                                url: 'https://tsc.gov.np', 
                                accent: 'bg-rose-500'
                            }
                        ].map(resource => (
                            <a 
                                key={resource.name} 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-gold/50 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className={`px-2 py-1 ${resource.accent} text-white text-[9px] font-black rounded-lg tracking-wider`}>
                                        {resource.name}
                                    </span>
                                    <ExternalLink className="h-4 w-4 text-slate-200 group-hover:text-gold transition-colors" />
                                </div>
                                
                                <h4 className="text-navy font-bold text-base leading-tight mb-2 group-hover:text-gold transition-colors">
                                    {resource.full}
                                </h4>
                                
                                <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-grow">
                                    {resource.desc}
                                </p>

                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-navy transition-colors">
                                    Check Portal <ChevronRight className="h-3 w-3" />
                                </div>
                            </a>
                        ))}
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

                {activeTab === 'curriculum' && (
                    <div className="animate-fade-in flex flex-col lg:flex-row gap-8">
                        {/* Grade Sidebar */}
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-4 sticky top-8">
                                <h3 className="font-display font-bold text-navy px-4 mb-4 text-sm uppercase tracking-widest opacity-50">Select Grade</h3>
                                <div className="space-y-1">
                                    {['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map(grade => (
                                        <button
                                            key={grade}
                                            onClick={() => setActiveGrade(grade)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeGrade === grade 
                                                ? 'bg-gold/10 text-gold-dark border-r-4 border-gold' 
                                                : 'text-navy/60 hover:bg-gray-50 hover:text-navy'}`}
                                        >
                                            {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Resource Content */}
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-display font-bold text-navy text-2xl">Resources for {activeGrade}</h2>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Academic Repository</p>
                                </div>
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {['All', 'Nepali', 'English', 'Mathematics', 'Science', 'Social', 'Moral', 'Computer', 'Creative'].map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => setActiveSubject(sub)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubject === sub 
                                                ? 'bg-navy text-white shadow-lg' 
                                                : 'bg-white text-gray-400 border border-gray-100 hover:border-gold/30 hover:text-navy'}`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(() => {
                                    const filtered = allCurriculum.filter(c => c.grade === activeGrade && (activeSubject === 'All' || c.subject === activeSubject))
                                    
                                    if (filtered.length > 0) {
                                        return filtered.map((item, idx) => {
                                            const IconComponent = item.type === 'Archive' ? FileText : item.type === 'PDF Guide' ? GraduationCap : BookOpen;
                                            return (
                                                <div key={idx} className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-gold/30 hover:shadow-xl transition-all duration-300">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="bg-navy/5 p-3 rounded-2xl group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                                                            <IconComponent className="h-6 w-6" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg uppercase">{item.type}</span>
                                                    </div>
                                                    <h4 className="font-display font-bold text-navy text-lg mb-2">{item.title}</h4>
                                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.grade} · {item.subject}</p>
                                                    <a 
                                                        href={item.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 group-hover:bg-gold group-hover:text-white rounded-xl text-xs font-bold transition-all"
                                                    >
                                                        Access Resource
                                                        <ChevronRight className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            );
                                        })
                                    }

                                    return [
                                        { title: 'Official Curriculum', desc: 'Ministry approved curriculum and standards', icon: BookOpen, type: 'Document' },
                                        { title: 'Lesson Syllabus', desc: 'Grade specific learning objectives and timeline', icon: FileText, type: 'Archive' },
                                        { title: 'Teaching Manual', desc: 'Recommended teaching methodologies and guides', icon: GraduationCap, type: 'PDF Guide' },
                                        { title: 'Reference Material', desc: 'Additional research and lesson materials', icon: Library, type: 'Resources' }
                                    ].map((item, idx) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <div key={idx} className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-gold/30 hover:shadow-xl transition-all duration-300">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="bg-navy/5 p-3 rounded-2xl group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                                                        <IconComponent className="h-6 w-6" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg uppercase">{item.type}</span>
                                                </div>
                                                <h4 className="font-display font-bold text-navy text-lg mb-2">{item.title}</h4>
                                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                                                <a 
                                                    href={`https://moecdc.gov.np/en/curriculum?grade=${activeGrade.replace(/\s+/g, '')}&subject=${activeSubject === 'All' ? '' : activeSubject}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 group-hover:bg-gold group-hover:text-white rounded-xl text-xs font-bold transition-all"
                                                >
                                                    Search {activeSubject !== 'All' ? `${activeSubject} ` : ''}{item.title}
                                                    <ChevronRight className="h-4 w-4" />
                                                </a>
                                            </div>
                                        );
                                    })
                                })()}
                            </div>

                            <div className="bg-gold/5 border-2 border-dashed border-gold/20 rounded-3xl p-8 text-center">
                                <FileText className="h-10 w-10 text-gold/40 mx-auto mb-4" />
                                <h3 className="text-navy font-bold mb-2">Classroom Materials Repository</h3>
                                <p className="text-gray-500 text-sm max-w-md mx-auto">Upload and manage school-specific files, question papers, and results internally via the Admin portal.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StaffPortal
