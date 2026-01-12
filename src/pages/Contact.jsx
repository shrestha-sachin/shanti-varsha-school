import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, User, MessageSquare, Send, CheckCircle } from 'lucide-react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-4 bg-gradient-to-r from-navy to-navy-dark bg-clip-text text-transparent">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500">
              <h2 className="text-3xl font-bold text-navy mb-8 flex items-center space-x-3">
                <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                <span>Get in Touch</span>
              </h2>
              
              <div className="space-y-6">
                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-300 cursor-pointer">
                  <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110">
                    <MapPin className="h-6 w-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy mb-2 group-hover:text-gold transition-colors">Address</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Vyas-5, Chapaghat<br />
                      Damauli, Tanahun<br />
                      Nepal
                    </p>
                  </div>
                </div>

                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-300 cursor-pointer">
                  <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110">
                    <Phone className="h-6 w-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy mb-2 group-hover:text-gold transition-colors">Phone</h3>
                    <a href="tel:+977XXXXXXXX" className="text-gray-700 hover:text-gold transition-colors">
                      +977-XXXXXXXX
                    </a>
                  </div>
                </div>

                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-300 cursor-pointer">
                  <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110">
                    <Mail className="h-6 w-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy mb-2 group-hover:text-gold transition-colors">Email</h3>
                    <a href="mailto:info@shantivarsha.edu.np" className="text-gray-700 hover:text-gold transition-colors break-all">
                      info@shantivarsha.edu.np
                    </a>
                  </div>
                </div>

                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-300">
                  <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110">
                    <Clock className="h-6 w-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy mb-2 group-hover:text-gold transition-colors">Office Hours</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Sunday - Friday: 9:00 AM - 4:00 PM<br />
                      Saturday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-navy mb-8 flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                  <span>Send us a Message</span>
                </h2>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center space-x-3 animate-fade-in-up">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 font-medium">Thank you! Your message has been sent successfully.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2 flex items-center space-x-2">
                      <User className="h-4 w-4 text-gold" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 bg-gray-50/50 focus:bg-white group-hover:border-gold/50"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2 flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gold" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 bg-gray-50/50 focus:bg-white group-hover:border-gold/50"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label htmlFor="subject" className="block text-sm font-semibold text-navy mb-2 flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-gold" />
                      <span>Subject</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 bg-gray-50/50 focus:bg-white group-hover:border-gold/50"
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2 flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-gold" />
                      <span>Message</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 bg-gray-50/50 focus:bg-white resize-none group-hover:border-gold/50"
                      placeholder="Tell us more about your inquiry..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-gradient-to-r from-gold to-gold-light text-white py-4 rounded-xl font-bold text-lg hover:from-gold-light hover:to-gold transition-all duration-500 shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 transform hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
