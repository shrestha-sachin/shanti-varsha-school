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
        const { data: sData } = await supabase.from('class_students').select('*').order('id')
        if (sData) setStudents(sData.map(s => ({ id: s.id, name: s.name, rollNo: s.roll_no, dob: s.dob, address: s.address, parentContact: s.parent_contact })))
        
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
                        <button onClick={() => setActiveTab('myClass')} className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'myClass' ? 'bg-white text-navy border-gold' : 'bg-white/5 text-white/60 border-transparent hover:bg-white/10'}`}>
                            <GraduationCap className="w-4 h-4" /> Class Ops
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

                {/* Teacher Admin Panel for Results */}
                <div className="bg-white rounded-2xl shadow-card border border-gold/30 p-6 mt-6 animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-2.5 rounded-xl border border-gold/20">
                                <Award className="h-5 w-5 text-gold" />
                            </div>
                            <div>
                                <h2 className="font-display font-bold text-navy text-lg">Results Publisher Module</h2>
                                <p className="text-xs text-gray-500">Manage internal grades and publish to student portals</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-gray-100 rounded-xl p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm text-navy">Enter Student Data - Mid-Term Results</h3>
                            <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded">Draft Mode</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <div className="col-span-1 border-r border-gray-200 pr-4">
                                <label className="label-modern text-xs">Student ID</label>
                                <input className="input-modern py-2 text-sm" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. SVS-123" />
                            </div>
                            <div className="col-span-1">
                                <label className="label-modern text-xs">Mathematics /100</label>
                                <input type="number" className="input-modern py-2 text-sm" value={marks.math} onChange={e => setMarks({...marks, math: e.target.value})} placeholder="e.g. 92" />
                            </div>
                            <div className="col-span-1">
                                <label className="label-modern text-xs">Science /100</label>
                                <input type="number" className="input-modern py-2 text-sm" value={marks.science} onChange={e => setMarks({...marks, science: e.target.value})} placeholder="e.g. 88" />
                            </div>
                            <div className="col-span-1">
                                <label className="label-modern text-xs">English /100</label>
                                <input type="number" className="input-modern py-2 text-sm" value={marks.english} onChange={e => setMarks({...marks, english: e.target.value})} placeholder="e.g. 85" />
                            </div>
                            <div className="col-span-1">
                                <label className="label-modern text-xs">Nepali /100</label>
                                <input type="number" className="input-modern py-2 text-sm" value={marks.nepali} onChange={e => setMarks({...marks, nepali: e.target.value})} placeholder="e.g. 90" />
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => {
                                setPublishStatus('Publishing...')
                                setTimeout(() => {
                                    // Simulated calculation logic
                                    const m = parseInt(marks.math) || 92;
                                    const s = parseInt(marks.science) || 88;
                                    const e = parseInt(marks.english) || 85;
                                    const n = parseInt(marks.nepali) || 90;

                                    const getGrade = (val) => val >= 90 ? 'A+' : val >= 80 ? 'A' : val >= 70 ? 'B+' : val >= 60 ? 'B' : val >= 50 ? 'C+' : val >= 40 ? 'C' : 'D';

                                    const mockResults = [
                                        { subject: 'Mathematics', marks: `${m}/100`, grade: getGrade(m) },
                                        { subject: 'Science', marks: `${s}/100`, grade: getGrade(s) },
                                        { subject: 'English', marks: `${e}/100`, grade: getGrade(e) },
                                        { subject: 'Nepali', marks: `${n}/100`, grade: getGrade(n) }
                                    ]

                                    // Assign results directly to specific student ID in Supabase
                                    const pushGrade = async () => {
                                        const currentAttendance = grades[studentId]?.attendance || null
                                        await supabase.from('student_grades').upsert({
                                            student_id: studentId,
                                            term: 'Mid-Term',
                                            results: mockResults,
                                            teacher: staffMember?.name || 'Assigned Teacher',
                                            attendance: currentAttendance
                                        }, { onConflict: 'student_id' })
                                        fetchDB()

                                        // Backwards compatibility for the Admin Tab which looks for 'publishedResults' global existence flag
                                        localStorage.setItem('publishedResults', JSON.stringify({term: 'Mid-Term', teacher: staffMember?.name || 'Assigned Teacher'}))
                                        window.dispatchEvent(new Event('publishedResultsUpdated'))
                                    }
                                    pushGrade()

                                    setPublishStatus('Published Successfully!')
                                    setTimeout(() => {
                                        setPublishStatus('')
                                        setMarks({ math: '', science: '', english: '', nepali: '' })
                                    }, 2000)
                                }, 800)
                            }}
                            disabled={publishStatus === 'Publishing...'}
                            className="w-full sm:w-auto px-6 py-2.5 bg-navy hover:bg-navy-light text-white rounded-xl text-sm font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            {publishStatus || 'Publish Grades to Portal'}
                        </button>
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
                                        {s.photoUrl ? <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} /> : <Users className="h-5 w-5 text-navy/50" />}
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

                {activeTab === 'myClass' && (
                    <div className="animate-fade-in-up">
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl border border-gold/20">
                                        <GraduationCap className="h-6 w-6 text-gold" />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold text-navy text-xl">Class 10 Student Database</h2>
                                        <p className="text-xs text-gray-500 font-medium">Manage student details and academic status</p>
                                    </div>
                                </div>
                                <span className="bg-navy-light/10 text-navy font-bold px-4 py-2 rounded-xl text-sm border border-navy/10">{students.length} Enrolled</span>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-5 py-3.5 font-semibold text-gray-700">Roll No</th>
                                            <th className="px-5 py-3.5 font-semibold text-gray-700">Student Info</th>
                                            <th className="px-5 py-3.5 font-semibold text-gray-700">Contact</th>
                                            <th className="px-5 py-3.5 font-semibold text-gray-700 text-center">Today's Attendance</th>
                                            <th className="px-5 py-3.5 font-semibold text-gray-700 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {students.map((student) => {
                                            const isEditing = editingStudent?.id === student.id;
                                            return (
                                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-4 font-bold text-navy text-base">{isEditing ? <input className="input-modern py-1 w-16 text-center" value={editingStudent.rollNo} onChange={e => setEditingStudent({...editingStudent, rollNo: e.target.value})} /> : student.rollNo}</td>
                                                    <td className="px-5 py-4">
                                                        {isEditing ? (
                                                            <div className="space-y-2">
                                                                <input className="input-modern py-1 w-full" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} placeholder="Full Name" />
                                                                <input className="input-modern py-1 w-full text-xs" value={editingStudent.id} disabled />
                                                                <input className="input-modern py-1 w-full text-xs" value={editingStudent.dob} onChange={e => setEditingStudent({...editingStudent, dob: e.target.value})} placeholder="DOB" />
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p className="font-bold text-navy">{student.name}</p>
                                                                <p className="text-xs font-medium text-gray-400 font-mono mt-0.5">{student.id}</p>
                                                                <p className="text-xs mt-1 text-gray-500">DOB: {student.dob}</p>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {isEditing ? (
                                                            <div className="space-y-2">
                                                                <input className="input-modern py-1 w-full text-xs" value={editingStudent.parentContact} onChange={e => setEditingStudent({...editingStudent, parentContact: e.target.value})} placeholder="Parent Phone" />
                                                                <input className="input-modern py-1 w-full text-xs" value={editingStudent.address} onChange={e => setEditingStudent({...editingStudent, address: e.target.value})} placeholder="Address" />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-1">
                                                                <p className="flex items-center gap-1.5 text-xs text-gray-600"><Phone className="w-3.5 h-3.5 text-gray-400" /> {student.parentContact}</p>
                                                                <p className="flex items-center gap-1.5 text-xs text-gray-600"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {student.address}</p>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        {isEditing ? (
                                                            <span className="text-xs text-gray-400">Save to mark</span>
                                                        ) : (
                                                            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                                                                <button 
                                                                    onClick={async () => {
                                                                        const existing = grades[student.id] || {}
                                                                        await supabase.from('student_grades').upsert({
                                                                            student_id: student.id,
                                                                            term: existing.term || 'N/A',
                                                                            results: existing.results || [],
                                                                            teacher: existing.teacher || staffMember?.name,
                                                                            attendance: 'Present'
                                                                        }, { onConflict: 'student_id' })
                                                                        fetchDB()
                                                                    }}
                                                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                                                                        (grades[student.id]?.attendance === 'Present') 
                                                                        ? 'bg-green-500 text-white shadow-sm' 
                                                                        : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                                                                    }`}
                                                                >
                                                                    Present
                                                                </button>
                                                                <button 
                                                                    onClick={async () => {
                                                                        const existing = grades[student.id] || {}
                                                                        await supabase.from('student_grades').upsert({
                                                                            student_id: student.id,
                                                                            term: existing.term || 'N/A',
                                                                            results: existing.results || [],
                                                                            teacher: existing.teacher || staffMember?.name,
                                                                            attendance: 'Absent'
                                                                        }, { onConflict: 'student_id' })
                                                                        fetchDB()
                                                                    }}
                                                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                                                                        (grades[student.id]?.attendance === 'Absent') 
                                                                        ? 'bg-red-500 text-white shadow-sm' 
                                                                        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                                                    }`}
                                                                >
                                                                    Absent
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {isEditing ? (
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => setEditingStudent(null)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors">Cancel</button>
                                                                <button onClick={async () => {
                                                                    await supabase.from('class_students').update({
                                                                        roll_no: editingStudent.rollNo,
                                                                        name: editingStudent.name,
                                                                        dob: editingStudent.dob,
                                                                        parent_contact: editingStudent.parentContact,
                                                                        address: editingStudent.address
                                                                    }).eq('id', editingStudent.id)
                                                                    fetchDB()
                                                                    setEditingStudent(null)
                                                                }} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"><Save className="w-3.5 h-3.5"/> Save</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setEditingStudent(student)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold-dark rounded-lg text-xs font-bold transition-colors border border-gold/20">
                                                                <Edit className="w-3.5 h-3.5" /> Edit Profile
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StaffPortal
