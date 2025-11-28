import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const Contact = lazy(() => import('./pages/Contact'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./dashboard/Dashboard'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center app-bg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes with Navbar and Footer */}
        <Route path="/" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <Home />
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <About />
            <Footer />
          </div>
        } />
        <Route path="/features" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <Features />
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <Contact />
            <Footer />
          </div>
        } />
        <Route path="/help-center" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <HelpCenter />
            <Footer />
          </div>
        } />
        <Route path="/privacy-policy" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <PrivacyPolicy />
            <Footer />
          </div>
        } />
        <Route path="/terms-of-service" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <TermsOfService />
            <Footer />
          </div>
        } />
        <Route path="/faq" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <FAQ />
            <Footer />
          </div>
        } />
        
        {/* Auth routes with Navbar and Footer */}
        <Route path="/login" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <Login />
            <Footer />
          </div>
        } />
        <Route path="/signup" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <Signup />
            <Footer />
          </div>
        } />
        
        {/* Dashboard routes - WITH Navbar, NO Footer, full h-screen */}
        <Route path="/dashboard/*" element={
          <div className="min-h-screen app-bg">
            <Navbar />
            <Dashboard />
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
