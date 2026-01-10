import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, GraduationCap, Award, Calendar, Trophy, Medal } from 'lucide-react'
import NoticeBoard from '../components/NoticeBoard'

function Home() {
  const [counters, setCounters] = useState({
    students: 0,
    teachers: 0,
    years: 0,
    awards: 0,
  })

  const [imageErrors, setImageErrors] = useState({
    sanjana: false,
    sneha: false,
    sachin: false,
    kripa: false,
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
      <section className="relative h-[650px] md:h-[700px] flex items-center justify-center text-white overflow-hidden">
        {/* School Background Image with zoom animation */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat animate-fade-in-zoom"
          style={{
            backgroundImage: 'url(/images/school.webp)',
            backgroundSize: '120%',
            backgroundPosition: 'center',
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
        {/* Additional subtle dark overlay with animated pattern */}
        <div className="absolute inset-0 bg-black/5 z-[1]"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl animate-float z-[2]" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-float z-[2]" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 drop-shadow-2xl animate-fade-in-up leading-tight">
            <span className="block bg-gradient-to-r from-white via-gold/90 to-white bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>Welcome to</span>
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-1 text-white animate-fade-in-up" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>Shanti Varsha Angreji Ma. Vi.</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}></div>
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-gray-100 drop-shadow-xl font-light animate-fade-in-up" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            Quality Education is our Destination!
          </p>
          <Link
            to="/about"
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-gold to-gold-light text-white px-5 py-3 rounded-2xl font-bold text-lg hover:from-gold-light hover:to-gold transition-all duration-500 shadow-2xl shadow-gold/40 animate-fade-in-up hover:scale-110 hover:shadow-gold/60 transform hover:-translate-y-1" 
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <span>Learn More</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-float">
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-gold rounded-full mt-2 animate-pulse-slow"></div>
          </div>
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-white to-gray-50/30 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-navy rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <NoticeBoard limit={3} />
          <div className="mt-10 text-center animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
            <Link
              to="/notices"
              className="group inline-flex items-center space-x-3 text-navy font-bold text-lg hover:text-gold transition-all duration-500 hover:scale-110 bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl border-2 border-navy/20 hover:border-gold/40"
            >
              <span>View All Notices</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Toppers Section */}
      <section className="relative bg-gradient-to-b from-white via-gray-50/50 to-white py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Trophy className="h-12 w-12 text-gold animate-float" style={{ animationDelay: '0s' }} />
              <h2 className="text-4xl md:text-5xl font-bold text-navy bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">
                Our Academic Excellence
              </h2>
              <Trophy className="h-12 w-12 text-gold animate-float" style={{ animationDelay: '1.5s' }} />
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Proud to celebrate our outstanding students who have achieved remarkable success in National Examination Board (NEB) examinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sanjana Wagle - 4th Topper Nationwide 2069 */}
            <div className="group bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border-2 border-gold/20 hover:border-gold/60 animate-scale-in relative overflow-hidden backdrop-blur-sm" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-dark text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 z-10">
                4th Nationwide
              </div>
              
              {/* Photo Container */}
              <div className="mb-6 relative">
                <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-2xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                  {/* Animated ring on hover */}
                  <div className="absolute inset-0 rounded-full border-4 border-gold/0 group-hover:border-gold/30 group-hover:animate-pulse-slow transition-all duration-500"></div>
                  
                  {!imageErrors.sanjana ? (
                    <img
                      src="/images/toppers/sanjana-wagle.jpg"
                      alt="Sanjana Wagle"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => setImageErrors(prev => ({ ...prev, sanjana: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white group-hover:scale-110 transition-transform duration-500">
                      <GraduationCap className="h-20 w-20" />
                    </div>
                  )}
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold/30 rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gold/40 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">Ms. Sanjana Wagle</h3>
              <p className="text-sm text-gray-600 mb-4 font-medium">Batch 2069</p>
              
              {/* Achievement Badge */}
              <div className="flex items-center justify-center space-x-2 mb-4 bg-gradient-to-r from-gold/20 to-gold/10 px-4 py-2 rounded-full">
                <Medal className="h-5 w-5 text-gold animate-pulse-slow" />
                <span className="text-gold font-bold text-base">93.37%</span>
              </div>
              
              <p className="text-sm text-gray-700 bg-gradient-to-br from-gold/10 to-gold/5 p-4 rounded-xl border border-gold/20 leading-relaxed">
                Secured 4th position nationwide and topped Tanahun district - An exceptional achievement!
              </p>
            </div>

            

            {/* Sachin Shrestha - 4.0 GPA 2078 */}
            <div className="group bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border-2 border-gold/20 hover:border-gold/60 animate-scale-in relative overflow-hidden backdrop-blur-sm" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-dark text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 z-10">
                4.0 GPA
              </div>
              
              {/* Photo Container */}
              <div className="mb-6 relative">
                <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-2xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                  {/* Animated ring on hover */}
                  <div className="absolute inset-0 rounded-full border-4 border-gold/0 group-hover:border-gold/30 group-hover:animate-pulse-slow transition-all duration-500"></div>
                  
                  {!imageErrors.sachin ? (
                    <img
                      src="/images/toppers/sachin-shrestha.png"
                      alt="Sachin Shrestha"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => setImageErrors(prev => ({ ...prev, sachin: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white group-hover:scale-110 transition-transform duration-500">
                      <GraduationCap className="h-20 w-20" />
                    </div>
                  )}
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold/30 rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gold/40 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">Sachin Shrestha</h3>
              <p className="text-sm text-gray-600 mb-4 font-medium">Batch 2078</p>
              
              {/* Achievement Badge */}
              <div className="flex items-center justify-center space-x-2 mb-4 bg-gradient-to-r from-gold/20 to-gold/10 px-4 py-2 rounded-full">
                <Award className="h-5 w-5 text-gold animate-pulse-slow" />
                <span className="text-gold font-bold text-base">4.0 GPA</span>
              </div>
              
              <p className="text-sm text-gray-700 bg-gradient-to-br from-gold/10 to-gold/5 p-4 rounded-xl border border-gold/20 leading-relaxed">
                Outstanding performance with perfect 4.0 GPA in SEE examination
              </p>
            </div>

            {/* Kripa Shahi - 4.0 GPA 2078 */}
            <div className="group bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border-2 border-gold/20 hover:border-gold/60 animate-scale-in relative overflow-hidden backdrop-blur-sm" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-dark text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 z-10">
                4.0 GPA
              </div>
              
              {/* Photo Container */}
              <div className="mb-6 relative">
                <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-2xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                  {/* Animated ring on hover */}
                  <div className="absolute inset-0 rounded-full border-4 border-gold/0 group-hover:border-gold/30 group-hover:animate-pulse-slow transition-all duration-500"></div>
                  
                  {!imageErrors.kripa ? (
                    <img
                      src="/images/toppers/kripa-shahi.png"
                      alt="Kripa Shahi"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => setImageErrors(prev => ({ ...prev, kripa: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white group-hover:scale-110 transition-transform duration-500">
                      <GraduationCap className="h-20 w-20" />
                    </div>
                  )}
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold/30 rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gold/40 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">Kripa Shahi</h3>
              <p className="text-sm text-gray-600 mb-4 font-medium">Batch 2078</p>
              
              {/* Achievement Badge */}
              <div className="flex items-center justify-center space-x-2 mb-4 bg-gradient-to-r from-gold/20 to-gold/10 px-4 py-2 rounded-full">
                <Award className="h-5 w-5 text-gold animate-pulse-slow" />
                <span className="text-gold font-bold text-base">4.0 GPA</span>
              </div>
              
              <p className="text-sm text-gray-700 bg-gradient-to-br from-gold/10 to-gold/5 p-4 rounded-xl border border-gold/20 leading-relaxed">
                Exemplary achievement with perfect 4.0 GPA in SEE examination
              </p>
            </div>


            {/* Sneha Giri - 4.0 GPA 2071 */}
            <div className="group bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border-2 border-gold/20 hover:border-gold/60 animate-scale-in relative overflow-hidden backdrop-blur-sm" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-dark text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 z-10">
                4.0 GPA
              </div>
              
              {/* Photo Container */}
              <div className="mb-6 relative">
                <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-2xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                  {/* Animated ring on hover */}
                  <div className="absolute inset-0 rounded-full border-4 border-gold/0 group-hover:border-gold/30 group-hover:animate-pulse-slow transition-all duration-500"></div>
                  
                  {!imageErrors.sneha ? (
                    <img
                      src="/images/toppers/sneha-giri.jpg"
                      alt="Sneha Giri"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => setImageErrors(prev => ({ ...prev, sneha: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white group-hover:scale-110 transition-transform duration-500">
                      <GraduationCap className="h-20 w-20" />
                    </div>
                  )}
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold/30 rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gold/40 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">Sneha Giri</h3>
              <p className="text-sm text-gray-600 mb-4 font-medium">Batch 2071</p>
              
              {/* Achievement Badge */}
              <div className="flex items-center justify-center space-x-2 mb-4 bg-gradient-to-r from-gold/20 to-gold/10 px-4 py-2 rounded-full">
                <Award className="h-5 w-5 text-gold animate-pulse-slow" />
                <span className="text-gold font-bold text-base">4.0 GPA</span>
              </div>
              
              <p className="text-sm text-gray-700 bg-gradient-to-br from-gold/10 to-gold/5 p-4 rounded-xl border border-gold/20 leading-relaxed">
                Achieved perfect 4.0 GPA in SEE examination - Outstanding academic excellence!
              </p>
            </div>
          </div>

          <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '1.1s', animationFillMode: 'both' }}>
            <div className="relative bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20 rounded-2xl p-8 border-2 border-gold/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Trophy className="h-8 w-8 text-gold animate-float" />
                  <p className="text-2xl font-bold text-navy bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">
                    Celebrating Excellence
                  </p>
                  <Trophy className="h-8 w-8 text-gold animate-float" style={{ animationDelay: '1s' }} />
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4"></div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                  We are proud of our students who have consistently achieved outstanding results in National Examination Board (NEB) examinations, bringing honor to our school and the Damauli area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Statistics Section */}
      <section className="relative bg-gradient-to-b from-navy via-navy-dark to-navy text-white py-20 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
              Our School at a Glance
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border border-gold/20 hover:border-gold/40 animate-scale-in shadow-xl hover:shadow-2xl" style={{ animationDelay: '1.3s', animationFillMode: 'both' }}>
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-gold/30 to-gold/10 p-5 rounded-full group-hover:from-gold/40 group-hover:to-gold/20 transition-all duration-500 shadow-lg group-hover:shadow-gold/50">
                  <Users className="h-10 w-10 text-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-gold mb-3 group-hover:scale-110 transition-transform duration-500">
                {counters.students}+
              </div>
              <div className="text-gray-200 font-semibold text-lg">Active Students</div>
            </div>

            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border border-gold/20 hover:border-gold/40 animate-scale-in shadow-xl hover:shadow-2xl" style={{ animationDelay: '1.4s', animationFillMode: 'both' }}>
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-gold/30 to-gold/10 p-5 rounded-full group-hover:from-gold/40 group-hover:to-gold/20 transition-all duration-500 shadow-lg group-hover:shadow-gold/50">
                  <GraduationCap className="h-10 w-10 text-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-gold mb-3 group-hover:scale-110 transition-transform duration-500">
                {counters.teachers}+
              </div>
              <div className="text-gray-200 font-semibold text-lg">Qualified Teachers</div>
            </div>

            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border border-gold/20 hover:border-gold/40 animate-scale-in shadow-xl hover:shadow-2xl" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-gold/30 to-gold/10 p-5 rounded-full group-hover:from-gold/40 group-hover:to-gold/20 transition-all duration-500 shadow-lg group-hover:shadow-gold/50">
                  <Calendar className="h-10 w-10 text-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-gold mb-3 group-hover:scale-110 transition-transform duration-500">
                {counters.years}+
              </div>
              <div className="text-gray-200 font-semibold text-lg">Years of Excellence</div>
            </div>

            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border border-gold/20 hover:border-gold/40 animate-scale-in shadow-xl hover:shadow-2xl" style={{ animationDelay: '1.6s', animationFillMode: 'both' }}>
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-gold/30 to-gold/10 p-5 rounded-full group-hover:from-gold/40 group-hover:to-gold/20 transition-all duration-500 shadow-lg group-hover:shadow-gold/50">
                  <Award className="h-10 w-10 text-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-gold mb-3 group-hover:scale-110 transition-transform duration-500">
                {counters.awards}+
              </div>
              <div className="text-gray-200 font-semibold text-lg">Awards & Achievements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-24 overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, navy 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '1.7s', animationFillMode: 'both' }}>
            <h2 className="text-4xl md:text-5xl font-bold text-center text-navy mb-4 bg-gradient-to-r from-navy via-navy-dark to-navy bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"></div>
            <p className="text-center text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              We are committed to providing excellence in education and holistic development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div className="group bg-white p-10 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] animate-scale-in border-2 border-gray-100 hover:border-gold/40 relative overflow-hidden" style={{ animationDelay: '1.9s', animationFillMode: 'both' }}>
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">📚</div>
                <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-gold transition-colors duration-300">Quality Education</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  We provide comprehensive education that prepares students for their future with modern teaching methodologies.
                </p>
              </div>
            </div>
            
            <div className="group bg-white p-10 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] animate-scale-in border-2 border-gray-100 hover:border-gold/40 relative overflow-hidden" style={{ animationDelay: '2s', animationFillMode: 'both' }}>
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">👨‍🏫</div>
                <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-gold transition-colors duration-300">Experienced Faculty</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  Our dedicated teachers are committed to student success and growth with years of expertise.
                </p>
              </div>
            </div>
            
            <div className="group bg-white p-10 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] animate-scale-in border-2 border-gray-100 hover:border-gold/40 relative overflow-hidden" style={{ animationDelay: '2.1s', animationFillMode: 'both' }}>
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">🌟</div>
                <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-gold transition-colors duration-300">Holistic Development</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  We focus on academic excellence along with character building and extracurricular activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
