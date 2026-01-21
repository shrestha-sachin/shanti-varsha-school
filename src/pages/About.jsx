import { User, BookOpen, Target } from 'lucide-react'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-4 bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">
            About Us
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Learn more about our school's mission, history, and commitment to excellence in education.
          </p>
        </div>

        {/* Principal's Message */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <User className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Principal's Message</span>
                </h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-4 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                  Welcome to Shanti Varsha Angreji Ma. Vi., a place where education meets excellence.
                  Our school is committed to providing quality education that nurtures young minds
                  and prepares them for the challenges of tomorrow.
                </p>
                <p className="text-lg leading-relaxed mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  At Shanti Varsha, we believe in holistic development. We strive to create an
                  environment where students can grow academically, socially, and emotionally. Our
                  dedicated faculty works tirelessly to ensure that every student receives the
                  attention and guidance they need to succeed.
                </p>
                <p className="text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  We are proud of our students' achievements and look forward to continuing our
                  journey of excellence in education.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* School History */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>School History</span>
                </h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  Shanti Varsha Angreji Ma. Vi. has been serving the community of Vyas-5, Chapaghat,
                  Damauli, Tanahun for many years. Established with a vision to provide quality
                  education to the local community, our school has grown to become a trusted
                  institution in the region.
                </p>
                <p className="text-lg leading-relaxed mb-4 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  Over the years, we have maintained our commitment to academic excellence while
                  adapting to the changing needs of education. Our school has produced numerous
                  successful graduates who have gone on to make significant contributions in various
                  fields.
                </p>
                <p className="text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                  Today, we continue to uphold our values and traditions while embracing modern
                  teaching methodologies and technologies to provide the best possible education
                  to our students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <Target className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Our Mission</span>
                </h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-4 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  Our mission is to provide a nurturing and stimulating learning environment that
                  enables students to:
                </p>
                <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 ml-4">
                  <li className="animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>Achieve academic excellence through quality education</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>Develop critical thinking and problem-solving skills</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>Cultivate values of respect, integrity, and responsibility</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>Foster creativity and innovation</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'both' }}>Prepare for higher education and future careers</li>
                  <li className="animate-fade-in-up" style={{ animationDelay: '1.1s', animationFillMode: 'both' }}>Contribute positively to society</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
