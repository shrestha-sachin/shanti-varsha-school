import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { User, BookOpen, Target, Users, GraduationCap, Award, Quote, Loader2 } from 'lucide-react'
import { useSchoolSettings } from '../hooks/useSchoolSettings'

function About() {
  const [imageErrors, setImageErrors] = useState({})

  const [committee, setCommittee] = useState([])
  const [staff, setStaff] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const settings = useSchoolSettings()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [smcRes, staffRes] = await Promise.all([
          supabase.from('school_smc').select('*').order('name'),
          supabase.from('school_staff').select('*').order('name')
        ])
        if (smcRes.data) setCommittee(smcRes.data)
        if (staffRes.data) setStaff(staffRes.data)
      } catch (err) {
        console.error("Error fetching about page data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Re-fetch whenever user navigates back to this page (tab becomes visible)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchData()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Load testimonials from local storage since they aren't in Supabase yet
    const loadTestimonials = () => {
      try {
        const stored = localStorage.getItem('schoolTestimonials')
        if (stored) {
          setTestimonials(JSON.parse(stored))
        } else {
          setTestimonials([
            { id: 1, name: 'Parent Name 1', role: 'Parent', message: 'Shanti Varsha Angreji Ma. Vi. has provided excellent education to my child...', image: '' },
            { id: 2, name: 'Stakeholder Name 1', role: 'Community Leader', message: 'The school has been a pillar of educational excellence in our community...', image: '' }
          ])
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadTestimonials()
    window.addEventListener('schoolTestimonialsUpdated', loadTestimonials)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('schoolTestimonialsUpdated', loadTestimonials)
    }
  }, [])


  // Fallback if DB is empty/fails
  const displayCommittee = committee.length > 0 ? committee : [
    { id: 1, name: 'Chairperson Name', position: 'Chairperson', image: '/images/management/chairperson.jpg' },
    { id: 2, name: 'Vice Chairperson Name', position: 'Vice Chairperson', image: '/images/management/vice-chairperson.jpg' },
    { id: 3, name: 'Secretary Name', position: 'Secretary', image: '/images/management/secretary.jpg' },
  ]

  const displayStaff = staff.length > 0 ? staff : [
    { id: 1, name: 'Teacher Name 1', subject: 'Mathematics', photo_url: '/images/teachers/teacher1.jpg' },
    { id: 2, name: 'Teacher Name 2', subject: 'Science', photo_url: '/images/teachers/teacher2.jpg' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Hero */}
      <section className="page-hero py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 animate-fade-in-up">
            <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl md:text-5xl">About Us</h1>
              <p className="text-gold-light text-sm mt-1">Learn more about our school's mission, history, and commitment to excellence in education.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Principal's Message */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group">
            <div className="flex flex-col lg:flex-row">
              {/* Image Side */}
              <div className="lg:w-1/3 relative min-h-[400px] bg-navy overflow-hidden">
                {settings.principal_photo ? (
                  <img 
                    src={`${settings.principal_photo}?t=${Date.now()}`} 
                    alt={settings.principal_name || "Principal"}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-navy to-navy-dark border border-white/5">
                    <User className="h-24 w-24 text-white opacity-20 mb-4" />
                    <span className="text-white/40 uppercase tracking-widest text-xs font-bold">Photo Pending</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="font-display font-bold text-2xl">{settings.principal_name || 'Principal'}</h3>
                  <p className="text-gold font-medium text-sm">Head of School</p>
                </div>
              </div>

              {/* Text Side */}
              <div className="lg:w-2/3 p-8 md:p-12 flex flex-col justify-center relative">
                <div className="absolute top-8 right-8 text-gold/10">
                  <Quote className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    <User className="h-3.5 w-3.5" /> Welcome Message
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-extrabold text-navy mb-8 leading-tight">
                    From the <span className="text-gold-dark">Principal's Desk</span>
                  </h2>
                  <div className="prose max-w-none text-gray-600 space-y-4">
                    {(settings.principal_message || '').split('\n').map((para, i) => (
                      <p key={i} className="text-lg leading-relaxed">{para}</p>
                    ))}
                    {!settings.principal_message && (
                      <p className="text-lg leading-relaxed italic opacity-70">
                        The Principal's welcome message is being updated. Please check back soon.
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-10 flex items-center gap-4">
                    <div className="h-0.5 w-12 bg-gold mt-1" />
                    <p className="font-display font-bold text-navy uppercase tracking-widest text-sm">
                      {settings.principal_name || 'Shanti Varsha Administration'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* School History */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>School History</span>
                </h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  Shanti Varsha Angreji Ma. Vi. has been serving the community of Vyas-5, Chapaghat,
                  Damauli, Tanahun for many years. Established with a vision to provide quality
                  education to the local community, our school has grown to become a trusted
                  institution in the region.
                </p>
                <p className="text-lg leading-relaxed mb-4 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  Over the years, we have maintained our commitment to academic excellence while
                  adapting to the changing needs of education. Our school has produced numerous
                  successful graduates who have gone on to make significant contributions in various
                  fields.
                </p>
                <p className="text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                  Today, we continue to uphold our values and traditions while embracing modern
                  teaching methodologies and technologies to provide the best possible education
                  to our students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <Target className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Our Mission</span>
                </h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-4 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  Our mission is to provide a nurturing and stimulating learning environment that
                  enables students to:
                </p>
                <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 ml-4">
                  <li className="animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>Achieve academic excellence through quality education</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>Develop critical thinking and problem-solving skills</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>Cultivate values of respect, integrity, and responsibility</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>Foster creativity and innovation</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'both' }}>Prepare for higher education and future careers</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '1.1s', animationFillMode: 'both' }}>Contribute positively to society</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Management Committee */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <Users className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Management Committee</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayCommittee.map((member, index) => (
                  <div
                    key={member.id}
                    className="group card-3d magnetic hover-lift bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-gold/40 animate-scale-in glow-border"
                    style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <div className="mb-4 relative">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                        {(member.image_url || member.image || member.photo_url) ? (
                          <img
                            src={`${member.image_url || member.image || member.photo_url}?t=${Date.now()}`}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white">
                            <User className="h-16 w-16" />
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-1 group-hover:text-gold transition-colors duration-300">{member.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{member.position}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Teachers and Staff */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <GraduationCap className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Our Teachers & Staff</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayStaff.map((teacher, index) => (
                  <div
                    key={teacher.id}
                    className="group card-3d magnetic hover-lift bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-gold/40 animate-scale-in glow-border"
                    style={{ animationDelay: `${0.7 + index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <div className="mb-4 relative">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                         {(teacher.image_url || teacher.photo_url || teacher.image) ? (
                           <img
                             src={`${teacher.image_url || teacher.photo_url || teacher.image}?t=${Date.now()}`}
                             alt={teacher.name}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white">
                             <GraduationCap className="h-16 w-16" />
                           </div>
                         )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-1 group-hover:text-gold transition-colors duration-300">{teacher.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{teacher.role === 'Teacher' ? teacher.subject : teacher.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Parents and Stakeholders Testimonials */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <Quote className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Parents & Stakeholders Messages</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="group card-3d bg-white rounded-3xl p-8 border border-gray-100 hover:border-gold/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all duration-500 animate-fade-in-up glow-border relative flex flex-col justify-between"
                    style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <Quote className="absolute right-8 top-8 h-16 w-16 text-gray-50 group-hover:text-gold/10 transition-colors duration-500" />
                    <div>
                      <Quote className="h-6 w-6 text-gold mb-6" />
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed italic z-10 relative">
                        "{testimonial.message}"
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 flex-shrink-0 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold font-display text-lg group-hover:bg-gold flex-shrink-0 group-hover:text-white transition-colors duration-300 border border-gray-100 group-hover:border-gold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-navy truncate">{testimonial.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest font-extrabold text-gold-dark truncate">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
