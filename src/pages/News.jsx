import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Newspaper, Calendar, Tag, X, ChevronLeft, ChevronRight, Eye, Filter } from 'lucide-react'
import { supabase } from '../supabaseClient'

const CATEGORY_BADGE = {
    'School News': 'badge-general',
    'Academic': 'badge-academic',
    'Sports': 'badge-sports',
    'Arts': 'badge-arts',
    'Achievement': 'badge-news',
    'Community': 'badge-event',
}



function News() {
    const [allNews, setAllNews] = useState([])
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    useEffect(() => {
        const fetchNews = async () => {
            const { data } = await supabase.from('school_news')
                .select('*')
                .eq('published', true)
                .order('date', { ascending: false })
            if (data) setAllNews(data)
        }
        fetchNews()
    }, [])

    const categories = ['All', ...new Set(allNews.map(n => n.category))]

    const filtered = allNews.filter(n => {
        const matchCat = activeCategory === 'All' || n.category === activeCategory
        const matchSearch = !search || 
            (n.title && n.title.toLowerCase().includes(search.toLowerCase())) || 
            (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
        return matchCat && matchSearch
    })

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in">
            {/* Standard Hero */}
            <section className="page-hero py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up">
                        <div className="bg-white/15 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
                            <Newspaper className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">Latest News</h1>
                            <p className="text-gold-light text-base md:text-lg mt-2 font-medium">Stay updated with our school's progress and events</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Simplified Search & Category */}
                <div className="flex flex-col lg:flex-row gap-6 mb-12 animate-fade-in-up">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gold transition-colors" />
                        <input
                            className="input-modern !pl-12 !pr-12 h-14 border-2 border-gray-100 hover:border-gold/30 focus:border-gold shadow-sm"
                            placeholder="Search stories..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-navy text-white shadow-lg'
                                        : 'bg-white text-gray-500 border border-gray-100 hover:border-gold/50 hover:text-navy active:scale-95'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100">
                        <Newspaper className="h-16 w-16 text-gray-100 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-navy/40">No news articles found</h3>
                        {search && <button onClick={() => setSearch('')} className="mt-4 text-gold font-bold">Clear Search</button>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((article, idx) => (
                            <Link
                                key={article.id}
                                to={`/news/${article.id}`}
                                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-navy/10 hover:border-gold/30 transition-all duration-500 animate-fade-in-up block"
                                style={{ animationDelay: `${idx * 0.07}s` }}
                            >
                                <div className="h-52 overflow-hidden relative">
                                    {article.image_url ? (
                                        <img src={`${article.image_url}?t=${Date.now()}`} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                            <Newspaper className="h-12 w-12 text-navy/10" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                       <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-navy text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                                          {article.category}
                                       </span>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
                                        <Calendar className="h-3 w-3 text-gold" />
                                        {new Date(article.date).toLocaleDateString()}
                                    </div>
                                    <h3 className="font-display font-bold text-navy text-xl mb-4 leading-snug group-hover:text-gold transition-colors line-clamp-2 uppercase">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {article.content?.replace(/<[^>]*>?/gm, '')}
                                    </p>
                                    <div className="flex items-center gap-2 text-gold text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                        Read More <ChevronRight className="h-3 w-3" />
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

export default News
