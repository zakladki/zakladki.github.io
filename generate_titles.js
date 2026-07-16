import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is missing.");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const files = [
  'index.html',
  'news.html',
  'media.html',
  'social.html',
  'communal.html',
  'bank.html',
  'market.html',
  'shops.html',
  'city.html',
  'programs.html',
  'games.html',
  'others.html'
];

const CACHE_FILE = 'descriptions_cache.json';

// Load cache if exists
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    const rawCache = fs.readFileSync(CACHE_FILE, 'utf8');
    if (rawCache && rawCache.trim() !== '') {
      cache = JSON.parse(rawCache);
      console.log(`Loaded ${Object.keys(cache).length} cached descriptions from ${CACHE_FILE}.`);
    }
  } catch (e) {
    console.error("Error reading cache file, starting fresh:", e);
  }
}

// Helper to save cache
function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

// Helper to escape HTML attributes
function escapeHtmlAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function run() {
  console.log("Analyzing all category files...");
  
  const missingLinks = [];
  
  files.forEach(file => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping file (not found): ${file}`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Regex matching individual <li> items in lists
    const liRegex = /<li>[\s\S]*?<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/li>/gi;
    
    let match;
    while ((match = liRegex.exec(content)) !== null) {
      const fullLi = match[0];
      const url = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      
      // If it contains a title, skip it
      if (/title=["']/i.test(fullLi)) {
        continue;
      }
      
      // Exclude anchor-only or empty links
      if (!url || url.startsWith('#') || url.startsWith('javascript:')) {
        continue;
      }
      
      missingLinks.push({
        file,
        url,
        text,
        fullLi
      });
    }
  });
  
  console.log(`Found ${missingLinks.length} total missing descriptions.`);
  
  // Deduplicate by URL
  const uniqueUrls = new Map();
  missingLinks.forEach(item => {
    if (!uniqueUrls.has(item.url)) {
      uniqueUrls.set(item.url, { url: item.url, text: item.text });
    }
  });
  
  // Filter out URLs that are already in cache
  const uniqueList = Array.from(uniqueUrls.values()).filter(item => !cache[item.url]);
  console.log(`Deduplicated to ${uniqueList.length} unique URLs that NEED generation (skipping cached).`);
  
  if (uniqueList.length === 0) {
    console.log("All missing links are already in cache or don't need generation. Writing updates directly.");
  } else {
    // Batch the unique URLs to ask Gemini
    // Large batch size (75) to make very few API calls and avoid 20 requests/day limits
    const batchSize = 75; 
    
    for (let i = 0; i < uniqueList.length; i += batchSize) {
      const batch = uniqueList.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(uniqueList.length / batchSize)} (${batch.length} items)...`);
      
      const prompt = `Ви є професійним копірайтером. Складіть короткі, корисні та лаконічні описи для наступних сайтів українською мовою.
Кожен опис повинен:
1. Бути написаний українською мовою.
2. Складатися максимум з 1-3 речень (до 3-4 коротких рядків).
3. Бути об'єктивним, інформативним та корисним для користувача (вказувати, чим корисний цей сайт, які послуги надає або що на ньому можна знайти).
4. НЕ містити зайвої води, реклами або закликів до дії.

Сайт(и) для опису:
${JSON.stringify(batch, null, 2)}

Поверніть результат у вигляді JSON об'єкта, де ключем є точний URL, а значенням — складений опис сайту українською мовою. Не повертайте нічого іншого, крім валідного JSON об'єкта.`;

      let success = false;
      let retries = 5;
      let delay = 65000; // Wait 65s on quota/rate limits to be absolutely safe
      
      while (!success && retries > 0) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                description: "JSON object mapping website URLs to their Ukrainian descriptions",
              }
            }
          });
          
          const text = response.text.trim();
          const results = JSON.parse(text);
          
          Object.assign(cache, results);
          saveCache();
          success = true;
          console.log(`Batch ${Math.floor(i / batchSize) + 1} successfully completed. Cached: ${Object.keys(results).length} items.`);
        } catch (err) {
          retries--;
          const errMsg = err.message || JSON.stringify(err);
          console.error(`Error processing batch starting at index ${i}. Retries left: ${retries}\nError message: ${errMsg}`);
          
          if (retries > 0) {
            console.log(`Rate limit or temporary error hit. Waiting 65 seconds before retry...`);
            await new Promise(r => setTimeout(r, delay));
          }
        }
      }
      
      if (!success) {
        console.warn(`Skipping batch starting at index ${i} after all retries failed.`);
      }
      
      // Add a small delay between batches
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  // 4. Update the HTML files with the cached descriptions
  console.log("\nWriting cached descriptions to HTML files...");
  
  files.forEach(file => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fileUpdated = false;
    
    const liRegex = /(<li>[\s\S]*?<a\s+[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>[\s\S]*?<\/li>)/gi;
    
    content = content.replace(liRegex, (fullLi, p1, url) => {
      if (/title=["']/i.test(fullLi)) {
        return fullLi;
      }
      
      const desc = cache[url];
      if (desc) {
        const aTagRegex = /(<a\s+[^>]*href=["']([^"']+)["'][^>]*)(>)/i;
        const updatedLi = fullLi.replace(aTagRegex, (aTag, p1_a, url_a, p3_a) => {
          const cleanDesc = escapeHtmlAttr(desc);
          return `${p1_a} title="${cleanDesc}"${p3_a}`;
        });
        
        fileUpdated = true;
        return updatedLi;
      }
      
      return fullLi;
    });
    
    if (fileUpdated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${file}`);
    }
  });
  
  console.log("\nFinished updating all files!");
}

run().catch(err => {
  console.error("Unhandled error in runner:", err);
});
