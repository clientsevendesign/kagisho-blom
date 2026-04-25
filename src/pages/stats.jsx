import React from 'react';
import { motion } from 'framer-motion';
import StatBox from '../components/statbox';
import { Activity, Target, Zap, TrendingUp } from 'lucide-react';

const Stats = ({ player, theme, accentColor }) => {
  const ac           = accentColor || '#e10600';
  const textColor    = theme === 'dark' ? 'text-white'    : 'text-neutral-900';
  const panelClass   = theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-neutral-50 border-black/5';
  const goalInvolvements = (Number(player.goals) || 0) + (Number(player.assists) || 0);

  const parsePercent = (val = '') => {
    const n = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : Math.min(n, 100);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">

      {/* Header */}
      <div>
        <h2 className={`text-6xl font-black uppercase mb-2 ${textColor}`}>Technical Data</h2>
        <div className="flex items-center gap-3">
          <TrendingUp size={16} style={{ color: ac }} />
          <p className="font-bold uppercase tracking-[0.3em] text-[10px]" style={{ color: ac }}>
            Verified Season 2025/26
          </p>
        </div>
      </div>

      {/* Primary stat boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatBox theme={theme} label="Goals"             value={player.goals}          color="accent" accentColor={ac} />
        <StatBox theme={theme} label="Assists"           value={player.assists}                        accentColor={ac} />
        <StatBox theme={theme} label="Goal Involvements" value={goalInvolvements}                      accentColor={ac} />
        <StatBox theme={theme} label="Pass Accuracy"     value={player.pass_accuracy || '0%'}          accentColor={ac} />
      </div>

      {/* Attacking & Physical panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className={`p-10 rounded-[40px] border ${panelClass}`}>
          <div className="flex items-center gap-3 mb-8">
            <Target size={20} style={{ color: ac }} />
            <h3 className={`text-xl font-black uppercase ${textColor}`}>Attacking Efficiency</h3>
          </div>
          <div className="space-y-8">
            <ProgressBar label="Shot Conversion" display={player.shot_conversion || '0%'} percent={parsePercent(player.shot_conversion)} theme={theme} accentColor={ac} index={0} />
            <ProgressBar label="Dribble Success"  display={player.dribble_success  || '0%'} percent={parsePercent(player.dribble_success)}  theme={theme} accentColor={ac} index={1} />
            <ProgressBar label="Pass Accuracy"    display={player.pass_accuracy    || '0%'} percent={parsePercent(player.pass_accuracy)}    theme={theme} accentColor={ac} index={2} />
            <StatRow label="Chances Created" value={player.chances_created || '—'} theme={theme} />
            <StatRow label="Recoveries / 90" value={player.recoveries      || '—'} theme={theme} />
          </div>
        </div>

        <div className={`p-10 rounded-[40px] border ${panelClass}`}>
          <div className="flex items-center gap-3 mb-8">
            <Zap size={20} style={{ color: ac }} />
            <h3 className={`text-xl font-black uppercase ${textColor}`}>Physical Profile</h3>
          </div>
          <div className="space-y-8">
            <StatRow label="Top Sprint Speed"  value={player.sprint_speed      || '—'} theme={theme} />
            <StatRow label="Avg Distance / 90" value={player.avg_distance      || '—'} theme={theme} />
            <StatRow label="Sprints per Match" value={player.sprints_per_match || '—'} theme={theme} />
            <StatRow label="Work Rate"         value={player.work_rate         || '—'} theme={theme} />
            <StatRow label="Preferred Foot"    value={player.preferred_foot    || '—'} theme={theme} />
          </div>
        </div>
      </div>

      {/* Bottom summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatBox theme={theme} label="Sprint Speed"    value={player.sprint_speed      || '—'} accentColor={ac} />
        <StatBox theme={theme} label="Avg Distance"    value={player.avg_distance      || '—'} accentColor={ac} />
        <StatBox theme={theme} label="Sprints / Match" value={player.sprints_per_match || '—'} accentColor={ac} />
        <StatBox theme={theme} label="Recoveries / 90" value={player.recoveries        || '—'} accentColor={ac} />
      </div>
    </motion.div>
  );
};

const ProgressBar = ({ label, display, percent, theme, accentColor, index = 0 }) => (
  <div>
    <div className="flex justify-between mb-3">
      <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{label}</span>
      <motion.span
        className={`text-[10px] font-black ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + index * 0.12, duration: 0.4 }}
      >{display}</motion.span>
    </div>
    <div className={`h-1.5 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-black/10'}`}>
      <motion.div
        className="h-full rounded-full relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1.1, delay: 0.2 + index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ background: `linear-gradient(90deg, ${accentColor}99, ${accentColor}, ${accentColor}dd)` }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ x: ['−100%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 1.2 + index * 0.12 }}
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)', width: '60%' }}
        />
      </motion.div>
    </div>
  </div>
);

const StatRow = ({ label, value, theme }) => (
  <div className="flex justify-between items-center">
    <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{label}</span>
    <span className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{value}</span>
  </div>
);

export default Stats;
