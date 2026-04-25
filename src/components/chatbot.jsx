import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Phone, Mail, Bot, Download, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const STARTER_SUGGESTIONS = [
  "What position do you play?",
  "How many goals this season?",
  "Are you available for trials?",
  "How can I contact your team?",
];

const ChatMessage = ({ msg, accentColor, theme }) => {
  const isBot = msg.role === 'assistant';
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-neutral-900';

  if (msg.type === 'contact') {
    return (
      <div className="flex gap-2 items-start">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
          style={{ backgroundColor: accentColor }}>
          <Bot size={14} />
        </div>
        <div className="space-y-2 flex-1">
          <p className={`text-sm leading-relaxed ${textColor}`}>{msg.content}</p>
          <div className="flex flex-col gap-2 mt-2">
            {msg.whatsapp && (
              <a href={`https://wa.me/${msg.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/15 border border-green-500/25 text-green-500 text-xs font-bold hover:bg-green-500/25 transition">
                <Phone size={14} /> WhatsApp {msg.whatsapp}
              </a>
            )}
            {msg.email && (
              <a href={`mailto:${msg.email}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-80 transition"
                style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}>
                <Mail size={14} /> {msg.email}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (msg.type === 'cv') {
    return (
      <div className="flex gap-2 items-start">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
          style={{ backgroundColor: accentColor }}>
          <Bot size={14} />
        </div>
        <div className="space-y-2 flex-1">
          <p className={`text-sm leading-relaxed ${textColor}`}>{msg.content}</p>
          <a href={`${API_BASE}/api/cv`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:brightness-110 transition"
            style={{ backgroundColor: accentColor }}>
            <Download size={14} /> Download CV / Scout Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 items-end ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 text-white"
          style={{ backgroundColor: accentColor }}>
          <Bot size={14} />
        </div>
      )}
      <div
        className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isBot
          ? isDark
            ? 'bg-white/8 text-white rounded-bl-sm'
            : 'bg-neutral-100 text-neutral-900 rounded-bl-sm'
          : 'text-white rounded-br-sm'
          }`}
        style={!isBot ? { backgroundColor: accentColor } : {}}
      >
        {msg.content}
      </div>
    </div>
  );
};

const TypingIndicator = ({ accentColor, theme }) => (
  <div className="flex gap-2 items-end">
    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white"
      style={{ backgroundColor: accentColor }}>
      <Bot size={14} />
    </div>
    <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${theme === 'dark' ? 'bg-white/8' : 'bg-neutral-100'}`}>
      <div className="flex gap-1 items-center h-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ backgroundColor: accentColor, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  </div>
);

const Chatbot = ({ accentColor, theme, player }) => {
  const location = useLocation();
  if (location.pathname.startsWith('/crm')) return null;

  const makeGreeting = () => ({
    role: 'assistant',
    content: `Awe, Keyang`,
  });

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [makeGreeting()]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const ac = accentColor || '#e10600';

  const clearChat = () => setMessages([makeGreeting()]);

  useEffect(() => {
    if (open) { setHasUnread(false); setTimeout(() => inputRef.current?.focus(), 200); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const CV_KEYWORDS = ['cv', 'resume', 'download', 'profile doc', 'scout report', 'pdf'];
  const CONTACT_KEYWORDS = ['contact', 'reach', 'whatsapp', 'email', 'phone', 'get in touch', 'representative', 'agent', 'scout'];

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');
    const userMsg = { role: 'user', content };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);
    const lower = content.toLowerCase();
    const isCV = CV_KEYWORDS.some(k => lower.includes(k));
    const isContact = CONTACT_KEYWORDS.some(k => lower.includes(k));
    const apiMessages = history
      .filter((m, idx) => !(idx === 0 && m.role === 'assistant'))
      .map(m => ({ role: m.role, content: m.content }));
    try {
      const res = await axios.post('/api/chat', { messages: apiMessages });
      const reply = res.data.reply || "Let me get back to you on that!";
      if (res.data.photos && res.data.photos.length) {
        setMessages(prev => [...prev, { role: 'assistant', type: 'photos', content: reply, photos: res.data.photos }]);
      } else if (isCV) {
        setMessages(prev => [...prev, { role: 'assistant', type: 'cv', content: reply }]);
      } else if (isContact && (res.data.whatsapp || res.data.email)) {
        setMessages(prev => [...prev, { role: 'assistant', type: 'contact', content: reply, whatsapp: res.data.whatsapp, email: res.data.email }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || '';
      if (err.response?.status === 503 || errMsg.includes('GEMINI')) {
        setMessages(prev => [...prev, { role: 'assistant', type: 'contact', content: "My AI assistant isn't configured yet, but you can reach my team directly:", whatsapp: player?.whatsapp, email: player?.email }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having a moment. Try again shortly!" }]);
      }
    } finally { setLoading(false); }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const isDark = theme === 'dark';
  const panelBg = isDark ? 'bg-[#111]' : 'bg-white';
  const borderCol = isDark ? 'border-white/8' : 'border-black/8';
  const headerBg = isDark ? 'bg-[#0a0a0a]' : 'bg-neutral-50';
  const inputBg = isDark
    ? 'bg-white/5 border-white/8 text-white placeholder:text-white/25'
    : 'bg-neutral-50 border-black/10 text-neutral-900 placeholder:text-neutral-400';

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center"
        style={{ backgroundColor: ac }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with Kagisho"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {hasUnread && !open && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center" style={{ boxShadow: `0 0 0 2px ${ac}` }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ac }} />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${panelBg} ${borderCol}`}
            style={{ height: '520px', boxShadow: `0 32px 80px ${ac}20, 0 8px 32px rgba(0,0,0,0.3)` }}
          >
            <div className={`flex items-center gap-3 px-5 py-4 border-b ${headerBg} ${borderCol}`}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: ac }}>
                  {player?.name?.[0] || 'K'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2" style={{ borderColor: isDark ? '#111' : '#fff' }} />
              </div>
              <div>
                <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>{player?.name || 'Kagisho Blom'}</p>
                <p className="text-[10px] font-bold" style={{ color: ac }}>{player?.position} · {player?.club}</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button onClick={clearChat} title="Clear chat" className={`p-2 rounded-xl transition ${isDark ? 'text-white/20 hover:text-white/50 hover:bg-white/5' : 'text-neutral-300 hover:text-neutral-500 hover:bg-black/5'}`}>
                  <Trash2 size={14} />
                </button>
                <button onClick={() => setOpen(false)} className={`p-2 rounded-xl transition ${isDark ? 'text-white/30 hover:text-white hover:bg-white/5' : 'text-neutral-400 hover:text-neutral-900 hover:bg-black/5'}`}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
                  <ChatMessage msg={msg} accentColor={ac} theme={theme} />
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <TypingIndicator accentColor={ac} theme={theme} />
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length === 1 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className={`px-4 pb-3 flex flex-wrap gap-1.5 border-t pt-3 ${borderCol}`}
              >
                {STARTER_SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.07, duration: 0.25 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => sendMessage(s)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-colors ${isDark ? 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/70' : 'border-black/10 text-neutral-500 hover:border-black/20 hover:text-neutral-700'}`}
                  >
                    {s}
                  </motion.button>
                ))}
              </motion.div>
            )}

            <div className={`px-4 py-3 border-t ${borderCol}`}>
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask Kagisho anything..."
                  rows={1}
                  className={`flex-1 p-3 rounded-2xl border text-sm outline-none resize-none transition leading-snug ${inputBg}`}
                  style={{ maxHeight: '80px' }}
                />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="w-10 h-10 rounded-2xl text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:brightness-110 transition" style={{ backgroundColor: ac }}>
                  <Send size={15} />
                </button>
              </div>
              <p className={`text-[9px] text-center mt-2 ${isDark ? 'text-white/15' : 'text-neutral-300'}`}>AI-powered</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;