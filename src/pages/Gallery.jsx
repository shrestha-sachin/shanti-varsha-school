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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center text-navy mb-12">Gallery</h1>
      {galleryImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={`/gallery/${image}`}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderImages.map((num) => (
              <div
                key={num}
                className="aspect-square bg-gradient-to-br from-navy to-blue-900 rounded-lg shadow-md flex items-center justify-center text-white text-4xl font-bold"
              >
                <span className="opacity-50">Image {num}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">
            To add gallery images, place them in the <code className="bg-gray-100 px-2 py-1 rounded">public/gallery/</code> folder
            and update the <code className="bg-gray-100 px-2 py-1 rounded">galleryImages</code> array in Gallery.jsx
          </p>
        </>
      )}
    </div>
  )
}

export default Gallery
