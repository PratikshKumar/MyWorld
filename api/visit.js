export default async function handler(req, res) {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: "Missing Upstash env vars" });
    }

    // increment counter
    const r = await fetch(`${url}/incr/visits`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await r.json(); // { result: number }
    return res.status(200).json({ visits: data.result });
  } catch (e) {
    return res.status(500).json({ error: "Counter failed", details: String(e) });
  }
}
