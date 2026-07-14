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
      // 1. Read JSON events from the repository file
      let jsonEvents = [];
      try {
        const filePath = path.join(process.cwd(), 'calendar_events.json');
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath, 'utf-8');
          jsonEvents = JSON.parse(fileData);
        }
      } catch (fileError) {
        console.error('Error reading calendar_events.json:', fileError);
      }

      // 2. Read events from Vercel KV database
      let kvEvents = null;
      if (kv) {
        try {
          kvEvents = await kv.get('calendar_events');
        } catch (kvError) {
          console.error('Vercel KV Read Error:', kvError);
        }
      }

      let finalEvents = [];
      if (kvEvents) {
        // Merge KV events and JSON events.
        // We prioritize the version from the JSON file because Git pushes represent the deployment source of truth.
        const mergedMap = new Map();
        
        // Load KV events first
        for (const ev of kvEvents) {
          if (ev && (ev.date || ev.id)) {
            mergedMap.set(ev.date || ev.id, ev);
          }
        }
        
        // Overwrite or add JSON events (Git updates take precedence)
        for (const ev of jsonEvents) {
          if (ev && (ev.date || ev.id)) {
            mergedMap.set(ev.date || ev.id, ev);
          }
        }
        
        finalEvents = Array.from(mergedMap.values());
        
        // If the merged result is different from what was in KV, sync the database back
        if (JSON.stringify(kvEvents) !== JSON.stringify(finalEvents)) {
          try {
            await kv.set('calendar_events', finalEvents);
          } catch (kvWriteError) {
            console.error('Failed to sync merged events back to Vercel KV:', kvWriteError);
          }
        }
      } else {
        // No KV events yet, initialize KV with JSON events
        finalEvents = jsonEvents;
        if (kv && finalEvents.length > 0) {
          try {
            await kv.set('calendar_events', finalEvents);
          } catch (kvWriteError) {
            console.error('Failed to initialize Vercel KV with JSON events:', kvWriteError);
          }
        }
      }

      // If still empty, use memory fallback
      if (finalEvents.length === 0 && localMemoryEvents) {
        finalEvents = localMemoryEvents;
      }

      return res.status(200).json(finalEvents);
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

