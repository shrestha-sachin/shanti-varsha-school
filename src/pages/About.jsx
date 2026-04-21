import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { User, BookOpen, Target, Users, GraduationCap, Award, Quote, Loader2, Calendar, Trophy, Music, FlaskConical, Map, Palette, PenTool, Microscope, ShieldCheck, ChevronDown, CheckCircle2, ChevronRight, Archive, UserCheck, FileText } from 'lucide-react'
import { useSchoolSettings } from '../hooks/useSchoolSettings'

function About() {
   const [imageErrors, setImageErrors] = useState({})

   const [committee, setCommittee] = useState([])
   const [staff, setStaff] = useState([])
   const [levels, setLevels] = useState([])
   const [selectedLevel, setSelectedLevel] = useState(null)

   const levelSubjects = {
      'Early Years': ['English Foundation', 'Nepali Sensory', 'Basic Number Work', 'Creative Arts', 'Play & Social Skills', 'Rhymes & Storytelling'],
      'Foundation': ['English Language', 'Nepali Bhasa', 'Mathematics', 'Science & Health', 'Social Studies', 'Local Subject', 'Computer Science', 'Moral Education'],
      'Middle Years': ['English Literature', 'Nepali Bhasa', 'Mathematics', 'Science & Technology', 'Social Studies', 'OBTE (Vocation)', 'Moral Education', 'Computer Science'],
      'Secondary': ['Compulsory English', 'Compulsory Nepali', 'Compulsory Mathematics', 'Science & Tech', 'Social Studies', 'HPE', 'Optional Mathematics', 'Accountancy / Computer']
   }
   const [testimonials, setTestimonials] = useState([])
   const [loading, setLoading] = useState(true)
   const settings = useSchoolSettings()

   // Reveal animation logic
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

      const timer = setTimeout(() => {
         document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            observer.observe(el)
         })
      }, 500)

      return () => {
         observer.disconnect()
         clearTimeout(timer)
      }
   }, [loading, committee, staff])

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true)
         try {
            // Fallback array handling for missing display_order columns
            let smcData = []
            let staffData = []

            const [smcRes, staffRes, levelsRes] = await Promise.all([
               supabase.from('school_smc').select('*').order('display_order', { ascending: true }),
               supabase.from('school_staff').select('*').order('display_order', { ascending: true }),
               supabase.from('school_academic_levels').select('*').order('id')
            ])

            if (levelsRes.data) setLevels(levelsRes.data)

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
      <div className="min-h-screen bg-slate-50 animate-fade-in">
         {/* Standard Global Hero */}
         <section className="page-hero py-20 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center gap-4 animate-fade-in-up">
                  <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm shadow-xl">
                     <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                     <h1 className="font-display font-bold text-3xl md:text-5xl">About Us</h1>
                     <p className="text-gold-light text-sm mt-1">Nurturing Excellence Since {settings.established} B.S.</p>
                  </div>
               </div>
            </div>
         </section>

         {/* Institutional Vitals - Consistent Stat Row */}
         <section className="py-12 bg-white border-b border-slate-100 relative z-10 -mt-8 mx-4 sm:mx-8 md:mx-auto max-w-7xl rounded-2xl shadow-xl shadow-navy/5">
            <div className="px-6 sm:px-12">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                     { label: 'Founded Year', val: settings.established },
                     { label: 'Student Body', val: '500+' },
                     { label: 'Faculty Staff', val: '35+' },
                     { label: 'Alumni Network', val: '2000+' }
                  ].map((s, i) => (
                     <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="text-gold font-bold text-[9px] uppercase tracking-[0.2em] mb-1">{s.label}</span>
                        <span className="text-3xl font-display font-black text-navy">{s.val}</span>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* The Narrative - Tightened Spacing */}
         <section className="pt-12 pb-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8 reveal-left">
                     <h2 className="text-3xl md:text-4xl font-display font-black text-navy leading-tight">Our Academic Narrative</h2>
                     <div className="space-y-6 text-slate-500 text-base leading-relaxed">
                        <p>At <span className="text-navy font-bold">{settings.name}</span>, we believe education is a lifelong journey of discovery. Since our inception, we have dedicated ourselves to creating an environment where curiosity is celebrated and integrity is the cornerstone of all we do.</p>
                        <p>Our institution serves as a bridge between foundational local values and global educational standards. In the heart of Chapaghat, we are nurturing the next generation of thinkers, creators, and leaders.</p>
                     </div>
                     <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                        <div>
                           <h4 className="text-navy font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="h-3 w-3 text-gold" /> Our Mission</h4>
                           <p className="text-[11px] text-slate-400">Fostering excellence through scientific inquiry and creative expression.</p>
                        </div>
                        <div>
                           <h4 className="text-navy font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><BookOpen className="h-3 w-3 text-gold" /> Our Vision</h4>
                           <p className="text-[11px] text-slate-400">Becoming a regional leader in holistic academic development.</p>
                        </div>
                     </div>
                  </div>
                  <div className="relative reveal-right">
                     <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                        <img src={settings.campus_photo || "/images/school/building.jpg"} alt="Campus" className="w-full h-full object-cover" />
                     </div>
                     <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-xl hidden md:block">
                        <p className="text-navy font-black text-xs uppercase tracking-widest">Shanti Varsha</p>
                        <p className="text-slate-400 text-[10px] mt-1 italic">Excellence in every step.</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>


         {/* Principal's Message - Balanced & Professional */}
         <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="bg-white rounded-[3rem] overflow-hidden shadow-card border border-slate-100 flex flex-col lg:flex-row items-stretch">
                  <div className="lg:w-1/3 min-h-[400px] relative">
                     {settings.principal_photo ? (
                        <img src={`${settings.principal_photo}?t=${Date.now()}`} alt="Principal" className="absolute inset-0 w-full h-full object-cover" />
                     ) : (
                        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-navy/10"><User className="h-20 w-20" /></div>
                     )}
                  </div>
                  <div className="lg:w-2/3 p-12 lg:p-20 flex flex-col justify-center">
                     <Quote className="h-10 w-10 text-gold/20 mb-8" />
                     <h2 className="text-3xl md:text-4xl font-display font-black text-navy mb-8 uppercase tracking-tight">Leadership & Vision</h2>
                     <div className="prose prose-lg text-slate-500 font-medium leading-relaxed mb-10 italic border-l-2 border-gold/30 pl-8">
                        {(settings.principal_message || 'Welcome to our institution.').split('\n').map((para, i) => (
                           <p key={i} className="mb-4 last:mb-0">"{para}"</p>
                        ))}
                     </div>
                     <div>
                        <p className="text-xl font-display font-black text-navy uppercase tracking-tight">{settings.principal_name}</p>
                        <p className="text-gold font-bold text-[10px] uppercase tracking-[0.3em] mt-1">School Principal</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Institutional Traditions - Consistent Grid */}
         <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-4xl font-display font-black text-navy uppercase tracking-tight">Institutional Traditions</h2>
                  <div className="section-divider" />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                     { id: 'annual-function', title: 'Annual Function', desc: 'A showcase of cultural heritage through performance arts and grand events.', icon: Music },
                     { id: 'sports-day', title: 'Sports Excellence', desc: 'Fostering sportsmanship, physical resilience, and healthy competition.', icon: Trophy },
                     { id: 'science-fair', title: 'Science Fair', desc: 'Encouraging inquiry, innovation, and scientific student-led projects.', icon: FlaskConical },
                     { id: 'field-trips', title: 'Experiential Trips', desc: 'Expanding horizons through outdoor discovery and educational tours.', icon: Map }
                  ].map((event, i) => (
                     <Link to={`/activities/${event.id}`} key={i} className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-gold/30 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <event.icon className="h-8 w-8 text-gold" />
                        </div>
                        <h3 className="font-display font-bold text-navy text-xl mb-3 tracking-tight">{event.title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">{event.desc}</p>
                     </Link>
                  ))}
               </div>
            </div>
         </section>

         {/* Academic Framework - Interactive Depth View */}
         <section className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-200">
            {/* Visual Depth Accents */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
               <div className="mb-20 reveal">
                  <h2 className="text-3xl md:text-4xl font-display font-black text-navy uppercase tracking-tight">Academic Framework</h2>
                  <div className="section-divider mx-auto" />
                  <div className="mt-8 flex flex-col items-center gap-2">
                     <p className="bg-navy text-gold font-black text-[10px] uppercase tracking-[0.4em] px-6 py-2 rounded-full shadow-lg shadow-navy/20 animate-pulse">
                        Select a Class Level Below
                     </p>
                     <p className="text-slate-500 font-medium text-sm mt-2">Discover the detailed subject matrix for each academic tier</p>
                  </div>
               </div>

               {/* High-Contrast Level Selector */}
               <div className="flex flex-wrap justify-center gap-6 reveal-scale">
                  {(levels.length > 0 ? levels : [
                     { title: 'Early Years', core: 'Sensory foundation and creative play.', icon: Palette },
                     { title: 'Foundation', core: 'Core literacy and scientific inquiry.', icon: PenTool },
                     { title: 'Middle Years', core: 'Analytical thinking and moral ethics.', icon: Microscope },
                     { title: 'Secondary', core: 'Higher academic excellence and success.', icon: GraduationCap }
                  ]).map((level, i) => (
                     <button
                        key={i}
                        onClick={() => setSelectedLevel(selectedLevel === level.title ? null : level.title)}
                        className={`flex items-center gap-5 px-10 py-5 rounded-[1.5rem] border-2 transition-all duration-500 shadow-sm ${selectedLevel === level.title ? 'bg-navy border-navy shadow-2xl shadow-navy/20 scale-105' : 'bg-white border-slate-200 hover:border-gold/50 hover:bg-white hover:shadow-xl' + (selectedLevel === null ? ' animate-bounce-subtle' : '')}`}
                     >
                        <div className={`p-2.5 rounded-xl transition-all duration-500 ${selectedLevel === level.title ? 'bg-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white border border-slate-100 shadow-sm'}`}>
                           <level.icon className={`h-5 w-5 ${selectedLevel === level.title ? 'text-navy' : 'text-gold-dark'}`} />
                        </div>
                        <div className="text-left">
                           <h3 className={`font-display font-black text-sm uppercase tracking-tight leading-none ${selectedLevel === level.title ? 'text-white' : 'text-navy'}`}>{level.title}</h3>
                           <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 transition-colors ${selectedLevel === level.title ? 'text-gold' : 'text-slate-400'}`}>
                              {selectedLevel === level.title ? 'Selected' : 'Overview'}
                           </p>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-all duration-500 ${selectedLevel === level.title ? 'rotate-90 text-gold scale-125' : 'text-slate-300 group-hover:text-gold'}`} />
                     </button>
                  ))}
               </div>

               {/* Excel-Style Subjects Matrix Area */}
               {selectedLevel && (
                  <div className="mt-16 animate-fade-in-up">
                     <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
                        {/* Table Header / Title Bar */}
                        <div className="bg-navy px-8 py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                           {/* Decorative background accent */}
                           <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] -mr-48 -mt-48" />

                           <div className="flex items-center gap-5 relative z-10">
                              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
                                 <FileText className="h-7 w-7 text-gold-light" />
                              </div>
                              <div className="text-left">
                                 <h4 className="text-white font-display font-black text-2xl md:text-3xl uppercase tracking-tighter">{selectedLevel} Matrix</h4>
                                 <div className="flex items-center gap-3 mt-2">
                                    <div className="h-px w-6 bg-gold/50" />
                                    <p className="text-gold-light font-bold text-xs uppercase tracking-[0.2em] opacity-90 italic">
                                       Perspective & Narrative
                                    </p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 px-6 py-2.5 bg-gold border border-gold shadow-lg shadow-gold/20 rounded-full transition-transform hover:scale-105 active:scale-95">
                              <div className="w-2.5 h-2.5 rounded-full bg-navy animate-pulse" />
                              <span className="text-navy text-[11px] font-black uppercase tracking-widest">CDC Certified</span>
                           </div>
                        </div>

                        {/* Narrative Lead-in */}
                        <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-200 backdrop-blur-sm">
                           <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-4xl italic">
                              "{(levels.find(l => l.title === selectedLevel)?.core) ||
                                 ([
                                    { title: 'Early Years', core: 'Sensory foundation and creative play.' },
                                    { title: 'Foundation', core: 'Core literacy and scientific inquiry.' },
                                    { title: 'Middle Years', core: 'Analytical thinking and moral ethics.' },
                                    { title: 'Secondary', core: 'Higher academic excellence and success.' }
                                 ].find(l => l.title === selectedLevel)?.core)
                              }"
                           </p>
                        </div>

                        {/* The "Excel" Table */}
                        <div className="overflow-x-auto">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="bg-slate-50 border-b border-slate-200 text-navy font-black text-[11px] uppercase tracking-widest">
                                    <th className="px-8 py-5 border-r border-slate-200 w-20">S.N.</th>
                                    <th className="px-8 py-5 border-r border-slate-200">Offered Subject</th>
                                    <th className="px-8 py-5 border-r border-slate-200">Category</th>
                                    <th className="px-8 py-5">Primary Focus Area</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 {(selectedLevel === 'Early Years' ? [
                                    { sn: '01', sub: 'English Language', cat: 'Language/Comm', focus: 'Phonetics & Vocabulary' },
                                    { sn: '02', sub: 'Nepali Bhasa', cat: 'Language/Comm', focus: 'Letter Recognition & Speech' },
                                    { sn: '03', sub: 'Mathematical Concepts', cat: 'Core/Logic', focus: 'Number Recognition & Shapes' },
                                    { sn: '04', sub: 'Creative Arts', cat: 'Creative/Expr', focus: 'Coloring, Craft & Sensory Play' },
                                    { sn: '05', sub: 'Environmental Science', cat: 'Discovery', focus: 'Nature Awareness & Habits' },
                                 ] : selectedLevel === 'Foundation' ? [
                                    { sn: '01', sub: 'English Language', cat: 'Core Language', focus: 'Grammar, Writing & Fluency' },
                                    { sn: '02', sub: 'Nepali Bhasa', cat: 'Core Language', focus: 'Saahitya & Byakaran' },
                                    { sn: '03', sub: 'Mathematics', cat: 'Core Logic', focus: 'Arithmetic & Geometry Basics' },
                                    { sn: '04', sub: 'Science & Environment', cat: 'Discovery', focus: 'Empirical Inquiry & Health' },
                                    { sn: '05', sub: 'Social Studies', cat: 'Civic', focus: 'Society, Culture & Values' },
                                    { sn: '06', sub: 'General Knowledge', cat: 'Integrated', focus: 'World Awareness & IQ' },
                                    { sn: '07', sub: 'Computer Science', cat: 'Technology', focus: 'Digital Literacy & Typing' },
                                 ] : selectedLevel === 'Middle Years' ? [
                                    { sn: '01', sub: 'English Language', cat: 'Core Language', focus: 'Literature & Critical Analysis' },
                                    { sn: '02', sub: 'Nepali Bhasa', cat: 'Core Language', focus: 'Kathaa & Advanced Grammar' },
                                    { sn: '03', sub: 'Mathematics', cat: 'Core Logic', focus: 'Algebra, Trigonometry & Accounts' },
                                    { sn: '04', sub: 'Science & Technology', cat: 'Physical/Bio', focus: 'Practical Lab & Digital Skills' },
                                    { sn: '05', sub: 'Social & Moral Education', cat: 'Civic', focus: 'Ethics, Policy & Geography' },
                                    { sn: '06', sub: 'Occupation & OBTE', cat: 'Vocational', focus: 'Business Basics & Technology' },
                                    { sn: '07', sub: 'Computer Science', cat: 'Technology', focus: 'Logic, Office Tools & Coding' },
                                 ] : [
                                    { sn: '01', sub: 'Compulsory English', cat: 'National Core', focus: 'Comprehensive Communication' },
                                    { sn: '02', sub: 'Compulsory Nepali', cat: 'National Core', focus: 'National Identity & Lit' },
                                    { sn: '03', sub: 'Compulsory Mathematics', cat: 'National Core', focus: 'Advanced Logic & Stats' },
                                    { sn: '04', sub: 'Science & Technology', cat: 'National Core', focus: 'Laboratory & Theoretical Physics' },
                                    { sn: '05', sub: 'Social Studies', cat: 'National Core', focus: 'Global History & Constitution' },
                                    { sn: '06', sub: 'Optional Mathematics', cat: 'Elective (A)', focus: 'Higher Algebra & Calculus' },
                                    { sn: '07', sub: 'Accountancy / Computer', cat: 'Elective (B)', focus: 'Fin-Records / Software Systems' },
                                 ]).map((row, idx) => (
                                    <tr key={idx} className="group hover:bg-gold/5 transition-colors">
                                       <td className="px-8 py-5 border-r border-slate-100 font-mono text-[11px] text-slate-400">{row.sn}</td>
                                       <td className="px-8 py-5 border-r border-slate-100 font-display font-bold text-navy text-sm">{row.sub}</td>
                                       <td className="px-8 py-5 border-r border-slate-100">
                                          <span className="inline-block px-3 py-1 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">{row.cat}</span>
                                       </td>
                                       <td className="px-8 py-5 text-slate-500 text-xs font-medium italic">
                                          {row.focus}
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>

                        {/* Footer Notes */}
                        <div className="bg-slate-50 p-6 border-t border-slate-200">
                           <div className="flex items-center gap-3 text-slate-400">
                              <ShieldCheck className="h-4 w-4 text-gold/60" />
                              <p className="text-[10px] font-medium leading-relaxed italic italic">
                                 Note: This matrix represents the base curriculum. Additional personality development and creative workshops are integrated weekly for all {selectedLevel} students.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </section>

         {/* Leadership & Teams - Consistent Gallery */}
         <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-4xl font-display font-black text-navy uppercase tracking-tight">The Leadership</h2>
                  <div className="section-divider" />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                  {displayCommittee.map((member) => (
                     <div key={member.id} className="group flex flex-col items-center">
                        <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 mb-6 group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                           {(member.image_url || member.image || member.photo_url) ? (
                              <img src={member.image_url || member.image || member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100 italic text-navy/10"><User className="h-12 w-12" /></div>
                           )}
                        </div>
                        <div className="text-center">
                           <h4 className="font-display font-bold text-navy text-lg">{member.name}</h4>
                           <p className="text-gold font-bold text-[10px] uppercase tracking-widest mt-1">{member.position}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Educators - Premium Circle Portrait Grid */}
         <section className="py-24 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-24">
                  <h2 className="text-3xl md:text-4xl font-display font-black text-navy uppercase tracking-tight">Academic Faculty</h2>
                  <div className="section-divider" />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                  {displayStaff.map((teacher) => (
                     <div key={teacher.id} className="group flex flex-col items-center">
                        <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden bg-white border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 relative group-hover:border-gold/20">
                           {(teacher.image_url || teacher.photo_url || teacher.image) ? (
                              <img src={teacher.image_url || teacher.photo_url || teacher.image} alt={teacher.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-100"><User className="h-16 w-16" /></div>
                           )}
                           <div className="absolute inset-0 bg-navy/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[8px] font-black tracking-widest text-white uppercase bg-navy/60 px-3 py-1 rounded-full backdrop-blur-sm">
                                 {teacher.subject || 'Faculty'}
                              </span>
                           </div>
                        </div>
                        <div className="text-center mt-8">
                           <h4 className="font-display font-bold text-navy text-lg">{teacher.name}</h4>
                           <div className="flex items-center justify-center gap-2 mt-1">
                              <div className="h-px w-3 bg-gold/40" />
                              <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">{teacher.role}</p>
                              <div className="h-px w-3 bg-gold/40" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Testimonials - Pure Minimalist */}
         <section className="py-32 bg-white border-t border-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col gap-24">
                  {testimonials.map((testimonial, index) => (
                     <div key={testimonial.id} className="space-y-8 text-center group">
                        <Quote className="h-8 w-8 text-gold/20 mx-auto" />
                        <p className="text-2xl font-display font-medium text-slate-500 leading-relaxed italic italic">"{testimonial.message}"</p>
                        <div>
                           <h4 className="font-display font-black text-navy text-lg">{testimonial.name}</h4>
                           <p className="text-gold font-bold text-[9px] uppercase tracking-widest mt-1">{testimonial.role}</p>
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
