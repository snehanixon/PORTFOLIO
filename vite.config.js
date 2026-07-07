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
            const defaultEvents = [
              {
                "id": "1",
                "date": "2026-06-19",
                "title": "Day 01: Introduction to IoT & Ecosystem",
                "category": "internship",
                "description": "Inauguration of the PM-VIKAS IoT assistant training program. Introduced to IoT nodes, device-to-cloud architectures, real-world smart systems (cities, grid networks), and communication layers."
              },
              {
                "id": "2",
                "date": "2026-06-20",
                "title": "Day 02: Microcontroller Architectures & IDE",
                "category": "internship",
                "description": "Study of Arduino Uno and ESP32 board layouts. Installation of Arduino IDE software, configuring port selections, writing basic C script routines, and flashing standard status LED programs."
              },
              {
                "id": "3",
                "date": "2026-06-22",
                "title": "Day 03: Basic Electronic Components",
                "category": "internship",
                "description": "Detailed analysis of electronic devices including Resistors, Capacitors, and Light Emitting Diodes (LEDs). Practical hands-on breadboard wiring configurations and simple circuit design rules."
              },
              {
                "id": "4",
                "date": "2026-06-23",
                "title": "Day 04: Hardware Measurement & GPIOs",
                "category": "internship",
                "description": "Configuring and testing digital/analog General Purpose Input/Output (GPIO) pins. Measuring voltage, loop currents, and resistance values across wired test circuits using a digital multimeter."
              },
              {
                "id": "5",
                "date": "2026-06-24",
                "title": "Day 05: Interfacing LDR (Light Sensors)",
                "category": "internship",
                "description": "Interfacing Light Dependent Resistors (LDR) to read changing analog light intensity levels. Programmed thresholds to trigger output alerts based on ambient illumination changes."
              },
              {
                "id": "6",
                "date": "2026-06-25",
                "title": "Day 06: Interfacing DHT11 Temperature Sensor",
                "category": "internship",
                "description": "Interfacing the DHT11 sensor to monitor environmental temperature and humidity levels. Written data validation logic to filter out noise fluctuations and format values for transmission."
              },
              {
                "id": "7",
                "date": "2026-06-26",
                "title": "Day 07: ESP32 WiFi & Network Protocols",
                "category": "internship",
                "description": "Setting up the ESP32 microcontroller's Wi-Fi module. Establishing station (STA) connections to local networks and checking communication protocols (IP addressing, TCP client/server models)."
              },
              {
                "id": "8",
                "date": "2026-06-27",
                "title": "Day 08: Blynk IoT Cloud Setup & Auth",
                "category": "internship",
                "description": "Created developer accounts on Blynk IoT Cloud. Set up device templates, virtual datastreams, and generated secure Authentication Tokens. Configured basic mobile application dashboards."
              },
              {
                "id": "9",
                "date": "2026-06-29",
                "title": "Day 09: Real-time Cloud Telemetry (Blynk)",
                "category": "internship",
                "description": "Programmed the ESP32 to upload environmental parameters (LDR intensity and DHT11 values) to the Blynk Cloud dashboard in real-time. Verified low-latency response and remote app widgets."
              },
              {
                "id": "10",
                "date": "2026-06-30",
                "title": "Day 10: ThingSpeak Logger & Capstone",
                "category": "internship",
                "description": "Linked the ESP32 to the ThingSpeak server for long-term data logging and visualization. Assembled the final Capstone Project: an integrated Smart Home System that tracks sensors and controls output relays."
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
