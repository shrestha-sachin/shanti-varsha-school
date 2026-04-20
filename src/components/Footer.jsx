import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react'
import { useSchoolSettings } from '../hooks/useSchoolSettings'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    const subs = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]')
    if (!subs.includes(email.trim())) {
      subs.push(email.trim())
      localStorage.setItem('newsletterSubscribers', JSON.stringify(subs))
    }
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/notices', label: 'Notice Board' },
    { path: '/news', label: 'News & Updates' },
    { path: '/calendar', label: 'Academic Calendar' },
    { path: '/gallery', label: 'Photo Gallery' },
    { path: '/contact', label: 'Contact Us' },
  ]

  const settings = useSchoolSettings()

  const contactInfo = [
    { icon: MapPin, text: settings.address },
    { icon: Phone, text: settings.phone },
    { icon: Mail, text: settings.email },
  ]

  const socials = [
    { icon: Facebook, href: settings.facebook, label: 'Facebook', color: 'hover:text-gold' },
    { icon: Instagram, href: settings.instagram, label: 'Instagram', color: 'hover:text-gold' },
    { icon: Youtube, href: settings.youtube, label: 'YouTube', color: 'hover:text-gold' },
  ]

  return (
    <footer className="bg-navy-darker text-white border-t-2 border-gold/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-light rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* School Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-5">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <GraduationCap className="h-7 w-7 text-navy" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm leading-tight">{settings.name ? settings.name.split(' ').slice(0, 2).join(' ') : 'Shanti Varsha'}</p>
                <p className="text-gold text-xs">{settings.name ? settings.name.split(' ').slice(2).join(' ') : 'Angreji Ma. Vi.'}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Committed to providing quality education that nurtures young minds and prepares them for the future with excellence.
            </p>
            <div className="flex items-center space-x-3">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`text-gray-400 ${color} transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-white/10`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-display font-bold text-white mb-5 relative">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold rounded-full" />
            </h3>
            <ul className="space-y-2.5 mt-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-gold transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-display font-bold text-white mb-5 relative">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold rounded-full" />
            </h3>
            <ul className="space-y-4 mt-4">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start space-x-3">
                  <div className="bg-gold/10 p-2 rounded-lg flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <span className="text-gray-400 text-sm leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-base font-display font-bold text-white mb-5 relative">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold rounded-full" />
            </h3>
            <p className="text-gray-400 text-sm mb-4 mt-4">
              Subscribe to get the latest notices and news from our school.
            </p>
            {subscribed ? (
              <div className="bg-success/20 border border-success/40 rounded-xl px-4 py-3 text-success text-sm font-medium animate-fade-in flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold/60 focus:bg-white/15 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold to-gold-light text-white py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
