import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, ChevronLeft, Newspaper, Share2, Clock, Tag } from 'lucide-react'
import { supabase } from '../supabaseClient'

function NewsDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticle = async () => {
            const { data } = await supabase.from('school_news')
                .select('*')
                .eq('id', id)
                .maybeSingle()
            if (data) setArticle(data)
            setLoading(false)
        }
        fetchArticle()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gold/20 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <Newspaper className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-navy mb-2">Article Not Found</h2>
                <p className="text-gray-500 mb-6 text-center">The news article you're looking for doesn't exist or has been removed.</p>
                <Link to="/news" className="btn-gold px-8 py-3 rounded-xl flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back to News
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Standard Article Header */}
            <div className="relative h-[40vh] md:h-[60vh] bg-navy overflow-hidden">
            {article.image_url ? (
                    <img src={`${article.image_url}?t=${Date.now()}`} alt={article.title} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-darker">
                        <Newspaper className="h-24 w-24 text-white/10" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-gold text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{article.category}</span>
                        <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm">
                            <Calendar className="h-4 w-4" />
                            {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight drop-shadow-lg">
                        {article.title}
                    </h1>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Main Content */}
                    <article className="flex-1">
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                            {article.content}
                        </div>

                        {/* Article Footer */}
                        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: article.title,
                                                text: 'Check out this news from Shanti Varsha School!',
                                                url: window.location.href,
                                            }).catch(console.error)
                                        } else {
                                            navigator.clipboard.writeText(window.location.href)
                                            alert("Article link copied to clipboard!")
                                        }
                                    }}
                                    className="flex items-center gap-2 text-gray-400 hover:text-navy transition-colors text-sm font-medium"
                                >
                                    <Share2 className="h-4 w-4" /> Share Article
                                </button>
                                <div className="h-4 w-px bg-gray-200" />
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Clock className="h-4 w-4" /> 5 min read
                                </div>
                            </div>
                            <Link to="/news" className="text-gold font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                More News <ChevronLeft className="h-4 w-4 rotate-180" />
                            </Link>
                        </div>
                    </article>

                    {/* Sidebar components can go here if needed */}
                </div>
            </div>
            
            {/* Related/Back Section */}
            <section className="bg-slate-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <Link to="/news" className="inline-flex items-center gap-2 text-gray-500 hover:text-navy font-semibold transition-colors">
                        <ChevronLeft className="h-5 w-5" /> Back to all updates
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default NewsDetail
