import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './dashboard/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with Navbar and Footer */}
          <Route path="/" element={
            <div className="min-h-screen bg-[#0a0a0a] text-white">
              <Navbar />
              <Home />
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="min-h-screen bg-[#0a0a0a] text-white">
              <Navbar />
              <About />
              <Footer />
            </div>
          } />
          <Route path="/features" element={
            <div className="min-h-screen bg-[#0a0a0a] text-white">
              <Navbar />
              <Features />
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div className="min-h-screen bg-[#0a0a0a] text-white">
              <Navbar />
              <Contact />
              <Footer />
            </div>
          } />
          
          {/* Auth routes with Navbar and Footer */}
          <Route path="/login" element={
            <div className="min-h-screen bg-[#0a0a0a] text-white">
              <Navbar />
              <Login />
              <Footer />
            </div>
          } />
          <Route path="/signup" element={
            <div className="min-h-screen bg-[#0a0a0a] text-white">
              <Navbar />
              <Signup />
              <Footer />
            </div>
          } />
          
          {/* Dashboard routes - NO Navbar/Footer, full h-screen */}
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
