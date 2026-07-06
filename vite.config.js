import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Mock API for local development
const mockApiPlugin = () => ({
  name: 'mock-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/events') {
        const filePath = path.resolve(__dirname, 'calendar_events.json');
        
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            res.end(data);
          } else {
            // Return some default events to make it look active initially!
            const defaultEvents = [
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
            fs.writeFileSync(filePath, JSON.stringify(defaultEvents, null, 2), 'utf-8');
            res.end(JSON.stringify(defaultEvents));
          }
          return;
        }
        
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const events = JSON.parse(body);
              fs.writeFileSync(filePath, JSON.stringify(events, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, events }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  server: {
    port: 3000
  }
})
