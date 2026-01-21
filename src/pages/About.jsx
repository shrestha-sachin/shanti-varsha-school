import { useState } from 'react'
import { User, BookOpen, Target, Users, GraduationCap, Award, Quote } from 'lucide-react'

function About() {
  const [imageErrors, setImageErrors] = useState({})

  // Management Committee Members
  const managementCommittee = [
    { id: 1, name: 'Chairperson Name', position: 'Chairperson', image: '/images/management/chairperson.jpg' },
    { id: 2, name: 'Vice Chairperson Name', position: 'Vice Chairperson', image: '/images/management/vice-chairperson.jpg' },
    { id: 3, name: 'Secretary Name', position: 'Secretary', image: '/images/management/secretary.jpg' },
    { id: 4, name: 'Treasurer Name', position: 'Treasurer', image: '/images/management/treasurer.jpg' },
    { id: 5, name: 'Member Name 1', position: 'Committee Member', image: '/images/management/member1.jpg' },
    { id: 6, name: 'Member Name 2', position: 'Committee Member', image: '/images/management/member2.jpg' },
  ]

  // Teachers and Staff
  const teachers = [
    { id: 1, name: 'Teacher Name 1', subject: 'Mathematics', image: '/images/teachers/teacher1.jpg' },
    { id: 2, name: 'Teacher Name 2', subject: 'Science', image: '/images/teachers/teacher2.jpg' },
    { id: 3, name: 'Teacher Name 3', subject: 'English', image: '/images/teachers/teacher3.jpg' },
    { id: 4, name: 'Teacher Name 4', subject: 'Social Studies', image: '/images/teachers/teacher4.jpg' },
    { id: 5, name: 'Teacher Name 5', subject: 'Nepali', image: '/images/teachers/teacher5.jpg' },
    { id: 6, name: 'Teacher Name 6', subject: 'Computer Science', image: '/images/teachers/teacher6.jpg' },
  ]

  // Parents and Stakeholders Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Parent Name 1',
      role: 'Parent of Student Name',
      message: 'Shanti Varsha Angreji Ma. Vi. has provided excellent education to my child. The teachers are dedicated, and the school environment is nurturing. I am very satisfied with the quality of education and the overall development of my child.',
      image: '/images/testimonials/parent1.jpg'
    },
    {
      id: 2,
      name: 'Stakeholder Name 1',
      role: 'Community Leader',
      message: 'The school has been a pillar of educational excellence in our community. The management and staff work tirelessly to ensure quality education. The achievements of the students speak volumes about the school\'s commitment.',
      image: '/images/testimonials/stakeholder1.jpg'
    },
    {
      id: 3,
      name: 'Parent Name 2',
      role: 'Parent of Student Name',
      message: 'I am impressed by the holistic approach to education at Shanti Varsha. The school not only focuses on academics but also on character building and overall personality development. My child has grown tremendously here.',
      image: '/images/testimonials/parent2.jpg'
    },
  ]

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
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
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

        {/* Management Committee */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <Users className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Management Committee</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {managementCommittee.map((member, index) => (
                  <div
                    key={member.id}
                    className="group card-3d magnetic hover-lift bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-gold/40 animate-scale-in glow-border"
                    style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <div className="mb-4 relative">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                        {!imageErrors[`management-${member.id}`] ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => setImageErrors(prev => ({ ...prev, [`management-${member.id}`]: true }))}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white group-hover:scale-110 transition-transform duration-500">
                            <User className="h-16 w-16" />
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-1 group-hover:text-gold transition-colors duration-300">{member.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{member.position}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Teachers and Staff */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <GraduationCap className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Our Teachers & Staff</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {teachers.map((teacher, index) => (
                  <div
                    key={teacher.id}
                    className="group card-3d magnetic hover-lift bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-gold/40 animate-scale-in glow-border"
                    style={{ animationDelay: `${0.7 + index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <div className="mb-4 relative">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                        {!imageErrors[`teacher-${teacher.id}`] ? (
                          <img
                            src={teacher.image}
                            alt={teacher.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => setImageErrors(prev => ({ ...prev, [`teacher-${teacher.id}`]: true }))}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white group-hover:scale-110 transition-transform duration-500">
                            <GraduationCap className="h-16 w-16" />
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-1 group-hover:text-gold transition-colors duration-300">{teacher.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{teacher.subject}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Parents and Stakeholders Testimonials */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl shadow-lg">
                  <Quote className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-bold text-navy flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Parents & Stakeholders Messages</span>
                </h2>
              </div>
              <div className="space-y-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="group card-3d magnetic hover-lift bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 hover:border-gold/40 hover:shadow-xl transition-all duration-500 animate-scale-in glow-border"
                    style={{ animationDelay: `${0.8 + index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      {/* Photo on the side */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-gold/30 via-gold/20 to-navy/20 flex items-center justify-center overflow-hidden border-4 border-gold/40 shadow-xl group-hover:border-gold transition-all duration-500 group-hover:shadow-gold/50 relative">
                          {!imageErrors[`testimonial-${testimonial.id}`] ? (
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={() => setImageErrors(prev => ({ ...prev, [`testimonial-${testimonial.id}`]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark text-white group-hover:scale-110 transition-transform duration-500">
                              <User className="h-20 w-20" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Message content */}
                      <div className="flex-1">
                        <div className="mb-4">
                          <Quote className="h-8 w-8 text-gold/60 mb-2" />
                          <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">
                            "{testimonial.message}"
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-lg font-bold text-navy mb-1">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600 font-medium">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
