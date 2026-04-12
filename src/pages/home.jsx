import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import StatBox from '../components/statbox';

const Home = ({ player, theme }) => {
  const nameParts = player.name?.split(' ') || ['Player'];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || '';
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-16">
        <h1 className={`text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-[0.75] mb-4 ${textColor}`}>
          <span className="opacity-10 block">{firstName}</span>
          <span className="text-soccer-red block">{lastName}</span>
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-soccer-red/10 text-soccer-red border border-soccer-red/20">
            {player.is_available ? '● Available' : '● Under Contract'}
          </div>
          <span className={`text-xs font-bold uppercase tracking-widest opacity-40 ${textColor}`}>{player.club}</span>
          <span className={`text-xs font-bold uppercase tracking-widest opacity-40 ${textColor}`}>{player.position}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`md:col-span-2 md:row-span-2 rounded-[40px] relative overflow-hidden min-h-[400px] ${theme === 'dark' ? 'bg-soccer-grey' : 'bg-neutral-100'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <div className="absolute bottom-10 left-10 z-20 text-white">
            <p className="text-soccer-red font-black text-6xl italic leading-none mb-2">{player.jersey_number || '15'}</p>
            <h3 className="text-3xl font-black uppercase leading-none">{player.position}</h3>
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/50">{player.nationality}</p>
          </div>
        </div>
        <StatBox theme={theme} label="Goals" value={player.goals} color="text-soccer-red" />
        <StatBox theme={theme} label="Assists" value={player.assists} />
        <a href="/api/cv" target="_blank" rel="noreferrer" className={`p-10 rounded-[40px] flex flex-col justify-between hover:scale-[1.02] transition cursor-pointer shadow-xl min-h-[210px] ${theme === 'dark' ? 'bg-white text-black' : 'bg-neutral-900 text-white'}`}>
          <FileText size={40} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 mb-2">Generated from CRM</p>
            <h3 className="text-3xl font-black uppercase leading-none">Scout CV</h3>
          </div>
        </a>
        <StatBox theme={theme} label="Accuracy" value={player.pass_accuracy} />
      </div>
    </motion.div>
  );
};

export default Home;
