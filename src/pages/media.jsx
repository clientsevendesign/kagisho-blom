import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Image, Award, Film, X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const CATEGORIES = [
  { id: 'all',         label: 'All' },
  { id: 'photo',       label: 'Photos' },
  { id: 'video',       label: 'Videos' },
  { id: 'certificate', label: 'Certificates' },
  { id: 'press',       label: 'Press' },
];

const Media = ({ player, theme, accentColor }) => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const ac = accentColor || '#e10600';

  const textColor  = theme === 'dark' ? 'text-white'    : 'text-neutral-900';
  const mutedColor = theme === 'dark' ? 'text-white/40' : 'text-neutral-500';

  useEffect(() => {
    axios.get('/api/media').then(r => setItems(r.data || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const filtered = category === 'all' ? items : items.filter(i => i.category === category);

  useEffect(() => {
    const handler = (e) => {
      if (lightbox === null) return;
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => Math.min(i + 1, filtered.length - 1));
      if (e.key === 'ArrowLeft')  setLightbox(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, filtered.length]);

  const legacyVideos = [
    { title: player.highlight_title_1 || 'Season Highlights 2025/26', duration: player.highlight_duration_1 || '4:15', url: player.highlight_url_1 },
    { title: player.highlight_title_2 || 'Defensive Masterclass',     duration: player.highlight_duration_2 || '3:40', url: player.highlight_url_2 },
  ].filter(v => v.url);

  const showLegacy = items.filter(i => i.category === 'video').length === 0 && legacyVideos.length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <title>{player.name} Media | Photos, Videos & Highlights</title>
      <meta name="description" content={`Official photo and video gallery for ${player.name}. Match highlights, training footage, certificates and press coverage from ${player.club}.`} />
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: ac }}>Gallery &amp; Media</p>
          <h2 className={`text-6xl font-black uppercase ${textColor}`}>Media</h2>
        </div>
        <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-black/10">
          {CATEGORIES.map(c => {
            const count = c.id === 'all' ? items.length : items.filter(i => i.category === c.id).length;
            if (c.id !== 'all' && count === 0) return null;
            return (
              <button key={c.id} onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${
                  category === c.id ? 'text-white shadow' : theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                }`}
                style={category === c.id ? { backgroundColor: ac } : {}}>
                {c.label}{c.id !== 'all' && count > 0 && <span className="ml-1 opacity-60">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: ac }} />
        </div>
      )}

      {!loading && filtered.length === 0 && !showLegacy && (
        <div className={`text-center py-24 ${mutedColor}`}>
          <Image size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-bold uppercase tracking-widest text-xs">No media yet</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <MediaCard key={item.id} item={item} theme={theme} accentColor={ac} onClick={() => setLightbox(idx)} />
          ))}
        </div>
      )}

      {/* Legacy video fallback */}
      {!loading && showLegacy && (category === 'all' || category === 'video') && (
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${mutedColor}`}>Highlight Reels</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {legacyVideos.map((vid, idx) => (
              <a key={idx} href={vid.url} target="_blank" rel="noreferrer"
                className="group relative aspect-video rounded-[40px] bg-neutral-900 overflow-hidden block">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition" style={{ backgroundColor: ac }}>
                    <ExternalLink size={24} />
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">{vid.duration}</p>
                  <h4 className="text-xl font-bold uppercase">{vid.title}</h4>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <Lightbox
            item={filtered[lightbox]}
            accentColor={ac}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(i => Math.max(i - 1, 0))}
            onNext={() => setLightbox(i => Math.min(i + 1, filtered.length - 1))}
            hasPrev={lightbox > 0}
            hasNext={lightbox < filtered.length - 1}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CategoryIcon = ({ cat }) => {
  if (cat === 'video')       return <Film size={14} />;
  if (cat === 'certificate') return <Award size={14} />;
  if (cat === 'press')       return <ExternalLink size={14} />;
  return <Image size={14} />;
};

const MediaCard = ({ item, theme, accentColor, onClick }) => {
  const isVideo = item.category === 'video';
  const isCert  = item.category === 'certificate';
  const thumb   = item.thumbnail || item.url;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer" onClick={onClick}>
      <div className={`relative aspect-video flex items-center justify-center overflow-hidden ${
        isCert ? '' : theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'
      }`}
        style={isCert ? { background: `linear-gradient(135deg, ${accentColor}20 0%, #000 100%)` } : {}}>
        {isCert ? (
          <div className="flex flex-col items-center gap-3 opacity-60" style={{ color: accentColor }}>
            <Award size={40} />
            <span className="text-[10px] font-black uppercase tracking-widest">Certificate</span>
          </div>
        ) : (
          <img src={thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition duration-300">
            {isVideo
              ? <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: accentColor }}><Play fill="white" size={20} /></div>
              : <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"><ExternalLink size={20} className="text-white" /></div>
            }
          </div>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full">
          <CategoryIcon cat={item.category} />
          {item.category}
        </div>
      </div>
      {item.title && (
        <div className={`p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-neutral-50'}`}>
          <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{item.title}</p>
          {item.duration && <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>{item.duration}</p>}
        </div>
      )}
    </motion.div>
  );
};

const Lightbox = ({ item, accentColor, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  const isVideo = item.category === 'video';
  const isCert  = item.category === 'certificate';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"><X size={18} /></button>
      {hasPrev && (
        <button onClick={e => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"><ChevronLeft size={20} /></button>
      )}
      {hasNext && (
        <button onClick={e => { e.stopPropagation(); onNext(); }} className="absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"><ChevronRight size={20} /></button>
      )}
      <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
        {isVideo ? (
          <video src={item.url} controls autoPlay className="w-full rounded-2xl max-h-[75vh]" />
        ) : isCert ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Award size={48} className="mx-auto mb-4" style={{ color: accentColor }} />
            <p className="text-2xl font-black text-neutral-900 mb-4">{item.title}</p>
            <a href={item.url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold" style={{ backgroundColor: accentColor }}>
              <ExternalLink size={16} /> Open Document
            </a>
          </div>
        ) : (
          <img src={item.url} alt={item.title} className="w-full rounded-2xl max-h-[80vh] object-contain" />
        )}
        {item.title && <p className="text-white text-center mt-4 font-bold">{item.title}</p>}
      </div>
    </motion.div>
  );
};

export default Media;
