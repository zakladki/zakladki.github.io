import fs from "fs";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined.");
  process.exit(1);
}

const files = [
  "index.html", "bank.html", "city.html", "communal.html", 
  "games.html", "market.html", "media.html", "news.html", 
  "others.html", "programs.html", "shops.html", "social.html"
];

// Step 1: Scan files and find all links missing titles
console.log("Scanning files for links without titles...");
const missingMap = new Map(); // url -> { name, files: [] }

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, "utf8");
  
  // Pattern to find standard list items with links
  const regex = /<li>([\s\S]*?)<a\s+([^>]*?)href=["\x27]([^"\x27]+)["\x27]([^>]*?)>([\s\S]*?)<\/a>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const url = match[3].trim();
    const linkText = match[5].replace(/<[^>]*>/g, "").trim();
    const attrs = match[2] + " " + match[4];
    
    // Ignore images, buttons, or links that already have title
    if (!attrs.includes("title=") && !linkText.includes("<img") && linkText !== "" && !url.startsWith("#")) {
      if (!missingMap.has(url)) {
        missingMap.set(url, { name: linkText, files: [f] });
      } else {
        const item = missingMap.get(url);
        if (!item.files.includes(f)) {
          item.files.push(f);
        }
      }
    }
  }
});

const missingList = [];
for (const [url, data] of missingMap.entries()) {
  missingList.push({ url, name: data.name });
}

console.log(`Found ${missingList.length} unique URLs missing descriptions.`);

if (missingList.length === 0) {
  console.log("All links already have descriptions. Nothing to do!");
  process.exit(0);
}

// Step 2: Batch generate descriptions using Gemma
const BATCH_SIZE = 25;
const descriptions = {}; // url -> description

async function generateBatch(batch, batchNum, totalBatches) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${apiKey}`;
  
  const prompt = `You are an expert on Ukrainian websites and internet portals.
For each website in the list below, write a very short, helpful description in Ukrainian (maximum 10 words, extremely concise, focused on its utility and main function). Keep descriptions objective, professional, and clear.

Input list:
${JSON.stringify(batch, null, 2)}

Respond ONLY with a JSON array of objects, containing "url" and "description".
Format:
[
  { "url": "...", "description": "..." }
]`;

  console.log(`Sending batch ${batchNum}/${totalBatches} (${batch.length} items) to Gemma...`);
  
  let attempts = 3;
  while (attempts > 0) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      
      const data = await response.json();
      if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
      }
      
      // Get correct response part (skip thought parts if present)
      let txt = "";
      const parts = data.candidates[0].content.parts;
      const nonThoughtPart = parts.find(p => !p.thought);
      if (nonThoughtPart) {
        txt = nonThoughtPart.text;
      } else {
        txt = parts[0].text;
      }
      
      // Extract JSON array from response using regex
      const jsonMatch = txt.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) {
        throw new Error("Could not find JSON array in response text");
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.forEach(item => {
        if (item.url && item.description) {
          descriptions[item.url.trim()] = item.description.trim();
        }
      });
      
      console.log(`Successfully processed batch ${batchNum}.`);
      break; // Success, exit retry loop
    } catch (err) {
      console.warn(`Attempt failed for batch ${batchNum}: ${err.message}. Retrying...`);
      attempts--;
      if (attempts === 0) {
        console.error(`Failed to generate descriptions for batch ${batchNum} after 3 attempts.`);
      } else {
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5s before retry
      }
    }
  }
}

async function run() {
  const totalBatches = Math.ceil(missingList.length / BATCH_SIZE);
  for (let i = 0; i < missingList.length; i += BATCH_SIZE) {
    const batch = missingList.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    await generateBatch(batch, batchNum, totalBatches);
    // Be gentle to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\nGenerated ${Object.keys(descriptions).length} descriptions.`);
  
  // Step 3: Update HTML files with the generated descriptions
  console.log("Updating HTML files...");
  
  files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, "utf8");
    let updated = false;
    
    // Pattern to find standard list items with links
    const regex = /<li>([\s\S]*?)<a\s+([^>]*?)href=["\x27]([^"\x27]+)["\x27]([^>]*?)>([\s\S]*?)<\/a>([\s\S]*?)<\/li>/gi;
    
    let newContent = content.replace(regex, (match, prefix, beforeHref, url, afterHref, linkText, suffix) => {
      const trimmedUrl = url.trim();
      const attrs = beforeHref + " " + afterHref;
      
      // If it has no title, and we have a generated description for it
      if (!attrs.includes("title=") && !linkText.includes("<img") && linkText !== "" && descriptions[trimmedUrl]) {
        updated = true;
        const desc = descriptions[trimmedUrl].replace(/"/g, "&quot;");
        // Insert title="desc" right before href or at the end
        return `<li>${prefix}<a ${beforeHref}title="${desc}" href="${url}"${afterHref}>${linkText}</a>${suffix}</li>`;
      }
      return match;
    });
    
    if (updated) {
      fs.writeFileSync(f, newContent, "utf8");
      console.log(`Updated ${f}`);
    }
  });
  
  console.log("Done! All missing descriptions have been added successfully.");
}

run();
