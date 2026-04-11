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
import Login from './pages/login';

const App = () => {
  const [player, setPlayer] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    fetchPlayerData();
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchPlayerData = () => {
    axios.get('http://localhost:3001/api/player')
      .then(res => setPlayer(res.data || {}))
      .catch(() => setPlayer({ name: "Kagisho Blom", club: "Offline Mode" }));
  };

  if (!player) return null;

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-white'}`}>
        <Navbar theme={theme} setTheme={setTheme} player={player} />
        <main className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home player={player} theme={theme} />} />
            <Route path="/about" element={<About player={player} theme={theme} />} />
            <Route path="/stats" element={<Stats player={player} theme={theme} />} />
            <Route path="/media" element={<Media player={player} theme={theme} />} />
            
            {/* Contact page now sets hasSubmitted upon success */}
            <Route path="/contact" element={<Contact player={player} theme={theme} setHasSubmitted={setHasSubmitted} />} />
            
            {/* Restricted: Only accessible after form submission */}
            <Route path="/thank-you" element={hasSubmitted ? <ThankYou theme={theme} /> : <Navigate to="/contact" />} />
            
            {/* Restricted CRM: Requires Login */}
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

// Password Gate for CRM
const AdminLogin = ({ setIsAuthenticated, theme }) => {
  const [key, setKey] = useState("");
  const checkKey = (e) => {
    e.preventDefault();
    if (key === "blom22") setIsAuthenticated(true);
    else alert("Access Denied");
  };
  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <form onSubmit={checkKey} className={`p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
        <h2 className="text-2xl font-black uppercase mb-6">Admin Access</h2>
        <input type="password" placeholder="Access Key" className="w-full p-4 rounded-xl mb-4 bg-transparent border border-soccer-red/30 outline-none" onChange={(e) => setKey(e.target.value)} />
        <button className="w-full py-4 bg-soccer-red text-white font-bold rounded-xl uppercase">Authorize</button>
      </form>
    </div>
  );
};

export default App;