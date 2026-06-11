import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { validateContactForm } from '../../utils/contact-form';

export const prerender = false;

// Konfiguracja SMTP wyłącznie z runtime env (kontener Dockera dostaje ją
// przez env_file) — import.meta.env zostałoby wstrzyknięte podczas builda,
// kiedy .env nie istnieje w obrazie.
function getMailConfig() {
  const {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_FROM_ADDRESS,
    MAIL_FROM_NAME,
    CONTACT_RECIPIENT,
  } = process.env;

  if (!MAIL_HOST || !MAIL_USERNAME || !MAIL_PASSWORD || !MAIL_FROM_ADDRESS || !CONTACT_RECIPIENT) {
    return null;
  }

  return {
    host: MAIL_HOST,
    port: Number(MAIL_PORT ?? 587),
    username: MAIL_USERNAME,
    password: MAIL_PASSWORD,
    fromAddress: MAIL_FROM_ADDRESS,
    fromName: MAIL_FROM_NAME || 'OnboardingToGo',
    recipient: CONTACT_RECIPIENT,
  };
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  // Honeypot: pole "website" jest ukryte w formularzu — wypełniają je tylko
  // boty. Odpowiadamy sukcesem, żeby nie zdradzać mechanizmu.
  if (typeof payload === 'object' && payload !== null) {
    const honeypot = (payload as Record<string, unknown>).website;
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      return json({ ok: true }, 200);
    }
  }

  const result = validateContactForm(payload);
  if (!result.ok) {
    return json({ ok: false, errors: result.errors }, 400);
  }

  const config = getMailConfig();
  if (!config) {
    console.error('[api/contact] Missing SMTP configuration (MAIL_* env vars).');
    return json({ ok: false, error: 'Mail service is not configured.' }, 500);
  }

  const { name, email, company, topic, message } = result.data;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false, // port 587 → STARTTLS
    requireTLS: true,
    auth: { user: config.username, pass: config.password },
  });

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '-'}`,
    `Topic: ${topic}`,
    '',
    message,
  ].join('\n');

  try {
    await transporter.sendMail({
      from: { name: config.fromName, address: config.fromAddress },
      to: config.recipient,
      replyTo: { name, address: email },
      subject: `OnBoardToGo inquiry: ${topic}`,
      text: body,
    });
  } catch (error) {
    console.error('[api/contact] Failed to send email:', error);
    return json({ ok: false, error: 'Failed to send the message.' }, 502);
  }

  return json({ ok: true }, 200);
};
