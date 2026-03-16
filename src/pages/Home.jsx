import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Users, GraduationCap, Award, Calendar, Trophy, Medal,
  Newspaper, Bell, Star, BookOpen, UserCheck, Sparkles, MapPin, Phone,
  Clock, ChevronRight
} from 'lucide-react'
import NoticeBoard from '../components/NoticeBoard'
import { supabase } from '../supabaseClient'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
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

const toppers = [
  { name: 'Ms. Sanjana Wagle', batch: '2069', score: '93.37%', badge: '4th Nationwide', img: '/images/toppers/sanjana-wagle.jpg', note: 'Secured 4th position nationwide & topped Tanahun district', delay: '0.1s' },
  { name: 'Sneha Giri', batch: '2071', score: '4.0 GPA', badge: '4.0 GPA', img: '/images/toppers/sneha-giri.jpg', note: 'Achieved perfect 4.0 GPA in SEE examination', delay: '0.2s' },
  { name: 'Sachin Shrestha', batch: '2078', score: '4.0 GPA', badge: '4.0 GPA', img: '/images/toppers/sachin-shrestha.png', note: 'Outstanding performance with perfect 4.0 GPA in SEE', delay: '0.3s' },
  { name: 'Kripa Shahi', batch: '2078', score: '4.0 GPA', badge: '4.0 GPA', img: '/images/toppers/kripa-shahi.png', note: 'Exemplary achievement with perfect 4.0 GPA in SEE', delay: '0.4s' },
]

const stats = [
  { icon: Users, label: 'Active Students', value: 500, suffix: '+', color: 'from-navy-light to-navy' },
  { icon: GraduationCap, label: 'Qualified Teachers', value: 25, suffix: '+', color: 'from-gold to-gold-dark' },
  { icon: Calendar, label: 'Years of Excellence', value: 15, suffix: '+', color: 'from-navy-light to-navy' },
  { icon: Award, label: 'Awards & Achievements', value: 50, suffix: '+', color: 'from-gold to-gold-dark' },
]

const features = [
  { icon: BookOpen, title: 'Quality Education', desc: 'Comprehensive curriculum with modern teaching methodologies tailored to equip students with skills for the future.', color: 'from-navy-light to-navy' },
  { icon: UserCheck, title: 'Experienced Faculty', desc: 'Our dedicated and highly qualified teachers are genuinely invested in every student\'s academic and personal growth.', color: 'from-gold to-gold-dark' },
  { icon: Sparkles, title: 'Holistic Development', desc: 'Beyond academics — we nurture leadership, creativity, sportsmanship, and extracurricular excellence in every child.', color: 'from-navy to-navy-darker' },
]

function Home() {
  const [imgErrors, setImgErrors] = useState({})
  const [latestNews, setLatestNews] = useState([])

  useScrollReveal()

  useEffect(() => {
    const fetchLatestNews = async () => {
      const { data } = await supabase.from('school_news')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false })
        .limit(3)
      if (data) setLatestNews(data)
    }
    fetchLatestNews()
  }, [])

  const imgError = (key) => setImgErrors(p => ({ ...p, [key]: true }))

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-[680px] md:min-h-[760px] flex items-center justify-center text-white overflow-hidden particle-bg">
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat animate-fade-in-zoom"
          style={{ backgroundImage: 'url(/images/school.webp)', backgroundSize: '120%', backgroundPosition: 'center', transition: 'background-size 12s ease-in-out' }}
        />
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(135deg, rgba(7,47,110,0.88) 0%, rgba(13,71,161,0.75) 55%, rgba(8,145,178,0.60) 100%)' }} />
        <div className="absolute inset-0 bg-black/10 z-[1]" />

        {/* Floating orbs */}
        <div className="absolute top-16 left-12 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-float animate-morph z-[2]" />
        <div className="absolute bottom-16 right-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-float animate-morph z-[2]" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-white/5 rounded-full blur-2xl animate-float z-[2]" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-medium mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <Star className="h-4 w-4 text-gold-light fill-gold-light" />
            Quality Education is our Destination
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl mb-5 leading-none drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="block bg-gradient-to-r from-white via-gold-light to-white bg-clip-text text-transparent">Welcome to</span>
            <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 text-white/95">Shanti Varsha Angreji Ma. Vi.</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-7 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }} />
          <p className="text-lg md:text-xl text-gray-100 mb-10 font-light max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            Nurturing minds, building characters, and inspiring excellence in the heart of Damauli, Tanahun since 2043 B.S.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.45s', animationFillMode: 'both' }}>
            <Link to="/about" className="btn-modern group inline-flex items-center gap-3 bg-gradient-to-r from-gold to-gold-light text-white px-7 py-3.5 rounded-2xl font-bold text-base shadow-2xl shadow-gold/40 hover:shadow-gold/60 hover:scale-[1.04] transition-all duration-400">
              <span className="relative z-10">Discover Our School</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform relative z-10" />
            </Link>
            <Link to="/about#contact" className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-2xl font-semibold text-base hover:bg-white/25 transition-all duration-300">
              <Phone className="h-5 w-5" />
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-gold rounded-full mt-2 animate-pulse-slow" />
          </div>
        </div>
      </section>

      {/* ── STATS BAND (directly below hero, no gap) ── */}
      <section className="bg-gradient-hero py-4 md:py-0 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:divide-x divide-white/10">
            {stats.map(({ icon: Icon, label, value, suffix }, i) => (
              <div key={label} className={`flex items-center gap-4 px-6 py-6 sm:py-7 hover:bg-white/10 transition-all duration-300 group ${i > 1 ? 'hidden sm:flex' : 'flex'} lg:flex`}>
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300 border border-white/10">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-none drop-shadow-sm">
                    <AnimatedCounter target={value} />{suffix}
                  </div>
                  <div className="text-white/70 text-[10px] sm:text-xs mt-1 font-bold uppercase tracking-wider">{label}</div>
                </div>
              </div>
            ))}
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
                Shanti Varsha Angreji Ma. Vi. has been at the heart of quality education in Tanahun for over fifteen years.
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
            <div className="reveal-right grid grid-cols-2 gap-4">
              {[
                { icon: GraduationCap, label: 'NEB Affiliated', desc: 'Officially affiliated with the National Examination Board of Nepal', color: 'bg-navy/5 text-navy border-navy/20' },
                { icon: Trophy, label: 'District Topper', desc: 'Multiple district and national rank holders from our school', color: 'bg-gold/10 text-gold-dark border-gold/20' },
                { icon: BookOpen, label: 'English Medium', desc: 'English-medium instruction from Grade 1 through Grade 10', color: 'bg-navy/5 text-navy border-navy/20' },
                { icon: Clock, label: 'Since 2043 B.S.', desc: 'Over three decades of trusted education in the Tanahun community', color: 'bg-gold/10 text-gold-dark border-gold/20' },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div key={label} className={`p-5 rounded-2xl border ${color} card-hover`}>
                  <Icon className="h-7 w-7 mb-3 opacity-80" />
                  <p className="font-display font-bold text-sm mb-1">{label}</p>
                  <p className="text-xs opacity-70 leading-relaxed">{desc}</p>
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
      <section className={`bg-white pt-20 ${latestNews.length > 0 ? 'pb-10' : 'pb-4'} overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toppers.map((t) => (
              <div
                key={t.name}
                className="group bg-white rounded-2xl shadow-card border border-gray-100 p-6 text-center glow-border card-hover relative overflow-hidden reveal-scale"
                style={{ transitionDelay: t.delay }}
              >
                <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-dark text-white px-3 py-1 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-md group-hover:scale-105 transition-transform z-10">
                  {t.badge}
                </div>
                <div className="mb-5">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold/30 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/30 group-hover:border-gold/60 shadow-xl transition-all duration-500 group-hover:shadow-gold/30">
                    {!imgErrors[t.name] ? (
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={() => imgError(t.name)} />
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

      {/* ── LATEST NEWS ── */}
      {latestNews.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white pt-16 pb-10">
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
              <Link to="/news" className="hidden sm:flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all duration-300">
                All News <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((n, i) => (
                <Link 
                  to={`/news/${n.id}`} 
                  key={n.id} 
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gold/30 card-hover block reveal" 
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <span className="badge badge-news text-[11px] mb-3 inline-block">{n.category}</span>
                  <h3 className="font-display font-bold text-navy text-base mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">{n.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{n.content}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
