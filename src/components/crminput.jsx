import React from 'react';

const CRMInput = ({ label, value, onChange, type = "text", icon, theme, multiline = false, options }) => {
  const fieldClass = `w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-soccer-red transition ${icon ? 'pl-12' : ''} ${
    theme === 'dark'
      ? 'bg-black/40 border-white/5 text-white placeholder:text-white/20'
      : 'bg-white border-black/10 text-neutral-900 placeholder:text-neutral-400'
  }`;

  return (
    <div className="flex flex-col gap-1">
      <label className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-4 opacity-20">{icon}</div>}
        {options ? (
          <select value={value ?? ''} onChange={e => onChange(e.target.value)} className={fieldClass}>
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        ) : multiline ? (
          <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows="4" className={fieldClass} />
        ) : (
          <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} className={fieldClass} />
        )}
      </div>
    </div>
  );
};

export default CRMInput;
