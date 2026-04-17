import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Phone } from 'lucide-react';

const Footer = ({ player, theme, accentColor }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const subTextColor = theme === 'dark' ? 'text-white/30' : 'text-neutral-500';
  const ac = accentColor || '#e10600';

  return (
    <footer className={`mt-20 border-t py-12 px-6 md:px-12 ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">

        {/* Name + copyright */}
        <div className="text-center md:text-left">
          <Link to="/" className={`font-black text-2xl uppercase tracking-tighter mb-1 block ${textColor}`}>
            {player.name}
          </Link>
          <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${subTextColor}`}>
            © {new Date().getFullYear()} Athlete
          </p>
        </div>

        {/* Nav links */}
        <div className={`hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>
          {['about', 'stats', 'media', 'fixtures', 'community', 'contact'].map(path => (
            <Link key={path} to={`/${path}`} className="hover:opacity-100 transition capitalize"
              onMouseEnter={e => e.target.style.color = ac}
              onMouseLeave={e => e.target.style.color = ''}>
              {path}
            </Link>
          ))}
        </div>

        {/* Social icons */}
        <div className={`flex gap-8 items-center ${subTextColor}`}>
          {player.instagram && (
            <a href={player.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
              className="transition hover:opacity-100"
              onMouseEnter={e => e.currentTarget.style.color = ac}
              onMouseLeave={e => e.currentTarget.style.color = ''}>
              <Camera size={18} />
            </a>
          )}
          {player.facebook && (
            <a href={player.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
              className="transition hover:opacity-100"
              onMouseEnter={e => e.currentTarget.style.color = ac}
              onMouseLeave={e => e.currentTarget.style.color = ''}>
              <span className="text-sm font-black">f</span>
            </a>
          )}
          {player.whatsapp && (
            <a href={`https://wa.me/${player.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"
              className="transition hover:opacity-100"
              onMouseEnter={e => e.currentTarget.style.color = ac}
              onMouseLeave={e => e.currentTarget.style.color = ''}>
              <Phone size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
