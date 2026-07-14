// Serverless function for Vercel deployment
// Supports storing events in Vercel KV (Redis) with a memory fallback.
import fs from 'fs';
import path from 'path';

let localMemoryEvents = null; // Memory fallback in case KV is not bound

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Dynamically import @vercel/kv to prevent crashes if it is not installed locally
    let kv = null;
    if (process.env.KV_REST_API_URL) {
      try {
        const kvModule = await import('@vercel/kv');
        kv = kvModule.kv;
      } catch (e) {
        console.warn('Vercel KV module not available, using memory/local fallback.');
      }
    }

    if (req.method === 'GET') {
      let events = null;
      if (kv) {
        try {
          events = await kv.get('calendar_events');
        } catch (kvError) {
          console.error('Vercel KV Read Error:', kvError);
        }
      }

      if (!events) {
        if (localMemoryEvents) {
          events = localMemoryEvents;
        } else {
          try {
            const filePath = path.join(process.cwd(), 'calendar_events.json');
            if (fs.existsSync(filePath)) {
              const fileData = fs.readFileSync(filePath, 'utf-8');
              events = JSON.parse(fileData);
            }
          } catch (fileError) {
            console.error('Error reading calendar_events.json:', fileError);
          }
        }
      }

      // If still not loaded, use a default fallback to prevent API error
      if (!events) {
        events = [];
      }

      return res.status(200).json(events);
    }

    if (req.method === 'POST') {
      const events = req.body;
      let kvSuccess = false;
      if (kv) {
        try {
          await kv.set('calendar_events', events);
          kvSuccess = true;
        } catch (kvError) {
          console.error('Vercel KV Write Error:', kvError);
        }
      }

      // In local development or if running as a server where fs is writable
      try {
        const filePath = path.join(process.cwd(), 'calendar_events.json');
        fs.writeFileSync(filePath, JSON.stringify(events, null, 2), 'utf-8');
      } catch (fileError) {
        console.warn('Could not write to local calendar_events.json (common on serverless):', fileError.message);
      }

      localMemoryEvents = events;
      return res.status(200).json({ success: true, kvSaved: kvSuccess, events });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

