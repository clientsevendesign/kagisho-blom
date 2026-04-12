import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const defaultPlayer = {
  id: 1,
  name: 'Kagisho Blom',
  club: 'Kaizer Chiefs',
  goals: 6,
  assists: 4,
  recoveries: '8.1',
  age: 26,
  position: 'Midfielder',
  pass_accuracy: '87%',
  instagram: '',
  facebook: '',
  whatsapp: '27720000000',
  email: '',
  phone: '',
  nationality: 'South African',
  height: '',
  weight: '',
  preferred_foot: 'Right',
  jersey_number: '15',
  work_rate: 'High/High',
  bio: 'A dedicated midfielder known for tactical intelligence, physical presence, and composure in high-pressure competitive environments.',
  cv_summary: 'Professional footballer profile prepared for scouts, clubs, and representatives.',
  achievements: '',
  highlight_title_1: 'Season Highlights 2025/26',
  highlight_url_1: '',
  highlight_title_2: 'Defensive Masterclass',
  highlight_url_2: '',
  highlight_duration_1: '4:15',
  highlight_duration_2: '3:40',
  is_available: 1
};

const normalizePlayer = (player = {}) => ({
  ...defaultPlayer,
  ...player,
  goals: Number(player.goals ?? defaultPlayer.goals) || 0,
  assists: Number(player.assists ?? defaultPlayer.assists) || 0,
  age: Number(player.age ?? defaultPlayer.age) || 0,
  is_available:
    player.is_available === false ||
    player.is_available === 0 ||
    player.is_available === '0'
      ? 0
      : 1
});

export const getPlayer = async () => {
  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw error;
  return normalizePlayer(data || defaultPlayer);
};

export const updatePlayer = async (updates) => {
  const current = await getPlayer();
  const next = normalizePlayer({ ...current, ...updates, id: 1 });

  const { data, error } = await supabase
    .from('player_stats')
    .upsert({ ...next, updated_at: new Date().toISOString() }, { onConflict: 'id' })
    .select()
    .maybeSingle();

  if (error) throw error;
  return normalizePlayer(data || next);
};

export const saveContactLead = async ({ name, email, message }) => {
  const { error } = await supabase
    .from('contact_leads')
    .insert({ name, email, message });

  if (error) throw error;
};

export const getContactLeads = async () => {
  const { data, error } = await supabase
    .from('contact_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const markLeadRead = async (id) => {
  const { error } = await supabase
    .from('contact_leads')
    .update({ read: true })
    .eq('id', id);

  if (error) throw error;
};

export const saveLog = async (level, message, meta = null) => {
  try {
    await supabase.from('server_logs').insert({ level, message, meta });
  } catch {
    // silently skip log persistence errors
  }
};

export const getLogs = async (limit = 200) => {
  const { data, error } = await supabase
    .from('server_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).reverse();
};
