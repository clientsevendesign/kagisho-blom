import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Calendar, MapPin, Send, Mail, MessageSquare, User, Users, ChevronRight } from 'lucide-react';
import axios from 'axios';
import StatBox from '../components/statbox';

const Home = ({ player, theme, accentColor, settings }) => {
  const [fixtures, setFixtures] = useState({ upcoming: [], past: [] });
  const [media, setMedia] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [communityStats, setCommunityStats] = useState({ totalFollowers: 0 });
  const [formStatus, setFormStatus] = useState('');

  const nameParts = player.name?.split(' ') || ['Player'];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || '';
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const heroImg = settings?.hero_image_url || '';
  const profileImg = settings?.profile_image_url || '';

  useEffect(() => {
    axios.get('/api/fixtures').then(r => setFixtures(r.data)).catch(() => { });
    axios.get('/api/media').then(r => setMedia(r.data || [])).catch(() => { });
    axios.get('/api/community/stats').then(r => setCommunityStats(r.data)).catch(() => { });
    axios.get('/api/form-status').then(r => setFormStatus(r.data.status || '')).catch(() => { });
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try {
      await axios.post('/api/contact', formData);
      setFormSent(true);
    } catch { alert('Error sending. Please try WhatsApp directly.'); }
    finally { setFormLoading(false); }
  };

  // Pick 3 photos + 1 video for homepage preview
  const photos = media.filter(m => m.category === 'photo').slice(0, 3);
  const video = media.find(m => m.category === 'video');

  const upcomingFixtures = (fixtures.upcoming || []).slice(0, 3);

  const siteUrl = import.meta.env.VITE_SITE_URL || '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: player.name,
    jobTitle: player.position,
    nationality: player.nationality,
    description: player.bio,
    sport: 'Association Football',
    memberOf: { '@type': 'SportsTeam', name: player.club, sport: 'Association Football' },
    url: siteUrl,
    sameAs: [player.instagram, player.facebook].filter(Boolean),
    ...(player.email ? { contactPoint: { '@type': 'ContactPoint', email: player.email, contactType: 'agent' } } : {}),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-24">
      <title>{player.name} — Professional Footballer | {player.position} · {player.club}</title>
      <meta name="description" content={`Official website of ${player.name}, ${player.age}-year-old ${player.nationality} professional ${player.position.toLowerCase()}. ${player.goals} goals and ${player.assists} assists this season. ${player.is_available ? 'Available for transfer.' : `At ${player.club}.`}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-10 relative">
          <h1 className={`text-7xl md:text-[11rem] font-black uppercase tracking-tighter leading-[0.75] mb-6 ${textColor}`}>
            <span className="opacity-10 block">{firstName}</span>
            <span className="block" style={{ color: accentColor }}>{lastName}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor, borderColor: `${accentColor}30` }}>
              {player.is_available ? '● Available for Transfer' : '● Under Contract'}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest opacity-40 ${textColor}`}>{player.club}</span>
            <span className={`text-xs font-bold uppercase tracking-widest opacity-40 ${textColor}`}>{player.position}</span>
            {communityStats.totalFollowers > 0 && (
              <span className={`text-xs font-bold uppercase tracking-widest opacity-40 ${textColor}`}>
                {communityStats.totalFollowers} Followers
              </span>
            )}
            {formStatus && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor }}
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className={`text-[11px] font-medium italic opacity-60 ${textColor}`}>{formStatus}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Hero image card */}
          <div className={`md:col-span-2 md:row-span-2 rounded-[40px] relative overflow-hidden min-h-[420px] ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-neutral-200'}`}>
            {heroImg
              ? <img src={heroImg} alt={player.name} className="absolute inset-0 w-full h-full object-cover object-top" />
              : (
                <div className="absolute inset-0 flex items-end" style={{ background: `linear-gradient(135deg, ${accentColor}22 0%, #000 100%)` }}>
                  <div className="p-10">
                    <p className="font-black text-8xl italic leading-none mb-2" style={{ color: accentColor }}>{player.jersey_number || '15'}</p>
                  </div>
                </div>
              )
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute bottom-10 left-10 z-20 text-white">
              <p className="font-black text-6xl italic leading-none mb-2" style={{ color: accentColor }}>{player.jersey_number || '15'}</p>
              <h3 className="text-3xl font-black uppercase leading-none">{player.position}</h3>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/50">{player.nationality}</p>
            </div>
          </div>

          <StatBox theme={theme} label="Goals" value={player.goals} color="accent" accentColor={accentColor} />
          <StatBox theme={theme} label="Assists" value={player.assists} accentColor={accentColor} />

          {/* Contact CTA card — replaces CV link (CV available on request via CRM) */}
          <Link to="/contact"
            className={`p-10 rounded-[40px] flex flex-col justify-between hover:scale-[1.02] transition cursor-pointer shadow-xl min-h-[210px] ${theme === 'dark' ? 'bg-white text-black' : 'bg-neutral-900 text-white'}`}>
            <Phone size={40} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 mb-2">Scouts & Clubs</p>
              <h3 className="text-3xl font-black uppercase leading-none">Get in Touch</h3>
            </div>
          </Link>

          <StatBox theme={theme} label="Pass Acc." value={player.pass_accuracy} accentColor={accentColor} />
        </div>
      </section>

      {/* ── UPCOMING FIXTURES ─────────────────────────────────────────────── */}
      {upcomingFixtures.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: accentColor }}>Next Up</p>
              <h2 className={`text-4xl font-black uppercase ${textColor}`}>Fixtures</h2>
            </div>
            <Link to="/fixtures" className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition ${textColor}`}>
              All Fixtures <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingFixtures.map(f => <FixtureCard key={f.id} fixture={f} theme={theme} accentColor={accentColor} playerClub={player.club} />)}
          </div>
        </section>
      )}

      {/* ── MEDIA PREVIEW ─────────────────────────────────────────────────── */}
      {(photos.length > 0 || video) && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: accentColor }}>Gallery</p>
              <h2 className={`text-4xl font-black uppercase ${textColor}`}>Media</h2>
            </div>
            <Link to="/media" className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition ${textColor}`}>
              Full Gallery <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {photos.map((photo, i) => (
              <Link to="/media" key={photo.id}
                className={`group relative aspect-square rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
                <img src={photo.thumbnail || photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
              </Link>
            ))}
            {photos.length === 0 && video && (
              <div className={`aspect-square rounded-3xl ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'}`} />
            )}
          </div>
          {video && (
            <div className="mt-4">
              <Link to="/media" className="group relative aspect-video rounded-3xl overflow-hidden block bg-neutral-900">
                <video src={video.url} className="w-full h-full object-cover opacity-70" muted preload="metadata" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition" style={{ backgroundColor: accentColor }}>
                    <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{video.duration}</p>
                  <h4 className="text-xl font-bold uppercase">{video.title}</h4>
                </div>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ── COMMUNITY TEASER ─────────────────────────────────────────────── */}
      <section>
        <div className={`relative rounded-[40px] overflow-hidden p-12 md:p-16 ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-neutral-100'}`}
          style={{ background: `linear-gradient(135deg, ${accentColor}15 0%, transparent 60%)` }}>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: accentColor }}>Join the Squad</p>
              <h2 className={`text-5xl font-black uppercase leading-none mb-4 ${textColor}`}>Follow Kagisho</h2>
              <p className={`max-w-md leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-neutral-600'}`}>
                Be part of the journey. Follow to stay updated on matches, milestones, and achievements.
                {communityStats.totalFollowers > 0 && ` Join ${communityStats.totalFollowers} supporters already following.`}
              </p>
            </div>
            <Link to="/community"
              className="shrink-0 inline-flex items-center gap-3 px-8 py-5 rounded-2xl text-white font-black uppercase tracking-widest text-sm hover:brightness-110 transition shadow-xl"
              style={{ backgroundColor: accentColor }}>
              <Users size={18} /> Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ──────────────────────────────────────────────────── */}
      <section id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: accentColor }}>Scouts & Clubs</p>
            <h2 className={`text-5xl font-black uppercase mb-6 ${textColor}`}>Get in Touch</h2>
            <p className={`mb-8 leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-neutral-600'}`}>
              Available for trials, representation inquiries, scouting, or official football opportunities.
            </p>
            {player.whatsapp && (
              <a href={`https://wa.me/${player.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold hover:bg-green-500/20 transition">
                WhatsApp Direct →
              </a>
            )}
          </div>
          {formSent ? (
            <div className={`p-10 rounded-[40px] border flex flex-col items-center justify-center text-center gap-4 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-neutral-50 border-black/5'}`}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className={`text-2xl font-black uppercase ${textColor}`}>Message Sent!</h3>
              <p className={theme === 'dark' ? 'text-white/50' : 'text-neutral-500'}>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className={`p-8 rounded-[40px] border space-y-4 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
              {[
                { icon: <User size={16} />, type: 'text', placeholder: 'Full Name', field: 'name' },
                { icon: <Mail size={16} />, type: 'email', placeholder: 'Email Address', field: 'email' },
              ].map(({ icon, type, placeholder, field }) => (
                <div key={field} className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: accentColor }}>{icon}</div>
                  <input required type={type} placeholder={placeholder}
                    className={`w-full p-4 pl-12 rounded-xl border outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20' : 'bg-neutral-50 border-black/10 text-neutral-900'}`}
                    onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))} />
                </div>
              ))}
              <div className="relative">
                <div className="absolute left-4 top-5" style={{ color: accentColor }}><MessageSquare size={16} /></div>
                <textarea required rows={4} placeholder="Your message…"
                  className={`w-full p-4 pl-12 rounded-xl border outline-none resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20' : 'bg-neutral-50 border-black/10 text-neutral-900'}`}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} />
              </div>
              <button type="submit" disabled={formLoading}
                className="w-full py-5 text-white rounded-xl font-black uppercase hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: accentColor }}>
                {formLoading ? 'Sending…' : <><Send size={16} /> Send Inquiry</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </motion.div>
  );
};

// ── Fixture card ──────────────────────────────────────────────────────────────

const FixtureCard = ({ fixture, theme, accentColor, playerClub }) => {
  const isHome = fixture.home_team === playerClub;
  const matchDate = new Date(fixture.match_date);
  const dateStr = matchDate.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-neutral-50 border-black/5'}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: accentColor }}>{fixture.competition || 'Match'}</span>
        <span className={`text-[9px] font-bold uppercase ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>{dateStr}</span>
      </div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex-1 text-center">
          <p className={`text-sm font-black uppercase leading-tight ${isHome ? '' : 'opacity-60'} ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{fixture.home_team}</p>
          <p className={`text-[9px] uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Home</p>
        </div>
        <div className="flex flex-col items-center">
          <span className={`text-lg font-black ${theme === 'dark' ? 'text-white/20' : 'text-neutral-300'}`}>vs</span>
          {fixture.match_time && <span className={`text-[9px] font-bold ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>{fixture.match_time}</span>}
        </div>
        <div className="flex-1 text-center">
          <p className={`text-sm font-black uppercase leading-tight ${!isHome ? '' : 'opacity-60'} ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{fixture.away_team}</p>
          <p className={`text-[9px] uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>Away</p>
        </div>
      </div>
      {fixture.venue && (
        <div className="flex items-center gap-1.5 justify-center">
          <MapPin size={10} className={theme === 'dark' ? 'text-white/20' : 'text-neutral-400'} />
          <span className={`text-[9px] ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>{fixture.venue}</span>
        </div>
      )}
    </div>
  );
};

export default Home;