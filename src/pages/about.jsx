import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Footprints, Globe2, Ruler, Shield, User, Weight } from 'lucide-react';
import axios from 'axios';

const About = ({ player, theme, accentColor, settings }) => {
  const [clubs, setClubs] = useState([]);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const firstName = player.name?.split(' ')?.[0] || 'The athlete';
  const profileImg = settings?.profile_image_url || '';

  useEffect(() => {
    axios.get('/api/previous-clubs').then(r => setClubs(r.data || [])).catch(() => { });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">

      {/* ── Header + bio ───────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: accentColor }}>The Athlete</p>
        <h2 className={`text-6xl font-black uppercase mb-12 ${textColor}`}>About</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {/* Profile picture */}
            {profileImg && (
              <div className="flex items-center gap-5 mb-6">
                <img src={profileImg} alt={player.name}
                  className="w-20 h-20 rounded-full object-cover object-top border-2"
                  style={{ borderColor: accentColor }} />
                <div>
                  <p className={`font-black text-lg uppercase ${textColor}`}>{player.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>{player.position}</p>
                </div>
              </div>
            )}
            <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-neutral-700'}`}>
              {player.bio || `${player.name} is a dedicated ${player.position} currently representing ${player.club}. Known for tactical intelligence and physical presence, ${firstName} is a key asset in high-pressure competitive environments.`}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <InfoCard icon={<User size={20} />} label="Age" value={player.age || 'N/A'} theme={theme} accentColor={accentColor} />
              <InfoCard icon={<Shield size={20} />} label="Position" value={player.position || 'N/A'} theme={theme} accentColor={accentColor} />
              <InfoCard icon={<Globe2 size={20} />} label="Nationality" value={player.nationality || 'N/A'} theme={theme} accentColor={accentColor} />
              <InfoCard icon={<Activity size={20} />} label="Work Rate" value={player.work_rate || 'N/A'} theme={theme} accentColor={accentColor} />
              <InfoCard icon={<Ruler size={20} />} label="Height" value={player.height || 'N/A'} theme={theme} accentColor={accentColor} />
              <InfoCard icon={<Weight size={20} />} label="Weight" value={player.weight || 'N/A'} theme={theme} accentColor={accentColor} />
              <InfoCard icon={<Footprints size={20} />} label="Preferred Foot" value={player.preferred_foot || 'N/A'} theme={theme} accentColor={accentColor} />
              <InfoCard icon={<Shield size={20} />} label="Current Club" value={player.club || 'N/A'} theme={theme} accentColor={accentColor} />
            </div>
          </div>

          {/* Summary panel */}
          <div className={`rounded-[40px] overflow-hidden p-10 flex flex-col justify-end min-h-[460px] relative ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-neutral-100'}`}
            style={profileImg ? {} : { background: `linear-gradient(135deg, ${accentColor}20 0%, ${theme === 'dark' ? '#1a1a1a' : '#f3f4f6'} 100%)` }}>
            {profileImg && (
              <img src={profileImg} alt={player.name} className="absolute inset-0 w-full h-full object-cover object-top opacity-30" />
            )}
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: accentColor }}>Professional Summary</p>
              <h3 className={`text-4xl font-black uppercase leading-none mb-5 ${textColor}`}>{player.name}</h3>
              <p className={`${theme === 'dark' ? 'text-white/60' : 'text-neutral-600'} leading-relaxed`}>{player.cv_summary || player.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Career History ────────────────────────────────────────────── */}
      {clubs.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: accentColor }}>Career</p>
          <h3 className={`text-4xl font-black uppercase mb-8 ${textColor}`}>Club History</h3>
          <div className="space-y-3">
            {/* Current club */}
            <div className={`flex items-center justify-between p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}
              style={{ background: `${accentColor}10`, borderColor: `${accentColor}30` }}>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <div>
                  <p className={`font-black uppercase text-sm ${textColor}`}>{player.club}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>Current Club</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>Active</span>
            </div>

            {/* Previous clubs */}
            {clubs.map((club, i) => (
              <div key={club.id} className={`flex items-center justify-between p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-white/20' : 'bg-neutral-400'}`} />
                  <div>
                    <p className={`font-black uppercase text-sm ${textColor}`}>{club.club_name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>{club.role || 'Player'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>{club.season}</p>
                  <div className="flex gap-4 mt-1 text-[10px]">
                    {club.apps && <span className={theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}>{club.apps} Apps</span>}
                    {club.goals && <span style={{ color: accentColor }}>{club.goals} Goals</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const InfoCard = ({ icon, label, value, theme, accentColor }) => (
  <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
    <div className="mb-3" style={{ color: accentColor }}>{icon}</div>
    <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{label}</p>
    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{value}</p>
  </div>
);

export default About;