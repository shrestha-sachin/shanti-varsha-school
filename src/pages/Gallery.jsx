import { Image as ImageIcon } from 'lucide-react'

function Gallery() {
  // Add your image filenames here (e.g., ['image1.jpg', 'image2.jpg', ...])
  // Images should be placed in the public/gallery/ folder
  const galleryImages = [
    // 'gallery1.jpg',
    // 'gallery2.jpg',
    // 'gallery3.jpg',
    // Add more image filenames as needed
  ]

  // Placeholder gallery if no images are added
  const placeholderImages = Array.from({ length: 9 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-4 bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">
            Gallery
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore moments from our school events, activities, and celebrations.
          </p>
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group aspect-square rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border-2 border-gray-100 hover:border-gold/40 animate-scale-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'both' }}
              >
                <img
                  src={`/gallery/${image}`}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderImages.map((num, index) => (
              <div
                key={num}
                className="group aspect-square bg-gradient-to-br from-navy via-navy-dark to-blue-900 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border-2 border-gray-100 hover:border-gold/40 animate-scale-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <ImageIcon className="h-16 w-16 mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 relative z-10" />
                <span className="text-2xl font-bold opacity-50 group-hover:opacity-100 transition-opacity duration-500 relative z-10">Image {num}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-12 text-lg animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
            To add gallery images, place them in the <code className="bg-gray-100 px-2 py-1 rounded border border-gold/20">public/gallery/</code> folder
            and update the <code className="bg-gray-100 px-2 py-1 rounded border border-gold/20">galleryImages</code> array in Gallery.jsx
          </p>
        </>
      )}
      </div>
    </div>
  )
}

export default Gallery
