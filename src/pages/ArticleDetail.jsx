import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar, User, Tag, Share2, Printer, ArrowLeft, Clock, FileText } from 'lucide-react'
import { supabase } from '../supabaseClient'
import 'react-quill/dist/quill.snow.css'

function ArticleDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

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
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${copied ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-navy/5 text-navy hover:bg-navy hover:text-white border border-navy/10'}`}
                        >
                            <Share2 className="h-4 w-4" />
                            {copied ? 'Link Copied!' : 'Share Article'}
                        </button>
                        <div className="flex items-center gap-1">
                           <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Share on Facebook">
                              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                           </a>
                           <a href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + window.location.href)}`} target="_blank" rel="noreferrer" className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Share on WhatsApp">
                              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.164 1.236 8.41 3.483 2.247 2.247 3.483 5.235 3.483 8.41 0 6.556-5.332 11.89-11.888 11.89-2.016 0-3.991-.512-5.748-1.487l-6.244 1.631zm6.756-3.859c1.554.921 3.093 1.403 4.837 1.403 5.203 0 9.433-4.231 9.433-9.432 0-2.522-.982-4.893-2.767-6.678-1.785-1.785-4.156-2.767-6.678-2.767-5.204 0-9.433 4.231-9.433 9.432 0 1.932.552 3.511 1.603 4.931l-.986 3.601 3.692-.962zm10.15-5.185c-.253-.127-1.498-.738-1.73-.822-.232-.084-.401-.127-.57.127-.169.253-.654.822-.801.99-.147.169-.295.19-.548.063-.253-.127-1.07-.394-2.037-1.257-.753-.672-1.261-1.503-1.409-1.756-.148-.254-.016-.391.111-.518.114-.114.253-.295.38-.443s.169-.253.253-.422c.084-.169.042-.316-.021-.443-.063-.127-.57-1.371-.78-1.878-.204-.496-.411-.428-.57-.436-.147-.008-.316-.01-.485-.01s-.443.063-.675.316c-.232.253-.886.865-.886 2.11 0 1.245.907 2.448 1.034 2.617.127.169 1.785 2.726 4.323 3.82.604.26 1.076.415 1.444.532.607.192 1.159.165 1.595.1.486-.072 1.498-.612 1.71-.1.21-.612.21-1.014.156-1.12.054-.105-.12-.163-.373-.29z"/></svg>
                           </a>
                        </div>
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
                        <div 
                          className="prose prose-lg md:prose-xl max-w-none text-gray-600 ql-editor font-sans"
                          dangerouslySetInnerHTML={{ __html: article.body }}
                        />

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
