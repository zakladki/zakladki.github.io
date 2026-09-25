import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to safely store ad placement orders
app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData || !orderData.orderId) {
      return res.status(400).json({ error: 'Недійсні дані замовлення' });
    }
    const ordersFilePath = path.join(__dirname, 'orders.json');
    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
      try {
        const fileContent = fs.readFileSync(ordersFilePath, 'utf8');
        orders = JSON.parse(fileContent);
      } catch (e) {
        orders = [];
      }
    }
    orders.unshift({
      ...orderData,
      receivedAt: new Date().toISOString()
    });
    if (orders.length > 500) orders = orders.slice(0, 500);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
    return res.json({ success: true, orderId: orderData.orderId });
  } catch (err) {
    console.error('Error saving order:', err);
    return res.status(500).json({ error: 'Помилка збереження замовлення на сервері' });
  }
});

// Radio stream proxy route to fix Mixed Content (HTTP stream on HTTPS site)
app.get('/api/radio', (req, res) => {
  const streamUrl = 'http://82.207.23.148:8000/radio';

  const proxyReq = http.get(streamUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': '*/*',
      'Icy-MetaData': '0'
    }
  }, (streamRes) => {
    res.status(streamRes.statusCode || 200);
    res.setHeader('Content-Type', streamRes.headers['content-type'] || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
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

// Serve static files from root with no-cache for HTML
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

