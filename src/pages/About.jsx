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
        // Fallback array handling for missing display_order columns
        let smcData = []
        let staffData = []

        const [smcRes, staffRes] = await Promise.all([
          supabase.from('school_smc').select('*').order('display_order', { ascending: true }),
          supabase.from('school_staff').select('*').order('display_order', { ascending: true })
        ])

        if (smcRes.error) {
          const fallback = await supabase.from('school_smc').select('*').order('name')
          smcData = fallback.data || []
        } else {
          smcData = smcRes.data || []
        }

        if (staffRes.error) {
          const fallback = await supabase.from('school_staff').select('*').order('name')
          staffData = fallback.data || []
        } else {
          staffData = staffRes.data || []
        }

        setCommittee(smcData)
        setStaff(staffData)
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
        <div className="min-h-screen bg-white animate-fade-in">
            {/* Standard Hero */}
            <section className="page-hero py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up">
                        <div className="bg-white/15 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
                            <Users className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">About Us</h1>
                            <p className="text-gold-light text-base md:text-lg mt-2 font-medium">Nurturing Excellence Since {settings.established} B.S.</p>
                        </div>
                    </div>
                </div>
            </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
             {/* History */}
             <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="bg-gold/10 p-2.5 rounded-xl">
                    <BookOpen className="h-6 w-6 text-gold" />
                  </div>
                  <h2 className="text-2xl font-display font-extrabold text-navy">Our History</h2>
                </div>
                <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
                  <p>
                    {settings.name || 'Shanti Varsha Angreji Ma. Vi.'} has been serving the community of {settings.address} for many years. Established with a vision to provide quality
                    education, our school has grown to become a cornerstone of learning in the region.
                  </p>
                  <p>
                    Over the years, we have maintained our commitment to academic excellence while
                    adapting to modern educational needs. Today, we uphold our rich traditions while embracing 
                    technologies that prepare our students for a global future.
                  </p>
                </div>
             </div>

             {/* Mission */}
             <div className="lg:w-1/2 bg-slate-50 p-8 md:p-12 rounded-[2rem] border border-gray-100 relative overflow-hidden">
                <Target className="absolute -right-8 -bottom-8 h-48 w-48 text-navy/5" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="bg-gold/10 p-2.5 rounded-xl">
                      <Target className="h-6 w-6 text-gold" />
                    </div>
                    <h2 className="text-2xl font-display font-extrabold text-navy">Our Mission</h2>
                  </div>
                  <ul className="space-y-4">
                    {[
                      'Achieve academic excellence through quality education',
                      'Develop critical thinking and problem-solving skills',
                      'Cultivate values of respect, integrity, and responsibility',
                      'Foster creativity and innovation to prepare for future careers'
                    ].map((m, i) => (
                      <li key={i} className="flex items-start gap-4 text-gray-700">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                        <span className="font-medium text-lg lg:text-base xl:text-lg">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Principal's Message - Full Width Stylized */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="lg:w-1/3 w-full max-w-sm relative">
                <div className="absolute inset-0 bg-gold rounded-[3rem] rotate-6 translate-x-4 translate-y-4 -z-0 opacity-20" />
                <div className="relative z-10 aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                  {settings.principal_photo ? (
                    <img 
                      src={`${settings.principal_photo}?t=${Date.now()}`} 
                      alt={settings.principal_name || "Principal"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-navy flex flex-col items-center justify-center text-white/20">
                      <User className="h-32 w-32" />
                    </div>
                  )}
                </div>
             </div>

             <div className="lg:w-2/3 relative">
                <Quote className="absolute -top-10 -left-10 h-32 w-32 text-navy/5" />
                <div className="relative z-10">
                   <h4 className="text-gold-dark font-bold uppercase tracking-[0.2em] text-xs mb-4">Leadership Message</h4>
                   <h2 className="text-4xl md:text-5xl font-display font-black text-navy mb-8 leading-tight">
                     From the <br/><span className="text-gold-dark italic">Principal's Desk</span>
                   </h2>
                   <div className="prose max-w-none text-gray-600 space-y-6 italic text-xl md:text-2xl font-medium leading-normal">
                      {(settings.principal_message || 'The Principal\'s welcome message is being updated. Please check back soon.').split('\n').map((para, i) => (
                        <p key={i}>"{para}"</p>
                      ))}
                   </div>
                   <div className="mt-12 flex items-center gap-6">
                      <div className="h-px w-20 bg-gold" />
                      <div>
                        <p className="font-display font-black text-navy text-lg uppercase tracking-wider">{settings.principal_name || 'School Administration'}</p>
                        <p className="text-gold-dark font-bold text-xs uppercase mt-1">Principal & Academic Head</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Teams Sections */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h4 className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Our Core Team</h4>
              <h2 className="text-4xl font-display font-black text-navy uppercase">Management Committee</h2>
              <div className="mt-4 h-1 w-20 bg-gold mx-auto rounded-full" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayCommittee.map((member, index) => (
                <div key={member.id} className="group text-center">
                   <div className="relative mb-6 mx-auto w-48 h-48">
                      <div className="absolute inset-0 bg-slate-50 rounded-full border border-gray-100 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white shadow-xl">
                        {(member.image_url || member.image || member.photo_url) ? (
                          <img src={`${member.image_url || member.image || member.photo_url}?t=${Date.now()}`} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-navy flex items-center justify-center text-white/10"><User className="h-20 w-20" /></div>
                        )}
                      </div>
                   </div>
                   <h3 className="font-bold text-navy text-lg group-hover:text-gold transition-colors">{member.name}</h3>
                   <p className="text-gold-dark text-[11px] font-bold uppercase tracking-widest mt-1 opacity-80">{member.position}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h4 className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Educational Excellence</h4>
              <h2 className="text-4xl font-display font-black text-navy uppercase">Our Faculty & Staff</h2>
              <div className="mt-4 h-1 w-20 bg-gold mx-auto rounded-full" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayStaff.map((teacher, index) => (
                <div key={teacher.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                        {(teacher.image_url || teacher.photo_url || teacher.image) ? (
                            <img src={`${teacher.image_url || teacher.photo_url || teacher.image}?t=${Date.now()}`} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full bg-navy flex items-center justify-center text-white/10"><GraduationCap className="h-6 w-6" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                         <h3 className="font-bold text-navy truncate group-hover:text-gold transition-colors">{teacher.name}</h3>
                         <p className="text-gray-500 text-xs mt-0.5">{teacher.role === 'Teacher' ? teacher.subject : teacher.role}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h4 className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Community Voices</h4>
              <h2 className="text-4xl font-display font-black text-navy uppercase">Messages & Testimonials</h2>
              <div className="mt-4 h-1 w-20 bg-gold mx-auto rounded-full" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="relative group p-8 lg:p-12 rounded-[2.5rem] bg-slate-50 border border-gray-100 shadow-sm hover:shadow-2xl hover:bg-white transition-all duration-500 flex flex-col justify-between overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                   <div>
                      <Quote className="h-10 w-10 text-gold/20 mb-6 group-hover:text-gold transition-colors" />
                      <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium italic relative z-10">"{testimonial.message}"</p>
                   </div>
                   <div className="mt-10 flex items-center gap-4 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-navy font-black text-xl shadow-inner group-hover:border-gold transition-colors">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-navy text-lg">{testimonial.name}</h4>
                        <p className="text-gold-dark text-[10px] font-bold uppercase tracking-widest">{testimonial.role}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  )
}

export default About
