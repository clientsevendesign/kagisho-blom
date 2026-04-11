import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

const Media = ({ theme }) => {
  const videos = [
    { title: "Season Highlights 2025/26", duration: "4:15" },
    { title: "Defensive Masterclass", duration: "3:40" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className={`text-6xl font-black uppercase mb-12 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((vid, idx) => (
          <div key={idx} className="group relative aspect-video rounded-[40px] bg-neutral-900 overflow-hidden cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
              <div className="w-16 h-16 bg-soccer-red rounded-full flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition">
                <Play fill="white" size={24} />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">{vid.duration}</p>
              <h4 className="text-xl font-bold uppercase">{vid.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Media;