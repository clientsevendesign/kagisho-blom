import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, MessageSquare, Phone, Send, User } from 'lucide-react';
import axios from 'axios';

const Contact = ({ player, theme, accentColor, setHasSubmitted }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const mutedColor = theme === 'dark' ? 'text-white/50' : 'text-neutral-500';
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-black/10';
  const ac = accentColor || '#e10600';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/contact', formData);
      if (res.data.success) { setHasSubmitted(true); navigate('/thank-you'); }
    } catch { alert('Error sending message. Please try WhatsApp or social media.'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left — info */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: ac }}>Clubs</p>
          <h2 className={`text-6xl font-black uppercase mb-6 ${textColor}`}>Contact</h2>
          <p className={`mb-8 leading-relaxed ${mutedColor}`}>
            Reach out directly for representation, scouting information, trials, interviews, or official football opportunities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {player.whatsapp && (
              <a href={`https://wa.me/${player.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 font-bold hover:bg-green-500/20 transition">
                <Phone size={18} /> WhatsApp
              </a>
            )}
            {player.instagram && (
              <a href={player.instagram} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-5 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-500 font-bold hover:bg-pink-500/20 transition">
                <Camera size={18} /> Instagram
              </a>
            )}
            {player.facebook && (
              <a href={player.facebook} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-500 font-bold hover:bg-blue-500/20 transition">
                <span className="text-lg font-black">f</span> Facebook
              </a>
            )}
            {player.email && (
              <a href={`mailto:${player.email}`}
                className="flex items-center justify-center gap-3 w-full py-5 border rounded-2xl font-bold transition"
                style={{ backgroundColor: `${ac}15`, borderColor: `${ac}30`, color: ac }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = `${ac}25`}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = `${ac}15`}>
                <Mail size={18} /> Email
              </a>
            )}
          </div>
        </div>

        {/* Right — form */}
        <form onSubmit={handleSubmit}
          className={`p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
          <div className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: ac }} />
              <input required type="text" placeholder="Full Name"
                className={`w-full p-4 pl-12 rounded-xl border ${inputBg} ${textColor} outline-none focus:border-opacity-100 transition`}
                style={{ '--tw-border-opacity': 1 }}
                onFocus={e => e.target.style.borderColor = ac}
                onBlur={e => e.target.style.borderColor = ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: ac }} />
              <input required type="email" placeholder="Email Address"
                className={`w-full p-4 pl-12 rounded-xl border ${inputBg} ${textColor} outline-none transition`}
                onFocus={e => e.target.style.borderColor = ac}
                onBlur={e => e.target.style.borderColor = ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-4 top-5" style={{ color: ac }} />
              <textarea required rows={4} placeholder="Your message…"
                className={`w-full p-4 pl-12 rounded-xl border ${inputBg} ${textColor} outline-none transition resize-none`}
                onFocus={e => e.target.style.borderColor = ac}
                onBlur={e => e.target.style.borderColor = ''}
                onChange={e => setFormData({ ...formData, message: e.target.value })} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-5 text-white rounded-xl font-black uppercase hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: ac }}>
              {loading ? 'Sending…' : <><Send size={16} /> Send Inquiry</>}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Contact;
