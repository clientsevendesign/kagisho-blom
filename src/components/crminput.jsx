import React from 'react';

const CRMInput = ({ label, value, onChange, type = "text", icon, theme }) => (
  <div className="flex flex-col gap-1">
    <label className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
      {label}
    </label>
    <div className="relative flex items-center">
      {icon && <div className="absolute left-4 opacity-20">{icon}</div>}
      <input 
        type={type} 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-soccer-red transition ${icon ? 'pl-12' : ''} ${
          theme === 'dark' 
            ? 'bg-black/40 border-white/5 text-white' 
            : 'bg-white border-black/10 text-neutral-900'
        }`} 
      />
    </div>
  </div>
);

// THIS IS THE CRITICAL LINE
export default CRMInput;