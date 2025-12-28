export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rumuz, dert } = req.body || {};

  // Şimdilik sadece test: mail kısmını bir sonraki adımda ekleyeceğiz (Resend).
  // Bu endpoint veriyi kaydetmez; sadece OK döner.
  if (!rumuz || !dert) {
    return res.status(400).json({ error: "Missing rumuz or dert" });
  }

  return res.status(200).json({ success: true });
}
