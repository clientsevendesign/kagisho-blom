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
import Fixtures from './pages/fixtures';
import Community from './pages/community';
import CRM from './pages/crm';
import Chatbot from './components/chatbot';
import NotFound from './pages/notfound';

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

const fallbackPlayer = {
  name: 'Kagisho Blom', club: 'Kimberley United FC', position: 'Midfielder',
  nationality: 'South African', age: 19, height: '', weight: '',
  preferred_foot: 'Right', jersey_number: '15', work_rate: 'High/High',
  goals: 6, assists: 4, recoveries: '8.1', pass_accuracy: '87%',
  shot_conversion: '18%', dribble_success: '64%', chances_created: '12',
  sprint_speed: '34.2 km/h', avg_distance: '11.4 km', sprints_per_match: '28',
  whatsapp: '0634133628', email: '', phone: '', instagram: '', facebook: '',
  bio: 'Professional footballer profile currently loading.',
  cv_summary: 'Professional footballer profile prepared for scouts, clubs, and representatives.',
  achievements: '', highlight_title_1: 'Season Highlights 2025/26',
  highlight_url_1: '', highlight_duration_1: '4:15',
  highlight_title_2: 'Defensive Masterclass', highlight_url_2: '', highlight_duration_2: '3:40',
  is_available: 1,
};

const CRM_TOKEN_KEY = 'crm_token';
const getCrmToken = () => sessionStorage.getItem(CRM_TOKEN_KEY);
const setCrmToken = (t) => sessionStorage.setItem(CRM_TOKEN_KEY, t);
const clearCrmToken = () => sessionStorage.removeItem(CRM_TOKEN_KEY);

axios.interceptors.request.use((config) => {
  const token = getCrmToken();
  if (token) config.headers['x-crm-token'] = token;
  return config;
});

const App = () => {
  const [player, setPlayer] = useState(null);
  const [settings, setSettings] = useState({ accent_color: 'red' });
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getCrmToken()));
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => { fetchPlayerData(); fetchSettings(); }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Inject accent colour into CSS variable
    const accent = settings.accent_color === 'blue' ? '#0ea5e9' : '#e10600';
    document.documentElement.style.setProperty('--site-accent', accent);
    document.documentElement.setAttribute('data-accent', settings.accent_color || 'red');
  }, [settings.accent_color]);

  const fetchPlayerData = async () => {
    try {
      const res = await axios.get('/api/player');
      setPlayer({ ...fallbackPlayer, ...(res.data || {}) });
    } catch { setPlayer(fallbackPlayer); }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      setSettings(res.data || {});
    } catch { /* use defaults */ }
  };

  const handleLogin = async (password) => {
    const res = await axios.post('/api/auth', { password });
    setCrmToken(res.data.token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => { clearCrmToken(); setIsAuthenticated(false); };

  const accentColor = settings.accent_color === 'blue' ? '#0ea5e9' : '#e10600';

  if (!player) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
      <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
    </div>
  );

  const sharedProps = { player, theme, accentColor, settings };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-white'}`}>
        <Navbar theme={theme} setTheme={setTheme} player={player} isAuthenticated={isAuthenticated} onLogout={handleLogout} accentColor={accentColor} />
        <main className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home      {...sharedProps} />} />
            <Route path="/about" element={<About     {...sharedProps} />} />
            <Route path="/stats" element={<Stats     {...sharedProps} />} />
            <Route path="/media" element={<Media     {...sharedProps} />} />
            <Route path="/fixtures" element={<Fixtures  {...sharedProps} />} />
            <Route path="/community" element={<Community {...sharedProps} />} />
            <Route path="/contact" element={<Contact   {...sharedProps} setHasSubmitted={setHasSubmitted} />} />
            <Route path="/thank-you" element={hasSubmitted ? <ThankYou theme={theme} accentColor={accentColor} /> : <Navigate to="/contact" />} />
            <Route path="/login" element={
              isAuthenticated
                ? <CRM {...sharedProps} refreshData={fetchPlayerData} refreshSettings={fetchSettings} onLogout={handleLogout} />
                : <AdminLogin onLogin={handleLogin} theme={theme} accentColor={accentColor} />
            } />
            <Route path="*" element={<NotFound theme={theme} accentColor={accentColor} />} />
          </Routes>
        </main>
        <Chatbot theme={theme} accentColor={accentColor} player={player} />
        <Footer player={player} theme={theme} accentColor={accentColor} />
      </div>
    </Router>
  );
};

const AdminLogin = ({ onLogin, theme, accentColor }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await onLogin(password); }
    catch { setError('Invalid access key. Please try again.'); setPassword(''); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <form onSubmit={handleSubmit} className={`p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/10 shadow-xl'}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: accentColor }}>Login</p>
        <h2 className={`text-3xl font-black uppercase mb-6 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Player Access</h2>
        <input type="password" autoComplete="current-password" placeholder="Access Key" value={password}
          onChange={e => setPassword(e.target.value)}
          className={`w-full p-4 rounded-xl mb-4 bg-transparent border outline-none ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}
          style={{ borderColor: `${accentColor}4D` }} />
        {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-4 text-white font-bold rounded-xl uppercase disabled:opacity-50 transition hover:brightness-110"
          style={{ backgroundColor: accentColor }}>
          {loading ? 'Verifying…' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default App;