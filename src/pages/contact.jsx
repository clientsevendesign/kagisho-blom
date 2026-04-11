import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Send, User, Mail, MessageSquare } from 'lucide-react';
import axios from 'axios';

const Contact = ({ player, theme, setHasSubmitted }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-black/10';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/api/contact', formData);
      if (res.data.success) {
        setHasSubmitted(true); // Unlocks the restricted route
        navigate('/thank-you');
      }
    } catch (err) {
      alert("Error sending message. Please try WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className={`text-6xl font-black uppercase mb-6 ${textColor}`}>Contact</h2>
          <a href={`https://wa.me/${player.whatsapp}`} className="flex items-center justify-center gap-3 w-full py-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 font-bold hover:bg-green-500/20 transition">
            <Phone size={18} /> Official WhatsApp
          </a>
        </div>

        <form onSubmit={handleSubmit} className={`p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-soccer-grey border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
          <div className="space-y-4">
            <input required type="text" placeholder="Full Name" className={`w-full p-4 rounded-xl border ${inputBg} ${textColor} outline-none`} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Email" className={`w-full p-4 rounded-xl border ${inputBg} ${textColor} outline-none`} onChange={e => setFormData({...formData, email: e.target.value})} />
            <textarea required rows="4" placeholder="Message" className={`w-full p-4 rounded-xl border ${inputBg} ${textColor} outline-none`} onChange={e => setFormData({...formData, message: e.target.value})} />
            <button type="submit" disabled={loading} className="w-full py-5 bg-soccer-red text-white rounded-xl font-black uppercase hover:brightness-110 transition disabled:opacity-50">
              {loading ? "Sending..." : "Send Inquiry"} <Send size={16} className="inline ml-2" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Contact;