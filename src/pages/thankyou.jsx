import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const ThankYou = ({ theme, accentColor }) => {
  const ac = accentColor || '#e10600';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
      <div className="inline-flex p-6 rounded-full mb-8" style={{ backgroundColor: `${ac}15`, color: ac }}>
        <CheckCircle size={64} />
      </div>
      <h2 className={`text-5xl font-black uppercase mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
        Message Received
      </h2>
      <p className={`text-lg mb-12 ${theme === 'dark' ? 'text-white/50' : 'text-neutral-500'}`}>
        Kagisho and his team will review your inquiry shortly.
      </p>
      <Link to="/"
        className="inline-flex items-center gap-2 font-bold uppercase tracking-widest hover:gap-4 transition-all"
        style={{ color: ac }}>
        <ArrowLeft size={18} /> Back to Profile
      </Link>
    </motion.div>
  );
};

export default ThankYou;
