import React, { useState, memo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      window.location.href = '/';
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <nav className="fixed w-full z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <img src={logo} alt="AlcoZero Logo" className="h-8 w-8" />
                <span className="text-(--primary-blue) text-2xl font-bold">AlcoZero</span>
              </motion.div>
            </Link>
            <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed w-full z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <img src={logo} alt="AlcoZero Logo" className="h-8 w-8" />
              <span className="text-(--primary-blue) text-2xl font-bold">AlcoZero</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-(--primary-blue)'
                    : 'text-gray-300 hover:text-(--primary-blue)'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive('/dashboard')
                    ? 'text-(--primary-blue)'
                    : 'text-gray-300 hover:text-(--primary-blue)'
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
            {/* Theme toggle button */}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-(--primary-blue) focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-(--primary-blue)'
                      : 'text-gray-300 hover:text-(--primary-blue)'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'text-(--primary-blue)'
                      : 'text-gray-300 hover:text-(--primary-blue)'
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors text-left"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform duration-300 text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navbar);

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="ml-2 p-2 rounded-full bg-(--primary-blue)/10 hover:bg-(--primary-blue)/15 transition-colors"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-(--primary-blue)" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 5.22a1 1 0 011.415 0L6.64 6.22a1 1 0 11-1.414 1.415L4.22 6.636a1 1 0 010-1.415zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM5.22 14.78a1 1 0 010-1.415L6.636 12.36a1 1 0 111.415 1.414l-1.005 1.005a1 1 0 01-1.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.78 14.78a1 1 0 011.415 0l1.005 1.005a1 1 0 11-1.414 1.415l-1.005-1.005a1 1 0 010-1.415zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM14.78 5.22a1 1 0 010 1.415L13.36 7.636a1 1 0 11-1.415-1.414l1.005-1.005a1 1 0 011.415 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-(--primary-blue)" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}