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
        const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in">
            {/* Hero */}
            <section className="page-hero py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4 animate-fade-in-up">
                        <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
                            <Newspaper className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-3xl md:text-5xl">News & Updates</h1>
                            <p className="text-gold-light text-sm mt-1">Stay informed about our school activities</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            className="input-modern pl-10"
                            placeholder="Search news..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 animate-fade-in-up">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-gradient-to-r from-navy to-gold text-white shadow-md'
                                        : 'bg-white text-gray-500 border border-gray-200 hover:border-gold/50 hover:text-navy translate-y-0 active:scale-95'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No news articles found.</p>
                        {search && <button onClick={() => setSearch('')} className="mt-3 text-gold text-sm hover:underline">Clear search</button>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((article, idx) => (
                            <Link
                                key={article.id}
                                to={`/news/${article.id}`}
                                className="group bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden card-hover animate-fade-in-up block"
                                style={{ animationDelay: `${idx * 0.07}s` }}
                            >
                                {article.image_url ? (
                                    <div className="h-44 overflow-hidden">
                                        <img src={`${article.image_url}?t=${Date.now()}`} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ) : (
                                    <div className="h-44 bg-gradient-to-br from-navy/10 to-gold/10 flex items-center justify-center">
                                        <Newspaper className="h-12 w-12 text-navy/20" />
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className={`badge ${CATEGORY_BADGE[article.category] || 'badge-general'} text-[11px]`}>{article.category}</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-bold text-navy text-base mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{article.content}</p>
                                    <div className="mt-4 flex items-center gap-1 text-gold text-sm font-semibold">
                                        <Eye className="h-4 w-4" /> Read full article
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
