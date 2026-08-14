// Vercel Serverless API Route: /api/sync
// Supports Upstash Redis / Vercel KV / Cloud REST storage for cross-device persistence.

let inMemoryFallbackState = null;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const redisUrl =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_API_URL ||
    process.env.KV_URL;
  const redisToken =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_API_TOKEN ||
    process.env.KV_TOKEN;

  // Handle GET (Fetch state)
  if (req.method === 'GET') {
    if (redisUrl && redisToken) {
      try {
        const response = await fetch(`${redisUrl}/get/deepstack_state`, {
          headers: {
            Authorization: `Bearer ${redisToken}`
          }
        });
        const data = await response.json();
        if (data && data.result !== undefined && data.result !== null) {
          let parsed = data.result;
          // Unpack double-serialized JSON or array wrappers
          if (Array.isArray(parsed)) parsed = parsed[0];
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === 'string') {
                parsed = JSON.parse(parsed[0]);
              }
            } catch (e) {
              console.error('JSON parse error in Redis state:', e);
            }
          }

          if (parsed && Array.isArray(parsed.projects)) {
            inMemoryFallbackState = parsed;
            return res.status(200).json({ success: true, source: 'cloud-kv', state: parsed });
          }
        }
      } catch (err) {
        console.error('Error reading from Redis KV:', err);
      }
    }

    // Fallback to in-memory server state
    return res.status(200).json({
      success: true,
      source: redisUrl ? 'cloud-kv-empty' : 'serverless-memory',
      state: inMemoryFallbackState,
      isConfigured: Boolean(redisUrl && redisToken)
    });
  }

  // Handle POST / PUT (Save state)
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {}
      }

      const stateToSave = body?.state || body;

      if (!stateToSave || !Array.isArray(stateToSave.projects)) {
        return res.status(400).json({ success: false, error: 'Invalid state format: projects array required' });
      }

      inMemoryFallbackState = stateToSave;

      if (redisUrl && redisToken) {
        const stringifiedState = JSON.stringify(stateToSave);

        // Send standardized Redis command: ["SET", "deepstack_state", "<json_string>"]
        const response = await fetch(redisUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['SET', 'deepstack_state', stringifiedState])
        });

        const result = await response.json();
        return res.status(200).json({ success: true, source: 'cloud-kv', result });
      }

      return res.status(200).json({
        success: true,
        source: 'serverless-memory',
        message: 'Saved to memory. Note: Connect Upstash for Redis in Vercel Storage for permanent multi-device sync.'
      });
    } catch (err) {
      console.error('Error saving state:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
