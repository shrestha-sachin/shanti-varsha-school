import { useState, useEffect } from 'react'
import { Search, Newspaper, Calendar, Tag, X, ChevronLeft, ChevronRight, Eye, Filter } from 'lucide-react'

const CATEGORY_BADGE = {
    'School News': 'badge-general',
    'Academic': 'badge-academic',
    'Sports': 'badge-sports',
    'Arts': 'badge-arts',
    'Achievement': 'badge-news',
    'Community': 'badge-event',
}

function NewsModal({ article, onClose }) {
    if (!article) return null
    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                {article.imageUrl && (
                    <div className="w-full h-48 sm:h-64 overflow-hidden rounded-t-2xl">
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`badge ${CATEGORY_BADGE[article.category] || 'badge-general'}`}>{article.category}</span>
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all flex-shrink-0">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                    <h2 className="font-display font-bold text-navy text-2xl mb-4 leading-tight">{article.title}</h2>
                    <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                        {article.content}
                    </div>
                </div>
            </div>
        </div>
    )
}

function News() {
    const [allNews, setAllNews] = useState([])
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [selectedArticle, setSelectedArticle] = useState(null)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('schoolNews') || '[]')
        const published = stored.filter(n => n.published !== false).sort((a, b) => new Date(b.date) - new Date(a.date))
        if (published.length === 0) {
            // Sample news
            const sample = [
                { id: 1, title: 'School Celebrates Annual Sports Day 2081', category: 'Sports', date: new Date().toISOString().split('T')[0], content: 'Shanti Varsha Angreji Ma. Vi. held its annual sports day with great enthusiasm. Students participated in various track and field events, demonstrating exceptional athletic spirit and sportsmanship.\n\nThe event was attended by parents, guardians, and community members who cheered enthusiastically for the young athletes.\n\nThe school management congratulated all participants and winners for their outstanding performance.', imageUrl: '', published: true },
                { id: 2, title: 'Outstanding SEE Results — Students Achieve Excellence', category: 'Achievement', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], content: 'Students of Shanti Varsha Angreji Ma. Vi. have achieved outstanding results in the SEE (Secondary Education Examination). Multiple students secured GPA 4.0, bringing pride to the school and the community.\n\nThe school management, teachers, and parents congratulated the successful students and encouraged them to pursue excellence in higher education.', imageUrl: '', published: true },
                { id: 3, title: 'New Computer Lab Inaugurated', category: 'School News', date: new Date(Date.now() - 432000000).toISOString().split('T')[0], content: 'A state-of-the-art computer lab has been inaugurated at our school, equipped with modern computers and high-speed internet to support digital education.\n\nThis facility will enable students to enhance their technical skills and prepare for the digital future.', imageUrl: '', published: true },
            ]
            localStorage.setItem('schoolNews', JSON.stringify(sample))
            setAllNews(sample)
        } else {
            setAllNews(published)
        }
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
                    <div className="flex items-center gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                        ? 'bg-gradient-to-r from-navy to-gold text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gold/50 hover:text-navy'
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
                            <div
                                key={article.id}
                                className="group bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden card-hover cursor-pointer animate-fade-in-up"
                                style={{ animationDelay: `${idx * 0.07}s` }}
                                onClick={() => setSelectedArticle(article)}
                            >
                                {article.imageUrl ? (
                                    <div className="h-44 overflow-hidden">
                                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                                        <Eye className="h-4 w-4" /> Read more
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedArticle && <NewsModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
        </div>
    )
}

export default News
