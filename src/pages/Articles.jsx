import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, Calendar, Tag, ChevronLeft, ChevronRight, Eye, User, X } from 'lucide-react'
import { supabase } from '../supabaseClient'

function Articles() {
    const [articles, setArticles] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            const { data } = await supabase.from('school_articles')
                .select('*')
                .eq('published', true)
                .order('date', { ascending: false })
            if (data) setArticles(data)
            setLoading(false)
        }
        fetchArticles()
    }, [])

    const filtered = articles.filter(a => {
        const matchSearch = !search || 
            a.title.toLowerCase().includes(search.toLowerCase()) || 
            a.body.toLowerCase().includes(search.toLowerCase()) ||
            (a.author && a.author.toLowerCase().includes(search.toLowerCase())) ||
            (a.tags && a.tags.toLowerCase().includes(search.toLowerCase()))
        return matchSearch
    })

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in">
            {/* Hero */}
            <section className="page-hero py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up">
                        <div className="bg-white/15 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
                            <FileText className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">Educational Articles</h1>
                            <p className="text-gold-light text-base md:text-lg mt-2 font-medium">Insights and knowledge from our school community</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search */}
                <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gold transition-colors" />
                        <input
                            className="input-modern pl-12 h-14 text-lg border-2 border-gray-100 hover:border-gold/30 focus:border-gold shadow-sm"
                            placeholder="Search articles, authors, or topics..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="bg-white rounded-3xl p-6 h-64 border border-gray-100 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 animate-fade-in">
                        <FileText className="h-20 w-20 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 text-xl font-display font-bold">No articles found matching your search.</p>
                        {search && (
                            <button 
                                onClick={() => setSearch('')} 
                                className="mt-4 text-gold font-bold hover:text-gold-dark transition-colors inline-flex items-center gap-2"
                            >
                                <X className="h-4 w-4" /> Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((article, idx) => (
                            <Link
                                key={article.id}
                                to={`/articles/${article.id}`}
                                className="group bg-white rounded-3xl border border-gray-100 p-6 md:p-8 hover:shadow-2xl hover:shadow-navy/10 hover:border-gold/30 transition-all duration-500 animate-fade-in-up flex flex-col h-full"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="flex items-center justify-between gap-3 mb-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-navy/50">
                                        <Calendar className="h-3.5 w-3.5 text-gold" />
                                        {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {article.tags && (
                                        <div className="flex gap-1">
                                            {article.tags.split(',').slice(0, 1).map(tag => (
                                                <span key={tag} className="px-2.5 py-1 bg-gold/10 text-gold-darker text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <h2 className="font-display font-bold text-navy text-xl md:text-2xl mb-4 leading-tight group-hover:text-gold transition-colors line-clamp-2">
                                    {article.title}
                                </h2>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3 mb-6 flex-1">
                                    {article.body}
                                </p>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center">
                                            <User className="h-4 w-4 text-navy/40" />
                                        </div>
                                        <span className="text-sm font-semibold text-navy/70">{article.author || 'Anonymous'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gold text-sm font-bold group-hover:translate-x-1 transition-transform">
                                        Read Now <ChevronRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Articles
