import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Footprints, Globe2, Ruler, Shield, User, Weight } from 'lucide-react';

const About = ({ player, theme }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const firstName = player.name?.split(' ')?.[0] || 'The athlete';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className={`text-6xl font-black uppercase mb-12 ${textColor}`}>The Athlete</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-neutral-700'}`}>
            {player.bio || `${player.name} is a dedicated ${player.position} currently representing ${player.club}. Known for tactical intelligence and physical presence, ${firstName} is a key asset in high-pressure competitive environments.`}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <InfoCard icon={<User size={20}/>} label="Age" value={player.age || 'N/A'} theme={theme} />
            <InfoCard icon={<Shield size={20}/>} label="Position" value={player.position || 'N/A'} theme={theme} />
            <InfoCard icon={<Globe2 size={20}/>} label="Nationality" value={player.nationality || 'N/A'} theme={theme} />
            <InfoCard icon={<Activity size={20}/>} label="Work Rate" value={player.work_rate || 'N/A'} theme={theme} />
            <InfoCard icon={<Ruler size={20}/>} label="Height" value={player.height || 'N/A'} theme={theme} />
            <InfoCard icon={<Weight size={20}/>} label="Weight" value={player.weight || 'N/A'} theme={theme} />
            <InfoCard icon={<Footprints size={20}/>} label="Preferred Foot" value={player.preferred_foot || 'N/A'} theme={theme} />
            <InfoCard icon={<Shield size={20}/>} label="Club" value={player.club || 'N/A'} theme={theme} />
          </div>
        </div>
        <div className={`rounded-[40px] ${theme === 'dark' ? 'bg-soccer-grey' : 'bg-neutral-100'} overflow-hidden p-10 flex flex-col justify-end min-h-[460px]`}>
          <p className="text-soccer-red text-[10px] font-black uppercase tracking-[0.35em] mb-4">Professional Summary</p>
          <h3 className={`text-4xl font-black uppercase leading-none mb-5 ${textColor}`}>{player.name}</h3>
          <p className={`${theme === 'dark' ? 'text-white/50' : 'text-neutral-600'} leading-relaxed`}>{player.cv_summary || player.bio}</p>
        </div>
      </div>
    </motion.div>
  );
};

const InfoCard = ({ icon, label, value, theme }) => (
  <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
    <div className="text-soccer-red mb-3">{icon}</div>
    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</p>
    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{value}</p>
  </div>
);

export default About;
