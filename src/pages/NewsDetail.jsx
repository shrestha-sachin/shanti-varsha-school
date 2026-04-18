import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, ChevronLeft, Newspaper, Share2, Clock, Tag } from 'lucide-react'
import { supabase } from '../supabaseClient'
import 'react-quill/dist/quill.snow.css'

function NewsDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

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
                        <div 
                          className="prose prose-lg max-w-none text-gray-700 ql-editor"
                          dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Article Footer */}
                        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${copied ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-navy bg-gray-50'}`}
                                >
                                    <Share2 className="h-4 w-4" /> 
                                    {copied ? 'Link Copied!' : 'Share Article'}
                                </button>
                                <div className="flex items-center gap-1">
                                   <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                   </a>
                                   <a href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + window.location.href)}`} target="_blank" rel="noreferrer" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.164 1.236 8.41 3.483 2.247 2.247 3.483 5.235 3.483 8.41 0 6.556-5.332 11.89-11.888 11.89-2.016 0-3.991-.512-5.748-1.487l-6.244 1.631zm6.756-3.859c1.554.921 3.093 1.403 4.837 1.403 5.203 0 9.433-4.231 9.433-9.432 0-2.522-.982-4.893-2.767-6.678-1.785-1.785-4.156-2.767-6.678-2.767-5.204 0-9.433 4.231-9.433 9.432 0 1.932.552 3.511 1.603 4.931l-.986 3.601 3.692-.962zm10.15-5.185c-.253-.127-1.498-.738-1.73-.822-.232-.084-.401-.127-.57.127-.169.253-.654.822-.801.99-.147.169-.295.19-.548.063-.253-.127-1.07-.394-2.037-1.257-.753-.672-1.261-1.503-1.409-1.756-.148-.254-.016-.391.111-.518.114-.114.253-.295.38-.443s.169-.253.253-.422c.084-.169.042-.316-.021-.443-.063-.127-.57-1.371-.78-1.878-.204-.496-.411-.428-.57-.436-.147-.008-.316-.01-.485-.01s-.443.063-.675.316c-.232.253-.886.865-.886 2.11 0 1.245.907 2.448 1.034 2.617.127.169 1.785 2.726 4.323 3.82.604.26 1.076.415 1.444.532.607.192 1.159.165 1.595.1.486-.072 1.498-.612 1.71-.1.21-.612.21-1.014.156-1.12.054-.105-.12-.163-.373-.29z"/></svg>
                                   </a>
                                </div>
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
