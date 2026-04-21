import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Calendar, ArrowLeft, Loader2, Share2, Quote, Camera } from 'lucide-react'

function ActivityDetail() {
  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fallback data if DB doesn't have it yet
  const fallbacks = {
    'annual-function': {
      title: 'Annual Grand Function',
      category: 'Cultural',
      date: 'Annually / Falgun',
      description: 'The Annual Grand Function is the most prestigious event of Shanti Varsha, showcasing the holistic development of our students through performance arts.',
      content: `Our Annual Grand Function serves as a vibrant platform where students from Pre-Primary to Secondary levels display their talents in traditional music, modern dance, and theatrical plays. 
      The event traditionally features guest appearances from local government officials and educational leaders. 
      It is a culmination of months of practice and dedication, emphasizing our commitment to preserving cultural heritage while fostering artistic expression.`,
      image_url: null
    },
    'sports-day': {
      title: 'Annual Sports Excellence',
      category: 'Athletics',
      date: 'Annually / Mangsir',
      description: 'A day dedicated to physical resilience, discipline, and healthy competition among our four houses.',
      content: `Sports Day at Shanti Varsha is more than just a competition; it is a celebration of discipline and physical health. 
      Students compete in various track and field events, including sprints, relay races, long jump, and shot put. 
      The day begins with a formal march-past and ends with the awarding of the 'Overall Champions' shield to the winning house, fostering a sense of community and team spirit.`,
      image_url: null
    }
  }

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true)
      // Check Supabase first (future-proofing)
      const { data } = await supabase.from('school_events').select('*').eq('id', id).single()
      if (data) {
        setActivity(data)
      } else if (fallbacks[id]) {
        setActivity(fallbacks[id])
      }
      setLoading(false)
    }
    fetchActivity()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-gold" />
    </div>
  )

  if (!activity) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <h2 className="text-2xl font-display font-black text-navy mb-4">Activity Not Found</h2>
      <Link to="/about" className="btn-gold px-8 py-3 rounded-2xl flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to About
      </Link>
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <header className="relative py-24 md:py-32 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 -skew-x-12 translate-x-20" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="h-4 w-4" /> Institutional Traditions
          </Link>
          <div className="space-y-6">
            <span className="bg-navy text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{activity.category}</span>
            <h1 className="text-4xl md:text-5xl font-display font-black text-navy leading-tight tracking-tight">
              {activity.title}<span className="text-gold">.</span>
            </h1>
            <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
              <Calendar className="h-4 w-4" />
              <span>{activity.date}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Lead description */}
            <div className="bg-slate-50 p-10 md:p-16 rounded-[3rem] border border-slate-100 italic">
              <Quote className="h-10 w-10 text-gold/20 mb-6" />
              <p className="text-2xl md:text-3xl font-display font-medium text-navy leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* Visual Frame */}
            <div className="aspect-video bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 flex items-center justify-center">
              {activity.image_url ? (
                <img src={activity.image_url} alt={activity.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center space-y-4">
                  <Camera className="h-20 w-20 text-slate-200 mx-auto" />
                  <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">Visual Archive Pending Arrival</p>
                </div>
              )}
            </div>

            {/* Narrative Body */}
            <div className="prose prose-xl max-w-none text-slate-500 leading-relaxed font-serif space-y-8">
              {activity.content.split('\n').map((p, i) => (
                <p key={i}>{p.trim()}</p>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="pt-16 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-black text-xs">SVS</div>
                <div>
                  <p className="text-navy font-bold text-sm tracking-tight leading-none">Shanti Varsha School</p>
                  <p className="text-slate-400 text-[9px] uppercase tracking-widest mt-1">Institutional Event History</p>
                </div>
              </div>
              <button onClick={() => window.print()} className="p-3 bg-slate-50 rounded-2xl hover:bg-gold/10 transition-colors text-slate-400 hover:text-gold">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default ActivityDetail
