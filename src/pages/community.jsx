import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, MessageCircle, CheckCircle, Send, Sparkles, Sparkle } from 'lucide-react';
import axios from 'axios';

// ── Avatar colour from name hash ──────────────────────────────────────────────
const AVATAR_COLORS = [
    '#e10600', '#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
];
const getAvatarColor = (name = '') => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

// ── Emoji reactions (local only — no backend) ─────────────────────────────────
const REACTIONS = ['⚽', '🔥', '💪', '🏆', '👏', '❤️', '🎯', '⚡', '🙌', '🤩'];

// Convert emoji char to Twemoji SVG CDN URL
const emojiUrl = (emoji) => {
    const points = [...emoji]
        .map(c => c.codePointAt(0).toString(16))
        .filter(cp => cp !== 'fe0f');
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${points.join('-')}.svg`;
};

const CommentCard = ({ comment, index, accentColor, theme }) => {
        const [reactions, setReactions] = useState(Object.fromEntries(REACTIONS.map(e => [e, 0])));
    const [reacted, setReacted] = useState(null);
    const avatarColor = getAvatarColor(comment.name);
    const isDark = theme === 'dark';

    const react = (emoji) => {
        if (reacted === emoji) {
            setReactions(r => ({ ...r, [emoji]: Math.max(0, r[emoji] - 1) }));
            setReacted(null);
        } else {
            setReactions(r => ({
                ...r,
                ...(reacted ? { [reacted]: Math.max(0, r[reacted] - 1) } : {}),
                [emoji]: r[emoji] + 1,
            }));
            setReacted(emoji);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className={`p-6 rounded-3xl border flex flex-col gap-4 ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-black/5 shadow-sm'
                }`}
        >
            <div className="flex items-start gap-3">
                <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 select-none"
                    style={{ backgroundColor: avatarColor }}
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                    {comment.name?.[0]?.toUpperCase() || '?'}
                </motion.div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                        <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>{comment.name}</p>
                        <p className={`text-[10px] shrink-0 ${isDark ? 'text-white/20' : 'text-neutral-400'}`}>
                            {new Date(comment.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                        </p>
                    </div>
                    <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-white/60' : 'text-neutral-600'}`}>
                        {comment.comment}
                    </p>
                </div>
            </div>
            {/* Local emoji reactions */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {REACTIONS.map(emoji => {
                    const count = reactions[emoji];
                    const active = reacted === emoji;
                    return (
                        <motion.button key={emoji} onClick={() => react(emoji)} whileTap={{ scale: 0.8 }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${active ? 'border-transparent text-white'
                                    : isDark ? 'border-white/8 text-white/30 hover:border-white/20 hover:text-white/60'
                                        : 'border-black/8 text-neutral-400 hover:border-black/20'
                                }`}
                            style={active ? { backgroundColor: accentColor } : {}}>
                            <img src={emojiUrl(emoji)} alt={emoji} className="w-4 h-4" draggable={false} />{count > 0 && <span className="ml-0.5">{count}</span>}
                        </motion.button>
                    );
                })}
            </div>
            {/* AI reply from Kagisho */}
            {comment.ai_reply && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 22 }}
                    className={`mt-2 pt-4 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}
                >
                    <div className="flex items-start gap-2.5">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 text-[10px] font-black mt-0.5 shadow-md"
                            style={{ backgroundColor: accentColor }}
                        >
                            K
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: accentColor }}>Kagisho replied</p>
                                <Sparkle size={9} style={{ color: accentColor }} />
                            </div>
                            <p className={`text-[12px] leading-relaxed italic ${isDark ? 'text-white/65' : 'text-neutral-600'}`}>
                                &ldquo;{comment.ai_reply}&rdquo;
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

// ── Follower avatar strip ─────────────────────────────────────────────────────
const FollowerStrip = ({ count, sampleNames, accentColor, theme }) => {
    if (!count) return null;
    const isDark = theme === 'dark';
    const shown = sampleNames.slice(0, 10);
    const extra = count - shown.length;

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <div className="flex -space-x-2">
                {shown.map((name, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
                        title={name}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 select-none"
                        style={{ backgroundColor: getAvatarColor(name), borderColor: isDark ? '#0f0f0f' : '#ffffff', zIndex: shown.length - i }}>
                        {name?.[0]?.toUpperCase() || '?'}
                    </motion.div>
                ))}
                {extra > 0 && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black border-2 text-white"
                        style={{ backgroundColor: accentColor, borderColor: isDark ? '#0f0f0f' : '#ffffff', zIndex: 0 }}>
                        +{extra}
                    </div>
                )}
            </div>
            <p className={`text-[11px] font-bold ${isDark ? 'text-white/40' : 'text-neutral-500'}`}>
                {count} supporter{count !== 1 ? 's' : ''} following
            </p>
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Community = ({ player, theme, accentColor }) => {
    const [comments, setComments] = useState([]);
    const [followerData, setFollowerData] = useState({ count: 0, names: [] });
    const [activeTab, setActiveTab] = useState('wall');

    // Follow
    const [followName, setFollowName] = useState('');
    const [followDone, setFollowDone] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [followMessage, setFollowMessage] = useState('');

    // Comment
    const [commentName, setCommentName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [commentPosted, setCommentPosted] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    const ac = accentColor || '#e10600';
    const isDark = theme === 'dark';
    const textColor = isDark ? 'text-white' : 'text-neutral-900';
    const mutedColor = isDark ? 'text-white/50' : 'text-neutral-500';
    const cardClass = isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-black/5 shadow-sm';
    const inputClass = isDark
        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/25'
        : 'bg-neutral-50 border-black/10 text-neutral-900 placeholder:text-neutral-400';

    const fetchData = useCallback(async () => {
        const [cRes, sRes] = await Promise.allSettled([
            axios.get('/api/community/comments'),
            axios.get('/api/community/stats'),
        ]);
        const newComments = cRes.status === 'fulfilled' ? cRes.value.data || [] : [];
        const stats = sRes.status === 'fulfilled' ? sRes.value.data || {} : {};
        setComments(newComments);
        // Build follower names from comment authors as a visual proxy
        const names = [...new Set(newComments.map(c => c.name))].slice(0, 12);
        setFollowerData({ count: stats.totalFollowers || 0, names });
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleFollow = async (e) => {
        e.preventDefault();
        if (!followName.trim()) return;
        setFollowLoading(true);
        try {
            const followRes = await axios.post('/api/community/follow', { name: followName.trim() });
            setFollowDone(true);
            setFollowMessage(followRes.data.ai_welcome || '');
            setFollowName('');
            // Refresh to update count
            setTimeout(fetchData, 500);
        } catch { alert('Something went wrong. Please try again.'); }
        finally { setFollowLoading(false); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentName.trim() || !commentText.trim()) return;
        setCommentLoading(true);
        try {
            const commentPostRes = await axios.post('/api/community/comment', {
                name: commentName.trim(),
                comment: commentText.trim(),
            });
            // Optimistic update
            const newComment = {
                id: `temp-${Date.now()}`,
                name: commentName.trim(),
                comment: commentText.trim(),
                created_at: new Date().toISOString(),
                status: 'approved',
                ai_reply: commentPostRes.data.ai_reply || null,
            };
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
            setCommentPosted(true);
            setTimeout(() => setCommentPosted(false), 4000);
        } catch { alert('Something went wrong. Please try again.'); }
        finally { setCommentLoading(false); }
    };

    const TABS = [
        { id: 'wall', label: 'Wall', icon: <MessageCircle size={13} />, badge: comments.length },
        { id: 'follow', label: 'Follow', icon: <Heart size={13} />, badge: followerData.count },
        { id: 'comment', label: 'Post', icon: <Send size={13} /> },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-10">

            {/* Header */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: ac }}>The Fanbase</p>
                <h2 className={`text-6xl font-black uppercase mb-4 ${textColor}`}>Community</h2>
                <p className={`max-w-xl leading-relaxed ${mutedColor}`}>
                    Be part of Kagisho's journey. Follow along, drop your support, and leave your mark on the wall.
                </p>
                {/* Stats */}
                <div className="flex items-center gap-3 mt-5 flex-wrap">
                    <motion.div whileHover={{ scale: 1.04 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-black"
                        style={{ backgroundColor: `${ac}12`, borderColor: `${ac}25`, color: ac }}>
                        <Users size={14} />
                        <motion.span key={followerData.count} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}>
                            {followerData.count} Supporters
                        </motion.span>
                    </motion.div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${isDark ? 'border-white/10 text-white/40' : 'border-black/10 text-neutral-400'}`}>
                        <MessageCircle size={14} /> {comments.length} Messages
                    </div>
                </div>
                {/* Follower strip */}
                {followerData.count > 0 && (
                    <div className="mt-5">
                        <FollowerStrip count={followerData.count} sampleNames={followerData.names} accentColor={ac} theme={theme} />
                    </div>
                )}
            </div>

            {/* Tab bar */}
            <div className={`flex gap-1.5 p-1.5 rounded-2xl w-fit ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`}>
                {TABS.map(tab => (
                    <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${activeTab === tab.id ? 'text-white shadow-lg'
                                : isDark ? 'text-white/40 hover:text-white/70' : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        style={activeTab === tab.id ? { backgroundColor: ac } : {}}>
                        {tab.icon} {tab.label}
                        {tab.badge > 0 && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : isDark ? 'bg-white/10 text-white/40' : 'bg-black/10 text-neutral-500'
                                }`}>{tab.badge}</span>
                        )}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">

                {/* ── WALL ──────────────────────────────────────────────────────── */}
                {activeTab === 'wall' && (
                    <motion.div key="wall" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                        {comments.length === 0 ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className={`p-16 rounded-[40px] border text-center ${cardClass}`}>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                                    className="text-5xl mb-5">⚽</motion.div>
                                <h3 className={`text-2xl font-black uppercase mb-3 ${textColor}`}>Be the first!</h3>
                                <p className={`mb-6 ${mutedColor}`}>No messages yet. Drop the first one for Kagisho.</p>
                                <button onClick={() => setActiveTab('comment')}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-black uppercase tracking-widest hover:brightness-110 transition"
                                    style={{ backgroundColor: ac }}>
                                    <Send size={14} /> Leave a Message
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Quick post bar */}
                                <div className={`p-3 rounded-2xl border flex gap-3 items-center ${isDark ? 'bg-white/3 border-white/5' : 'bg-neutral-50 border-black/5'}`}>
                                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white"
                                        style={{ backgroundColor: ac }}>
                                        <Sparkles size={13} />
                                    </div>
                                    <button onClick={() => setActiveTab('comment')}
                                        className={`flex-1 text-left text-sm px-4 py-2.5 rounded-xl border transition ${isDark ? 'bg-white/5 border-white/8 text-white/25 hover:text-white/40'
                                                : 'bg-white border-black/10 text-neutral-400 hover:text-neutral-600'
                                            }`}>
                                        Write something for Kagisho…
                                    </button>
                                    <button onClick={() => setActiveTab('comment')}
                                        className="px-4 py-2.5 rounded-xl text-white text-[10px] font-black hover:brightness-110 transition"
                                        style={{ backgroundColor: ac }}>
                                        <Send size={13} />
                                    </button>
                                </div>

                                {/* Masonry-style comment grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {comments.map((comment, i) => (
                                        <CommentCard key={comment.id} comment={comment} index={i} accentColor={ac} theme={theme} />
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                {/* ── FOLLOW ────────────────────────────────────────────────────── */}
                {activeTab === 'follow' && (
                    <motion.div key="follow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        {followDone ? (
                            <div className={`p-14 rounded-[40px] border text-center ${cardClass}`}>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 280, damping: 14 }}
                                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                    style={{ backgroundColor: `${ac}20` }}>
                                    <CheckCircle size={36} style={{ color: ac }} />
                                </motion.div>
                                <h3 className={`text-2xl font-black uppercase mb-3 ${textColor}`}>You're in! 🎉</h3>
                                <p className={`mb-6 ${mutedColor}`}>
                                    {followMessage || `Welcome to the squad. You're now following ${player.name}.`}
                                </p>
                                <button onClick={() => { setFollowDone(false); setActiveTab('wall'); }}
                                    className="text-sm font-bold underline" style={{ color: ac }}>
                                    Back to the wall
                                </button>
                            </div>
                        ) : (
                            <div className={`p-10 rounded-[40px] border ${cardClass}`}>
                                {/* Player card */}
                                <div className="flex items-center gap-4 mb-8 pb-6 border-b"
                                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl"
                                        style={{ backgroundColor: ac }}>
                                        {player.name?.[0]}
                                    </div>
                                    <div>
                                        <p className={`font-black uppercase text-lg leading-tight ${textColor}`}>{player.name}</p>
                                        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: ac }}>
                                            {player.position} · {player.club}
                                        </p>
                                        <p className={`text-[11px] mt-0.5 ${mutedColor}`}>
                                            {followerData.count} supporters already following
                                        </p>
                                    </div>
                                </div>

                                <h3 className={`text-xl font-black uppercase mb-2 ${textColor}`}>Join the Squad</h3>
                                <p className={`text-sm mb-6 ${mutedColor}`}>Just your name — you're instantly in.</p>
                                <form onSubmit={handleFollow} className="space-y-4">
                                    <input required type="text" placeholder="Your name" value={followName} maxLength={50}
                                        onChange={e => setFollowName(e.target.value)}
                                        className={`w-full p-4 rounded-2xl border outline-none text-sm transition ${inputClass}`} />
                                    <motion.button type="submit" disabled={followLoading || !followName.trim()}
                                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                        className="w-full py-5 text-white rounded-2xl font-black uppercase tracking-widest transition disabled:opacity-40 flex items-center justify-center gap-2"
                                        style={{ backgroundColor: ac }}>
                                        {followLoading
                                            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <><Heart size={16} /> Follow {player.name}</>}
                                    </motion.button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── COMMENT ───────────────────────────────────────────────────── */}
                {activeTab === 'comment' && (
                    <motion.div key="comment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <div className={`p-10 rounded-[40px] border ${cardClass}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ac}18` }}>
                                    <MessageCircle size={18} style={{ color: ac }} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-black uppercase ${textColor}`}>Leave a Message</h3>
                                    <p className={`text-xs ${mutedColor}`}>Posts live on the wall instantly</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {commentPosted && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold"
                                            style={{ backgroundColor: `${ac}15`, color: ac }}>
                                            <CheckCircle size={16} /> Posted! Visible on the wall now.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleComment} className="space-y-4">
                                <input required type="text" placeholder="Your name" value={commentName} maxLength={50}
                                    onChange={e => setCommentName(e.target.value)}
                                    className={`w-full p-4 rounded-2xl border outline-none text-sm transition ${inputClass}`} />
                                <textarea required placeholder={`Say something to ${player.name}… 🔥`} rows={4}
                                    value={commentText} maxLength={300}
                                    onChange={e => setCommentText(e.target.value)}
                                    className={`w-full p-4 rounded-2xl border outline-none text-sm resize-none transition ${inputClass}`} />
                                <div className="flex items-center justify-between">
                                    <p className={`text-[10px] ${mutedColor}`}>{commentText.length}/300</p>
                                    <motion.button type="submit" disabled={commentLoading || !commentName.trim() || !commentText.trim()}
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest transition disabled:opacity-40 hover:brightness-110"
                                        style={{ backgroundColor: ac }}>
                                        {commentLoading
                                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <><Send size={14} /> Post It</>}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Community;

