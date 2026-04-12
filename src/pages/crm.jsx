import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Activity, AtSign, Award, ChartBar as BarChart3, Camera, FileText, Footprints, Globe as Globe2, Hash, Link as LinkIcon, LogOut, Mail, Phone, Ruler, Save, Shield, Terminal, User, Users, Weight } from 'lucide-react';
import CRMInput from '../components/crminput';

const TABS = ['Profile', 'Leads', 'Terminal'];

const CRM = ({ player, theme, refreshData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const panelClass = theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-neutral-50 border-black/5';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className={`p-8 rounded-[40px] border ${panelClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-soccer-red text-[10px] font-black uppercase tracking-[0.35em] mb-2">Private CRM</p>
            <h2 className={`text-4xl font-black uppercase ${textColor}`}>Control Panel</h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/cv"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-black px-5 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-soccer-red hover:text-white transition"
            >
              <FileText size={14} /> CV
            </a>
            <button
              onClick={onLogout}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-black uppercase text-[10px] tracking-widest border transition ${
                theme === 'dark'
                  ? 'border-white/10 text-white/50 hover:border-soccer-red hover:text-soccer-red'
                  : 'border-black/10 text-neutral-500 hover:border-soccer-red hover:text-soccer-red'
              }`}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-8 p-1 rounded-2xl w-fit bg-black/10">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${
                activeTab === tab
                  ? 'bg-soccer-red text-white shadow-lg'
                  : theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab === 'Profile' && <User size={10} className="inline mr-1.5" />}
              {tab === 'Leads' && <Users size={10} className="inline mr-1.5" />}
              {tab === 'Terminal' && <Terminal size={10} className="inline mr-1.5" />}
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Profile' && (
          <ProfileTab player={player} theme={theme} refreshData={refreshData} />
        )}
        {activeTab === 'Leads' && (
          <LeadsTab theme={theme} />
        )}
        {activeTab === 'Terminal' && (
          <TerminalTab theme={theme} />
        )}
      </div>
    </div>
  );
};

const ProfileTab = ({ player, theme, refreshData }) => {
  const [formData, setFormData] = useState(player);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/update', formData);
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
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

      <button
        type="submit"
        disabled={saving}
        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition shadow-lg disabled:opacity-50 ${
          saved
            ? 'bg-green-500 text-white shadow-green-500/20'
            : 'bg-soccer-red text-white shadow-soccer-red/20 hover:brightness-110'
        }`}
      >
        <Save size={18} className="inline mr-2" />
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save CRM Updates'}
      </button>
    </form>
  );
};

const LeadsTab = ({ theme }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const rowClass = theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5';

  useEffect(() => {
    axios.get('/api/leads')
      .then(r => setLeads(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await axios.patch(`/api/leads/${id}/read`);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, read: true } : l));
    } catch { /* empty */ }
  };

  const unread = leads.filter(l => !l.read).length;

  if (loading) {
    return (
      <div className={`text-center py-16 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>
        Loading leads...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className={`text-center py-16 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>
        <Users size={40} className="mx-auto mb-4 opacity-20" />
        <p className="font-bold uppercase tracking-widest text-xs">No contact leads yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className={`text-sm font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
            Scout Inquiries
          </h3>
          {unread > 0 && (
            <span className="bg-soccer-red text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {unread} new
            </span>
          )}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>
          {leads.length} total
        </span>
      </div>

      <div className="space-y-2">
        {leads.map(lead => (
          <div
            key={lead.id}
            className={`rounded-2xl border transition cursor-pointer ${rowClass} ${
              !lead.read ? 'border-soccer-red/20' : theme === 'dark' ? 'border-white/5' : 'border-black/5'
            }`}
          >
            <div
              className="flex items-center justify-between p-5"
              onClick={() => {
                setExpanded(expanded === lead.id ? null : lead.id);
                if (!lead.read) markRead(lead.id);
              }}
            >
              <div className="flex items-center gap-4 min-w-0">
                {!lead.read && (
                  <div className="w-2 h-2 rounded-full bg-soccer-red shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`font-bold text-sm truncate ${textColor}`}>{lead.name}</p>
                  <p className={`text-[11px] truncate ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-[10px] ${theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}`}>
                  {new Date(lead.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <div className={`w-4 h-4 flex items-center justify-center transition-transform ${expanded === lead.id ? 'rotate-180' : ''}`}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>
            {expanded === lead.id && (
              <div className={`px-5 pb-5 text-sm leading-relaxed border-t ${theme === 'dark' ? 'text-white/60 border-white/5' : 'text-neutral-600 border-black/5'}`}>
                <p className="pt-4">{lead.message}</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1.5 mt-4 text-soccer-red text-[10px] font-black uppercase tracking-widest hover:underline"
                >
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

const LOG_COLORS = {
  info: 'text-emerald-400',
  warn: 'text-amber-400',
  error: 'text-red-400'
};

const TerminalTab = ({ theme }) => {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState('all');
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    axios.get('/api/logs')
      .then(r => setLogs(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const es = new EventSource('/api/logs/stream');
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (e) => {
      try {
        const entry = JSON.parse(e.data);
        setLogs(prev => [...prev.slice(-499), entry]);
      } catch { /* empty */ }
    };
    return () => es.close();
  }, []);

  useEffect(() => {
    if (bottomRef.current && containerRef.current) {
      const el = containerRef.current;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      if (isNearBottom) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [logs]);

  const filtered = filter === 'all' ? logs : logs.filter(l => l.level === filter);

  const fmt = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 className={`text-sm font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
            Server Logs
          </h3>
          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${connected ? 'text-emerald-400' : 'text-neutral-500'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
            {connected ? 'Live' : 'Connecting...'}
          </div>
        </div>
        <div className="flex gap-1">
          {['all', 'info', 'warn', 'error'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                filter === f
                  ? f === 'all' ? 'bg-white/10 text-white' : `${LOG_COLORS[f]} bg-current/10`
                  : theme === 'dark' ? 'text-white/20 hover:text-white/50' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className={`rounded-2xl font-mono text-[11px] p-5 h-96 overflow-y-auto space-y-1 ${
          theme === 'dark' ? 'bg-black border border-white/5' : 'bg-neutral-900 border border-black/5'
        }`}
      >
        {filtered.length === 0 ? (
          <div className="text-white/20 text-center pt-16 uppercase tracking-widest text-[10px]">
            No logs yet
          </div>
        ) : (
          filtered.map((entry, i) => (
            <div key={i} className="flex gap-3 leading-relaxed">
              <span className="text-white/20 shrink-0">{fmt(entry.created_at)}</span>
              <span className={`uppercase font-black shrink-0 w-10 ${LOG_COLORS[entry.level] || 'text-white/50'}`}>
                {entry.level}
              </span>
              <span className="text-white/80 break-all">{entry.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

const Section = ({ title, theme, children }) => (
  <section>
    <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-5 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{children}</div>
  </section>
);

export default CRM;
