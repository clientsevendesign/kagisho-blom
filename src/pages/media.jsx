import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';

const Media = ({ player, theme }) => {
  const videos = [
    { title: player.highlight_title_1 || 'Season Highlights 2025/26', duration: player.highlight_duration_1 || '4:15', url: player.highlight_url_1 },
    { title: player.highlight_title_2 || 'Defensive Masterclass', duration: player.highlight_duration_2 || '3:40', url: player.highlight_url_2 }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className={`text-6xl font-black uppercase mb-12 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((vid, idx) => {
          const Card = vid.url ? 'a' : 'div';
          return (
            <Card key={idx} href={vid.url || undefined} target={vid.url ? '_blank' : undefined} rel={vid.url ? 'noreferrer' : undefined} className="group relative aspect-video rounded-[40px] bg-neutral-900 overflow-hidden cursor-pointer block">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                <div className="w-16 h-16 bg-soccer-red rounded-full flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition">
                  {vid.url ? <ExternalLink size={24} /> : <Play fill="white" size={24} />}
                </div>
              </div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">{vid.duration}</p>
                <h4 className="text-xl font-bold uppercase">{vid.title}</h4>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Media;
