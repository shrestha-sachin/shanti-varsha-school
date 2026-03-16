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
      <button onClick={onPrev} disabled={index === 0} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all disabled:opacity-30">
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center px-16">
        <img
          src={img.image_url}
          alt={img.caption || 'Gallery image'}
          className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl animate-scale-in"
        />
        {img.caption && (
          <div className="mt-4 text-white/90 text-center text-sm font-medium bg-black/30 backdrop-blur-sm px-6 py-2 rounded-full">
            {img.caption}
            {img.album && <span className="ml-2 text-gold-light">· {img.album}</span>}
          </div>
        )}
        <p className="text-white/40 text-xs mt-2">{index + 1} / {images.length}</p>
      </div>

      {/* Nav next */}
      <button onClick={onNext} disabled={index === images.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all disabled:opacity-30">
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 bg-white/15 hover:bg-white/30 text-white p-2.5 rounded-full backdrop-blur-sm transition-all">
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
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Hero */}
      <section className="page-hero py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 animate-fade-in-up">
            <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl md:text-5xl">Photo Gallery</h1>
              <p className="text-gold-light text-sm mt-1">Memories from our school life</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Album tabs */}
        <div className="flex items-center gap-3 flex-wrap mb-8 animate-fade-in-up">
          {albums.map(album => (
            <button
              key={album}
              onClick={() => setActiveAlbum(album)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeAlbum === album
                  ? 'bg-gradient-to-r from-navy to-gold text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gold/40 hover:text-navy'
                }`}
            >
              {album}
              <span className={`ml-1.5 text-xs ${activeAlbum === album ? 'text-white/70' : 'text-gray-400'}`}>
                ({album === 'All' ? allImages.length : allImages.filter(g => g.album === album).length})
              </span>
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Camera className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No photos in this album yet.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
            {filtered.map((img, idx) => (
              <div
                key={img.id}
                className="group relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-400 animate-fade-in"
                style={{ animationDelay: `${idx * 0.04}s` }}
                onClick={() => openLightbox(idx)}
              >
                {!imgErrors[img.id] ? (
                  <img
                    src={img.image_url}
                    alt={img.caption || 'Gallery'}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImgErrors(p => ({ ...p, [img.id]: true }))}
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-2">
                    <ImageOff className="h-8 w-8 text-gray-300" />
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center gap-2">
                  <ZoomIn className="h-8 w-8 text-white" />
                  {img.caption && <p className="text-white text-xs text-center px-3 leading-tight font-medium">{img.caption}</p>}
                  {img.album && <span className="badge badge-news text-[10px]">{img.album}</span>}
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
