// Vercel Serverless Function (pages router style /api/send.js)
// Bu endpoint veri depolamaz; sadece e-posta gönderimi için kullanılacak.
// Şu an Namecheap DNS doğrulaması bekleniyor; Resend entegresi bir sonraki adımda eklenecek.

const WINDOW_MS = 60_000; // 1 dakika
const MAX_PER_WINDOW = 2;

// Best-effort in-memory rate limit (serverless ortamda her zaman %100 garanti değildir ama ciddi azaltır)
const buckets = globalThis.__rateBuckets || (globalThis.__rateBuckets = new Map());

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (Array.isArray(xff)) return (xff[0] || "").split(",")[0].trim() || "unknown";
  if (typeof xff === "string") return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rumuz, dert } = req.body || {};
  if (!rumuz || !dert) {
    return res.status(400).json({ error: "Eksik alan" });
  }

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

  // TODO: DNS doğrulaması sonrası Resend ile mail gönderimi burada olacak.
  return res.status(200).json({ success: true });
}
