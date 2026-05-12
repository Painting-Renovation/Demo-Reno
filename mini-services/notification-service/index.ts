import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

const app = new Hono();

app.use('*', cors());

interface NotificationPayload {
  type: 'new_lead' | 'new_appointment' | 'quote_sent' | 'project_update';
  title: string;
  message: string;
  leadName?: string;
  leadEmail?: string;
  service?: string;
  date?: string;
  ownerEmail?: string;
  ownerName?: string;
  slackWebhook?: string;
}

// In-memory email log (would use SendGrid/SES in production)
const emailLog: Array<{
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  status: string;
}> = [];

// In-memory slack log
const slackLog: Array<{
  webhook: string;
  message: string;
  sentAt: string;
  status: string;
}> = [];

// POST /send - Send a notification
app.post('/send', async (c) => {
  const payload = await c.req.json<NotificationPayload>();

  if (!payload.type || !payload.title || !payload.message) {
    return c.json({ error: 'type, title, and message are required' }, 400);
  }

  const results: { email?: { success: boolean; logId?: string }; slack?: { success: boolean } } = {};

  // Send Email notification
  if (payload.ownerEmail) {
    const emailBody = buildEmailBody(payload);
    const subject = `[ProCoat] ${payload.title}`;

    // Log email (in production, use SendGrid API here)
    const logEntry = {
      to: payload.ownerEmail,
      subject,
      body: emailBody,
      sentAt: new Date().toISOString(),
      status: 'logged', // Would be 'sent' with real email service
    };
    emailLog.push(logEntry);

    results.email = { success: true, logId: String(emailLog.length) };
    console.log(`📧 Email notification: "${subject}" → ${payload.ownerEmail}`);
  }

  // Send Slack notification
  if (payload.slackWebhook) {
    const slackMessage = buildSlackMessage(payload);

    // Log slack (in production, use fetch to webhook URL)
    const logEntry = {
      webhook: payload.slackWebhook,
      message: slackMessage,
      sentAt: new Date().toISOString(),
      status: 'logged', // Would be 'sent' with real webhook
    };
    slackLog.push(logEntry);

    results.slack = { success: true };
    console.log(`💬 Slack notification: "${payload.title}"`);
  }

  return c.json({
    success: true,
    results,
    sentAt: new Date().toISOString(),
  });
});

// POST /send-bulk - Send multiple notifications
app.post('/send-bulk', async (c) => {
  const { notifications, ownerEmail, slackWebhook } = await c.req.json<{
    notifications: NotificationPayload[];
    ownerEmail?: string;
    slackWebhook?: string;
  }>();

  if (!Array.isArray(notifications)) {
    return c.json({ error: 'notifications array is required' }, 400);
  }

  const results = await Promise.all(
    notifications.map(async (n) => {
      const enriched = { ...n, ownerEmail: n.ownerEmail || ownerEmail, slackWebhook: n.slackWebhook || slackWebhook };
      const res = await fetch(`http://localhost:3001/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enriched),
      });
      return res.json();
    })
  );

  return c.json({ success: true, count: results.length, results });
});

// GET /logs - Get notification logs
app.get('/logs', async (c) => {
  const type = c.req.query('type'); // 'email' or 'slack'
  const limit = parseInt(c.req.query('limit') || '20');

  if (type === 'email') {
    return c.json({ logs: emailLog.slice(-limit).reverse() });
  } else if (type === 'slack') {
    return c.json({ logs: slackLog.slice(-limit).reverse() });
  }

  return c.json({
    emailCount: emailLog.length,
    slackCount: slackLog.length,
    emailLogs: emailLog.slice(-limit).reverse(),
    slackLogs: slackLog.slice(-limit).reverse(),
  });
});

// GET /health - Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'notification-service',
    uptime: process.uptime(),
    emailsSent: emailLog.length,
    slackMessagesSent: slackLog.length,
  });
});

// DELETE /logs - Clear logs
app.delete('/logs', (c) => {
  const type = c.req.query('type');
  if (type === 'email') {
    emailLog.length = 0;
  } else if (type === 'slack') {
    slackLog.length = 0;
  } else {
    emailLog.length = 0;
    slackLog.length = 0;
  }
  return c.json({ success: true });
});

function buildEmailBody(payload: NotificationPayload): string {
  const greeting = payload.ownerName ? `Hi ${payload.ownerName}` : 'Hello';
  const leadInfo = payload.leadName
    ? `\n\nClient: ${payload.leadName} (${payload.leadEmail || 'N/A'})`
    : '';
  const serviceInfo = payload.service ? `\nService: ${payload.service}` : '';
  const dateInfo = payload.date ? `\nDate: ${payload.date}` : '';

  return `
${greeting},

${payload.message}${leadInfo}${serviceInfo}${dateInfo}

---
ProCoat Painters - Business Management System
This notification was sent automatically.
  `.trim();
}

function buildSlackMessage(payload: NotificationPayload): string {
  const emoji = {
    new_lead: '🆕',
    new_appointment: '📅',
    quote_sent: '📄',
    project_update: '🔨',
  }[payload.type] || '🔔';

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${emoji} ${payload.title}` },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: payload.message },
    },
  ];

  if (payload.leadName) {
    blocks.push({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Client:*\n${payload.leadName}` },
        ...(payload.service ? [{ type: 'mrkdwn' as const, text: `*Service:*\n${payload.service}` }] : []),
      ],
    });
  }

  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: `⏰ ${new Date().toLocaleString()}` }],
  });

  return JSON.stringify(blocks);
}

const PORT = 3001;
console.log(`🔔 Notification Service starting on port ${PORT}`);

serve({ fetch: app.fetch, port: PORT });
