import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-card border-t border-(--glass-border) mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
              🚗 AlcoZero
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              AlchoZero is an advanced alcohol detection system that automatically locks the engine 
              and alerts administrators in real-time, ensuring safer roads for everyone.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/LNCTGroupOfCollege/"
                className="text-gray-400 hover:text-neon-blue transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/lnct_group"
                className="text-gray-400 hover:text-neon-blue transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/lnct-group-of-colleges-bhopal/?originalSubdomain=in"
                className="text-gray-400 hover:text-neon-blue transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-neon-blue transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-neon-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help-center" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-neon-blue transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} AlcoZero. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Made with ❤️ for Safer Roads
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
