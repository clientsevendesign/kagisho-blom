import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Lock, LogOut, Menu, X } from 'lucide-react';

const NAV_LINKS = ['about', 'stats', 'media', 'fixtures', 'community', 'contact'];

const Navbar = ({ theme, setTheme, player, isAuthenticated, onLogout, accentColor }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const nameParts = player?.name ? player.name.split(' ') : ['K', 'B'];
  const initials = (nameParts[0]?.[0] || '') + (nameParts[nameParts.length - 1]?.[0] || '');

  const isActive = (path) => location.pathname === `/${path}`;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b px-6 py-4 flex justify-between items-center ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white/80'
        }`}>
        {/* Logo */}
        <Link to="/" className={`font-black text-2xl tracking-tighter uppercase ${textColor}`} onClick={() => setOpen(false)}>
          {initials}<span className="text-sm italic ml-0.5" style={{ color: accentColor }}>{player?.jersey_number || '15'}</span>
        </Link>

        {/* Desktop nav */}
        <div className={`hidden md:flex gap-8 items-center text-[10px] font-bold uppercase tracking-widest ${textColor}`}>
          {NAV_LINKS.map(path => (
            <Link key={path} to={`/${path}`}
              className={`hover:opacity-100 transition ${isActive(path) ? 'opacity-100' : 'opacity-40'}`}
              style={isActive(path) ? { color: accentColor } : {}}>
              {path}
            </Link>
          ))}
          <div className={`h-4 w-px mx-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />
          {isAuthenticated ? (
            <button onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-current opacity-60 hover:opacity-100 transition"
              style={{ '--hover-color': accentColor }}>
              <LogOut size={10} /> Logout
            </button>
          ) : (
            <Link to="/login"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${isActive('login') ? 'text-white border-transparent' : 'border-current opacity-50 hover:opacity-100'}`}
              style={isActive('login') ? { backgroundColor: accentColor, borderColor: accentColor } : {}}>
              <Lock size={10} /> Login
            </Link>
          )}
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 opacity-60 hover:opacity-100 transition">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className={`p-2 opacity-60 ${textColor}`}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen(o => !o)} className={`p-2 ${textColor}`} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className={`fixed inset-0 z-40 pt-20 px-6 flex flex-col gap-2 md:hidden ${theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-white'
          }`}>
          {NAV_LINKS.map(path => (
            <Link key={path} to={`/${path}`}
              onClick={() => setOpen(false)}
              className={`py-4 border-b text-lg font-black uppercase tracking-widest transition ${theme === 'dark' ? 'border-white/5' : 'border-black/5'
                } ${isActive(path) ? '' : 'opacity-40'}`}
              style={isActive(path) ? { color: accentColor } : { color: theme === 'dark' ? 'white' : '#111' }}>
              {path}
            </Link>
          ))}
          <div className="mt-4">
            {isAuthenticated ? (
              <button onClick={() => { onLogout(); setOpen(false); }}
                className="flex items-center gap-3 py-4 text-lg font-black uppercase tracking-widest opacity-60"
                style={{ color: theme === 'dark' ? 'white' : '#111' }}>
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-4 text-lg font-black uppercase tracking-widest"
                style={{ color: accentColor }}>
                <Lock size={16} /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;