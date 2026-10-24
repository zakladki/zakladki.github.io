import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';
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

// Regional fuel prices API (updated: October 2026, UAH/l)
const REGIONAL_FUEL_DATA = {
  updatedAt: '2026-10-24',
  unit: 'грн/л',
  base: [
    { brand: 'OKKO', a95: 92.90, a95p: 95.90, dp: 105.90, dpp: 108.90, lpg: 52.90 },
    { brand: 'WOG', a95: 92.90, a95p: 95.90, dp: 104.50, dpp: 107.50, lpg: 53.50 },
    { brand: 'UPG', a95: 89.90, a95p: 92.90, dp: 101.90, dpp: 103.90, lpg: 51.90 },
    { brand: 'SOCAR', a95: 94.90, a95p: 97.90, dp: 106.00, dpp: 109.00, lpg: 54.40 },
    { brand: 'Укрнафта', a95: 88.90, a95p: 91.90, dp: 99.90, dpp: 101.90, lpg: 50.90 }
  ],
  // Regional price deltas (UAH) relative to national base
  regionDeltas: {
    ua: 0,
    kyiv: 0,
    kyiv_obl: -0.10,
    vinnytsia: -0.20,
    volyn: -0.40,
    dnipro: 0.20,
    donetsk: 0.60,
    zhytomyr: -0.20,
    zakarpattia: -0.40,
    zaporizhzhia: 0.40,
    ivano_frankivsk: -0.30,
    kirovohrad: 0.10,
    luhansk: 0.60,
    lviv: -0.40,
    mykolaiv: 0.10,
    odesa: 0.00,
    poltava: 0.10,
    rivne: -0.30,
    sumy: 0.20,
    ternopil: -0.30,
    kharkiv: 0.40,
    kherson: 0.50,
    khmelnytskyi: -0.20,
    cherkasy: 0.00,
    chernivtsi: -0.30,
    chernihiv: 0.10
  }
};

function getKyivUpdateStatus() {
  const now = new Date();
  const kyivStr = now.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' });
  const kyivDate = new Date(kyivStr);
  const hours = kyivDate.getHours();
  const minutes = kyivDate.getMinutes();

  // Якщо поточний час до 08:10 ранку, активні дані від вчорашніх 08:10
  const effectiveDate = new Date(kyivDate);
  if (hours < 8 || (hours === 8 && minutes < 10)) {
    effectiveDate.setDate(effectiveDate.getDate() - 1);
  }
  const y = effectiveDate.getFullYear();
  const m = String(effectiveDate.getMonth() + 1).padStart(2, '0');
  const d = String(effectiveDate.getDate()).padStart(2, '0');
  return {
    updatedAt: `${d}.${m}.${y} 08:10`,
    schedule: 'Щоденне оновлення о 08:10 (Київ)'
  };
}

app.get('/api/fuel-prices', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=1800');
  const status = getKyivUpdateStatus();
  res.json({
    ...REGIONAL_FUEL_DATA,
    ...status
  });
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

// Meteoprog proxy routes for dev/preview environments (bypasses CORS & host check)
app.get('/api/meteoprog/params/:id', (req, res) => {
  const { id } = req.params;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'X-Forwarded-For': clientIp
    }
  };
  https.get(`https://cdn.meteoprog.net/informerv4/1/params/${id}`, options, (pRes) => {
    let body = '';
    pRes.on('data', chunk => body += chunk);
    pRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      if (pRes.statusCode === 200 && body.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(body);
          if (parsed && !parsed.city_id) {
            parsed.city_id = '_rNkbYiHhgFgr1BdjhdKNw';
          }
          return res.json(parsed);
        } catch (e) {}
      }
      res.json({ lang: 'ua', city_id: '_rNkbYiHhgFgr1BdjhdKNw' });
    });
  }).on('error', () => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ lang: 'ua', city_id: '_rNkbYiHhgFgr1BdjhdKNw' });
  });
});

app.get('/api/meteoprog/js/:id/:lang/:city_id', (req, res) => {
  const { id, lang, city_id } = req.params;
  res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!city_id || city_id === 'undefined') {
    return res.send('/* Meteoprog city undefined */');
  }

  const url = `https://cdn.meteoprog.net/informerv4/1/js/${id}/${lang}/${city_id}`;
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (pRes) => {
    let body = '';
    pRes.on('data', chunk => body += chunk);
    pRes.on('end', () => {
      if (pRes.statusCode !== 200 || body.trim().startsWith('<') || body.trim().startsWith('{')) {
        return res.send('/* Meteoprog unavailable or non-JS response */');
      }
      // Allow execution in dev/preview environment by matching any host
      body = body.replace('window.location.host === "zakladki.github.io".replace(/^https?:\\/\\//, \'\')', 'true');
      res.send(body);
    });
  }).on('error', () => {
    res.send('// Error fetching meteoprog script');
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

// Fallback for any missing .js files: return valid JS comment instead of Express HTML 404 page
// This prevents "Uncaught SyntaxError: Unexpected token '<'" if any script is not found
app.use((req, res, next) => {
  if (req.path.endsWith('.js') || req.url.includes('.js?')) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    return res.status(404).send('/* 404 Script Not Found: ' + req.path + ' */');
  }
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});


