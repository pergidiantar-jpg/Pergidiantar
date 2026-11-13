import 'dotenv/config';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SENDER_EMAIL = 'pergi.diantar@gmail.com';
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const getSmtpConfig = () => {
    const user = (process.env.GMAIL_USER || DEFAULT_SENDER_EMAIL).trim();
    const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    return {
      user,
      pass,
      configured: Boolean(user && pass)
    };
  };

  // Health & SMTP Status Check
  app.get('/api/email-status', (_req: Request, res: Response) => {
    const cfg = getSmtpConfig();
    res.json({
      smtpConfigured: cfg.configured,
      sender: cfg.user,
      provider: 'gmail_smtp'
    });
  });

  // Real Email Dispatch Endpoint via SMTP (pergi.diantar@gmail.com)
  app.post('/api/send-email', async (req: Request, res: Response) => {
    try {
      const { to, subject, body, replyTo } = req.body || {};

      if (!to || typeof to !== 'string' || !to.includes('@')) {
        res.status(400).json({
          ok: false,
          code: 'INVALID_RECIPIENT',
          error: 'Alamat email penerima tidak valid.'
        });
        return;
      }

      if (!subject || !body) {
        res.status(400).json({
          ok: false,
          code: 'MISSING_CONTENT',
          error: 'Subjek dan isi email wajib diisi.'
        });
        return;
      }

      const cfg = getSmtpConfig();
      if (!cfg.configured) {
        res.status(503).json({
          ok: false,
          code: 'SMTP_NOT_CONFIGURED',
          error: 'GMAIL_APP_PASSWORD belum dikonfigurasi pada Secrets/Environment Server.'
        });
        return;
      }

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: cfg.user,
          pass: cfg.pass
        }
      });

      const info = await transporter.sendMail({
        from: `"PERGIDIANTAR Official" <${cfg.user}>`,
        sender: cfg.user,
        replyTo: typeof replyTo === 'string' && replyTo.includes('@') ? replyTo : cfg.user,
        to: to.trim(),
        subject: String(subject),
        text: String(body)
      });

      res.json({
        ok: true,
        messageId: info.messageId,
        sender: cfg.user,
        recipient: to.trim()
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim email melalui server SMTP Gmail.';
      console.error('[SMTP /api/send-email error]:', message);
      res.status(500).json({
        ok: false,
        code: 'SMTP_SEND_ERROR',
        error: message
      });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.use((_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PERGIDIANTAR server running on http://0.0.0.0:${PORT} (mode=${IS_PROD ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
