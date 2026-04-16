import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar, User, Tag, Share2, Printer, ArrowLeft, Clock, FileText } from 'lucide-react'
import { supabase } from '../supabaseClient'

function ArticleDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true)
            const { data } = await supabase.from('school_articles').select('*').eq('id', id).single()
            if (data) setArticle(data)
            else navigate('/articles')
            setLoading(false)
        }
        fetchArticle()
        window.scrollTo(0, 0)
    }, [id, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Opening Article...</p>
                </div>
            </div>
        )
    }

    if (!article) return null

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in">
            {/* Minimal Header */}
            <div className="bg-white border-b border-gray-100 py-6 sticky top-[68px] md:top-[80px] z-40 transition-all shadow-sm">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <Link to="/articles" className="flex items-center gap-2 text-navy hover:text-gold font-bold transition-colors group">
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Back to Articles</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.print()} className="p-2.5 text-navy/40 hover:text-navy hover:bg-gray-100 rounded-xl transition-all" title="Print Article">
                            <Printer className="h-5 w-5" />
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="p-2.5 text-navy/40 hover:text-navy hover:bg-gray-100 rounded-xl transition-all" title="Share Article">
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                {/* Meta Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-gold/10 text-gold-darker text-xs font-bold uppercase tracking-widest rounded-full border border-gold/20">
                            Educational Insight
                        </span>
                        <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            {article.body ? Math.ceil(article.body.split(' ').length / 200) : 0} min read
                        </div>
                    </div>
                    
                    <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-navy leading-tight mb-10 tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white shadow-lg">
                                <User className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Written By</p>
                                <p className="font-bold text-navy text-lg leading-none">{article.author || 'Anonymous Author'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-navy/40 border border-gray-200">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Published On</p>
                                <p className="font-bold text-navy text-lg leading-none">
                                    {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-navy/5 p-6 md:p-14 lg:p-20 border border-gray-100 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="prose prose-lg md:prose-xl max-w-none text-gray-600 leading-loose space-y-8 font-serif">
                            {article.body ? article.body.split('\n').map((para, i) => (
                                para.trim() ? <p key={i} className="mb-6">{para}</p> : <br key={i} />
                            )) : <p>No content available.</p>}
                        </div>

                        {article.tags && (
                            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap gap-3">
                                <div className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Tag className="h-3.5 w-3.5" /> Filed Under
                                </div>
                                {article.tags.split(',').map(tag => (
                                    <span key={tag} className="px-5 py-2.5 bg-gray-50 text-navy/70 text-sm font-bold rounded-2xl border border-gray-200 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-default">
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Link to="/articles" className="inline-flex items-center gap-3 px-10 py-5 bg-navy text-white rounded-3xl font-bold hover:bg-gold transition-all duration-500 shadow-xl shadow-navy/20 active:scale-95 group">
                        <FileText className="h-5 w-5" />
                        Explore More Articles
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </article>
        </div>
    )
}

export default ArticleDetail
