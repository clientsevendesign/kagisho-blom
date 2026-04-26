import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Activity, AtSign, Award, BarChart3, Bot, Camera, Calendar,
  CheckCircle, ChevronDown, ChevronUp, FileText, Film, Footprints,
  Globe2, Hash, Image, LinkIcon, LogOut, Mail, MapPin, MessageCircle,
  Palette, Phone, Plus, Ruler, Save, Shield, Trash2, TrendingUp,
  Upload, User, Users, Weight, X, XCircle, Zap, Copy, Share2,
} from 'lucide-react';
import CRMInput from '../components/crminput';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'kagisho_media';
const API_BASE = import.meta.env.VITE_API_URL || '';
// AI calls go through the server /api/chat endpoint (Gemini key stays server-side)

const TABS = [
  { id: 'Dashboard', icon: Bot, label: 'AI Dashboard' },
  { id: 'Profile', icon: User, label: 'Profile' },
  { id: 'Stats', icon: BarChart3, label: 'Stats' },
  { id: 'Achievements', icon: Award, label: 'Achievements' },
  { id: 'Clubs', icon: Shield, label: 'Club History' },
  { id: 'Fixtures', icon: Calendar, label: 'Fixtures' },
  { id: 'Media', icon: Camera, label: 'Media' },
  { id: 'Trends', icon: TrendingUp, label: 'Trends' },
  { id: 'Community', icon: Users, label: 'Community' },
  { id: 'Leads', icon: Mail, label: 'Leads' },
  { id: 'Settings', icon: Palette, label: 'Settings' },
  { id: 'Share', icon: Share2, label: 'Share' },
  { id: 'ChatbotSetup', icon: MessageCircle, label: 'Chatbot' },
];

const MEDIA_CATEGORIES = [
  { id: 'photo', label: 'Photo', icon: Image, accept: 'image/*' },
  { id: 'video', label: 'Video', icon: Film, accept: 'video/*' },
  { id: 'certificate', label: 'Certificate', icon: Award, accept: '.pdf,image/*' },
  { id: 'press', label: 'Press', icon: FileText, accept: 'image/*,.pdf' },
];

// ── CRM Shell ─────────────────────────────────────────────────────────────────

const CRM = ({ player, theme, accentColor, settings, refreshData, refreshSettings, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [communityBadge, setCommunityBadge] = useState(0);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const panelClass = theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-neutral-50 border-black/5';

  useEffect(() => {
    axios.get('/api/community/stats').then(r => {
      const d = r.data || {};
      setCommunityBadge((d.pendingFollows || 0) + (d.pendingComments || 0));
    }).catch(() => { });
  }, []);

  const handleLogoutClick = () => setLogoutConfirm(true);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className={`p-8 rounded-[40px] border ${panelClass}`}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: accentColor }}>Private CRM</p>
            <h2 className={`text-4xl font-black uppercase ${textColor}`}>Control Panel</h2>
          </div>
          <div className="flex items-center gap-3">
            <a href={`${API_BASE}/api/cv`} target="_blank" rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-black uppercase text-[10px] tracking-widest transition hover:text-white ${theme === 'dark' ? 'bg-white text-black hover:bg-soccer-red' : 'bg-neutral-900 text-white hover:bg-soccer-red'}`}>
              <FileText size={14} /> Scout CV
            </a>
            <button onClick={handleLogoutClick}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-black uppercase text-[10px] tracking-widest border transition ${theme === 'dark' ? 'border-white/10 text-white/50 hover:border-red-500 hover:text-red-500' : 'border-black/10 text-neutral-500 hover:border-red-500 hover:text-red-500'}`}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-1 mb-8 p-1.5 rounded-2xl w-full bg-black/10">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition whitespace-nowrap ${activeTab === id ? 'text-white shadow-lg' : theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              style={activeTab === id ? { backgroundColor: accentColor } : {}}>
              <Icon size={10} /> {label}
              {id === 'Community' && communityBadge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-black">
                  {communityBadge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'Dashboard' && <DashboardTab player={player} theme={theme} accentColor={accentColor} settings={settings} />}
        {activeTab === 'Profile' && <ProfileTab player={player} theme={theme} accentColor={accentColor} refreshData={refreshData} settings={settings} refreshSettings={refreshSettings} />}
        {activeTab === 'Stats' && <StatsTab player={player} theme={theme} accentColor={accentColor} refreshData={refreshData} />}
        {activeTab === 'Achievements' && <AchievementsTab player={player} theme={theme} accentColor={accentColor} refreshData={refreshData} />}
        {activeTab === 'Clubs' && <ClubsTab theme={theme} accentColor={accentColor} />}
        {activeTab === 'Fixtures' && <FixturesTab theme={theme} accentColor={accentColor} playerClub={player.club} />}
        {activeTab === 'Media' && <MediaTab theme={theme} accentColor={accentColor} />}
        {activeTab === 'Trends' && <TrendsTab theme={theme} accentColor={accentColor} />}
        {activeTab === 'Community' && <CommunityTab theme={theme} accentColor={accentColor} player={player} onBadgeUpdate={setCommunityBadge} />}
        {activeTab === 'Leads' && <LeadsTab theme={theme} accentColor={accentColor} />}
        {activeTab === 'Settings' && <SettingsTab theme={theme} accentColor={accentColor} settings={settings} refreshSettings={refreshSettings} player={player} />}
        {activeTab === 'Share' && <ShareTab player={player} theme={theme} accentColor={accentColor} />}
        {activeTab === 'ChatbotSetup' && <ChatbotProfileTab theme={theme} accentColor={accentColor} />}
      </div>

      {/* Logout confirm modal */}
      {logoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLogoutConfirm(false)}>
          <div className={`p-10 rounded-[40px] border max-w-sm w-full text-center ${panelClass}`} onClick={e => e.stopPropagation()}>
            <LogOut size={32} className="mx-auto mb-4 text-red-400" />
            <h3 className={`text-2xl font-black uppercase mb-3 ${textColor}`}>Log Out?</h3>
            <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-white/50' : 'text-neutral-500'}`}>You'll need your access key to return to the CRM.</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutConfirm(false)}
                className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition ${theme === 'dark' ? 'border-white/10 text-white/50 hover:border-white/30' : 'border-black/10 text-neutral-500 hover:border-black/30'}`}>
                Cancel
              </button>
              <button onClick={onLogout}
                className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-red-500 text-white hover:bg-red-600 transition">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Shared helpers ────────────────────────────────────────────────────────────

const useSave = (refreshData) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const save = async (data) => {
    setSaving(true); setSaveErr('');
    try { await axios.post('/api/update', data); await refreshData(); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    catch (e) { setSaveErr(e.response?.data?.error || 'Error saving.'); }
    finally { setSaving(false); }
  };
  return { saving, saved, saveErr, save };
};

const Section = ({ title, theme, children }) => (
  <section>
    <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-5 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{children}</div>
  </section>
);

const SaveBar = ({ saving, saved, saveErr, onSave, accentColor }) => (
  <div className="space-y-2">
    {saveErr && <p className="text-red-500 text-xs font-bold">{saveErr}</p>}
    <button type={onSave ? 'button' : 'submit'} onClick={onSave} disabled={saving}
      className="w-full py-5 rounded-2xl font-black uppercase tracking-widest transition shadow-lg disabled:opacity-50 text-white hover:brightness-110"
      style={{ backgroundColor: saved ? '#22c55e' : accentColor }}>
      <Save size={18} className="inline mr-2" />
      {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
    </button>
  </div>
);

// ── Cloudinary upload ─────────────────────────────────────────────────────────

const cloudinaryUpload = async (file, category) => {
  if (!CLOUD_NAME) throw new Error('VITE_CLOUDINARY_CLOUD_NAME not set');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', `kagisho/${category}`);
  const resourceType = file.type.startsWith('video/') ? 'video' : 'auto';
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, { method: 'POST', body: fd });
  if (!res.ok) { const b = await res.json(); throw new Error(b.error?.message || 'Upload failed'); }
  return res.json();
};

// ── AI DASHBOARD TAB ──────────────────────────────────────────────────────────

const DashboardTab = ({ player, theme, accentColor, settings }) => {
  const [aiResponse, setAiResponse] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePrompt, setActivePrompt] = useState(null);
  const [customQ, setCustomQ] = useState('');
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const mutedColor = theme === 'dark' ? 'text-white/50' : 'text-neutral-500';
  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm';

  const PROMPTS = [
    {
      id: 'performance',
      label: 'Performance Analysis',
      icon: <BarChart3 size={18} />,
      prompt: `Analyse this footballer's stats and give specific performance insights and areas to improve:\nGoals: ${player.goals}, Assists: ${player.assists}, Pass Accuracy: ${player.pass_accuracy}, Shot Conversion: ${player.shot_conversion}, Dribble Success: ${player.dribble_success}, Recoveries/90: ${player.recoveries}, Chances Created: ${player.chances_created}, Sprint Speed: ${player.sprint_speed}, Work Rate: ${player.work_rate}.\nPosition: ${player.position}. Be specific, concise and actionable.`,
    },
    {
      id: 'bio',
      label: 'Improve Bio',
      icon: <FileText size={18} />,
      prompt: `Rewrite this footballer's bio to be more compelling for scouts and clubs. Keep it under 80 words. Current bio: "${player.bio}". Player details: ${player.position}, ${player.nationality}, Age ${player.age}, Club: ${player.club}. Make it punchy, professional and highlight strengths.`,
    },
    {
      id: 'motivation',
      label: 'Coaching Tips',
      icon: <Zap size={18} />,
      prompt: `Based on these stats, give ${player.name} 3 specific, motivational coaching tips for improvement:\nGoals: ${player.goals}, Assists: ${player.assists}, Pass Accuracy: ${player.pass_accuracy}, Shot Conversion: ${player.shot_conversion}, Dribble Success: ${player.dribble_success}.\nBe direct, encouraging and specific. Format as numbered tips.`,
    },
  ];

  const askGemini = async (promptText) => {
    setLoading(true); setError(''); setAiResponse('');
    try {
      const res = await axios.post('/api/chat', {
        messages: [{ role: 'user', content: promptText }],
      });
      setAiResponse(res.data.reply || 'No response received.');
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      {/* Connection status */}
      <div className={`flex items-center justify-between p-5 rounded-2xl border ${cardClass}`}>
        <div className="flex items-center gap-3">
          <Bot size={20} style={{ color: accentColor }} />
          <div>
            <p className={`text-sm font-black ${textColor}`}>{settings?.ai_api_key?.startsWith('gsk_') ? 'Groq AI — Llama 3.3 70B' : 'Gemini AI — Flash 2.0'}</p>
            <p className={`text-[10px] ${mutedColor}`}>Server-side · Secure · Free</p>
          </div>
        </div>
        {(() => {
          const keySet = !!(settings?.ai_api_key || settings?.gemini_api_key);
          return keySet ? (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Connected
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                Key Not Set
              </div>
              <button
                onClick={() => {
                  const event = new CustomEvent('crm-switch-tab', { detail: 'Settings' });
                  window.dispatchEvent(event);
                }}
                className="text-[9px] font-black uppercase tracking-widest underline"
                style={{ color: accentColor }}>
                Add Key in Settings
              </button>
            </div>
          );
        })()}
      </div>

      {/* Quick action buttons */}
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Quick Analysis</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROMPTS.map(p => (
            <button key={p.id} onClick={() => { setActivePrompt(p.id); askGemini(p.prompt); }}
              disabled={loading}
              className={`flex items-center gap-3 p-5 rounded-2xl border text-left transition hover:border-opacity-100 disabled:opacity-40 ${cardClass} ${activePrompt === p.id ? 'border-opacity-100' : ''}`}
              style={activePrompt === p.id ? { borderColor: accentColor } : {}}>
              <div style={{ color: accentColor }}>{p.icon}</div>
              <span className={`text-sm font-black ${textColor}`}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom question */}
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Ask Anything</p>
        <div className="flex gap-3">
          <input type="text" value={customQ} onChange={e => setCustomQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && customQ.trim() && (setActivePrompt('custom'), askGemini(customQ))}
            placeholder={`Ask AI about ${player.name}'s career, tactics, or anything…`}
            className={`flex-1 p-4 rounded-2xl border outline-none text-sm ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white placeholder:text-white/20' : 'bg-white border-black/10 text-neutral-900'}`} />
          <button onClick={() => { if (customQ.trim()) { setActivePrompt('custom'); askGemini(customQ); } }}
            disabled={loading || !customQ.trim()}
            className="px-6 py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest disabled:opacity-40 hover:brightness-110 transition"
            style={{ backgroundColor: accentColor }}>
            Ask
          </button>
        </div>
      </div>

      {/* AI response */}
      {(loading || aiResponse || error) && (
        <div className={`p-8 rounded-3xl border ${cardClass}`}>
          <div className="flex items-center gap-2 mb-4">
            <Bot size={16} style={{ color: accentColor }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentColor }}>AI Response</span>
            {loading && <div className="w-1.5 h-1.5 rounded-full animate-ping ml-2" style={{ backgroundColor: accentColor }} />}
          </div>
          {error && <p className="text-red-400 text-sm font-bold">{error}</p>}
          {loading && !aiResponse && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className={`h-3 rounded-full animate-pulse ${theme === 'dark' ? 'bg-white/10' : 'bg-neutral-200'}`} style={{ width: `${[90, 75, 60][i - 1]}%` }} />)}
            </div>
          )}
          {aiResponse && (
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'text-white/80' : 'text-neutral-700'}`}>
              {aiResponse}
            </div>
          )}
        </div>
      )}

      {/* Stat summary cards */}
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Current Season At a Glance</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Goals', value: player.goals },
            { label: 'Assists', value: player.assists },
            { label: 'Pass Acc.', value: player.pass_accuracy },
            { label: 'Sprint', value: player.sprint_speed },
          ].map(({ label, value }) => (
            <div key={label} className={`p-5 rounded-2xl border ${cardClass}`}>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${mutedColor}`}>{label}</p>
              <p className="text-2xl font-black" style={{ color: accentColor }}>{value || '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── PROFILE TAB ───────────────────────────────────────────────────────────────

const ProfileTab = ({ player, theme, accentColor, refreshData, settings, refreshSettings }) => {
  const [form, setForm] = useState(player);
  const { saving, saved, saveErr, save } = useSave(refreshData);
  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  // Hero image upload
  const [heroUploading, setHeroUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const heroInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const uploadImage = async (file, type) => {
    const setter = type === 'hero' ? setHeroUploading : setProfileUploading;
    setter(true);
    try {
      const result = await cloudinaryUpload(file, type === 'hero' ? 'hero' : 'profile');
      await axios.post('/api/settings', {
        [`${type}_image_url`]: result.secure_url,
        [`${type}_image_public_id`]: result.public_id,
      });
      await refreshSettings();
    } catch (e) { alert('Upload failed: ' + e.message); }
    finally { setter(false); }
  };

  const currentHero = settings?.hero_image_url || '';
  const currentProfile = settings?.profile_image_url || '';

  return (
    <form onSubmit={e => { e.preventDefault(); save(form); }} className="space-y-10">

      {/* Hero & Profile image upload */}
      <Section title="Site Images" theme={theme}>
        {/* Hero image */}
        <div className={`md:col-span-2 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Homepage Hero Image</p>
          {currentHero && <img src={currentHero} alt="Hero" className="w-full h-32 object-cover rounded-xl mb-3 object-top" />}
          <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0], 'hero')} />
          <button type="button" onClick={() => heroInputRef.current?.click()} disabled={heroUploading}
            className="w-full py-3 rounded-xl border border-dashed text-[10px] font-black uppercase tracking-widest transition hover:border-opacity-100 disabled:opacity-50"
            style={{ borderColor: `${accentColor}60`, color: accentColor }}>
            {heroUploading ? 'Uploading…' : currentHero ? 'Replace Hero Image' : 'Upload Hero Image'}
          </button>
        </div>

        {/* Profile picture */}
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Profile Picture</p>
          {currentProfile && <img src={currentProfile} alt="Profile" className="w-16 h-16 rounded-full object-cover object-top mb-3" style={{ borderColor: accentColor, border: `2px solid ${accentColor}` }} />}
          <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0], 'profile')} />
          <button type="button" onClick={() => profileInputRef.current?.click()} disabled={profileUploading}
            className="w-full py-3 rounded-xl border border-dashed text-[10px] font-black uppercase tracking-widest transition hover:border-opacity-100 disabled:opacity-50"
            style={{ borderColor: `${accentColor}60`, color: accentColor }}>
            {profileUploading ? 'Uploading…' : currentProfile ? 'Replace Photo' : 'Upload Photo'}
          </button>
        </div>
      </Section>

      <Section title="Identity" theme={theme}>
        <CRMInput theme={theme} label="Full Name" value={form.name} onChange={v => set('name', v)} icon={<User size={14} />} />
        <CRMInput theme={theme} label="Current Club" value={form.club} onChange={v => set('club', v)} icon={<Shield size={14} />} />
        <CRMInput theme={theme} label="Position" value={form.position} onChange={v => set('position', v)} icon={<Activity size={14} />} />
        <CRMInput theme={theme} label="Jersey Number" value={form.jersey_number} onChange={v => set('jersey_number', v)} icon={<Hash size={14} />} />
        <CRMInput theme={theme} label="Nationality" value={form.nationality} onChange={v => set('nationality', v)} icon={<Globe2 size={14} />} />
        <CRMInput theme={theme} label="Availability" value={String(form.is_available ?? 1)} onChange={v => set('is_available', Number(v))}
          options={[{ value: '1', label: 'Available for Transfer' }, { value: '0', label: 'Under Contract' }]} />
      </Section>

      <Section title="Physical" theme={theme}>
        <CRMInput theme={theme} label="Age" type="number" value={form.age} onChange={v => set('age', v)} icon={<User size={14} />} />
        <CRMInput theme={theme} label="Height" value={form.height} onChange={v => set('height', v)} icon={<Ruler size={14} />} />
        <CRMInput theme={theme} label="Weight" value={form.weight} onChange={v => set('weight', v)} icon={<Weight size={14} />} />
        <CRMInput theme={theme} label="Preferred Foot" value={form.preferred_foot} onChange={v => set('preferred_foot', v)} icon={<Footprints size={14} />} />
        <CRMInput theme={theme} label="Work Rate" value={form.work_rate} onChange={v => set('work_rate', v)} icon={<Activity size={14} />} />
      </Section>

      <Section title="Contact & Social" theme={theme}>
        <CRMInput theme={theme} label="Email" type="email" value={form.email} onChange={v => set('email', v)} icon={<Mail size={14} />} />
        <CRMInput theme={theme} label="Phone" value={form.phone} onChange={v => set('phone', v)} icon={<Phone size={14} />} />
        <CRMInput theme={theme} label="WhatsApp" value={form.whatsapp} onChange={v => set('whatsapp', v)} icon={<Phone size={14} />} />
        <CRMInput theme={theme} label="Instagram URL" value={form.instagram} onChange={v => set('instagram', v)} icon={<Camera size={14} />} />
        <CRMInput theme={theme} label="Facebook URL" value={form.facebook} onChange={v => set('facebook', v)} icon={<span className="text-xs font-black">f</span>} />
      </Section>

      <Section title="Bio & CV" theme={theme}>
        <div className="md:col-span-2 lg:col-span-3"><CRMInput theme={theme} label="Public Bio" value={form.bio} onChange={v => set('bio', v)} multiline /></div>
        <div className="md:col-span-2 lg:col-span-3"><CRMInput theme={theme} label="CV Summary" value={form.cv_summary} onChange={v => set('cv_summary', v)} multiline /></div>
      </Section>

      <Section title="Highlight Reels" theme={theme}>
        <CRMInput theme={theme} label="Highlight 1 Title" value={form.highlight_title_1} onChange={v => set('highlight_title_1', v)} icon={<FileText size={14} />} />
        <CRMInput theme={theme} label="Highlight 1 URL" value={form.highlight_url_1} onChange={v => set('highlight_url_1', v)} icon={<LinkIcon size={14} />} />
        <CRMInput theme={theme} label="Highlight 1 Duration" value={form.highlight_duration_1} onChange={v => set('highlight_duration_1', v)} icon={<AtSign size={14} />} />
        <CRMInput theme={theme} label="Highlight 2 Title" value={form.highlight_title_2} onChange={v => set('highlight_title_2', v)} icon={<FileText size={14} />} />
        <CRMInput theme={theme} label="Highlight 2 URL" value={form.highlight_url_2} onChange={v => set('highlight_url_2', v)} icon={<LinkIcon size={14} />} />
        <CRMInput theme={theme} label="Highlight 2 Duration" value={form.highlight_duration_2} onChange={v => set('highlight_duration_2', v)} icon={<AtSign size={14} />} />
      </Section>

      <SaveBar saving={saving} saved={saved} saveErr={saveErr} accentColor={accentColor} />
    </form>
  );
};

// ── STATS TAB ─────────────────────────────────────────────────────────────────

const StatsTab = ({ player, theme, accentColor, refreshData }) => {
  const [form, setForm] = useState(player);
  const { saving, saved, saveErr, save } = useSave(refreshData);
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); save(form); }} className="space-y-10">
      <div className={`p-4 rounded-2xl border text-[11px] font-bold ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white/50' : 'bg-neutral-100 border-black/5 text-neutral-500'}`}>
        💡 Every save auto-snapshots stats to the Trends tab for historical tracking.
      </div>
      <Section title="Season Performance" theme={theme}>
        <CRMInput theme={theme} label="Goals" type="number" value={form.goals} onChange={v => set('goals', v)} icon={<BarChart3 size={14} />} />
        <CRMInput theme={theme} label="Assists" type="number" value={form.assists} onChange={v => set('assists', v)} icon={<BarChart3 size={14} />} />
        <CRMInput theme={theme} label="Recoveries / 90" value={form.recoveries} onChange={v => set('recoveries', v)} icon={<BarChart3 size={14} />} />
        <CRMInput theme={theme} label="Pass Accuracy" value={form.pass_accuracy} onChange={v => set('pass_accuracy', v)} icon={<TrendingUp size={14} />} />
      </Section>
      <Section title="Attacking" theme={theme}>
        <CRMInput theme={theme} label="Shot Conversion" value={form.shot_conversion} onChange={v => set('shot_conversion', v)} icon={<Zap size={14} />} />
        <CRMInput theme={theme} label="Dribble Success" value={form.dribble_success} onChange={v => set('dribble_success', v)} icon={<Activity size={14} />} />
        <CRMInput theme={theme} label="Chances Created" value={form.chances_created} onChange={v => set('chances_created', v)} icon={<BarChart3 size={14} />} />
      </Section>
      <Section title="Physical" theme={theme}>
        <CRMInput theme={theme} label="Sprint Speed" value={form.sprint_speed} onChange={v => set('sprint_speed', v)} icon={<Zap size={14} />} />
        <CRMInput theme={theme} label="Avg Distance / 90" value={form.avg_distance} onChange={v => set('avg_distance', v)} icon={<Activity size={14} />} />
        <CRMInput theme={theme} label="Sprints per Match" value={form.sprints_per_match} onChange={v => set('sprints_per_match', v)} icon={<BarChart3 size={14} />} />
      </Section>
      <SaveBar saving={saving} saved={saved} saveErr={saveErr} accentColor={accentColor} />
    </form>
  );
};

// ── ACHIEVEMENTS TAB ──────────────────────────────────────────────────────────

const AchievementsTab = ({ player, theme, accentColor, refreshData }) => {
  const [list, setList] = useState((player.achievements || '').split('\n').filter(Boolean));
  const [newItem, setNewItem] = useState('');
  const { saving, saved, saveErr, save } = useSave(refreshData);
  const inputClass = theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-50 border-black/10 text-neutral-900';

  const add = () => { const t = newItem.trim(); if (!t) return; setList(p => [...p, t]); setNewItem(''); };
  const remove = i => setList(p => p.filter((_, j) => j !== i));

  return (
    <div className="space-y-6">
      <ul className="space-y-3">
        {list.map((item, i) => (
          <li key={i} className={`flex items-center justify-between gap-4 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
            <div className="flex items-center gap-3">
              <Award size={16} style={{ color: accentColor }} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{item}</span>
            </div>
            <button type="button" onClick={() => remove(i)} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition">Remove</button>
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <input type="text" placeholder="Add achievement…" value={newItem} onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          className={`flex-1 p-4 rounded-xl border outline-none text-sm ${inputClass}`} />
        <button type="button" onClick={add} className="px-6 py-4 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:brightness-110 transition" style={{ backgroundColor: accentColor }}>Add</button>
      </div>
      <SaveBar saving={saving} saved={saved} saveErr={saveErr} onSave={() => save({ achievements: list.join('\n') })} accentColor={accentColor} />
    </div>
  );
};

// ── CLUBS TAB ─────────────────────────────────────────────────────────────────

const ClubsTab = ({ theme, accentColor }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ club_name: '', role: '', season: '', apps: '', goals: '' });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const inputClass = theme === 'dark' ? 'bg-black/40 border-white/5 text-white' : 'bg-white border-black/10 text-neutral-900';
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';

  const fetch_ = useCallback(async () => {
    const r = await axios.get('/api/crm/previous-clubs'); setClubs(r.data || []); setLoading(false);
  }, []);
  useEffect(() => { fetch_(); }, [fetch_]);

  const handleSave = async () => {
    if (!form.club_name.trim()) return;
    setSaving(true);
    try {
      if (editId) { await axios.patch(`/api/crm/previous-clubs/${editId}`, form); setEditId(null); }
      else { await axios.post('/api/crm/previous-clubs', form); }
      setForm({ club_name: '', role: '', season: '', apps: '', goals: '' });
      await fetch_();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this club entry?')) return;
    await axios.delete(`/api/crm/previous-clubs/${id}`); await fetch_();
  };

  const startEdit = (club) => { setEditId(club.id); setForm({ club_name: club.club_name, role: club.role, season: club.season, apps: club.apps, goals: club.goals }); };

  return (
    <div className="space-y-8">
      <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Previous Clubs</p>

      {/* List */}
      {clubs.map(club => (
        <div key={club.id} className={`flex items-center justify-between p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
          <div>
            <p className={`font-black text-sm uppercase ${textColor}`}>{club.club_name}</p>
            <div className="flex gap-4 mt-1">
              {club.role && <span className={`text-[10px] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>{club.role}</span>}
              {club.season && <span className={`text-[10px] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>{club.season}</span>}
              {club.apps && <span className={`text-[10px] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>{club.apps} Apps</span>}
              {club.goals && <span className="text-[10px]" style={{ color: accentColor }}>{club.goals} Goals</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => startEdit(club)} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border transition ${theme === 'dark' ? 'border-white/10 text-white/40 hover:border-white/30' : 'border-black/10 text-neutral-400 hover:border-black/20'}`}>Edit</button>
            <button onClick={() => handleDelete(club.id)} className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition">Delete</button>
          </div>
        </div>
      ))}
      {!loading && clubs.length === 0 && (
        <p className={`text-sm text-center py-8 ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>No previous clubs yet. Add one below.</p>
      )}

      {/* Add / Edit form */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>{editId ? 'Edit Club' : 'Add Club'}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {[['club_name', 'Club Name'], ['role', 'Role/Position'], ['season', 'Season (e.g. 2023/24)'], ['apps', 'Appearances'], ['goals', 'Goals']].map(([key, label]) => (
            <input key={key} type="text" placeholder={label} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              className={`p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          ))}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex-1 py-4 rounded-xl text-white font-black uppercase text-[10px] tracking-widest disabled:opacity-50 hover:brightness-110 transition"
            style={{ backgroundColor: accentColor }}>
            {saving ? 'Saving…' : editId ? 'Update Club' : 'Add Club'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ club_name: '', role: '', season: '', apps: '', goals: '' }); }}
            className={`px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border transition ${theme === 'dark' ? 'border-white/10 text-white/40' : 'border-black/10 text-neutral-400'}`}>Cancel</button>}
        </div>
      </div>
    </div>
  );
};

// ── FIXTURES TAB ──────────────────────────────────────────────────────────────

const FixturesTab = ({ theme, accentColor, playerClub }) => {
  const makeBlank = useCallback(() => ({
    match_date: '', match_time: '', home_team: playerClub || '',
    away_team: '', venue: '', competition: '',
    home_score: '', away_score: '', is_completed: false, notes: '',
  }), [playerClub]);

  const [fixtures, setFixtures] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(makeBlank);
  const [saveErr, setSaveErr] = useState('');

  const inputClass = theme === 'dark'
    ? 'bg-black/40 border-white/5 text-white placeholder:text-white/30'
    : 'bg-white border-black/10 text-neutral-900 placeholder:text-neutral-400';
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';

  const fetch_ = useCallback(async () => {
    try {
      const r = await axios.get('/api/crm/fixtures');
      setFixtures(r.data || []);
    } catch (e) { console.error('fetch fixtures:', e); }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleEdit = (f) => {
    // match_date from DB is 'YYYY-MM-DD' — use as-is for date input
    setEditId(f.id);
    setForm({
      match_date: f.match_date || '',
      match_time: f.match_time || '',
      home_team: f.home_team || '',
      away_team: f.away_team || '',
      venue: f.venue || '',
      competition: f.competition || '',
      home_score: f.home_score !== null && f.home_score !== undefined ? String(f.home_score) : '',
      away_score: f.away_score !== null && f.away_score !== undefined ? String(f.away_score) : '',
      is_completed: Boolean(f.is_completed),
      notes: f.notes || '',
    });
    setSaveErr('');
    // Scroll form into view
    setTimeout(() => document.getElementById('fixture-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleCancel = () => { setEditId(null); setForm(makeBlank()); setSaveErr(''); };

  const handleSave = async () => {
    if (!form.match_date) { setSaveErr('Match date is required.'); return; }
    if (!form.home_team) { setSaveErr('Home team is required.'); return; }
    if (!form.away_team) { setSaveErr('Away team is required.'); return; }
    setSaving(true); setSaveErr('');
    try {
      const payload = {
        ...form,
        home_score: form.home_score === '' ? null : Number(form.home_score),
        away_score: form.away_score === '' ? null : Number(form.away_score),
        is_completed: form.is_completed ? 1 : 0,
      };
      if (editId) {
        await axios.patch(`/api/crm/fixtures/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post('/api/crm/fixtures', payload);
      }
      setForm(makeBlank());
      await fetch_();
    } catch (e) {
      setSaveErr(e.response?.data?.error || 'Save failed. Check your connection.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fixture? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/crm/fixtures/${id}`);
      await fetch_();
      if (editId === id) handleCancel();
    } catch (e) {
      alert('Delete failed: ' + (e.response?.data?.error || e.message));
    }
  };

  return (
    <div className="space-y-8">
      <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
        Match Schedule — {fixtures.length} fixture{fixtures.length !== 1 ? 's' : ''}
      </p>

      {/* ── Fixture list ────────────────────────────────────────────── */}
      <div className="space-y-3">
        {fixtures.length === 0 && (
          <p className={`text-sm text-center py-8 ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>
            No fixtures yet. Add one below.
          </p>
        )}
        {fixtures.map(f => {
          const isEditing = editId === f.id;
          // Parse date safely (treat as local date to avoid timezone shift)
          const parts = (f.match_date || '').split('-');
          const dateStr = parts.length === 3
            ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
              .toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
            : f.match_date;

          return (
            <div key={f.id}
              className={`p-5 rounded-2xl border transition ${isEditing
                ? ''
                : theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'
                }`}
              style={isEditing ? { borderColor: accentColor, backgroundColor: `${accentColor}08` } : {}}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: accentColor }}>
                      {f.competition || 'Match'}
                    </span>
                    <span className={`text-[9px] ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>
                      {dateStr}{f.match_time ? ` · ${f.match_time}` : ''}
                    </span>
                    {f.is_completed
                      ? <span className="text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Completed</span>
                      : <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Upcoming</span>
                    }
                    {isEditing && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>Editing</span>}
                  </div>
                  <p className={`font-black text-sm ${textColor}`}>
                    {f.home_team}
                    {' '}
                    {(f.home_score !== null && f.home_score !== undefined && f.away_score !== null && f.away_score !== undefined)
                      ? <span className={`${theme === 'dark' ? 'text-white/60' : 'text-neutral-500'}`}>{f.home_score} – {f.away_score}</span>
                      : <span className={`text-[11px] ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>vs</span>
                    }
                    {' '}
                    {f.away_team}
                  </p>
                  {f.venue && (
                    <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>📍 {f.venue}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {isEditing ? (
                    <button onClick={handleCancel}
                      className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border transition ${theme === 'dark' ? 'border-white/10 text-white/40' : 'border-black/10 text-neutral-400'}`}>
                      Cancel
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(f)}
                      className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border transition ${theme === 'dark' ? 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70' : 'border-black/10 text-neutral-400 hover:border-black/30'}`}>
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDelete(f.id)}
                    className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add / Edit form ──────────────────────────────────────────── */}
      <div id="fixture-form" className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}
        style={editId ? { borderColor: `${accentColor}60` } : {}}>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-5 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
          {editId ? '✏️ Edit Fixture' : '+ Add New Fixture'}
        </p>

        {/* Row 1: date, time, competition */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Match Date *</label>
            <input type="date" value={form.match_date} onChange={e => setField('match_date', e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          </div>
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Kick-off Time</label>
            <input type="time" value={form.match_time} onChange={e => setField('match_time', e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          </div>
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Competition</label>
            <input type="text" placeholder="e.g. PSL, Nedbank Cup" value={form.competition} onChange={e => setField('competition', e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          </div>
        </div>

        {/* Row 2: teams + venue */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Home Team *</label>
            <input type="text" placeholder="Home Team" value={form.home_team} onChange={e => setField('home_team', e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          </div>
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Away Team *</label>
            <input type="text" placeholder="Away Team" value={form.away_team} onChange={e => setField('away_team', e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          </div>
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Venue</label>
            <input type="text" placeholder="Stadium / Ground" value={form.venue} onChange={e => setField('venue', e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          </div>
        </div>

        {/* Row 3: scores + completed */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Home Score</label>
            <input type="number" min="0" placeholder="—" value={form.home_score} onChange={e => setField('home_score', e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          </div>
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Away Score</label>
            <input type="number" min="0" placeholder="—" value={form.away_score} onChange={e => setField('away_score', e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
          </div>
          <div>
            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Status</label>
            <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer h-[42px] ${theme === 'dark' ? 'border-white/5 text-white/60' : 'border-black/5 text-neutral-500'}`}>
              <input type="checkbox" checked={form.is_completed} onChange={e => setField('is_completed', e.target.checked)} className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Completed</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Notes</label>
          <input type="text" placeholder="Optional notes or lineup info" value={form.notes} onChange={e => setField('notes', e.target.value)}
            className={`w-full p-3 rounded-xl border outline-none text-sm ${inputClass}`} />
        </div>

        {/* Error */}
        {saveErr && (
          <p className="text-red-400 text-xs font-bold mb-3">⚠️ {saveErr}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex-1 py-4 rounded-xl text-white font-black uppercase text-[10px] tracking-widest disabled:opacity-50 hover:brightness-110 transition"
            style={{ backgroundColor: accentColor }}>
            {saving ? 'Saving…' : editId ? '✓ Update Fixture' : '+ Add Fixture'}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel}
              className={`px-6 py-4 rounded-xl font-black uppercase text-[10px] border transition ${theme === 'dark' ? 'border-white/10 text-white/40 hover:border-white/20' : 'border-black/10 text-neutral-400 hover:border-black/20'}`}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── MEDIA TAB ─────────────────────────────────────────────────────────────────

const MediaTab = ({ theme, accentColor }) => {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [uploadOk, setUploadOk] = useState('');
  const [activeCat, setActiveCat] = useState('photo');
  const [dragOver, setDragOver] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const fileInputRef = useRef(null);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';

  const fetchMedia = useCallback(async () => {
    const r = await axios.get('/api/media'); setItems(r.data || []);
  }, []);
  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true); setUploadErr(''); setUploadOk(''); let ok = 0;
    for (const file of Array.from(files)) {
      try {
        const result = await cloudinaryUpload(file, activeCat);
        const isVid = file.type.startsWith('video/');
        await axios.post('/api/media', {
          category: activeCat, title: file.name.replace(/\.[^.]+$/, ''),
          url: result.secure_url, public_id: result.public_id,
          thumbnail: isVid ? result.secure_url.replace('/upload/', '/upload/so_0,w_400/') + '.jpg' : result.secure_url,
          duration: result.duration ? `${Math.round(result.duration)}s` : '',
          file_type: file.type,
        });
        ok++;
      } catch (e) { setUploadErr(`Failed: ${file.name} — ${e.message}`); }
    }
    if (ok > 0) setUploadOk(`${ok} file${ok > 1 ? 's' : ''} uploaded`);
    await fetchMedia(); setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    await axios.delete(`/api/media/${id}`); setItems(p => p.filter(i => i.id !== id));
  };

  const handleEditSave = async (id) => {
    await axios.patch(`/api/media/${id}`, { title: editTitle, category: activeCat });
    setItems(p => p.map(i => i.id === id ? { ...i, title: editTitle } : i)); setEditId(null);
  };

  const filtered = items.filter(i => i.category === activeCat);
  const cat = MEDIA_CATEGORIES.find(c => c.id === activeCat);

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MEDIA_CATEGORIES.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setActiveCat(id)}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border transition ${activeCat === id ? 'border-opacity-100' : ''} ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-black/10'}`}
            style={activeCat === id ? { borderColor: accentColor, backgroundColor: `${accentColor}15`, color: accentColor } : {}}>
            <Icon size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            <span className="text-[10px] opacity-40">{items.filter(i => i.category === id).length} files</span>
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${dragOver ? '' : 'hover:opacity-80'}`}
        style={{ borderColor: dragOver ? accentColor : `${accentColor}40`, backgroundColor: dragOver ? `${accentColor}10` : '' }}>
        <input ref={fileInputRef} type="file" multiple accept={cat?.accept} className="hidden" onChange={e => handleFiles(e.target.files)} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white/50' : 'text-neutral-500'}`}>Uploading to Cloudinary…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className={theme === 'dark' ? 'text-white/20' : 'text-neutral-300'} />
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white/50' : 'text-neutral-500'}`}>
              Drop files here or <span style={{ color: accentColor }}>browse</span>
            </p>
            <p className="text-[10px]" style={{ color: accentColor }}>Uploading as: {cat?.label.toUpperCase()} ({cat?.accept})</p>
          </div>
        )}
      </div>

      {uploadErr && <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">{uploadErr}</div>}
      {uploadOk && <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">✓ {uploadOk}</div>}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
            <div className="relative aspect-video bg-neutral-900 overflow-hidden flex items-center justify-center">
              {item.category === 'video'
                ? <video src={item.url} className="w-full h-full object-cover" preload="metadata" />
                : item.category === 'certificate'
                  ? <div className="flex flex-col items-center gap-2" style={{ color: accentColor }}><Award size={32} /><span className="text-[10px] font-bold uppercase">PDF</span></div>
                  : <img src={item.thumbnail || item.url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
              }
            </div>
            <div className="p-4">
              {editId === item.id ? (
                <div className="flex gap-2">
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus
                    className={`flex-1 text-sm p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10 text-neutral-900'}`} />
                  <button type="button" onClick={() => handleEditSave(item.id)} style={{ color: accentColor }} className="text-[10px] font-black uppercase">Save</button>
                  <button type="button" onClick={() => setEditId(null)} className="text-white/30"><X size={12} /></button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => { setEditId(item.id); setEditTitle(item.title); }}
                    className={`text-sm font-bold truncate text-left hover:opacity-70 transition ${textColor}`}>
                    {item.title || 'Untitled'}
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-500 shrink-0 ml-2 transition"><Trash2 size={14} /></button>
                </div>
              )}
              <a href={item.url} target="_blank" rel="noreferrer" className="text-[10px] mt-1 block" style={{ color: accentColor }}>Open ↗</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── TRENDS TAB ────────────────────────────────────────────────────────────────

const TrendsTab = ({ theme, accentColor }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const mutedColor = theme === 'dark' ? 'text-white/30' : 'text-neutral-400';
  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5';

  useEffect(() => { axios.get('/api/history?limit=20').then(r => setHistory(r.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-24"><div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} /></div>;
  if (history.length < 2) return (
    <div className={`text-center py-24 ${mutedColor}`}>
      <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
      <p className="font-bold uppercase tracking-widest text-xs mb-2">Not enough data yet</p>
      <p className="text-[11px]">Save Stats at least twice — each save creates a snapshot here.</p>
    </div>
  );

  const parseNum = v => parseFloat(String(v || '0').replace(/[^0-9.]/g, '')) || 0;
  const latest = history[history.length - 1];
  const prevSnap = history[history.length - 2];
  const getLabel = h => h.label || new Date(h.snapped_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });

  const metrics = [
    { key: 'goals', label: 'Goals', color: accentColor },
    { key: 'assists', label: 'Assists', color: '#3b82f6' },
    { key: 'pass_accuracy', label: 'Pass %', color: '#10b981' },
    { key: 'shot_conversion', label: 'Shot Conv', color: '#f59e0b' },
    { key: 'dribble_success', label: 'Dribble %', color: '#8b5cf6' },
  ];

  const donutValues = metrics.map(m => parseNum(latest[m.key]));
  const donutMax = Math.max(...donutValues, 1);
  const donutNorm = donutValues.map(v => Math.round((v / donutMax) * 100));
  const donutTotal = donutNorm.reduce((a, b) => a + b, 0) || 1;
  const R = 52, CX = 80, CY = 80, SW = 16;
  const circ = 2 * Math.PI * R;
  let cumOff = 0;

  return (
    <div className="space-y-8">

      {/* Delta cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {metrics.map(({ key, label, color }, i) => {
          const cur = parseNum(latest[key]);
          const prv = parseNum(prevSnap?.[key]);
          const d = cur - prv;
          return (
            <motion.div key={key}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className={`p-5 rounded-2xl border ${cardClass}`}>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${mutedColor}`}>{label}</p>
              <p className="text-2xl font-black" style={{ color }}>{cur}</p>
              {d !== 0 && (
                <p className={`text-[10px] font-bold mt-1 ${d > 0 ? 'text-green-500' : 'text-red-400'}`}>
                  {d > 0 ? '▲' : '▼'} {Math.abs(d).toFixed(1)}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Animated bar charts — one per metric */}
      {metrics.map(({ key, label, color }, mi) => {
        const values = history.map(h => parseNum(h[key]));
        const barMax = Math.max(...values, 1);
        const BAR_H = 96;
        return (
          <motion.div key={key}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + mi * 0.1, duration: 0.45 }}
            className={`p-6 rounded-2xl border ${cardClass}`}>
            <div className="flex items-center justify-between mb-5">
              <p className={`text-[10px] font-black uppercase tracking-widest ${mutedColor}`}>{label}</p>
              <span className="text-sm font-black" style={{ color }}>{parseNum(latest[key])}</span>
            </div>
            <div className="flex items-end gap-1.5" style={{ height: BAR_H + 'px' }}>
              {values.map((v, i) => {
                const bh = Math.max(Math.round((v / barMax) * BAR_H), v > 0 ? 4 : 0);
                const isLatest = i === values.length - 1;
                const alpha = isLatest ? 1 : 0.28 + (i / Math.max(values.length - 1, 1)) * 0.48;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <motion.div
                      className="w-full rounded-t-lg relative overflow-hidden"
                      style={{ height: bh + 'px', backgroundColor: color, opacity: alpha, originY: 1 }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 + mi * 0.08 + i * 0.045, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      {isLatest && (
                        <motion.div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', width: '60%' }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                        />
                      )}
                    </motion.div>
                    {(i === 0 || i === values.length - 1) && (
                      <span className={`text-[8px] mt-1.5 text-center leading-tight ${mutedColor}`}
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                        {getLabel(history[i])}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Donut chart — relative strengths of latest snapshot */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.45 }}
        className={`p-6 rounded-2xl border ${cardClass}`}>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${mutedColor}`}>
          Relative Strengths — {getLabel(latest)}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <svg viewBox="0 0 160 160" className="w-36 h-36 shrink-0">
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}
              strokeWidth={SW} />
            {metrics.map(({ color }, i) => {
              const segPct = donutNorm[i] / donutTotal;
              const segLen = segPct * circ;
              const thisCum = cumOff;
              cumOff += segLen;
              const dashOff = circ / 4 - thisCum;
              return (
                <motion.circle key={i}
                  cx={CX} cy={CY} r={R}
                  fill="none" stroke={color} strokeWidth={SW}
                  strokeLinecap="butt"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: CX + 'px ' + CY + 'px' }}
                  strokeDashoffset={dashOff}
                  initial={{ strokeDasharray: '0 ' + circ }}
                  animate={{ strokeDasharray: segLen + ' ' + (circ - segLen) }}
                  transition={{ duration: 1.1, delay: 0.9 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              );
            })}
          </svg>
          <div className="flex-1 w-full space-y-3">
            {metrics.map(({ label, color }, i) => {
              const pct = Math.round((donutNorm[i] / donutTotal) * 100);
              return (
                <div key={label}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className={`font-bold ${mutedColor}`}>{label}</span>
                    <span className="font-black" style={{ color }}>{donutValues[i]}</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                    <motion.div className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: pct + '%' }}
                      transition={{ duration: 0.9, delay: 0.9 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

    </div>
  );
};

// ── COMMUNITY TAB ─────────────────────────────────────────────────────────────

const CommunityTab = ({ theme, accentColor, player, onBadgeUpdate }) => {
  const [follows, setFollows] = useState([]);
  const [comments, setComments] = useState([]);
  const [view, setView] = useState('comments');
  const [deleting, setDeleting] = useState(null);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const mutedColor = theme === 'dark' ? 'text-white/30' : 'text-neutral-400';
  const rowClass = theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5';

  const fetch_ = useCallback(async () => {
    const [f, c] = await Promise.all([
      axios.get('/api/crm/community/follows').then(r => r.data || []).catch(() => []),
      axios.get('/api/crm/community/comments').then(r => r.data || []).catch(() => []),
    ]);
    setFollows(f);
    setComments(c);
    // Badge clears — no more pending items
    onBadgeUpdate(0);
  }, [onBadgeUpdate]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const deleteComment = async (id) => {
    if (!window.confirm('Delete this comment? It will be removed from the public wall.')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/crm/community/comments/${id}`);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch { alert('Delete failed.'); }
    finally { setDeleting(null); }
  };

  const deleteFollow = async (id) => {
    if (!window.confirm('Remove this follower?')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/crm/community/follows/${id}`);
      setFollows(prev => prev.filter(f => f.id !== id));
    } catch { alert('Delete failed.'); }
    finally { setDeleting(null); }
  };

  const approvedFollows = follows.filter(f => f.status === 'approved');
  const approvedComments = comments.filter(c => c.status === 'approved');

  return (
    <div className="space-y-6">

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Followers', value: approvedFollows.length, color: accentColor },
          { label: 'Total Comments', value: approvedComments.length, color: accentColor },
        ].map(({ label, value, color }) => (
          <div key={label} className={`p-5 rounded-2xl border ${rowClass}`}>
            <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${mutedColor}`}>{label}</p>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* View switcher */}
      <div className={`flex gap-1 p-1 rounded-2xl w-fit ${theme === 'dark' ? 'bg-white/5' : 'bg-neutral-100'}`}>
        {[
          { id: 'comments', label: `Comments (${approvedComments.length})` },
          { id: 'follows', label: `Followers (${approvedFollows.length})` },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setView(id)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${view === id ? 'text-white' : theme === 'dark' ? 'text-white/40 hover:text-white/60' : 'text-neutral-500 hover:text-neutral-700'}`}
            style={view === id ? { backgroundColor: accentColor } : {}}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Comments list — Kagisho can delete bad ones ── */}
      {view === 'comments' && (
        <div className="space-y-3">
          {approvedComments.length === 0 && (
            <p className={`text-center py-10 text-sm ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>
              No comments yet. They appear here as soon as someone posts.
            </p>
          )}
          {approvedComments.map(c => (
            <div key={c.id} className={`p-5 rounded-2xl border ${rowClass}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0"
                    style={{ backgroundColor: accentColor }}>
                    {c.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className={`font-black text-sm ${textColor}`}>{c.name}</p>
                      <span className={`text-[9px] ${mutedColor}`}>
                        {new Date(c.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-neutral-600'}`}>
                      {c.comment}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteComment(c.id)}
                  disabled={deleting === c.id}
                  title="Delete comment"
                  className="shrink-0 p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Followers list — Kagisho can remove ── */}
      {view === 'follows' && (
        <div className="space-y-3">
          {approvedFollows.length === 0 && (
            <p className={`text-center py-10 text-sm ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>
              No followers yet. They appear here instantly when someone follows.
            </p>
          )}
          {approvedFollows.map(f => (
            <div key={f.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${rowClass}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0"
                  style={{ backgroundColor: accentColor }}>
                  {f.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className={`font-black text-sm ${textColor}`}>{f.name}</p>
                  <p className={`text-[10px] ${mutedColor}`}>
                    {new Date(f.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteFollow(f.id)}
                disabled={deleting === f.id}
                title="Remove follower"
                className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition disabled:opacity-40"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── LEADS TAB ─────────────────────────────────────────────────────────────────

const LeadsTab = ({ theme, accentColor }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';

  useEffect(() => { axios.get('/api/leads').then(r => setLeads(r.data || [])).catch(() => { }).finally(() => setLoading(false)); }, []);

  const markRead = async (id) => {
    await axios.patch(`/api/leads/${id}/read`);
    setLeads(p => p.map(l => l.id === id ? { ...l, read: true } : l));
  };

  const unread = leads.filter(l => !l.read).length;
  if (loading) return <div className={`text-center py-16 text-sm ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className={`text-sm font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Scout Inquiries</h3>
          {unread > 0 && <span className="text-white text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: accentColor }}>{unread} new</span>}
        </div>
        <span className={`text-[10px] ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>{leads.length} total</span>
      </div>
      {leads.length === 0 && <p className={`text-center py-16 ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>No leads yet.</p>}
      <div className="space-y-2">
        {leads.map(lead => (
          <div key={lead.id} className={`rounded-2xl border cursor-pointer transition ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} ${!lead.read ? 'border-opacity-100' : ''}`}
            style={!lead.read ? { borderColor: `${accentColor}40` } : {}}>
            <div className="flex items-center justify-between p-5" onClick={() => { setExpanded(expanded === lead.id ? null : lead.id); if (!lead.read) markRead(lead.id); }}>
              <div className="flex items-center gap-4 min-w-0">
                {!lead.read && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />}
                <div className="min-w-0">
                  <p className={`font-bold text-sm truncate ${textColor}`}>{lead.name}</p>
                  <p className={`text-[11px] truncate ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>{new Date(lead.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                {expanded === lead.id ? <ChevronUp size={14} className="opacity-30" /> : <ChevronDown size={14} className="opacity-30" />}
              </div>
            </div>
            {expanded === lead.id && (
              <div className={`px-5 pb-5 text-sm border-t ${theme === 'dark' ? 'text-white/60 border-white/5' : 'text-neutral-600 border-black/5'}`}>
                <p className="pt-4 whitespace-pre-wrap">{lead.message}</p>
                <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-black uppercase tracking-widest hover:underline" style={{ color: accentColor }}>
                  <Mail size={12} /> Reply via Email
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── SETTINGS TAB ──────────────────────────────────────────────────────────────

const SettingsTab = ({ theme, accentColor, settings, refreshSettings }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [geminiSaving, setGeminiSaving] = useState(false);
  const [geminiSaved, setGeminiSaved] = useState(false);
  const [geminiErr, setGeminiErr] = useState('');
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const mutedColor = theme === 'dark' ? 'text-white/40' : 'text-neutral-500';
  const cardClass = theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5';
  const inputClass = theme === 'dark' ? 'bg-black/40 border-white/5 text-white placeholder:text-white/20' : 'bg-white border-black/10 text-neutral-900';

  const setColor = async (color) => {
    setSaving(true);
    try {
      await axios.post('/api/settings', { accent_color: color });
      await refreshSettings();
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const saveGeminiKey = async () => {
    if (!geminiKey.trim()) return;
    setGeminiSaving(true); setGeminiErr('');
    try {
      await axios.post('/api/settings/gemini', { key: geminiKey.trim() });
      setGeminiSaved(true);
      setGeminiKey('');
      setTimeout(() => setGeminiSaved(false), 3000);
    } catch (e) {
      setGeminiErr(e.response?.data?.error || 'Failed to save key.');
    } finally { setGeminiSaving(false); }
  };

  const currentColor = settings?.accent_color || 'red';
  const COLORS = [
    { id: 'red', label: 'Soccer Red', hex: '#e10600', desc: 'Classic & bold — default' },
    { id: 'blue', label: 'Sky Blue', hex: '#0ea5e9', desc: 'Fresh & modern — alternate' },
  ];

  return (
    <div className="space-y-10">

      {/* Colour switcher */}
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.35em] mb-3 ${mutedColor}`}>Website Accent Colour</p>
        <p className={`text-sm mb-6 ${mutedColor}`}>
          Changes the primary accent across the entire site — buttons, highlights, stats. Applies instantly for all visitors.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COLORS.map(({ id, label, hex, desc }) => (
            <button key={id} type="button" onClick={() => setColor(id)} disabled={saving}
              className={`relative p-6 rounded-3xl border-2 text-left transition hover:scale-[1.02] disabled:opacity-50 ${currentColor === id ? '' : 'border-transparent'}`}
              style={currentColor === id ? { borderColor: hex, backgroundColor: `${hex}15` } : { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5' }}>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full shadow-lg" style={{ backgroundColor: hex }} />
                <div>
                  <p className={`font-black text-sm ${textColor}`}>{label}</p>
                  <p className={`text-[10px] ${mutedColor}`}>{desc}</p>
                </div>
              </div>
              {currentColor === id && (
                <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full text-white" style={{ backgroundColor: hex }}>Active</span>
              )}
            </button>
          ))}
        </div>
        {saved && <p className="mt-4 text-green-500 text-sm font-bold">✓ Colour updated — live for all visitors.</p>}
      </div>

      {/* Gemini API key — updatable without redeploying */}
      <div className={`p-6 rounded-2xl border ${cardClass}`}>
        <div className="flex items-center gap-3 mb-4">
          <Bot size={18} style={{ color: accentColor }} />
          <div>
            <p className={`font-black text-sm uppercase tracking-widest ${textColor}`}>AI Chatbot & Dashboard — API Key</p>
            <p className={`text-[10px] mt-0.5 ${mutedColor}`}>Groq (recommended, free) or Google Gemini — takes effect immediately</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="Paste Groq key (gsk_…) or Gemini key (AIza…)"
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveGeminiKey()}
              className={`flex-1 p-3 rounded-xl border outline-none text-sm ${inputClass}`}
            />
            <button
              type="button"
              onClick={saveGeminiKey}
              disabled={geminiSaving || !geminiKey.trim()}
              className="px-5 py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-40 hover:brightness-110 transition"
              style={{ backgroundColor: geminiSaved ? '#22c55e' : accentColor }}>
              {geminiSaving ? '…' : geminiSaved ? '✓ Saved' : 'Save Key'}
            </button>
          </div>
          <p className={`text-[10px] leading-relaxed ${mutedColor}`}>
            <strong>Groq (free &amp; fast):</strong>{' '}
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="underline" style={{ color: accentColor }}>console.groq.com</a>
            {' · '}<strong>Gemini (also free):</strong>{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline" style={{ color: accentColor }}>aistudio.google.com</a><br/>
            Current key: {settings?.ai_api_key ? (settings.ai_api_key.startsWith('gsk_') ? '●●●●●●●● (Groq · via CRM)' : '●●●●●●●● (Gemini · via CRM)') : settings?.gemini_api_key ? '●●●●●●●● (Gemini · legacy)' : '✗ not set — paste key above'}
          </p>


        </div>
      </div>

      {/* Render keep-alive info */}
      <div className={`p-6 rounded-2xl border ${cardClass}`}>
        <p className={`font-black text-sm uppercase tracking-widest mb-3 ${textColor}`}>Render Keep-Alive</p>
        <p className={`text-[11px] leading-relaxed ${mutedColor}`}>
          The server self-pings every 13 minutes to prevent Render's free tier from sleeping.
          Add <code className={`px-1 rounded text-[10px] ${theme === 'dark' ? 'bg-black/40' : 'bg-neutral-200'}`}>RENDER_EXTERNAL_URL=https://your-app.onrender.com</code> to your Render environment variables to enable this.
        </p>
      </div>
    </div>
  );
};

// ── ShareTab ──────────────────────────────────────────────────────────────────
const ShareTab = ({ player, theme, accentColor }) => {
  const [copied, setCopied] = useState(null);
  const ac = accentColor || '#e10600';
  const profileUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-neutral-900';
  const mutedColor = isDark ? 'text-white/40' : 'text-neutral-500';
  const cardClass = isDark ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5';

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2200);
    });
  };

  const whatsappMsg = `Hey! Check out ${player.name}'s official footballer profile 🔥\n\nStats, highlights, and contact info for scouts and clubs:\n${profileUrl}`;
  const emailSubject = encodeURIComponent(`${player.name} — Professional Footballer Profile`);
  const emailBody = encodeURIComponent(`Hi,\n\nI'd like to share ${player.name}'s official professional footballer profile with you.\n\nView stats, highlights, and contact info here:\n${profileUrl}\n\nBest,\n${player.name}`);
  const tweetText = encodeURIComponent(`Check out ${player.name}'s official footballer profile 🔥⚽`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(profileUrl)}&color=${isDark ? 'ffffff' : '111111'}&bgcolor=${isDark ? '111111' : 'f5f5f5'}&qzone=2`;

  const SHARE_OPTIONS = [
    { key: 'whatsapp', label: 'WhatsApp', sub: 'Send via chat', color: '#25D366', emoji: '📱', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`, '_blank') },
    { key: 'email', label: 'Email', sub: 'Send to inbox', color: ac, emoji: '✉️', action: () => window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank') },
    { key: 'linkedin', label: 'LinkedIn', sub: 'Professional network', color: '#0A66C2', emoji: '💼', action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank') },
    { key: 'twitter', label: 'X / Twitter', sub: 'Post to timeline', color: isDark ? '#fff' : '#000', emoji: '𝕏', action: () => window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(profileUrl)}`, '_blank') },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: ac }}>Spread the Word</p>
        <h2 className={`text-4xl font-black uppercase ${textColor}`}>Share Profile</h2>
        <p className={`text-sm mt-2 ${mutedColor}`}>Send your profile to scouts, clubs, agents, and friends.</p>
      </div>

      {/* Profile URL */}
      <div className={`p-6 rounded-3xl border ${cardClass}`}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: ac }}>Your Profile Link</p>
        <div className="flex items-center gap-3">
          <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border overflow-hidden ${isDark ? 'bg-black/30 border-white/8' : 'bg-white border-black/10'}`}>
            <LinkIcon size={13} style={{ color: ac }} className="shrink-0" />
            <span className={`text-sm font-mono truncate ${textColor}`}>{profileUrl}</span>
          </div>
          <button
            onClick={() => copy(profileUrl, 'url')}
            className={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition ${copied === 'url' ? 'text-white' : isDark ? 'text-white/60 border border-white/10 hover:border-white/25' : 'text-neutral-600 border border-black/10 hover:border-black/20'}`}
            style={copied === 'url' ? { backgroundColor: ac } : {}}
          >
            {copied === 'url' ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>
      </div>

      {/* Quick share buttons */}
      <div className={`p-6 rounded-3xl border ${cardClass}`}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: ac }}>Quick Share</p>
        <div className="grid grid-cols-2 gap-3">
          {SHARE_OPTIONS.map(opt => (
            <button key={opt.key} onClick={opt.action}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border text-left transition hover:scale-[1.02] active:scale-[0.97] ${isDark ? 'border-white/8 hover:border-white/20 hover:bg-white/3' : 'border-black/8 hover:border-black/15 hover:bg-black/2'}`}>
              <span className="text-2xl leading-none">{opt.emoji}</span>
              <div>
                <p className={`text-xs font-black ${textColor}`}>{opt.label}</p>
                <p className={`text-[10px] ${mutedColor}`}>{opt.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pre-written message */}
      <div className={`p-6 rounded-3xl border ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: ac }}>Ready-to-send Message</p>
          <button
            onClick={() => copy(whatsappMsg, 'msg')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${copied === 'msg' ? 'text-white' : isDark ? 'text-white/50 border border-white/10 hover:border-white/25' : 'text-neutral-500 border border-black/10 hover:border-black/20'}`}
            style={copied === 'msg' ? { backgroundColor: ac } : {}}
          >
            {copied === 'msg' ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
          </button>
        </div>
        <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line select-all ${isDark ? 'bg-black/30 text-white/60 border border-white/5' : 'bg-white text-neutral-600 border border-black/5'}`}>
          {whatsappMsg}
        </div>
        <p className={`text-[10px] mt-2 ${mutedColor}`}>Click "Copy" then paste into WhatsApp, iMessage, or anywhere.</p>
      </div>

      {/* QR Code */}
      <div className={`p-6 rounded-3xl border ${cardClass}`}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-5" style={{ color: ac }}>QR Code</p>
        <div className="flex items-start gap-6 flex-wrap">
          <div className={`w-[140px] h-[140px] rounded-2xl overflow-hidden shrink-0 flex items-center justify-center ${isDark ? 'bg-black/40' : 'bg-neutral-100'}`}>
            <img src={qrUrl} alt="Profile QR Code" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-[180px]">
            <p className={`font-black text-sm mb-2 ${textColor}`}>Scan to open your profile</p>
            <p className={`text-xs leading-relaxed mb-5 ${mutedColor}`}>
              Show this at trials, training sessions, or in-person meetings. Anyone with a phone camera opens your full profile instantly — no typing needed.
            </p>
            <a
              href={qrUrl}
              download="kagisho-blom-qr.png"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition"
              style={{ backgroundColor: ac }}
            >
              <Share2 size={12} /> Download QR
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── CHATBOT PROFILE TAB ───────────────────────────────────────────────────────

const CHATBOT_FIELDS = [
  { section: 'Personal', fields: [
    { key: 'hometown',  label: 'Hometown',  placeholder: 'e.g. Kimberley, Northern Cape' },
    { key: 'birthday',  label: 'Birthday',  placeholder: 'e.g. 14 March 2005' },
    { key: 'biography', label: 'Personal Biography', placeholder: 'Write a personal story in your own words...', rows: 4 },
  ]},
  { section: 'Family', fields: [
    { key: 'mother_name', label: 'Mother\'s Name',  placeholder: 'e.g. Dikeledi Blom' },
    { key: 'father_name', label: 'Father\'s Name',  placeholder: 'e.g. Tebogo Blom' },
    { key: 'sibling_1',   label: 'Sibling 1',       placeholder: 'Name' },
    { key: 'sibling_2',   label: 'Sibling 2',       placeholder: 'Name' },
    { key: 'sibling_3',   label: 'Sibling 3',       placeholder: 'Name' },
    { key: 'cousin_1',    label: 'Cousin 1',         placeholder: 'Name' },
    { key: 'cousin_2',    label: 'Cousin 2',         placeholder: 'Name' },
    { key: 'cousin_3',    label: 'Cousin 3',         placeholder: 'Name' },
  ]},
  { section: 'Friends & Coach', fields: [
    { key: 'coach_name',  label: 'Coach Name',  placeholder: 'e.g. Coach Sithole' },
    { key: 'friend_1',    label: 'Friend 1',    placeholder: 'Name' },
    { key: 'friend_2',    label: 'Friend 2',    placeholder: 'Name' },
    { key: 'friend_3',    label: 'Friend 3',    placeholder: 'Name' },
    { key: 'friend_4',    label: 'Friend 4',    placeholder: 'Name' },
    { key: 'friend_5',    label: 'Friend 5',    placeholder: 'Name' },
    { key: 'teammate_1',  label: 'Teammate 1',  placeholder: 'Name' },
    { key: 'teammate_2',  label: 'Teammate 2',  placeholder: 'Name' },
    { key: 'teammate_3',  label: 'Teammate 3',  placeholder: 'Name' },
  ]},
  { section: 'Personality & Interests', fields: [
    { key: 'likes',      label: 'Things I Love',   placeholder: 'e.g. Music, dogs, road trips...', rows: 2 },
    { key: 'dislikes',   label: 'Things I Dislike', placeholder: 'e.g. Being late, cold weather...', rows: 2 },
    { key: 'hobbies',    label: 'Hobbies',          placeholder: 'e.g. Gaming, gym, fishing...' },
    { key: 'fun_facts',  label: 'Fun Facts',        placeholder: 'e.g. I can juggle a ball 300 times...', rows: 2 },
    { key: 'fav_music',  label: 'Favourite Music',  placeholder: 'e.g. Amapiano, Drake, Nasty C' },
    { key: 'fav_food',   label: 'Favourite Food',   placeholder: 'e.g. Pap and wors' },
    { key: 'fav_team',   label: 'Favourite Team',   placeholder: 'e.g. Kaizer Chiefs, Barcelona' },
    { key: 'fav_movie',  label: 'Favourite Movie',  placeholder: 'e.g. Black Panther' },
  ]},
];

const ChatbotProfileTab = ({ theme, accentColor }) => {
  const [form, setForm] = useState({});
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [captionInput, setCaptionInput] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef(null);

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-neutral-900';
  const mutedColor = isDark ? 'text-white/40' : 'text-neutral-400';
  const panelClass = isDark ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-black/5';
  const inputClass = isDark
    ? 'bg-white/5 border-white/8 text-white placeholder:text-white/20'
    : 'bg-white border-black/10 text-neutral-900 placeholder:text-neutral-400';

  useEffect(() => {
    Promise.all([
      axios.get('/api/crm/chatbot-profile').then(r => setForm(r.data || {})).catch(() => {}),
      axios.get('/api/crm/chatbot-photos').then(r => setPhotos(r.data || [])).catch(() => {}),
    ]);
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true); setSaved(false);
    try { await axios.post('/api/crm/chatbot-profile', form); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch { alert('Save failed.'); }
    finally { setSaving(false); }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const cld = await cloudinaryUpload(file, 'chatbot');
      const res = await axios.post('/api/crm/chatbot-photos', {
        url: cld.secure_url,
        public_id: cld.public_id,
        caption: captionInput,
      });
      setPhotos(prev => [res.data, ...prev]);
      setCaptionInput('');
      if (fileRef.current) fileRef.current.value = '';
    } catch { alert('Upload failed.'); }
    finally { setUploading(false); }
  };

  const deletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    setDeleteId(id);
    try {
      await axios.delete(`/api/crm/chatbot-photos/${id}`);
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch { alert('Delete failed.'); }
    finally { setDeleteId(null); }
  };

  return (
    <div className="space-y-10 max-w-3xl">
      <div className={`p-4 rounded-2xl border text-[11px] font-bold ${panelClass} ${mutedColor}`}>
        Everything you fill in here gets injected into the chatbot's AI brain — the more detail, the more personal and real the responses.
      </div>

      {CHATBOT_FIELDS.map(({ section, fields }) => (
        <div key={section}>
          <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${mutedColor}`}>{section}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, placeholder, rows }) => (
              <div key={key} className={rows && rows > 1 ? 'sm:col-span-2' : ''}>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${mutedColor}`}>{label}</label>
                {rows ? (
                  <textarea
                    value={form[key] || ''}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none transition ${inputClass}`}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[key] || ''}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition ${inputClass}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <SaveBar saving={saving} saved={saved} saveErr={null} accentColor={accentColor} onSave={save} />

      {/* Photos */}
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${mutedColor}`}>Chatbot Photos</p>
        <div className={`p-5 rounded-2xl border mb-6 ${panelClass}`}>
          <p className={`text-[11px] mb-3 ${mutedColor}`}>Upload photos the chatbot can share inline when fans ask.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={captionInput}
              onChange={e => setCaptionInput(e.target.value)}
              placeholder="Caption (optional)"
              className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none transition ${inputClass}`}
            />
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white cursor-pointer hover:brightness-110 transition shrink-0"
              style={{ backgroundColor: accentColor }}>
              {uploading ? 'Uploading...' : 'Choose Photo'}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} disabled={uploading} />
            </label>
          </div>
        </div>

        {photos.length === 0 ? (
          <p className={`text-[11px] text-center py-8 ${mutedColor}`}>No photos yet — upload some above.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className={`rounded-2xl border overflow-hidden ${panelClass}`}>
                <img src={photo.url} alt={photo.caption || 'Photo'} className="w-full h-40 object-cover" />
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className={`text-[10px] flex-1 truncate ${mutedColor}`}>{photo.caption || 'No caption'}</p>
                  <button onClick={() => deletePhoto(photo.id)} disabled={deleteId === photo.id}
                    className="text-red-400 hover:text-red-500 transition shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CRM;