import express from 'express';
import cors from 'cors';
import { getPlayer, updatePlayer } from './db.js';
import * as Brevo from '@getbrevo/brevo';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 3001);
const HOST = PORT === 3001 ? '127.0.0.1' : '0.0.0.0';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

let apiInstance = null;
if (process.env.BREVO_API_KEY && Brevo.TransactionalEmailsApi) {
  apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

const escapeHtml = (value = '') => String(value).replace(/[&<>"]/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}[char]));

const socialLink = (url, label) => url ? `<a href="${escapeHtml(url)}" style="color:#e10600;text-decoration:none;font-weight:700">${label}</a>` : '';

app.get('/api/player', async (req, res) => {
  try {
    res.json(await getPlayer());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cv', async (req, res) => {
  try {
    const player = await getPlayer();
    const achievements = String(player.achievements || '')
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(player.name)} CV</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; color: #111; background: #f5f5f5; }
      main { max-width: 920px; margin: 32px auto; background: white; padding: 48px; box-shadow: 0 20px 60px rgba(0,0,0,.08); }
      h1 { font-size: 58px; line-height: .9; margin: 0 0 12px; text-transform: uppercase; letter-spacing: -3px; }
      h2 { color: #e10600; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; margin: 34px 0 12px; }
      p, li { line-height: 1.7; color: #333; }
      .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 28px 0; }
      .card { border: 1px solid #eee; border-radius: 18px; padding: 18px; }
      .label { display: block; color: #888; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
      .value { font-size: 18px; font-weight: 900; }
      .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
      .footer { border-top: 1px solid #eee; margin-top: 36px; padding-top: 18px; display: flex; gap: 18px; flex-wrap: wrap; }
      .print { position: fixed; top: 18px; right: 18px; border: 0; background: #e10600; color: white; padding: 12px 18px; border-radius: 999px; font-weight: 800; cursor: pointer; }
      @media print { body { background: white; } main { margin: 0; box-shadow: none; } .print { display: none; } }
      @media (max-width: 720px) { main { margin: 0; padding: 28px; } h1 { font-size: 42px; } .meta, .stats { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <button class="print" onclick="window.print()">Print / Save PDF</button>
    <main>
      <h1>${escapeHtml(player.name)}</h1>
      <strong style="color:#e10600;text-transform:uppercase;letter-spacing:3px">${escapeHtml(player.position)} • ${escapeHtml(player.club)}</strong>
      <p>${escapeHtml(player.cv_summary || player.bio)}</p>
      <section class="meta">
        <div class="card"><span class="label">Age</span><span class="value">${escapeHtml(player.age)}</span></div>
        <div class="card"><span class="label">Nationality</span><span class="value">${escapeHtml(player.nationality)}</span></div>
        <div class="card"><span class="label">Status</span><span class="value">${player.is_available ? 'Available' : 'Under Contract'}</span></div>
        <div class="card"><span class="label">Height</span><span class="value">${escapeHtml(player.height || 'N/A')}</span></div>
        <div class="card"><span class="label">Weight</span><span class="value">${escapeHtml(player.weight || 'N/A')}</span></div>
        <div class="card"><span class="label">Preferred Foot</span><span class="value">${escapeHtml(player.preferred_foot)}</span></div>
      </section>
      <h2>Performance Data</h2>
      <section class="stats">
        <div class="card"><span class="label">Goals</span><span class="value">${escapeHtml(player.goals)}</span></div>
        <div class="card"><span class="label">Assists</span><span class="value">${escapeHtml(player.assists)}</span></div>
        <div class="card"><span class="label">Pass Accuracy</span><span class="value">${escapeHtml(player.pass_accuracy)}</span></div>
        <div class="card"><span class="label">Recoveries</span><span class="value">${escapeHtml(player.recoveries)}</span></div>
      </section>
      <h2>Profile</h2>
      <p>${escapeHtml(player.bio)}</p>
      ${achievements.length ? `<h2>Achievements</h2><ul>${achievements.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
      <h2>Contact</h2>
      <p>${escapeHtml(player.email || '')}${player.email && player.phone ? ' • ' : ''}${escapeHtml(player.phone || player.whatsapp || '')}</p>
      <div class="footer">
        ${socialLink(player.instagram, 'Instagram')}
        ${socialLink(player.facebook, 'Facebook')}
        ${socialLink(player.highlight_url_1, 'Highlight 1')}
        ${socialLink(player.highlight_url_2, 'Highlight 2')}
      </div>
    </main>
  </body>
</html>`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const player = await getPlayer();

    if (apiInstance) {
      await apiInstance.sendTransacEmail({
        sender: { name: 'Portfolio System', email: 'noreply@kagishoblom.com' },
        to: [
          { email: player.email || 'blomkagisho22@gmail.com' },
          { email: 'lebogangvictor23@gmail.com' }
        ],
        subject: `New Scout Inquiry: ${name}`,
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #E63946;">New Lead Received</h2>
            <p><strong>From:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong> ${escapeHtml(message)}</p>
          </div>`
      });

      await apiInstance.sendTransacEmail({
        sender: { name: `${player.name} Team`, email: 'contact@kagishoblom.com' },
        to: [{ email }],
        subject: 'We received your message',
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hello ${escapeHtml(name)},</h2>
            <p>Thank you for reaching out. We have received your inquiry and will get back to you shortly.</p>
          </div>`
      });
    } else {
      console.warn(`Contact form received without BREVO_API_KEY configured: ${name} <${email}>`);
    }

    res.json({ success: true, emailSent: Boolean(apiInstance) });
  } catch (error) {
    console.error('Brevo Error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/update', async (req, res) => {
  try {
    const player = await updatePlayer(req.body);
    res.json({ success: true, player });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(distPath));
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));
