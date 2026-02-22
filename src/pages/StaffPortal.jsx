import { useState, useEffect } from 'react'
import { Users, LogIn, LogOut, Bell, Calendar, Newspaper, User, Lock, BookOpen, Award } from 'lucide-react'

function StaffPortal() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [staffMember, setStaffMember] = useState(null)
    const [nameInput, setNameInput] = useState('')
    const [pinInput, setPinInput] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const saved = sessionStorage.getItem('staffPortalUser')
        if (saved) { setStaffMember(JSON.parse(saved)); setLoggedIn(true) }
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setTimeout(() => {
            const staff = JSON.parse(localStorage.getItem('schoolStaff') || '[]')
            const found = staff.find(s =>
                s.name.trim().toLowerCase() === nameInput.trim().toLowerCase() &&
                s.pin && s.pin === pinInput.trim()
            )
            if (found) {
                setStaffMember(found)
                setLoggedIn(true)
                sessionStorage.setItem('staffPortalUser', JSON.stringify(found))
            } else {
                setError('Invalid name or PIN. Please contact the administrator.')
            }
            setLoading(false)
        }, 800)
    }

    const handleLogout = () => {
        setLoggedIn(false)
        setStaffMember(null)
        sessionStorage.removeItem('staffPortalUser')
        setNameInput('')
        setPinInput('')
        setError('')
    }

    // Dashboard data
    const notices = JSON.parse(localStorage.getItem('schoolNotices') || '[]').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    const events = JSON.parse(localStorage.getItem('schoolCalendarEvents') || '[]').filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
    const news = JSON.parse(localStorage.getItem('schoolNews') || '[]').filter(n => n.published !== false).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
    const allStaff = JSON.parse(localStorage.getItem('schoolStaff') || '[]')

    if (!loggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20 animate-fade-in">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-navy-darker to-navy p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gold rounded-full blur-3xl" />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <Users className="h-10 w-10 text-white" />
                                </div>
                                <h1 className="font-display font-bold text-2xl mb-1">Staff Portal</h1>
                                <p className="text-gold-light text-sm">Shanti Varsha Angreji Ma. Vi.</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            <p className="text-gray-500 text-sm mb-6 text-center">Enter your registered name and PIN to access the portal.</p>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="label-modern">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            className="input-modern pl-10"
                                            placeholder="Enter your registered name"
                                            value={nameInput}
                                            onChange={e => setNameInput(e.target.value)}
                                            required
                                            autoComplete="name"
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
                                            placeholder="Enter your PIN"
                                            value={pinInput}
                                            onChange={e => setPinInput(e.target.value)}
                                            required
                                            maxLength={6}
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className="bg-danger-light border border-danger/30 text-red-700 text-sm px-4 py-3 rounded-xl animate-fade-in">
                                        {error}
                                    </div>
                                )}
                                <button type="submit" disabled={loading} className="btn-gold w-full mt-2 py-3 text-base">
                                    {loading ? (
                                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in...</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><LogIn className="h-5 w-5" />Sign In</span>
                                    )}
                                </button>
                            </form>
                            <p className="text-gray-400 text-xs text-center mt-5">
                                Don't have access? Contact the school administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in">
            {/* Banner */}
            <section className="page-hero py-14 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 animate-fade-in-up">
                        <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm flex-shrink-0">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-2xl md:text-3xl">Welcome, {staffMember?.name}!</h1>
                            <p className="text-gold-light text-sm mt-0.5">{staffMember?.role}{staffMember?.subject ? ` · ${staffMember.subject}` : ''}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
                        <LogOut className="h-4 w-4" /> Logout
                    </button>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
                            <div className="bg-emerald-100 p-2.5 rounded-xl">
                                <Calendar className="h-5 w-5 text-emerald-600" />
                            </div>
                            <h2 className="font-display font-bold text-navy text-lg">Upcoming Events</h2>
                        </div>
                        {events.length === 0 ? <p className="text-gray-400 text-sm">No upcoming events.</p> : (
                            <div className="space-y-2.5">
                                {events.map(ev => (
                                    <div key={ev.id} className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                        <p className="text-sm font-semibold text-navy leading-snug">{ev.title}</p>
                                        <p className="text-xs text-emerald-600 mt-0.5">{new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {ev.type}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* News */}
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-purple-100 p-2.5 rounded-xl">
                                <Newspaper className="h-5 w-5 text-purple-600" />
                            </div>
                            <h2 className="font-display font-bold text-navy text-lg">School News</h2>
                        </div>
                        {news.length === 0 ? <p className="text-gray-400 text-sm">No news yet.</p> : (
                            <div className="space-y-2.5">
                                {news.map(n => (
                                    <div key={n.id} className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                                        <p className="text-sm font-semibold text-navy leading-snug">{n.title}</p>
                                        <p className="text-xs text-purple-500 mt-0.5">{n.category} · {new Date(n.date).toLocaleDateString()}</p>
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
                            <div className="bg-sky-100 p-2.5 rounded-xl">
                                <Users className="h-5 w-5 text-sky-600" />
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
        </div>
    )
}

export default StaffPortal
