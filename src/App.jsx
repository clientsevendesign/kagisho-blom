import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import About from './pages/about';
import Stats from './pages/stats';
import Media from './pages/media';
import Contact from './pages/contact';
import ThankYou from './pages/thankyou';
import CRM from './pages/crm';

const fallbackPlayer = {
  name: 'Kagisho Blom',
  club: 'Offline Mode',
  goals: 0,
  assists: 0,
  recoveries: '0',
  age: 26,
  position: 'Midfielder',
  pass_accuracy: '0%',
  whatsapp: '27720000000',
  jersey_number: '15',
  work_rate: 'High/High',
  nationality: 'South African',
  preferred_foot: 'Right',
  bio: 'Professional footballer profile currently loading local data.',
  cv_summary: 'Professional footballer profile prepared for scouts, clubs, and representatives.',
  is_available: 1
};

const App = () => {
  const [player, setPlayer] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('crm_auth') === 'true'
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchPlayerData = async () => {
    try {
      const res = await axios.get('/api/player');
      setPlayer({ ...fallbackPlayer, ...(res.data || {}) });
    } catch {
      setPlayer(fallbackPlayer);
    }
  };

  const handleLogin = () => {
    sessionStorage.setItem('crm_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('crm_auth');
    setIsAuthenticated(false);
  };

  if (!player) return null;

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-white'}`}>
        <Navbar
          theme={theme}
          setTheme={setTheme}
          player={player}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
        <main className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home player={player} theme={theme} />} />
            <Route path="/about" element={<About player={player} theme={theme} />} />
            <Route path="/stats" element={<Stats player={player} theme={theme} />} />
            <Route path="/media" element={<Media player={player} theme={theme} />} />
            <Route path="/contact" element={<Contact player={player} theme={theme} setHasSubmitted={setHasSubmitted} />} />
            <Route path="/thank-you" element={hasSubmitted ? <ThankYou theme={theme} /> : <Navigate to="/contact" />} />
            <Route path="/login" element={
              isAuthenticated ?
                <Login player={player} theme={theme} refreshData={fetchPlayerData} /> :
                <AdminLogin setIsAuthenticated={setIsAuthenticated} theme={theme} />
            } />
          </Routes>
        </main>
        <Footer player={player} theme={theme} />
      </div>
    </Router>
  );
};

const AdminLogin = ({ onLogin, theme }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const checkKey = (e) => {
    e.preventDefault();
    if (key === 'blom22') {
      onLogin();
    } else {
      setError('Invalid access key. Please try again.');
      setKey('');
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <form onSubmit={checkKey} className={`p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/10 shadow-xl'}`}>
        <p className="text-soccer-red text-[10px] font-black uppercase tracking-[0.35em] mb-3">CRM Login</p>
        <h2 className={`text-3xl font-black uppercase mb-6 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Admin Access</h2>
        <input type="password" autoComplete="current-password" placeholder="Access Key" className={`w-full p-4 rounded-xl mb-4 bg-transparent border border-soccer-red/30 outline-none ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`} onChange={(e) => setKey(e.target.value)} />
        <button className="w-full py-4 bg-soccer-red text-white font-bold rounded-xl uppercase">Open CRM</button>
      </form>
    </div>
  );
};

export default App;
