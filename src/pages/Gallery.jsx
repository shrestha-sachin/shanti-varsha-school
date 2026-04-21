import { useState, useEffect, useCallback } from 'react'
import { X, ZoomIn, ChevronLeft, ChevronRight, Camera, ImageOff } from 'lucide-react'
import { supabase } from '../supabaseClient'

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const img = images[index]
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  if (!img) return null
  return (
    <div className="lightbox-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Nav prev */}
      <button onClick={onPrev} disabled={index === 0} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-md transition-all disabled:opacity-30 z-50">
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <div className="w-full max-w-4xl max-h-[85vh] flex flex-col items-center px-4 sm:px-16">
        <img
          src={`${img.image_url || img.photo_url || img.image}?t=${Date.now()}`}
          alt={img.caption || 'Gallery image'}
          className="max-h-[70vh] sm:max-h-[75vh] w-full object-contain rounded-2xl shadow-2xl animate-scale-in"
        />
        {img.caption && (
          <div className="mt-4 text-white/90 text-center text-xs sm:text-sm font-bold bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-xl max-w-[90%]">
            {img.caption}
            {img.album && <span className="block sm:inline sm:ml-2 text-gold-light mt-1 sm:mt-0 opacity-80 font-medium">· {img.album}</span>}
          </div>
        )}
        <p className="text-white/40 text-[10px] mt-3 font-bold uppercase tracking-widest">{index + 1} / {images.length}</p>
      </div>

      {/* Nav next */}
      <button onClick={onNext} disabled={index === images.length - 1} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-md transition-all disabled:opacity-30 z-50">
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 bg-red-500/20 hover:bg-red-500/40 text-white p-2.5 rounded-full backdrop-blur-md transition-all border border-red-500/20 z-50">
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

function Gallery() {
  const [allImages, setAllImages] = useState([])
  const [activeAlbum, setActiveAlbum] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [imgErrors, setImgErrors] = useState({})

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from('school_gallery').select('*').order('date', { ascending: false })
      if (data) setAllImages(data)
    }
    fetchGallery()
  }, [])

  const albums = ['All', ...new Set(allImages.map(g => g.album).filter(Boolean))]
  const filtered = activeAlbum === 'All' ? allImages : allImages.filter(g => g.album === activeAlbum)

  const openLightbox = (idx) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex(i => Math.max(0, i - 1))
  const next = () => setLightboxIndex(i => Math.min(filtered.length - 1, i + 1))

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      {/* Standard Hero */}
      <section className="page-hero py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up">
            <div className="bg-white/15 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
              <Camera className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">Photo Gallery</h1>
              <p className="text-gold-light text-base md:text-lg mt-2 font-medium">Capturing beautiful moments at Shanti Varsha</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Simplified Album Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up">
          {albums.map(album => (
            <button
              key={album}
              onClick={() => setActiveAlbum(album)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${activeAlbum === album
                ? 'bg-navy text-white shadow-lg scale-105'
                : 'bg-slate-50 text-gray-400 border border-gray-100 hover:border-gold/40 hover:text-navy active:scale-95'
                }`}
            >
              {album}
              <span className="ml-2 opacity-40">
                {album === 'All' ? allImages.length : allImages.filter(g => g.album === album).length}
              </span>
            </button>
          ))}
        </div>

        {/* Masonry grid with balanced rounding */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-gray-100">
            <Camera className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy/40">No photos found</h3>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, idx) => (
              <div
                key={img.id}
                className="group relative break-inside-avoid rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 animate-fade-in-up border border-gray-100"
                style={{ animationDelay: `${idx * 0.04}s` }}
                onClick={() => openLightbox(idx)}
              >
                {!imgErrors[img.id] ? (
                  <img
                    src={`${img.image_url || img.photo_url || img.image}?t=${Date.now()}`}
                    alt={img.caption || 'Gallery'}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={() => setImgErrors(p => ({ ...p, [img.id]: true }))}
                  />
                ) : (
                  <div className="w-full h-40 bg-slate-50 flex items-center justify-center">
                    <ImageOff className="h-8 w-8 text-gray-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 scale-50 group-hover:scale-100 transition-transform duration-500 backdrop-blur-md">
                    <ZoomIn className="h-5 w-5 text-white" />
                  </div>
                  {img.caption && <p className="text-white text-xs font-bold line-clamp-2">{img.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  )
}

export default Gallery
