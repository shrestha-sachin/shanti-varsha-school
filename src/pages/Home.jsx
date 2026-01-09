import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, GraduationCap, Award, Calendar } from 'lucide-react'
import NoticeBoard from '../components/NoticeBoard'

function Home() {
  const [counters, setCounters] = useState({
    students: 0,
    teachers: 0,
    years: 0,
    awards: 0,
  })

  const stats = {
    students: 500,
    teachers: 25,
    years: 15,
    awards: 50,
  }

  useEffect(() => {
    // Animate counters
    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    const animateCounter = (key, target) => {
      let current = 0
      const increment = target / steps
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCounters((prev) => ({ ...prev, [key]: target }))
          clearInterval(timer)
        } else {
          setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
        }
      }, interval)
    }

    // Start animations with slight delays
    setTimeout(() => animateCounter('students', stats.students), 100)
    setTimeout(() => animateCounter('teachers', stats.teachers), 200)
    setTimeout(() => animateCounter('years', stats.years), 300)
    setTimeout(() => animateCounter('awards', stats.awards), 400)
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        {/* School Background Image with zoom animation */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat animate-fade-in-zoom"
          style={{
            backgroundImage: 'url(/images/school.webp)',
            backgroundSize: '120%',
          }}
        >
        </div>
        {/* Gradient overlay from right to left - darker on right, lighter on left */}
        <div 
          className="absolute inset-0 z-[1] animate-fade-in"
          style={{
            background: 'linear-gradient(to left, rgba(10, 61, 145, 0.75) 0%, rgba(13, 71, 161, 0.55) 40%, rgba(13, 71, 161, 0.35) 100%)',
            animationDelay: '0.3s',
            animationFillMode: 'both',
          }}
        ></div>
        {/* Additional subtle dark overlay */}
        <div className="absolute inset-0 bg-black/5 z-[1]"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in-up">
            <span className="block animation-delay-100" style={{ animationFillMode: 'both' }}>Welcome to</span>
            <span className="block animation-delay-200" style={{ animationFillMode: 'both' }}>Shanti Varsha Angreji Ma. Vi.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-lg animate-fade-in-up animation-delay-300" style={{ animationFillMode: 'both' }}>
            Empowering minds, shaping futures
          </p>
          <Link
            to="/about"
            className="inline-flex items-center space-x-2 bg-gold text-white px-8 py-4 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-xl shadow-gold/30 animate-fade-in-up animation-delay-400 hover:scale-105 hover:shadow-2xl hover:shadow-gold/40" 
            style={{ animationFillMode: 'both' }}
          >
            <span>Learn More</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        <NoticeBoard limit={3} />
        <div className="mt-8 text-center">
          <Link
            to="/notices"
            className="inline-flex items-center space-x-2 text-navy font-semibold hover:text-gold transition-all duration-300 hover:scale-105 group"
          >
            <span>View All Notices</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* School Statistics Section */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            Our School at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
              <div className="flex justify-center mb-4">
                <div className="bg-gold/20 p-4 rounded-full">
                  <Users className="h-8 w-8 text-gold" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
                {counters.students}+
              </div>
              <div className="text-gray-200 font-medium">Active Students</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
              <div className="flex justify-center mb-4">
                <div className="bg-gold/20 p-4 rounded-full">
                  <GraduationCap className="h-8 w-8 text-gold" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
                {counters.teachers}+
              </div>
              <div className="text-gray-200 font-medium">Qualified Teachers</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
              <div className="flex justify-center mb-4">
                <div className="bg-gold/20 p-4 rounded-full">
                  <Calendar className="h-8 w-8 text-gold" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
                {counters.years}+
              </div>
              <div className="text-gray-200 font-medium">Years of Excellence</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
              <div className="flex justify-center mb-4">
                <div className="bg-gold/20 p-4 rounded-full">
                  <Award className="h-8 w-8 text-gold" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
                {counters.awards}+
              </div>
              <div className="text-gray-200 font-medium">Awards & Achievements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy mb-4 animate-fade-in-up" style={{ animationDelay: '1.1s', animationFillMode: 'both' }}>
            Why Choose Us?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
            We are committed to providing excellence in education and holistic development
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border border-gray-100" style={{ animationDelay: '1.3s', animationFillMode: 'both' }}>
              <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">📚</div>
              <h3 className="text-xl font-bold text-navy mb-3">Quality Education</h3>
              <p className="text-gray-600 leading-relaxed">
                We provide comprehensive education that prepares students for their future with modern teaching methodologies.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border border-gray-100" style={{ animationDelay: '1.4s', animationFillMode: 'both' }}>
              <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">👨‍🏫</div>
              <h3 className="text-xl font-bold text-navy mb-3">Experienced Faculty</h3>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated teachers are committed to student success and growth with years of expertise.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border border-gray-100" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
              <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">🌟</div>
              <h3 className="text-xl font-bold text-navy mb-3">Holistic Development</h3>
              <p className="text-gray-600 leading-relaxed">
                We focus on academic excellence along with character building and extracurricular activities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
