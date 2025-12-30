// /api/send.js (Vercel Serverless Function - pages router)
// Resend TESTING MODE uyumlu: sadece hesap sahibinin mailine gönderir.

import { Resend } from "resend";

const WINDOW_MS = 60_000; // 1 dakika
const MAX_PER_WINDOW = 2;

const buckets = globalThis.__rateBuckets || (globalThis.__rateBuckets = new Map());

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (Array.isArray(xff)) return (xff[0] || "").split(",")[0].trim() || "unknown";
  if (typeof xff === "string") return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { rumuz, dert } = req.body || {};
  if (!rumuz || !dert) return res.status(400).json({ error: "Eksik alan" });

  // Rate limit
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = buckets.get(ip) || { start: now, count: 0 };

  if (now - entry.start > WINDOW_MS) {
    entry.start = now;
    entry.count = 0;
  }

  entry.count += 1;
  buckets.set(ip, entry);

  if (entry.count > MAX_PER_WINDOW) {
    return res.status(429).json({ error: "Rate limit" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY eksik" });
    }

    const resend = new Resend(apiKey);

    const subject = `🎧 Yeni Dert Geldi – Kod Adı: ${String(rumuz).slice(0, 60)}`;
    const text = `Kod Adı: ${rumuz}\n\nDert:\n${dert}`;

    const { error } = await resend.emails.send({
      from: "Buse’nin Cast’in <onboarding@resend.dev>",
      to: "gokberkciloglu@gmail.com",
      subject,
      text,
    });

    if (error) {
      return res.status(500).json({ error: "Mail gönderilemedi", detail: error.message || String(error) });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: "Mail gönderilemedi", detail: e?.message || String(e) });
  }
}
