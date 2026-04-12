import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AtSign, Award, BarChart3, Camera, FileText, Footprints, Globe2, Hash, Link as LinkIcon, Mail, Phone, Ruler, Save, Shield, User, Weight } from 'lucide-react';
import CRMInput from '../components/crminput';

const Login = ({ player, theme, refreshData }) => {
  const [formData, setFormData] = useState(player);
  const [saving, setSaving] = useState(false);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const panelClass = theme === 'dark' ? 'bg-soccer-grey border-white/5' : 'bg-neutral-50 border-black/5';

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/update', formData);
      await refreshData();
      alert('CRM updated successfully. The website and generated CV now use the latest data.');
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className={`p-8 md:p-10 rounded-[40px] border ${panelClass}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <p className="text-soccer-red text-[10px] font-black uppercase tracking-[0.35em] mb-3">Private CRM</p>
            <h2 className={`text-4xl md:text-5xl font-black uppercase ${textColor}`}>Profile Control</h2>
            <p className={`mt-3 max-w-2xl ${theme === 'dark' ? 'text-white/50' : 'text-neutral-500'}`}>Update the public website details, contact links, performance stats, and generated CV from one place.</p>
          </div>
          <a href="/api/cv" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-black px-6 py-4 font-black uppercase text-xs tracking-widest hover:bg-soccer-red hover:text-white transition">
            <FileText size={18} /> Open CV
          </a>
        </div>

        <form onSubmit={handleUpdate} className="space-y-10">
          <Section title="Frontend Profile" theme={theme}>
            <CRMInput theme={theme} label="Full Name" value={formData.name} onChange={v => updateField('name', v)} icon={<User size={14} />} />
            <CRMInput theme={theme} label="Current Club" value={formData.club} onChange={v => updateField('club', v)} icon={<Shield size={14} />} />
            <CRMInput theme={theme} label="Position" value={formData.position} onChange={v => updateField('position', v)} icon={<Activity size={14} />} />
            <CRMInput theme={theme} label="Jersey Number" value={formData.jersey_number} onChange={v => updateField('jersey_number', v)} icon={<Hash size={14} />} />
            <CRMInput theme={theme} label="Availability" value={String(formData.is_available ?? 1)} onChange={v => updateField('is_available', Number(v))} options={[{ value: '1', label: 'Available' }, { value: '0', label: 'Under Contract' }]} />
            <CRMInput theme={theme} label="Nationality" value={formData.nationality} onChange={v => updateField('nationality', v)} icon={<Globe2 size={14} />} />
          </Section>

          <Section title="Physical Details" theme={theme}>
            <CRMInput theme={theme} label="Age" type="number" value={formData.age} onChange={v => updateField('age', v)} icon={<User size={14} />} />
            <CRMInput theme={theme} label="Height" value={formData.height} onChange={v => updateField('height', v)} icon={<Ruler size={14} />} />
            <CRMInput theme={theme} label="Weight" value={formData.weight} onChange={v => updateField('weight', v)} icon={<Weight size={14} />} />
            <CRMInput theme={theme} label="Preferred Foot" value={formData.preferred_foot} onChange={v => updateField('preferred_foot', v)} icon={<Footprints size={14} />} />
            <CRMInput theme={theme} label="Work Rate" value={formData.work_rate} onChange={v => updateField('work_rate', v)} icon={<Activity size={14} />} />
          </Section>

          <Section title="Performance Stats" theme={theme}>
            <CRMInput theme={theme} label="Goals" type="number" value={formData.goals} onChange={v => updateField('goals', v)} icon={<BarChart3 size={14} />} />
            <CRMInput theme={theme} label="Assists" type="number" value={formData.assists} onChange={v => updateField('assists', v)} icon={<BarChart3 size={14} />} />
            <CRMInput theme={theme} label="Recoveries" value={formData.recoveries} onChange={v => updateField('recoveries', v)} icon={<BarChart3 size={14} />} />
            <CRMInput theme={theme} label="Pass Accuracy" value={formData.pass_accuracy} onChange={v => updateField('pass_accuracy', v)} icon={<BarChart3 size={14} />} />
          </Section>

          <Section title="Contact and Social" theme={theme}>
            <CRMInput theme={theme} label="Email" type="email" value={formData.email} onChange={v => updateField('email', v)} icon={<Mail size={14} />} />
            <CRMInput theme={theme} label="Phone" value={formData.phone} onChange={v => updateField('phone', v)} icon={<Phone size={14} />} />
            <CRMInput theme={theme} label="WhatsApp Number" value={formData.whatsapp} onChange={v => updateField('whatsapp', v)} icon={<Phone size={14} />} />
            <CRMInput theme={theme} label="Instagram URL" value={formData.instagram} onChange={v => updateField('instagram', v)} icon={<Camera size={14} />} />
            <CRMInput theme={theme} label="Facebook URL" value={formData.facebook} onChange={v => updateField('facebook', v)} icon={<span className="text-xs font-black">f</span>} />
          </Section>

          <Section title="Media and CV" theme={theme}>
            <CRMInput theme={theme} label="Highlight 1 Title" value={formData.highlight_title_1} onChange={v => updateField('highlight_title_1', v)} icon={<FileText size={14} />} />
            <CRMInput theme={theme} label="Highlight 1 URL" value={formData.highlight_url_1} onChange={v => updateField('highlight_url_1', v)} icon={<LinkIcon size={14} />} />
            <CRMInput theme={theme} label="Highlight 1 Duration" value={formData.highlight_duration_1} onChange={v => updateField('highlight_duration_1', v)} icon={<AtSign size={14} />} />
            <CRMInput theme={theme} label="Highlight 2 Title" value={formData.highlight_title_2} onChange={v => updateField('highlight_title_2', v)} icon={<FileText size={14} />} />
            <CRMInput theme={theme} label="Highlight 2 URL" value={formData.highlight_url_2} onChange={v => updateField('highlight_url_2', v)} icon={<LinkIcon size={14} />} />
            <CRMInput theme={theme} label="Highlight 2 Duration" value={formData.highlight_duration_2} onChange={v => updateField('highlight_duration_2', v)} icon={<AtSign size={14} />} />
            <div className="md:col-span-2">
              <CRMInput theme={theme} label="Public Bio" value={formData.bio} onChange={v => updateField('bio', v)} multiline />
            </div>
            <div className="md:col-span-2">
              <CRMInput theme={theme} label="CV Summary" value={formData.cv_summary} onChange={v => updateField('cv_summary', v)} multiline />
            </div>
            <div className="md:col-span-2">
              <CRMInput theme={theme} label="Achievements (one per line)" value={formData.achievements} onChange={v => updateField('achievements', v)} icon={<Award size={14} />} multiline />
            </div>
          </Section>

          <button type="submit" disabled={saving} className="w-full bg-soccer-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-soccer-red/20 disabled:opacity-50">
            <Save size={18} className="inline mr-2" /> {saving ? 'Saving...' : 'Save CRM Updates'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Section = ({ title, theme, children }) => (
  <section>
    <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-5 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{children}</div>
  </section>
);

export default Login;
