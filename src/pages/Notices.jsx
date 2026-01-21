import NoticeBoard from '../components/NoticeBoard'

function Notices() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-4 bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">
            All Notices & Announcements
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, announcements, and important information from our school.
          </p>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <NoticeBoard />
        </div>
      </div>
    </div>
  )
}

export default Notices
