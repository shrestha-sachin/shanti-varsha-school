import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto border-t-2 border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Address Section */}
          <div>
            <h3 className="text-xl font-bold text-gold mb-6">Address</h3>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
              <p className="text-gray-300 leading-relaxed">
                Vyas-5, Chapaghat<br />
                Damauli, Tanahun<br />
                Nepal
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About Us' },
                { path: '/notices', label: 'Notices' },
                { path: '/calendar', label: 'Calendar' },
                { path: '/gallery', label: 'Gallery' },
                { path: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div>
            <h3 className="text-xl font-bold text-gold mb-6">Connect With Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <span className="text-gray-300">+977-XXXXXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <span className="text-gray-300">info@shantivarsha.edu.np</span>
              </div>
              <div className="flex items-center space-x-4 mt-6">
                <a
                  href="#"
                  className="text-gray-300 hover:text-gold transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gold transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gold/30 mt-12 pt-8 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} Shanti Varsha Angreji Ma. Vi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
