import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Lock } from 'lucide-react';

const Navbar = ({ theme, setTheme, player }) => {
  const location = useLocation();
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';

  const nameParts = player?.name ? player.name.split(' ') : ["N", "J"];
  const initials = (nameParts[0]?.[0] || "") + (nameParts[nameParts.length - 1]?.[0] || "");

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b px-6 py-4 flex justify-between items-center ${
      theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white/20'
    }`}>
      <Link to="/" className={`font-black text-2xl tracking-tighter uppercase ${textColor}`}>
        {initials}<span className="text-soccer-red text-sm italic">15</span>
      </Link>

      <div className={`hidden md:flex gap-8 items-center text-[10px] font-bold uppercase tracking-widest ${textColor}`}>
        {/* Updated mapping to include 'stats' */}
        {['about', 'stats', 'media', 'contact'].map(path => (
          <Link 
            key={path} 
            to={`/${path}`} 
            className={`hover:text-soccer-red transition ${
              location.pathname === `/${path}` ? 'text-soccer-red' : 'opacity-50'
            }`}
          >
            {path}
          </Link>
        ))}

        <div className={`h-4 w-[1px] mx-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />
        
        <Link to="/login" className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
          location.pathname === '/login' ? 'bg-soccer-red text-white border-soccer-red' : 'border-current opacity-50 hover:opacity-100'
        }`}>
          <Lock size={10} /> <span>Login</span>
        </Link>
        
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;