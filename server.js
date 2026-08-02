import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Radio stream proxy route to fix Mixed Content (HTTP stream on HTTPS site)
app.get('/api/radio', (req, res) => {
  const streamUrl = 'http://82.207.23.148:8000/radio';

  const proxyReq = http.get(streamUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Icy-MetaData': '1'
    }
  }, (streamRes) => {
    res.setHeader('Content-Type', streamRes.headers['content-type'] || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    streamRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Radio stream proxy error:', err);
    if (!res.headersSent) {
      res.status(502).send('Error connecting to radio stream');
    }
  });

  req.on('close', () => {
    proxyReq.destroy();
  });
});

// Serve static files from root
app.use(express.static(__dirname));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

