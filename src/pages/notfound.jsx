import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import heroImg from '../assets/hero.png';

const NotFound = ({ theme, accentColor }) => {
  const location = useLocation();
  const ac       = accentColor || '#e10600';
  const isDark   = theme === 'dark';
  const textColor  = isDark ? 'text-white'    : 'text-neutral-900';
  const mutedColor = isDark ? 'text-white/40' : 'text-neutral-500';

  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame;
    const start = Date.now();
    const duration = 900;
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 404));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const NAV_LINKS = [
    { to: '/',          label: 'Home' },
    { to: '/about',     label: 'About' },
    { to: '/stats',     label: 'Stats' },
    { to: '/fixtures',  label: 'Fixtures' },
    { to: '/media',     label: 'Media' },
    { to: '/community', label: 'Community' },
    { to: '/contact',   label: 'Contact' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20"
    >
      {/* Giant 404 with photo */}
      <div className="relative mb-8 select-none">
        <motion.p
          className="text-[clamp(120px,25vw,220px)] font-black leading-none tabular-nums"
          style={{ color: `${ac}18` }}
        >
          {String(count).padStart(3, '0')}
        </motion.p>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 18 }}
        >
          <div className="relative">
            <img
              src={heroImg}
              alt="Kagisho Blom"
              className="w-28 h-28 rounded-full object-cover shadow-2xl"
              style={{ border: `4px solid ${ac}` }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white"
              style={{ backgroundColor: ac }}
            >
              ⚽
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 mb-10"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: ac }}>
          Off the Pitch
        </p>
        <h1 className={`text-4xl md:text-5xl font-black uppercase leading-tight ${textColor}`}>
          Page Not Found
        </h1>
        <p className={`text-sm max-w-sm mx-auto leading-relaxed ${mutedColor}`}>
          Looks like this ball went out of bounds.
          {location.pathname !== '/' && (
            <> The page <code className={`text-xs px-1.5 py-0.5 rounded mx-1 font-mono ${isDark ? 'bg-white/10' : 'bg-black/8'}`}>{location.pathname}</code> does not exist.</>
          )}
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap items-center justify-center gap-3 mb-14"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest hover:brightness-110 transition shadow-lg"
          style={{ backgroundColor: ac }}
        >
          <Home size={15} /> Back Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className={`inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest border transition ${
            isDark ? 'border-white/10 text-white/50 hover:text-white hover:border-white/30' : 'border-black/10 text-neutral-500 hover:text-neutral-900 hover:border-black/25'
          }`}
        >
          <ArrowLeft size={15} /> Go Back
        </button>
      </motion.div>

      {/* Quick nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <p className={`text-[10px] font-black uppercase tracking-[0.35em] ${mutedColor}`}>
          Quick Links
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition ${
                isDark
                  ? 'border-white/8 text-white/40 hover:text-white hover:border-white/25'
                  : 'border-black/8 text-neutral-500 hover:text-neutral-900 hover:border-black/20'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
