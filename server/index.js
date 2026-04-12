import express from 'express';
import cors from 'cors';
import { client } from './db.js';
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

// 1. GET PLAYER DATA
app.get('/api/player', async (req, res) => {
  try {
    const result = await client.execute("SELECT * FROM player_stats WHERE id = 1");
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. BREVO EMAIL ROUTE (Kagisho & Lebogang Recipients)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (apiInstance) {
      await apiInstance.sendTransacEmail({
        sender: { name: "Portfolio System", email: "noreply@kagishoblom.com" },
        to: [
          { email: "blomkagisho22@gmail.com" },
          { email: "lebogangvictor23@gmail.com" }
        ],
        subject: `New Scout Inquiry: ${name}`,
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #E63946;">New Lead Received</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>`
      });

      await apiInstance.sendTransacEmail({
        sender: { name: "Kagisho Blom Team", email: "contact@kagishoblom.com" },
        to: [{ email: email }],
        subject: "We received your message",
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hello ${name},</h2>
            <p>Thank you for reaching out. We have received your inquiry and will get back to you shortly.</p>
          </div>`
      });
    } else {
      console.warn(`Contact form received without BREVO_API_KEY configured: ${name} <${email}>`);
    }

    res.json({ success: true, emailSent: Boolean(apiInstance) });
  } catch (error) {
    console.error("Brevo Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// 3. UPDATE PLAYER DATA
app.post('/api/update', async (req, res) => {
  const { club, goals, assists, recoveries, age, position, pass_accuracy, instagram, facebook, whatsapp, is_available } = req.body;
  try {
    await client.execute({
      sql: `UPDATE player_stats SET club = ?, goals = ?, assists = ?, recoveries = ?, age = ?, position = ?, pass_accuracy = ?, instagram = ?, facebook = ?, whatsapp = ?, is_available = ? WHERE id = 1`,
      args: [club || "", goals || 0, assists || 0, recoveries || "", age || 0, position || "", pass_accuracy || "", instagram || "", facebook || "", whatsapp || "", is_available ?? 1]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(distPath));
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));