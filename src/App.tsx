/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Blog } from './pages/Blog';
import { SermonDetail } from './pages/SermonDetail';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ScrollToTop } from './components/ScrollToTop';
import { BackToTop } from './components/BackToTop';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Chatbot } from './components/Chatbot';

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
