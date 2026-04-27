import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Sparkle } from 'lucide-react';
import axios from 'axios';

const Fixtures = ({ player, theme, accentColor }) => {
    const [fixtures, setFixtures] = useState({ upcoming: [], past: [] });
    const [loading, setLoading] = useState(true);
    const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
    const mutedColor = theme === 'dark' ? 'text-white/40' : 'text-neutral-500';

    useEffect(() => {
        axios.get('/api/fixtures').then(r => setFixtures(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const { upcoming = [], past = [] } = fixtures;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <title>{player.name} Fixtures & Results | Upcoming Matches</title>
            <meta name="description" content={`Upcoming matches and recent results for ${player.name} at ${player.club}. Full fixture list with dates, venues and match commentary.`} />
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: accentColor }}>Match Schedule</p>
                <h2 className={`text-6xl font-black uppercase ${textColor}`}>Fixtures</h2>
            </div>

            {loading && <div className="flex justify-center py-24"><div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} /></div>}

            {!loading && upcoming.length === 0 && past.length === 0 && (
                <div className={`text-center py-24 ${mutedColor}`}>
                    <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">No fixtures scheduled yet</p>
                </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
                <div>
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.35em] mb-6 ${mutedColor}`}>Upcoming Matches</h3>
                    <div className="space-y-4">
                        {upcoming.map(f => <FixtureRow key={f.id} fixture={f} theme={theme} accentColor={accentColor} playerClub={player.club} upcoming />)}
                    </div>
                </div>
            )}

            {/* Past results */}
            {past.length > 0 && (
                <div>
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.35em] mb-6 ${mutedColor}`}>Recent Results</h3>
                    <div className="space-y-4">
                        {past.map(f => <FixtureRow key={f.id} fixture={f} theme={theme} accentColor={accentColor} playerClub={player.club} />)}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

const FixtureRow = ({ fixture, theme, accentColor, playerClub, upcoming }) => {
    const matchDate = new Date(fixture.match_date);
    const dateStr = matchDate.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const isHome = fixture.home_team === playerClub;
    const hasScore = fixture.home_score !== null && fixture.away_score !== null;

    const getResult = () => {
        if (!hasScore) return null;
        const hs = Number(fixture.home_score), as = Number(fixture.away_score);
        const myScore = isHome ? hs : as;
        const theirScore = isHome ? as : hs;
        if (myScore > theirScore) return { label: 'W', color: '#22c55e' };
        if (myScore < theirScore) return { label: 'L', color: '#ef4444' };
        return { label: 'D', color: '#f59e0b' };
    };

    const result = getResult();

    return (
        <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-neutral-50 border-black/5'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Date + competition */}
                <div className="flex flex-col gap-1 min-w-[160px]">
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: accentColor }}>{fixture.competition || 'Match'}</span>
                    <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>{dateStr}</span>
                    {fixture.match_time && !hasScore && (
                        <span className={`text-[11px] font-black ${theme === 'dark' ? 'text-white/60' : 'text-neutral-700'}`}>{fixture.match_time}</span>
                    )}
                </div>

                {/* Teams + score */}
                <div className="flex items-center gap-4 flex-1 justify-center">
                    <p className={`text-sm font-black uppercase text-right flex-1 ${isHome ? '' : 'opacity-50'} ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{fixture.home_team}</p>
                    {hasScore ? (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl ${theme === 'dark' ? 'bg-white/10' : 'bg-neutral-200'}`}>
                            <span className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>{fixture.home_score}</span>
                            <span className={theme === 'dark' ? 'text-white/20' : 'text-neutral-400'}>–</span>
                            <span className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>{fixture.away_score}</span>
                        </div>
                    ) : (
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-white/30' : 'bg-neutral-200 text-neutral-400'}`}>vs</div>
                    )}
                    <p className={`text-sm font-black uppercase flex-1 ${!isHome ? '' : 'opacity-50'} ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{fixture.away_team}</p>
                </div>

                {/* Result badge / venue */}
                <div className="flex flex-col items-end gap-1 min-w-[80px]">
                    {result && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white"
                            style={{ backgroundColor: result.color }}>{result.label}</span>
                    )}
                    {fixture.venue && (
                        <div className="flex items-center gap-1">
                            <MapPin size={10} className={theme === 'dark' ? 'text-white/20' : 'text-neutral-400'} />
                            <span className={`text-[10px] ${theme === 'dark' ? 'text-white/30' : 'text-neutral-400'}`}>{fixture.venue}</span>
                        </div>
                    )}
                </div>
            </div>
            {fixture.notes && (
                <p className={`mt-3 text-[11px] pt-3 border-t ${theme === 'dark' ? 'text-white/30 border-white/5' : 'text-neutral-400 border-black/5'}`}>{fixture.notes}</p>
            )}
            {fixture.commentary && (
                <div className={`mt-3 pt-3 border-t flex items-start gap-2.5 ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 text-[9px] font-black mt-0.5" style={{ backgroundColor: accentColor }}>K</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: accentColor }}>{upcoming ? 'Pre-match' : 'Post-match'}</p>
                            <Sparkle size={9} style={{ color: accentColor }} />
                        </div>
                        <p className={`text-[12px] leading-relaxed italic ${theme === 'dark' ? 'text-white/60' : 'text-neutral-500'}`}>&ldquo;{fixture.commentary}&rdquo;</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fixtures;