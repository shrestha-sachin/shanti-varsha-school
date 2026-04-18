import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Users, GraduationCap, Award, Calendar, Trophy, Medal,
  Newspaper, Bell, Star, BookOpen, UserCheck, Sparkles, MapPin, Phone,
  Clock, ChevronRight, X, Maximize2, Download
} from 'lucide-react'
import NoticeBoard from '../components/NoticeBoard'
import { supabase } from '../supabaseClient'
import { useSchoolSettings } from '../hooks/useSchoolSettings'

function useScrollReveal(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { 
          e.target.classList.add('visible'); 
          observer.unobserve(e.target) 
        }
      }),
      { threshold: 0.1 }
    )
    
    // Tiny delay to ensure DOM is updated
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        if (!el.classList.contains('visible')) observer.observe(el)
      })
    }, 100)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, deps)
}

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}</span>
}

const features = [
  { icon: BookOpen, title: 'Quality Education', desc: 'Comprehensive curriculum with modern teaching methodologies tailored to equip students with skills for the future.', color: 'from-navy-light to-navy' },
  { icon: UserCheck, title: 'Experienced Faculty', desc: 'Our dedicated and highly qualified teachers are genuinely invested in every student\'s academic and personal growth.', color: 'from-gold to-gold-dark' },
  { icon: Sparkles, title: 'Holistic Development', desc: 'Beyond academics — we nurture leadership, creativity, sportsmanship, and extracurricular excellence in every child.', color: 'from-navy to-navy-darker' },
]

function PopupAd() {
  const [popups, setPopups] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const { data } = await supabase.from('school_popups')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
        
        if (data && data.length > 0) {
          // Only show those not yet dismissed in THIS session
          const dismissedStrings = sessionStorage.getItem('dismissedPopupIds')
          const dismissedIds = dismissedStrings ? JSON.parse(dismissedStrings) : []
          const remaining = data.filter(p => !dismissedIds.includes(p.id))
          
          if (remaining.length > 0) {
            setPopups(remaining)
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
          }
        }
      } catch (err) {
        console.warn("Popups table may not exist yet")
      }
    }
    fetchPopups()
  }, [])

  const current = popups[currentIndex]

  const close = (e) => {
    if (e) e.stopPropagation()
    
    // Save dismissal to session
    if (current) {
      const dismissedStrings = sessionStorage.getItem('dismissedPopupIds')
      const dismissedIds = dismissedStrings ? JSON.parse(dismissedStrings) : []
      if (!dismissedIds.includes(current.id)) dismissedIds.push(current.id)
      sessionStorage.setItem('dismissedPopupIds', JSON.stringify(dismissedIds))
    }

    if (currentIndex < popups.length - 1) {
      // Transition to next popup
      setIsVisible(false) // Hide briefly for effect
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setIsVisible(true)
      }, 300)
    } else {
      setIsVisible(false)
    }
  }

  if (!isVisible || !current) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden animate-fade-in" onClick={close}>
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl w-[92vw] max-w-sm sm:max-w-md max-h-[85vh] animate-scale-in border border-white/10 flex flex-col mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={close} 
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40 bg-black/50 backdrop-blur-md hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all group border border-white/10"
          title="Close"
        >
          <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="relative flex-1 overflow-y-auto bg-gray-100 flex items-center justify-center min-h-[30vh]">
          {current.link_url ? (
            <Link to={current.link_url} onClick={() => close()} className="block w-full h-full cursor-pointer group">
               <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
               <img 
                 src={`${current.image_url}?t=${Date.now()}`} 
                 alt="Announcement" 
                 className="w-full h-auto object-contain max-h-[60vh] sm:max-h-[70vh] group-hover:scale-[1.02] transition-transform duration-700" 
               />
            </Link>
          ) : (
            <img 
              src={`${current.image_url}?t=${Date.now()}`} 
              alt="Announcement" 
              className="w-full h-auto object-contain max-h-[60vh] sm:max-h-[70vh]" 
            />
          )}
        </div>

        <div className="p-3 sm:p-4 bg-navy/95 border-t border-white/10 flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); window.open(current.image_url, '_blank') }}
            className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            title="View Full Screen"
          >
            <Maximize2 className="h-4 w-4" /> Full Size
          </button>
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const response = await fetch(current.image_url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `announcement-${current.id}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch (err) {
                window.open(current.image_url, '_blank');
              }
            }}
            className="w-full sm:flex-1 bg-gold hover:bg-gold-light text-navy py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold/20"
            title="Download Announcement"
          >
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </div>
    </div>
  )
}


function Home() {
  const [imgErrors, setImgErrors] = useState({})
  const [latestNews, setLatestNews] = useState([])
  const [liveToppers, setLiveToppers] = useState([])
  const [liveEvents, setLiveEvents] = useState([])
  const [liveStats, setLiveStats] = useState([
    { icon: Users, label: 'Active Learners', value: 500, suffix: '+', color: 'from-navy-light to-navy' },
    { icon: GraduationCap, label: 'Qualified Staff', value: 25, suffix: '+', color: 'from-gold to-gold-dark' },
    { icon: Calendar, label: 'Years of Service', value: 15, suffix: '+', color: 'from-navy-light to-navy' },
    { icon: Award, label: 'Academic Awards', value: 50, suffix: '+', color: 'from-gold to-gold-dark' },
  ])
  const settings = useSchoolSettings()

  useScrollReveal([latestNews, liveToppers, liveEvents])

  useEffect(() => {
    const fetchData = async () => {
      // Fetch news
      const { data: newsData, error: newsError } = await supabase.from('school_news')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false })
        .limit(3)
      if (newsError) console.error("Home news fetch error:", newsError)
      if (newsData) setLatestNews(newsData)
      
      // Fetch toppers
      let { data: toppersData, error: toppersError } = await supabase.from('school_toppers').select('*').order('display_order', { ascending: true })
      if (toppersError) {
         const fallback = await supabase.from('school_toppers').select('*').order('batch', { ascending: false })
         toppersData = fallback.data
      }
      if (toppersData) setLiveToppers(toppersData)

      // Fetch Events
      const today = new Date().toISOString().split('T')[0]
      const { data: eventsData, error: eventsError } = await supabase.from('school_events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(4)
      if (eventsError) console.error("Home events fetch error:", eventsError)
      if (eventsData) setLiveEvents(eventsData)

      // Fetch dynamic stats
      try {
        const [{ count: sCount }, { count: smcCount }] = await Promise.all([
          supabase.from('school_staff').select('*', { count: 'exact', head: true }),
          supabase.from('school_smc').select('*', { count: 'exact', head: true })
        ])

        setLiveStats(prev => {
          const established = parseInt(settings.established) || 2043;
          // Standard conversion: B.S. = A.D. + 57 years roughly
          const currentBSYear = new Date().getFullYear() + 57;
          const years = Math.max(0, currentBSYear - established);

          return [
            { ...prev[0], value: 750 }, // Updated for 750+ learners
            { ...prev[1], value: (sCount || 0) + (smcCount || 0) },
            { ...prev[2], value: years },
            { ...prev[3], value: 150 } // Updated for 150+ awards
          ]
        })
      } catch (err) {
        console.error("Home stats fetch error:", err)
      }
    }
    fetchData()
  }, [settings.established])

  const imgError = (key) => setImgErrors(p => ({ ...p, [key]: true }))

  return (
    <div>
      <PopupAd />
      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] lg:min-h-[600px] lg:h-[calc(100svh-88px)] flex flex-col lg:items-center lg:justify-center text-white lg:overflow-hidden particle-bg">
        <div
          className="absolute inset-0 bg-top sm:bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/school.webp)',
          }}
        >
          {/* Internal overlay for the zoom effect - enabled only on larger screens via CSS if needed, 
              or just keep it simple and stable for mobile */}
          <div className="absolute inset-0 bg-cover bg-center hidden lg:block animate-fade-in-zoom" style={{ backgroundImage: 'url(/images/school.webp)' }} />
        </div>
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(135deg, rgba(7,47,110,0.88) 0%, rgba(13,71,161,0.75) 55%, rgba(8,145,178,0.60) 100%)' }} />
        <div className="absolute inset-0 bg-black/10 z-[1]" />

        {/* Floating orbs */}
        <div className="absolute top-16 left-12 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-float animate-morph z-[2]" />
        <div className="absolute bottom-16 right-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-float animate-morph z-[2]" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-white/5 rounded-full blur-2xl animate-float z-[2]" style={{ animationDelay: '4s' }} />

        {/* Hero Content - Tightly packed for mobile 'First Screen' visibility */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto pt-0 sm:pt-12 pb-0 lg:py-0 -mt-16 lg:-mt-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-[9px] sm:text-sm font-medium mb-2 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-gold-light fill-gold-light" />
            Quality Education is our Destination
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-7xl lg:text-8xl mb-2 sm:mb-5 leading-tight sm:leading-none drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="block bg-gradient-to-r from-white via-gold-light to-white bg-clip-text text-transparent">Welcome to</span>
            <span className="block text-xl sm:text-3xl md:text-5xl lg:text-5xl mt-0.5 sm:mt-2 text-white/95">{settings.name}</span>
          </h1>
          <div className="w-12 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4 sm:mb-7 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }} />
          <p className="text-[12px] sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-10 font-light max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            Nurturing minds, building characters, and inspiring excellence in {settings.address}.
          </p>
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.45s', animationFillMode: 'both' }}>
            <Link to="/about" className="btn-modern group inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-white px-4 sm:px-7 py-2 sm:py-3.5 rounded-lg sm:rounded-2xl font-bold text-xs sm:text-base shadow-2xl shadow-gold/40 hover:shadow-gold/60 hover:scale-[1.04] transition-all duration-400">
              <span>About Us</span>
              <ArrowRight className="h-3 w-3 sm:h-5 sm:w-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link to="/about#contact" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-4 sm:px-7 py-2 sm:py-3.5 rounded-lg sm:rounded-2xl font-semibold text-xs sm:text-base hover:bg-white/25 transition-all duration-300">
              <Phone className="h-3 w-3 sm:h-5 sm:w-5" />
              Contact
            </Link>
          </div>
        </div>

        {/* ── STATS BAND (2x2 on mobile for readability, 1x4 on desktop) ── */}
        <div className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 overflow-hidden z-20 group border-t border-white/10 shadow-[0_-10px_40px_rgba(6,182,212,0.2)] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-darker via-gold-dark to-gold-darker" />
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
              {liveStats.map(({ icon: Icon, label, value, suffix }, i) => (
                <div key={label} className="flex items-center justify-center gap-3 px-4 py-3 sm:py-7 hover:bg-white/5 transition-all duration-500">
                  <div className="relative flex-shrink-0 w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                    <Icon className="h-4 w-4 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg sm:text-3xl md:text-4xl font-display font-extrabold text-white leading-none">
                      <AnimatedCounter target={value} />{suffix}
                    </div>
                    <div className="text-[8px] sm:text-[10px] md:text-[11px] text-white/70 font-bold uppercase tracking-wider mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SNIPPET / MISSION ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left: text */}
            <div className="reveal-left">
              <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
                <Star className="h-3.5 w-3.5 fill-gold" /> Est. 2043 B.S. · Vyas-5, Chapaghat, Damauli
              </div>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl section-heading mb-5 leading-tight">
                A School Built on Excellence
              </h2>
              <p className="text-gray-600 leading-relaxed text-base mb-5">
                We blend academic rigor with extracurricular opportunity, helping every student discover their potential
                and build a strong foundation for life.
              </p>
              <p className="text-gray-500 leading-relaxed text-sm mb-8">
                Our graduates consistently achieve top results in SLC/SEE examinations, with multiple students ranking
                among the best in the district and nationally — a testament to our dedicated faculty and nurturing environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/about" className="btn-primary group">
                  Our Story <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-navy/20 text-navy rounded-xl font-semibold text-sm hover:border-gold hover:text-gold transition-all duration-300">
                  <MapPin className="h-4 w-4" /> Visit Us
                </Link>
              </div>
            </div>

            {/* Right: highlight cards */}
            <div className="reveal-right grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:mt-0">
              {[
                { icon: GraduationCap, label: 'NEB Affiliated', desc: 'Officially affiliated with the National Examination Board of Nepal', color: 'bg-navy/5 text-navy border-navy/20' },
                { icon: Trophy, label: 'District Topper', desc: 'Multiple district and national rank holders from our school', color: 'bg-gold/10 text-gold-dark border-gold/20' },
                { icon: BookOpen, label: 'English Medium', desc: 'English-medium instruction from Grade 1 through Grade 10', color: 'bg-navy/5 text-navy border-navy/20' },
                { icon: Clock, label: `Since ${settings.established} B.S.`, desc: `Over decades of trusted education in the ${(settings.address || '').split(',').slice(-2, -1).join('').trim() || 'local'} community`, color: 'bg-gold/10 text-gold-dark border-gold/20' },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div key={label} className={`p-4 sm:p-5 rounded-2xl border ${color} card-hover`}>
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 mb-2 sm:mb-3 opacity-80" />
                  <p className="font-display font-bold text-sm mb-1">{label}</p>
                  <p className="text-[11px] sm:text-xs opacity-70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl section-heading mb-2">Why Choose Us?</h2>
            <div className="section-divider" />
            <p className="text-gray-500 text-base max-w-xl mx-auto mt-5">We are committed to excellence in education and the complete, holistic development of every student</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={f.title} className="group bg-white p-8 rounded-2xl shadow-card border border-gray-100 hover:border-gold/30 text-center card-hover reveal-scale relative overflow-hidden" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${f.color} mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-400`}>
                  <f.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-display font-bold text-navy text-xl mb-3 group-hover:text-gold transition-colors">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOPPERS ── */}
      {liveToppers.length > 0 && (
        <section className="bg-white pt-20 pb-4 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 reveal">
              <div className="flex items-center justify-center gap-4 mb-3">
                <Trophy className="h-10 w-10 text-gold animate-float" />
                <h2 className="font-display font-extrabold text-4xl md:text-5xl section-heading">Our Academic Excellence</h2>
                <Trophy className="h-10 w-10 text-gold animate-float" style={{ animationDelay: '1.5s' }} />
              </div>
              <div className="section-divider" />
              <p className="text-gray-500 text-base max-w-2xl mx-auto mt-5 leading-relaxed">
                Celebrating our outstanding students who achieved remarkable results in NEB / SEE examinations
              </p>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${liveToppers.length === 1 ? 'lg:grid-cols-1 max-w-sm mx-auto' :
                liveToppers.length === 2 ? 'lg:grid-cols-2 max-w-3xl mx-auto' :
                  liveToppers.length === 3 ? 'lg:grid-cols-3 max-w-5xl mx-auto' :
                    'lg:grid-cols-4'
              } gap-6`}>
              {liveToppers.map((t, idx) => (
                <div
                  key={t.name}
                  className="group bg-white rounded-2xl shadow-card border border-gray-100 p-6 text-center glow-border card-hover relative overflow-hidden reveal-scale"
                  style={{ transitionDelay: t.delay || `${idx * 0.1}s` }}
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-dark text-white px-3 py-1 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-md group-hover:scale-105 transition-transform z-10">
                    {t.badge}
                  </div>
                  <div className="mb-5">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold/30 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/30 group-hover:border-gold/60 shadow-xl transition-all duration-500 group-hover:shadow-gold/30">
                      {(t.photo_url || t.image_url || t.image || t.img) ? (
                        <img
                          src={`${t.photo_url || t.image_url || t.image || t.img}?t=${Date.now()}`}
                          alt={t.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white">
                          <GraduationCap className="h-16 w-16 opacity-70" />
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-navy text-lg mb-1 group-hover:text-gold transition-colors">{t.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 font-medium">Batch {t.batch}</p>
                  <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold/15 to-gold/5 px-4 py-2 rounded-full mb-3">
                    <Medal className="h-4 w-4 text-gold animate-pulse-slow" />
                    <span className="text-gold font-bold">{t.score}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS ── */}
      <section className="bg-white pt-10 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-8 reveal">
            <div className="bg-gradient-to-br from-navy/10 to-navy/5 p-2.5 rounded-xl">
              <Calendar className="h-6 w-6 text-navy" />
            </div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-navy">Upcoming Events</h2>
          </div>

          {liveEvents.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-3xl border border-gray-100 shadow-inner reveal">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                <Calendar className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm max-w-sm mx-auto italic">Our calendar is currently clear. Please stay tuned for upcoming events and announcements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {liveEvents.map((evt, i) => (
                <div 
                  key={evt.id} 
                  className="group bg-slate-50 rounded-3xl border border-gray-100 p-5 hover:border-gold/30 hover:shadow-xl transition-all duration-300 reveal flex flex-col"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col items-center justify-center flex-shrink-0 text-navy group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-colors">
                      <span className="text-[10px] uppercase font-bold tracking-widest">{new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-black leading-none">{new Date(evt.date).getDate()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-gray-100">{evt.type || 'Event'}</span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-navy text-lg line-clamp-2 mb-2 group-hover:text-gold transition-colors">{evt.title}</h3>
                  {evt.description && <p className="text-xs text-gray-500 line-clamp-2 mt-auto leading-relaxed">{evt.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LATEST NEWS ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 reveal">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-2.5 rounded-xl">
                  <Newspaper className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl section-heading">Latest News</h2>
              </div>
              <div className="section-divider ml-0" style={{ margin: '0' }} />
            </div>
            {latestNews.length > 0 && (
              <Link to="/news" className="hidden sm:flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all duration-300">
                All News <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {latestNews.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm reveal">
              <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Newspaper className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-1">Stay Tuned!</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">We are currently gathering the latest updates and announcements. Check back soon for exciting news.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((n, i) => (
                <Link
                  to={`/news/${n.id}`}
                  key={n.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gold/30 shadow-sm hover:shadow-xl transition-all duration-500 block reveal"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="h-44 overflow-hidden relative">
                    {(n.image_url || n.photo_url || n.image) ? (
                      <img src={`${n.image_url || n.photo_url || n.image}?t=${Date.now()}`} alt={n.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy/10 to-gold/10 flex items-center justify-center">
                        <Newspaper className="h-12 w-12 text-navy/20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-navy text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">{n.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-navy text-base mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">{n.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                      {n.content?.replace(/<[^>]*>?/gm, '')}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-3 border-t border-gray-50">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NOTICE BOARD ── */}
      <section className="bg-white pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <NoticeBoard limit={3} />
            <div className="mt-8 text-center">
              <Link to="/notices" className="group inline-flex items-center gap-2 text-navy font-bold hover:text-gold transition-colors duration-300 bg-white px-6 py-3 rounded-full shadow-card hover:shadow-card-hover border border-gray-100 hover:border-gold/30">
                View All Notices
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
