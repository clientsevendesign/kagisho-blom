import React from 'react';
import { motion } from 'framer-motion';
import StatBox from '../components/statbox'; // Importing the "brick" component
import { Activity, Target, Zap, TrendingUp } from 'lucide-react';

const StatboxPage = ({ player, theme }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const subTextColor = theme === 'dark' ? 'text-white/40' : 'text-neutral-500';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      {/* Header Section */}
      <div>
        <h2 className={`text-6xl font-black uppercase mb-2 ${textColor}`}>Technical Data</h2>
        <div className="flex items-center gap-3">
          <TrendingUp className="text-soccer-red" size={16} />
          <p className="text-soccer-red font-bold uppercase tracking-[0.3em] text-[10px]">Verified Season 2025/26</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox theme={theme} label="Total Goals" value={player.goals} color="text-soccer-red" />
        <StatBox theme={theme} label="Goal Involvements" value={(player.goals || 0) + (player.assists || 0)} />
        <StatBox theme={theme} label="Pass Accuracy" value={player.pass_accuracy || '0%'} />
      </div>

      {/* Advanced Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-soccer-grey border-white/5' : 'bg-neutral-50 border-black/5'}`}>
          <div className="flex items-center gap-3 mb-8">
            <Target className="text-soccer-red" />
            <h3 className={`text-xl font-black uppercase ${textColor}`}>Attacking Efficiency</h3>
          </div>
          <div className="space-y-8">
            <ProgressBar label="Shot Conversion" percent="18%" theme={theme} />
            <ProgressBar label="Dribble Success" percent="64%" theme={theme} />
            <ProgressBar label="Chances Created" percent="12" theme={theme} isValue />
          </div>
        </div>

        <div className={`p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-soccer-grey border-white/5' : 'bg-neutral-50 border-black/5'}`}>
          <div className="flex items-center gap-3 mb-8">
            <Zap className="text-soccer-red" />
            <h3 className={`text-xl font-black uppercase ${textColor}`}>Physical Profile</h3>
          </div>
          <div className="space-y-8">
            <ProgressBar label="Top Sprint Speed" percent="34.2 km/h" theme={theme} isValue />
            <ProgressBar label="Avg Distance / 90" percent="11.4 km" theme={theme} isValue />
            <ProgressBar label="Sprints per Match" percent="28" theme={theme} isValue />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Internal Helper for the Progress Bars
const ProgressBar = ({ label, percent, theme, isValue }) => (
  <div>
    <div className="flex justify-between mb-3">
      <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{label}</span>
      <span className={`text-[10px] font-black ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{percent}</span>
    </div>
    {!isValue && (
      <div className={`h-1.5 w-full rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-black/10'}`}>
        <div className="h-full bg-soccer-red rounded-full" style={{ width: percent }} />
      </div>
    )}
  </div>
);

export default StatboxPage;