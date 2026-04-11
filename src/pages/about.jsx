import React from 'react';
import { motion } from 'framer-motion';
import { User, Activity, Shield } from 'lucide-react';

const About = ({ player, theme }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const subTextColor = theme === 'dark' ? 'text-white/40' : 'text-neutral-500';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className={`text-6xl font-black uppercase mb-12 ${textColor}`}>The Athlete</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-neutral-700'}`}>
            {player.name} is a dedicated {player.position} currently representing {player.club}. 
            Known for tactical intelligence and physical presence, {player.name.split(' ')[0]} 
            is a key asset in high-pressure competitive environments.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <InfoCard icon={<User size={20}/>} label="Position" value={player.position} theme={theme} />
            <InfoCard icon={<Activity size={20}/>} label="Work Rate" value="High/High" theme={theme} />
          </div>
        </div>
        <div className={`aspect-square rounded-[40px] ${theme === 'dark' ? 'bg-soccer-grey' : 'bg-neutral-100'} overflow-hidden grayscale opacity-50`}>
          {/* Professional Headshot Placeholder */}
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