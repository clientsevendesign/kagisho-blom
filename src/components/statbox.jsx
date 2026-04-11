import React from 'react';

const StatBox = ({ label, value, color, theme }) => (
  <div className={`p-10 rounded-[40px] flex flex-col justify-between border transition-colors ${
    theme === 'dark' 
      ? 'bg-soccer-grey border-white/5 text-white' 
      : 'bg-neutral-50 border-black/5 text-neutral-900'
  }`}>
    <div className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ${color || ''}`}>{label}</div>
    <div className="text-6xl font-black tracking-tighter">{value || 0}</div>
  </div>
);

// This line is likely missing or misspelled
export default StatBox;