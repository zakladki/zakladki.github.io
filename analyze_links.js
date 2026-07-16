import fs from 'fs';
import path from 'path';

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

let totalLinks = 0;
let linksWithDesc = 0;
let linksWithoutDesc = 0;

const linksMissing = [];

files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // A regex to match <li> containing <a href="...">...</a>
  // We can look for <a href="..." and see if it has a title
  const liRegex = /<li>[\s\S]*?<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/li>/gi;
  
  let match;
  while ((match = liRegex.exec(content)) !== null) {
    const fullLinkTag = match[0];
    const url = match[1];
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    
    totalLinks++;
    
    // Check if title attribute exists in this anchor or anywhere in the match
    const hasTitle = /title=["']([^"']*)["']/i.test(fullLinkTag);
    
    if (hasTitle) {
      linksWithDesc++;
    } else {
      linksWithoutDesc++;
      linksMissing.push({ file, url, text });
    }
  }
});

console.log(`Total Links found in lists: ${totalLinks}`);
console.log(`Links with descriptions: ${linksWithDesc}`);
console.log(`Links without descriptions: ${linksWithoutDesc}`);
console.log('\nSample links without descriptions (first 10):');
console.log(linksMissing.slice(0, 10));
