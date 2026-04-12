import React, { useState } from 'react';
import axios from 'axios';
import { Save, Phone, Lock } from 'lucide-react';
import CRMInput from '../components/crminput';

const Login = ({ player, theme, refreshData }) => {
  const [formData, setFormData] = useState(player);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/update', formData);
      alert("Profile updated successfully!");
      refreshData();
    } catch (err) {
      alert("Error updating profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`p-10 rounded-[40px] border ${theme === 'dark' ? 'bg-soccer-grey border-white/5' : 'bg-neutral-50 border-black/5'}`}>
        <h2 className={`text-3xl font-black uppercase mb-8 ${textColor}`}>Update Profile</h2>
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CRMInput theme={theme} label="Current Club" value={formData.club} onChange={v => setFormData({ ...formData, club: v })} />
          <CRMInput theme={theme} label="Goals" type="number" value={formData.goals} onChange={v => setFormData({ ...formData, goals: v })} />
          <CRMInput theme={theme} label="Assists" type="number" value={formData.assists} onChange={v => setFormData({ ...formData, assists: v })} />
          <CRMInput theme={theme} label="WhatsApp" value={formData.whatsapp} onChange={v => setFormData({ ...formData, whatsapp: v })} icon={<Phone size={14} />} />
          <button type="submit" className="md:col-span-2 mt-4 bg-soccer-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-soccer-red/20">
            <Save size={18} className="inline mr-2" /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

// THIS IS THE LINE THAT WAS MISSING
export default Login;