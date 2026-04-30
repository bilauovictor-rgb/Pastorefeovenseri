/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { BackToTop } from './components/BackToTop';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Chatbot } from './components/Chatbot';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const SermonDetail = lazy(() => import('./pages/SermonDetail').then(module => ({ default: module.SermonDetail })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const SignIn = lazy(() => import('./pages/SignIn').then(module => ({ default: module.SignIn })));
const SignUp = lazy(() => import('./pages/SignUp').then(module => ({ default: module.SignUp })));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-bg-midnight flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-accent-gold-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="font-sans antialiased flex flex-col min-h-screen layered-wave-bg">
      <div className="wave-container">
        <div className="wave-layer wave-middle"></div>
        <div className="wave-layer wave-top"></div>
      </div>
      {!isAdminPage && <Navbar />}
      <main className={`flex-grow ${!isAdminPage ? 'pt-20' : ''}`}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/resources/:category" element={<Blog />} />
            <Route path="/resources/sermons/:slug" element={<SermonDetail />} />
            <Route path="/resources/sermon/:id" element={<SermonDetail />} />
            <Route path="/blog/:id" element={<SermonDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <BackToTop />}
      {!isAdminPage && <VoiceAssistant />}
      {!isAdminPage && <Chatbot />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
