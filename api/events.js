// Serverless function for Vercel deployment
// Supports storing events in Vercel KV (Redis) with a memory fallback.

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
        events = localMemoryEvents || [
          {
            id: '1',
            date: '2026-06-05',
            title: 'Internship Orientation',
            description: 'Attended the introductory session for PM-VIKAS Program at IIIT Kottayam. Overview of IoT, embedded hardware, and communication protocols.',
            category: 'internship'
          },
          {
            id: '2',
            date: '2026-06-12',
            title: 'Sensor Interfacing Workshop',
            description: 'Interfaced ultrasonic and DHT11 sensors with Arduino Uno. Conducted testing for distance calculation.',
            category: 'internship'
          },
          {
            id: '3',
            date: '2026-06-18',
            title: 'ESP32 and Cloud Integration',
            description: 'Worked on IoT communication protocols, sending sensor data from ESP32 to MQTT broker.',
            category: 'internship'
          },
          {
            id: '4',
            date: '2026-06-25',
            title: 'IoT Assistant Project Kickoff',
            description: 'Started development of the IoT-based prototype for the real-world smart assistant project.',
            category: 'internship'
          }
        ];
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

      localMemoryEvents = events;
      return res.status(200).json({ success: true, kvSaved: kvSuccess, events });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
