import { User, BookOpen, Target } from 'lucide-react'

function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center text-navy mb-12">About Us</h1>

      {/* Principal's Message */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-8 w-8 text-gold" />
            <h2 className="text-3xl font-bold text-navy">Principal's Message</h2>
          </div>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-4">
              Welcome to Shanti Varsha Angreji Ma. Vi., a place where education meets excellence.
              Our school is committed to providing quality education that nurtures young minds
              and prepares them for the challenges of tomorrow.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              At Shanti Varsha, we believe in holistic development. We strive to create an
              environment where students can grow academically, socially, and emotionally. Our
              dedicated faculty works tirelessly to ensure that every student receives the
              attention and guidance they need to succeed.
            </p>
            <p className="text-lg leading-relaxed">
              We are proud of our students' achievements and look forward to continuing our
              journey of excellence in education.
            </p>
          </div>
        </div>
      </section>

      {/* School History */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="h-8 w-8 text-gold" />
            <h2 className="text-3xl font-bold text-navy">School History</h2>
          </div>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-4">
              Shanti Varsha Angreji Ma. Vi. has been serving the community of Vyas-5, Chapaghat,
              Damauli, Tanahun for many years. Established with a vision to provide quality
              education to the local community, our school has grown to become a trusted
              institution in the region.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Over the years, we have maintained our commitment to academic excellence while
              adapting to the changing needs of education. Our school has produced numerous
              successful graduates who have gone on to make significant contributions in various
              fields.
            </p>
            <p className="text-lg leading-relaxed">
              Today, we continue to uphold our values and traditions while embracing modern
              teaching methodologies and technologies to provide the best possible education
              to our students.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="h-8 w-8 text-gold" />
            <h2 className="text-3xl font-bold text-navy">Our Mission</h2>
          </div>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-4">
              Our mission is to provide a nurturing and stimulating learning environment that
              enables students to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 ml-4">
              <li>Achieve academic excellence through quality education</li>
              <li>Develop critical thinking and problem-solving skills</li>
              <li>Cultivate values of respect, integrity, and responsibility</li>
              <li>Foster creativity and innovation</li>
              <li>Prepare for higher education and future careers</li>
              <li>Contribute positively to society</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
