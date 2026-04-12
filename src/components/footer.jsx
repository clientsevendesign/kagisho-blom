import React from 'react';
import { Camera, Phone } from 'lucide-react';

const Footer = ({ player, theme }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const subTextColor = theme === 'dark' ? 'text-white/30' : 'text-neutral-500';

  return (
    <footer className={`mt-20 border-t py-12 px-6 md:px-12 ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-center md:text-left">
          <h4 className={`font-black text-2xl uppercase tracking-tighter mb-1 ${textColor}`}>
            {player.name}
          </h4>
          <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${subTextColor}`}>
            © {new Date().getFullYear()} Athlete Profile
          </p>
        </div>
        <div className={`flex gap-10 items-center ${subTextColor}`}>
          {player.instagram && (
            <a href={player.instagram} target="_blank" rel="noreferrer" className="hover:text-soccer-red transition" aria-label="Instagram">
              <Camera size={18} />
            </a>
          )}
          {player.facebook && (
            <a href={player.facebook} target="_blank" rel="noreferrer" className="hover:text-soccer-red transition" aria-label="Facebook">
              <span className="text-sm font-black">f</span>
            </a>
          )}
          {player.whatsapp && (
            <a href={`https://wa.me/${player.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-soccer-red transition" aria-label="WhatsApp">
              <Phone size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
