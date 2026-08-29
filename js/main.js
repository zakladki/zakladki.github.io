// 0. Пригнічення помилок від сторонніх розширень браузера (MetaMask, Auro Wallet тощо)
(function() {
  function isExtensionError(err) {
    if (!err) return false;
    const str = String(err.message || err.stack || err.reason || err).toLowerCase();
    return str.includes('metamask') || 
           str.includes('auro wallet') || 
           str.includes('phantom') || 
           str.includes('coinbase') ||
           str.includes('failed to connect');
  }

  window.addEventListener('unhandledrejection', function(event) {
    if (isExtensionError(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('error', function(event) {
    if (isExtensionError(event.error) || isExtensionError(event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();

// 1. Швидке застосування темної теми (запобігає білому спалаху)
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark-mode");
  if (document.body) {
    document.body.classList.add("dark-mode");
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.add("dark-mode");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  // === Fix favicon for subdomains and special services ===
  const base64Favicons = {"accounts.ukr.net":"https://accounts.ukr.net/login/assets/favicon.png","mail.ukr.net":"https://accounts.ukr.net/login/assets/favicon.png","ukr.net":"https://upst.fwdcdn.com/favicon-v3.png","www.ukr.net":"https://upst.fwdcdn.com/favicon-v3.png","uaflix.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M4 10c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V10z\" fill=\"%230057b7\"/><path d=\"M4 16h24v6c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4v-6z\" fill=\"%23ffd700\"/><polygon points=\"13,10 23,16 13,22\" fill=\"%23ffffff\"/></svg>","myradio.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><circle cx=\"16\" cy=\"18\" r=\"5\" fill=\"%23ffffff\"/><path d=\"M9 11a10 10 0 0 1 14 0M12 14a6 6 0 0 1 8 0\" stroke=\"%23ffffff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"18\" r=\"2\" fill=\"%23ea580c\"/></svg>","abuk.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M8 8h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H8V8z\" fill=\"%23ffffff\"/><path d=\"M24 8h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7V8z\" fill=\"%23e0e7ff\"/><path d=\"M16 12v12\" stroke=\"%234f46e5\" stroke-width=\"2\"/></svg>","podcasts.nv.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><rect x=\"13\" y=\"8\" width=\"6\" height=\"10\" rx=\"3\" fill=\"%23ffffff\"/><path d=\"M9 15a7 7 0 0 0 14 0M16 22v5M12 27h8\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>","kick.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><path d=\"M8 6h5v7.5L18.5 6H24l-6.5 8.5L24 26h-5.5l-5.5-8V26H8V6z\" fill=\"%2353fc18\"/></svg>","youtv.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><rect x=\"5\" y=\"7\" width=\"22\" height=\"15\" rx=\"3\" fill=\"%23ffffff\"/><path d=\"M10 26h12M16 22v4\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\"/><polygon points=\"13,11 20,14.5 13,18\" fill=\"%230284c7\"/></svg>","tv.kyivstar.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><path d=\"M16 5l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z\" fill=\"%23ffffff\"/></svg>","radioplayer.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><path d=\"M12 10l10 6-10 6V10z\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"12\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\"/></svg>","uakino.me":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23eab308\"/><path d=\"M12 9l11 7-11 7V9z\" fill=\"%23111827\"/></svg>","eneyida.tv":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"23\" font-size=\"20\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">E</text></svg>","uaserials.pro":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%239333ea\"/><rect x=\"6\" y=\"8\" width=\"20\" height=\"14\" rx=\"3\" fill=\"%23ffffff\"/><polygon points=\"13,11 20,15 13,19\" fill=\"%239333ea\"/></svg>","takflix.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2318181b\"/><text x=\"16\" y=\"23\" font-size=\"20\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">T</text></svg>","music.youtube.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23ff0000\"/><circle cx=\"16\" cy=\"16\" r=\"10\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"2\"/><polygon points=\"13,11 21,16 13,21\" fill=\"%23ffffff\"/></svg>","open.spotify.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%231ed760\"/><path d=\"M8 12c6-1.5 12-1 16 1.5M9 16c5-1.2 10-.8 14 1M11 20c4-1 8-.5 11 1\" stroke=\"%23ffffff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/></svg>","music.apple.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23fa2d48\"/><path d=\"M18 9v11a3 3 0 1 1-3-3h3V9z\" fill=\"%23ffffff\"/></svg>","soundcloud.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff5500\"/><path d=\"M8 20v-4M11 21v-7M14 22v-9M17 22v-11M20 22a4 4 0 0 0 0-8 5 5 0 0 0-5 3v5z\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>","store.steampowered.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23171a21\"/><path d=\"M16 6a10 10 0 0 0-9.8 8l4.4 1.8a3.5 3.5 0 0 1 4.9-1.3l3-4.3a10 10 0 0 0-2.5-4.2zm-6 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm12-3a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z\" fill=\"%2366c0f4\"/></svg>","steampowered.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23171a21\"/><path d=\"M16 6a10 10 0 0 0-9.8 8l4.4 1.8a3.5 3.5 0 0 1 4.9-1.3l3-4.3a10 10 0 0 0-2.5-4.2zm-6 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm12-3a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z\" fill=\"%2366c0f4\"/></svg>","store.epicgames.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23121212\"/><path d=\"M7 6h18v4H11v6h12v4H11v6h14v4H7V6z\" fill=\"%23ffffff\"/></svg>","epicgames.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23121212\"/><path d=\"M7 6h18v4H11v6h12v4H11v6h14v4H7V6z\" fill=\"%23ffffff\"/></svg>","gog.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%238a2be2\"/><text x=\"16\" y=\"22\" font-size=\"16\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">GOG</text></svg>","playua.net":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><path d=\"M10 8l14 8-14 8V8z\" fill=\"%230057b7\"/><path d=\"M10 16l14 0-14 8V16z\" fill=\"%23ffd700\"/></svg>","gamedev.dou.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231a202c\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%2338bdf8\" text-anchor=\"middle\" font-family=\"sans-serif\">DOU</text></svg>","itc.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ITC</text></svg>","boosteroid.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230088cc\"/><path d=\"M8 20l8-12 8 12h-5l-3-4.5-3 4.5H8z\" fill=\"%23ffffff\"/></svg>","geforcenow.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2376b900\"/><path d=\"M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z\" fill=\"%23ffffff\"/></svg>","crazygames.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%237c3aed\"/><path d=\"M10 10h12v4H10zM10 18h12v4H10z\" fill=\"%23ffffff\"/></svg>","kongregate.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"23\" font-size=\"18\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">K</text></svg>","hltv.org":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232b6cb0\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">HLTV</text></svg>","liquipedia.net":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%2338bdf8\"/></svg>","pw.game":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAACXBIWXMAAAsTAAALEwEAmpwYAAABUElEQVR42q1VO27DMAx9owfDgGfv3Tply1ECX6Q38OgLaDOQo2TTpito05wMAlihqKqwpGKh7nuLDYGPH1EkVPSYYWAREBMDLAxmjGjCGwweIIUPmHT6Eh0WZiwZsaCr+7agBjo9jhMCqJEBJ+E9mzcy8Ci6Enwz3XMtFpDGM62J55rEWsJXKv9OV8q4pj9IxpyGAXFOxfhJZJISGxJ67n+gle6k4Z5Oht+tNQIzV/X0Cp7AOYsE9gBOA9hDAhYIhwQCEKWAz4VkBXSaQFQFHIGmL5FsPBHoVhEIugB+TG7sT6ZgGwX0FGzlGh1dmMCFXOUaRSOVJnbkv0vqSkMrjTSyVs7eBHJUspVLEkzE8xbOxpxbfs5RHg70kVNIX0PlOYuBIkWksRwoQAf3h5HWHxyq/zTWeRSufbHo6LAi7qy2Ff3ect2qy3WTvnWM7ev9E1Cd4GW12cjkAAAAAElFTkSuQmCC","chess.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23689f38\"/><path d=\"M16 6a3 3 0 0 0-3 3c0 .8.3 1.5.8 2H11v3h10v-3h-2.8c.5-.5.8-1.2.8-2a3 3 0 0 0-3-3zm-6 12h12v3H10zm-2 5h16v3H8z\" fill=\"%23ffffff\"/></svg>","sudoku.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M6 6h20v20H6V6zm2 2v5h5V8H8zm7 0v5h5V8h-5zm7 0v5h4V8h-4zm-14 7v5h5v-5H8zm7 0v5h5v-5h-5zm7 0v5h4v-5h-4z\" fill=\"%23ffffff\"/></svg>","mezha.media":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M6 8h4l6 10 6-10h4v16h-4v-9.5L16 23.5 10 14.5V24H6V8z\" fill=\"%2338bdf8\"/></svg>","overclockers.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">OC.UA</text></svg>","escharts.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230d1117\"/><path d=\"M8 22V16l5 4 6-8 5 4\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>","maincast.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff4500\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">MC</text></svg>","battle.net":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300aeff\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"4\" fill=\"%2300aeff\"/></svg>","roblox.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><rect x=\"9\" y=\"9\" width=\"14\" height=\"14\" rx=\"2\" fill=\"%23ffffff\" transform=\"rotate(-15 16 16)\"/><rect x=\"14\" y=\"14\" width=\"4\" height=\"4\" fill=\"%23000000\" transform=\"rotate(-15 16 16)\"/></svg>","xbox.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23107c41\"/><path d=\"M9 9c2 2 5 6 7 10 2-4 5-8 7-10 1.5 2 3 5 3 7 0 5-4 10-10 10S6 21 6 16c0-2 1.5-5 3-7z\" fill=\"%23ffffff\"/></svg>","ggbet.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23ff6600\" text-anchor=\"middle\" font-family=\"sans-serif\">GG</text></svg>","favbet.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><path d=\"M8 8h16v4H12v4h10v4H12v8H8V8z\" fill=\"%23ffffff\"/></svg>","ggpoker.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ef4444\" text-anchor=\"middle\" font-family=\"sans-serif\">GGP</text></svg>","pokermatch.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23f59e0b\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23000000\" text-anchor=\"middle\" font-family=\"sans-serif\">PM</text></svg>","pokermatch.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23f59e0b\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23000000\" text-anchor=\"middle\" font-family=\"sans-serif\">PM</text></svg>","supergra.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%23facc15\"/></svg>","t.me":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23229ED9\"/><path d=\"M7.8 15.5l15.8-6.1c.7-.3 1.4.2 1.2 1l-2.7 12.6c-.2.9-.7 1.1-1.5.7l-4.1-3-2 1.9c-.2.2-.4.4-.8.4l.3-4.2 7.6-6.9c.3-.3-.1-.5-.5-.2l-9.4 5.9-4.1-1.3c-.9-.3-.9-.9.2-1.3z\" fill=\"%23ffffff\"/></svg>","easypay.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23eb2328\"/><text x=\"16\" y=\"22\" font-size=\"13\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">EP</text></svg>","ipay.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300529b\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">iPay</text></svg>","city24.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300b0ff\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">C24</text></svg>","portmone.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ef4444\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">P</text></svg>","yasno.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ffcc00\"/><path d=\"M16 6l2.5 5.5L24 14l-4 4.5L21 24l-5-3-5 3 1-5.5-4-4.5 5.5-2.5z\" fill=\"%23111827\"/></svg>","grmu.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 8c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23facc15\"/></svg>","vodokanal.kiev.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 7c-3.5 5-7 8.5-7 12a7 7 0 0 0 14 0c0-3.5-3.5-7-7-12z\" fill=\"%23ffffff\"/></svg>","gerc.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><text x=\"16\" y=\"22\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГЕРЦ</text></svg>","kte.kmda.gov.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><path d=\"M16 6c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23fef08a\"/></svg>","portal.pfu.gov.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"900\" fill=\"%23ffd700\" text-anchor=\"middle\" font-family=\"sans-serif\">ПФУ</text></svg>","diia.gov.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">дія</text></svg>","cabinet.tax.gov.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ДПС</text></svg>","eq.hsc.gov.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e3a8a\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">МВС</text></svg>","gioc.kiev.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГІОЦ</text></svg>","mydimonline.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><path d=\"M16 8l8 7v9h-5v-6h-6v6h-5v-9z\" fill=\"%23ffffff\"/></svg>","infoxvod.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 6c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23ffffff\"/></svg>","novakom.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">НОВАКОМ</text></svg>","bankchart.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23059669\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">BC</text></svg>","lycamobile.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300a859\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">Lyca</text></svg>","cc.ukrtele.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>","ukrtele.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>","ukrtelecom.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>","www.ukrtelecom.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>","my.ukrtelecom.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>","vodokanal.kyiv.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 7c-3.5 5-7 8.5-7 12a7 7 0 0 0 14 0c0-3.5-3.5-7-7-12z\" fill=\"%23ffffff\"/></svg>","gioc.kyivcity.gov.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГІОЦ</text></svg>","e-driver.mvs.gov.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e3a8a\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">МВС</text></svg>","mydim.online":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><path d=\"M16 8l8 7v9h-5v-6h-6v6h-5v-9z\" fill=\"%23ffffff\"/></svg>","mail.google.com":"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%234285F4' d='M2 8v10c0 1.1.9 2 2 2h2V9.5L2 6.5z'/><path fill='%2334A853' d='M22 8v10c0 1.1-.9 2-2 2h-2V9.5l4-3z'/><path fill='%23FBBC04' d='M2 8c0-1.1.9-2 2-2h2v3.5L2 6.5z'/><path fill='%23C5221F' d='M22 8c0-1.1-.9-2-2-2h-2v3.5l4-3z'/><path fill='%23EA4335' d='M12 14l8-6.5V6c0-.83-.8-1.4-1.5-.9L12 9.5 5.5 5.1C4.8 4.6 4 5.17 4 6v1.5l8 6.5z'/></svg>","gmail.com":"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%234285F4' d='M2 8v10c0 1.1.9 2 2 2h2V9.5L2 6.5z'/><path fill='%2334A853' d='M22 8v10c0 1.1-.9 2-2 2h-2V9.5l4-3z'/><path fill='%23FBBC04' d='M2 8c0-1.1.9-2 2-2h2v3.5L2 6.5z'/><path fill='%23C5221F' d='M22 8c0-1.1-.9-2-2-2h-2v3.5l4-3z'/><path fill='%23EA4335' d='M12 14l8-6.5V6c0-.83-.8-1.4-1.5-.9L12 9.5 5.5 5.1C4.8 4.6 4 5.17 4 6v1.5l8 6.5z'/></svg>","subsidii.ioc.gov.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"bold\" fill=\"%23ffd700\" text-anchor=\"middle\" font-family=\"sans-serif\">СУБС</text></svg>","protonvpn.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%236d4aff\"/><path d=\"M16 6l9 4v7c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V10l9-4z\" fill=\"%23ffffff\"/><path d=\"M16 11l5 2.5v4.5c0 3.1-2.1 6-5 6.7-2.9-.7-5-3.6-5-6.7v-4.5l5-2.5z\" fill=\"%236d4aff\"/></svg>","windscribe.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231a2b4c\"/><path d=\"M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6\" stroke=\"%2300b0ff\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M8 14c0-4.4 3.6-8 8-8s8 3.6 8 8\" stroke=\"%2300b0ff\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"20\" r=\"2.5\" fill=\"%2300b0ff\"/></svg>","upchart.in":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M7 23l5-6 5 3 8-10\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20 10h5v5\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><rect x=\"8\" y=\"19\" width=\"3\" height=\"5\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"13\" y=\"16\" width=\"3\" height=\"8\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"18\" y=\"13\" width=\"3\" height=\"11\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"23\" y=\"9\" width=\"3\" height=\"15\" fill=\"%23ffffff\" opacity=\"0.9\"/></svg>","khartiia.org":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2315803d\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ХАРТІЯ</text></svg>","koloua.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><circle cx=\"16\" cy=\"16\" r=\"9\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"/></svg>"};












  const domainAliases = {
  "webmail.meta.ua": "meta.ua",
  "mail.i.ua": "i.ua",
  "speed.inetpro.com.ua": "speedtest.net",
  "tlgrm.ru": "telegram.org",
  "otto-trade.ua": "otto.de",
  "airbnb.com.ua": "airbnb.com",
  "ru.airbnb.com": "airbnb.com",
  "web.whatsapp.com": "whatsapp.com",
  "web.viber.com": "viber.com",
  "viber.com.ua": "viber.com",
  "pro.musixmatch.com": "musixmatch.com",
  "ru.uptodown.com": "uptodown.com",
  "ukr.net": "ukr.net",
  "meta.ua": "meta.ua",
  "i.ua": "i.ua",
  "whatsapp.com": "whatsapp.com"
};

  const fixFavicon = (img) => {
    if (!img) return;
    const parentA = img.closest ? img.closest("a") : null;
    if (parentA && parentA.getAttribute("href") && parentA.getAttribute("href").includes("CHANGELOG.md")) {
      img.src = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23007bff\"/><path d=\"M9 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V8z\" fill=\"%23ffffff\"/><path d=\"M13 11h6M13 15h6M13 19h4\" stroke=\"%23007bff\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>";
      return;
    }
    let domain = "";
    if (parentA && parentA.href && parentA.href.startsWith("http")) {
      try {
        domain = new URL(parentA.href).hostname.toLowerCase().replace(/^www\./, "");
      } catch (e) {}
    }
    if (!domain && img.src) {
      try {
        const match = img.src.match(/domain=([^&]+)/);
        if (match) domain = match[1].toLowerCase().replace(/^www\./, "");
      } catch (e) {}
    }

    if (!domain) return;

    if (base64Favicons[domain]) {
      img.src = base64Favicons[domain];
      return;
    }

    if (domainAliases[domain]) {
      const alias = domainAliases[domain];
      if (base64Favicons[alias]) {
        img.src = base64Favicons[alias];
      } else {
        img.src = "https://www.google.com/s2/favicons?domain=" + alias + "&sz=32";
      }
      return;
    }
  };
  // Run immediately on existing images
  document.querySelectorAll('img.link-favicon').forEach(fixFavicon);

  // Watch for newly added images
  const faviconObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'IMG' && node.classList.contains('link-favicon')) {
            fixFavicon(node);
          } else {
            node.querySelectorAll('img.link-favicon').forEach(fixFavicon);
          }
        }
      }
    }
  });
  faviconObserver.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });

  // === Radio LEGION Stream Player Logic ===
  const radioPlayBtn = document.getElementById('radioLegionPlayBtn');
  const radioAudio = document.getElementById('radioLegionAudio');
  const radioPlayIcon = document.getElementById('radioPlayIcon');

  if (radioPlayBtn && radioAudio) {
    const radioItem = radioPlayBtn.closest('.radio-legion-item');
    let currentState = 'idle'; // 'idle', 'loading', 'playing'

    const setState = (newState) => {
      currentState = newState;
      if (radioItem) {
        radioItem.classList.remove('playing', 'loading');
      }

      if (newState === 'playing') {
        if (radioItem) radioItem.classList.add('playing');
        if (radioPlayIcon) radioPlayIcon.className = 'fas fa-pause';
      } else if (newState === 'loading') {
        if (radioItem) radioItem.classList.add('loading');
        if (radioPlayIcon) radioPlayIcon.className = 'fas fa-spinner fa-spin';
      } else {
        if (radioPlayIcon) radioPlayIcon.className = 'fas fa-play';
      }
    };

    radioPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Зупиняємо YouTube плеєр якщо він грає
      if (window.pauseYtTestPlayer) {
        window.pauseYtTestPlayer();
      }

      if (currentState === 'idle') {
        // Миттєво показуємо іконку завантаження (спінер)
        setState('loading');

        const streamUrl = 'https://radio-legion.com.ua/stream.php?stream=radio&t=' + Date.now();
        radioAudio.src = streamUrl;

        const playPromise = radioAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error('Помилка відтворення Радіо ЛЕГІОН:', err);
            // Спроба відтворення резервного потоку
            radioAudio.src = 'https://radio-legion.com.ua/stream.php?stream=radiohd&t=' + Date.now();
            radioAudio.play().catch((fallbackErr) => {
              console.error('Помилка резервного потоку:', fallbackErr);
              setState('idle');
            });
          });
        }
      } else {
        // Якщо завантажується або грає — зупиняємо
        radioAudio.pause();
        radioAudio.removeAttribute('src');
        radioAudio.load();
        setState('idle');
      }
    });

    radioAudio.addEventListener('waiting', () => {
      if (currentState === 'playing') setState('loading');
    });
    radioAudio.addEventListener('playing', () => setState('playing'));
    radioAudio.addEventListener('pause', () => {
      if (currentState !== 'loading') setState('idle');
    });
    radioAudio.addEventListener('ended', () => setState('idle'));
    radioAudio.addEventListener('error', () => setState('idle'));
  }

  // === YouTube Test Player Logic (Card "ТЕСТ") ===
  const ytPlayBtns = document.querySelectorAll('.yt-play-btn');

  if (ytPlayBtns.length > 0) {
    let activeBtn = null;
    let activePlaylistId = null;
    let ytState = 'idle'; // 'idle', 'loading', 'playing'
    let ytPlayer = null;
    let isApiLoading = false;
    let needsShuffle = false;
    let tickerInterval = null;

    const IDLE_TICKER_TEXT = '🎵 Для прослуховування натисніть кнопку <i class="fas fa-play yt-ticker-play-icon"></i> «Play» 🎵 Режим очікування 🎵';

    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };

    const ensurePlayerContainer = () => {
      const wrapper = document.getElementById('ytTestPlayerWrapper');
      if (wrapper) {
        let container = document.getElementById('ytTestPlayer');
        if (!container) {
          container = document.createElement('div');
          container.id = 'ytTestPlayer';
          wrapper.appendChild(container);
        }
      }
    };

    const destroyPlayer = () => {
      if (ytPlayer) {
        try {
          if (typeof ytPlayer.destroy === 'function') {
            ytPlayer.destroy();
          }
        } catch (e) {
          console.warn('Error destroying YT player:', e);
        }
        ytPlayer = null;
      }
      ensurePlayerContainer();
    };

    const updateTickerText = (text) => {
      const activeCard = activeBtn ? activeBtn.closest('.group') : null;
      document.querySelectorAll('.group.cat-media').forEach((card) => {
        const tickerTextEl = card.querySelector('.yt-ticker-text');
        if (tickerTextEl) {
          if (activeCard && card === activeCard) {
            tickerTextEl.innerHTML = text;
          } else {
            tickerTextEl.innerHTML = IDLE_TICKER_TEXT;
          }
        }
      });
    };

    const refreshTickerVideoData = () => {
      if (ytPlayer && typeof ytPlayer.getVideoData === 'function') {
        const data = ytPlayer.getVideoData();
        if (data && (data.title || data.author)) {
          const authorStr = data.author ? `КАНАЛ: «${escapeHtml(data.author)}»` : '';
          const titleStr = data.title ? `ТРЕК: «${escapeHtml(data.title)}»` : '';
          if (authorStr && titleStr) {
            updateTickerText(`🎵 ${authorStr} 🎵 ${titleStr} 🎵`);
          } else if (titleStr) {
            updateTickerText(`🎵 ${titleStr} 🎵`);
          } else if (authorStr) {
            updateTickerText(`🎵 ${authorStr} 🎵`);
          }
          return;
        }
      }
      updateTickerText('🎵 Відтворення YouTube плейлиста...');
    };

    const startTickerPolling = () => {
      if (tickerInterval) clearInterval(tickerInterval);
      refreshTickerVideoData();
      tickerInterval = setInterval(refreshTickerVideoData, 3000);
    };

    const stopTickerPolling = () => {
      if (tickerInterval) {
        clearInterval(tickerInterval);
        tickerInterval = null;
      }
    };

    window.pauseYtTestPlayer = () => {
      if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
      }
      setPlayerVisible(false);
      stopTickerPolling();
      updateTickerText('⏸ Пауза. Натисніть «Play» для продовження');
      if (activeBtn) {
        updateItemState(activeBtn, 'idle');
        activeBtn = null;
      }
      ytState = 'idle';
    };

    const updateItemState = (btn, newState) => {
      if (!btn) return;
      const item = btn.closest('.radio-legion-item');
      const icon = btn.querySelector('.yt-play-icon');

      if (item) {
        item.classList.remove('playing', 'loading');
      }

      if (newState === 'playing') {
        if (item) item.classList.add('playing');
        if (icon) icon.className = 'fas fa-pause yt-play-icon';
      } else if (newState === 'loading') {
        if (item) item.classList.add('loading');
        if (icon) icon.className = 'fas fa-spinner fa-spin yt-play-icon';
      } else {
        if (icon) icon.className = 'fas fa-play yt-play-icon';
      }
    };

    const createPlayer = (playlistId, autoPlay = true) => {
      ensurePlayerContainer();
      ytPlayer = new window.YT.Player('ytTestPlayer', {
        height: '100%',
        width: '100%',
        playerVars: {
          listType: 'playlist',
          list: playlistId,
          autoplay: autoPlay ? 1 : 0,
          playsinline: 1,
          enablejsapi: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          vq: 'medium',
          origin: window.location.origin
        },
        events: {
          'onReady': (event) => {
            try {
              event.target.setShuffle(true);
            } catch (e) {
              console.log('Shuffle error:', e);
            }
            try {
              if (typeof event.target.setPlaybackQuality === 'function') {
                event.target.setPlaybackQuality('medium');
              }
            } catch (e) {}
            try {
              if (typeof event.target.unloadModule === 'function') {
                event.target.unloadModule('captions');
              }
            } catch (e) {}
            if (autoPlay) {
              event.target.playVideo();
            }
          },
          'onStateChange': (event) => {
            if (window.YT) {
              if (needsShuffle && (event.data === window.YT.PlayerState.BUFFERING || event.data === window.YT.PlayerState.PLAYING)) {
                needsShuffle = false;
                setTimeout(() => {
                  try {
                    if (ytPlayer && typeof ytPlayer.setShuffle === 'function') {
                      ytPlayer.setShuffle(true);
                    }
                  } catch (e) {}
                }, 300);
              }
              if (event.data === window.YT.PlayerState.BUFFERING) {
                ytState = 'loading';
                if (activeBtn) updateItemState(activeBtn, 'loading');
                updateTickerText('▶ Завантаження треку...');
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                ytState = 'playing';
                try {
                  if (ytPlayer && typeof ytPlayer.setPlaybackQuality === 'function') {
                    ytPlayer.setPlaybackQuality('medium');
                  }
                } catch (e) {}
                if (!activeBtn && activePlaylistId) {
                  activeBtn = document.querySelector(`.yt-play-btn[data-playlist="${activePlaylistId}"]`);
                }
                if (activeBtn) updateItemState(activeBtn, 'playing');
                startTickerPolling();
              } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                ytState = 'idle';
                if (activeBtn) updateItemState(activeBtn, 'idle');
                stopTickerPolling();
                updateTickerText(event.data === window.YT.PlayerState.ENDED ? '⏹ Відтворення завершено. Натисніть «Play» для повтору' : '⏸ Пауза. Натисніть «Play» для продовження');
              }
            }
          },
          'onError': (err) => {
            console.error('YouTube Player Error:', err);
            if (activeBtn) updateItemState(activeBtn, 'idle');
            ytState = 'idle';
            stopTickerPolling();
            updateTickerText('⚠️ Помилка завантаження треку');
          }
        }
      });
    };

    const updateToggleBtnIcon = (isVisible) => {
      const wrapper = document.getElementById('ytTestPlayerWrapper');
      const activeCard = wrapper ? wrapper.closest('.group') : null;

      document.querySelectorAll('.group.cat-media').forEach((card) => {
        const toggleBtns = card.querySelectorAll('.yt-toggle-btn');
        const isCardPlayerVisible = (card === activeCard) && isVisible;
        toggleBtns.forEach((btn) => {
          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = isCardPlayerVisible ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
          }
        });
      });
    };

    const setPlayerVisible = (visible) => {
      const wrapper = document.getElementById('ytTestPlayerWrapper');
      if (wrapper) {
        if (visible) {
          wrapper.classList.add('visible-player');
        } else {
          wrapper.classList.remove('visible-player');
        }
        updateToggleBtnIcon(visible);
      }
    };

    const toggleBtns = document.querySelectorAll('.yt-toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.group');
        const wrapper = document.getElementById('ytTestPlayerWrapper');
        if (card && wrapper) {
          if (wrapper.parentElement !== card) {
            const ticker = card.querySelector('.yt-player-ticker');
            if (ticker) {
              ticker.after(wrapper);
            } else {
              card.appendChild(wrapper);
            }
            setPlayerVisible(true);
          } else {
            const isCurrentlyVisible = wrapper.classList.contains('visible-player');
            setPlayerVisible(!isCurrentlyVisible);
          }
        }
      });
    });

    const loadPlaylistAndPlay = (playlistId) => {
      setPlayerVisible(true);
      updateTickerText('▶ Завантаження плейлиста...');

      if (window.YT && window.YT.Player) {
        destroyPlayer();
        createPlayer(playlistId, true);
        return;
      }

      if (!isApiLoading) {
        isApiLoading = true;
        const previousOnReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function() {
          if (previousOnReady) previousOnReady();
          ensurePlayerContainer();
          createPlayer(playlistId, true);
        };

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    };

    ytPlayBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const playlistId = btn.getAttribute('data-playlist');
        const targetCard = btn.closest('.group');
        const wrapper = document.getElementById('ytTestPlayerWrapper');

        if (targetCard && wrapper) {
          const ticker = targetCard.querySelector('.yt-player-ticker');
          if (ticker) {
            ticker.after(wrapper);
          } else if (wrapper.parentElement !== targetCard) {
            targetCard.appendChild(wrapper);
          }
        }

        // Зупиняємо радіо якщо воно грає
        const radioAudio = document.getElementById('radioLegionAudio');
        if (radioAudio && !radioAudio.paused) {
          radioAudio.pause();
        }

        if (activeBtn === btn) {
          if (ytState === 'playing' || ytState === 'loading') {
            if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
              ytPlayer.pauseVideo();
            }
            setPlayerVisible(false);
            updateItemState(btn, 'idle');
            ytState = 'idle';
          } else {
            setPlayerVisible(true);
            ytState = 'loading';
            updateItemState(btn, 'loading');
            if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
              ytPlayer.playVideo();
            } else {
              loadPlaylistAndPlay(playlistId);
            }
          }
        } else {
          if (activeBtn) {
            updateItemState(activeBtn, 'idle');
          }
          activeBtn = btn;
          activePlaylistId = playlistId;
          ytState = 'loading';
          updateItemState(btn, 'loading');
          setPlayerVisible(true);
          loadPlaylistAndPlay(playlistId);
        }
      });
    });
  }

  // === Оновлення мобільного заголовка відповідно до поточного розділу ===
  const mobileTitleEl = document.querySelector('.mobile-navbar-title');
  if (mobileTitleEl) {
    const activeLink = document.querySelector('.navbar-nav .nav-link.active');
    if (activeLink) {
      let text = activeLink.textContent.trim();
      mobileTitleEl.textContent = text.toUpperCase();
    } else {
      const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html' || !window.location.pathname.includes('.html');
      if (isHomepage) {
        mobileTitleEl.textContent = 'ГОЛОВНА';
      } else {
        const pageTitle = document.title;
        const parts = pageTitle.split('-');
        if (parts.length > 0) {
          const sectionName = parts[0].trim();
          mobileTitleEl.textContent = sectionName.toUpperCase();
        }
      }
    }
  }

  // 2. Логіка перемикання теми
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector("i");
    
    function updateThemeIcon() {
      if (themeIcon) {
        if (document.body.classList.contains("dark-mode") || document.documentElement.classList.contains("dark-mode")) {
          themeIcon.className = "fas fa-sun";
        } else {
          themeIcon.className = "fas fa-moon";
        }
      }
    }

    // Синхронізація візуального стану елемента (наприклад, якщо це чекбокс)
    if (localStorage.getItem("theme") === "dark") {
      themeToggle.checked = true;
    }
    updateThemeIcon();

    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark-mode");
      document.body.classList.toggle("dark-mode");
      
      if (document.documentElement.classList.contains("dark-mode") || document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
      } else {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
      }
      updateThemeIcon();
    });
  }

  // 3. Анімація кнопки меню (гамбургера) - прив'язка до подій розгортання/згортання Bootstrap
  $('#navbarCollapse').on('show.bs.collapse', function() {
    $('.hamburger').addClass('is-active');
  });
  $('#navbarCollapse').on('hide.bs.collapse', function() {
    $('.hamburger').removeClass('is-active');
  });

  // 5. Динамічне додавання кнопка-трикутника для опису сайту
  // Впорскуємо стилі для описів та кнопок-перемикачів
  const descStyle = document.createElement('style');
  descStyle.textContent = `
    .group li {
      flex-wrap: wrap !important;
      row-gap: 0px !important;
    }
    .desc-toggle-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-left: auto !important;
      margin-right: 0px;
      color: #cbd5e1; /* Дуже м'який, ледь помітний сірий колір для світлої теми */
      cursor: pointer;
      transition: transform 0.2s ease, color 0.2s ease;
      vertical-align: middle;
      flex-shrink: 0;
    }
    .dark-mode .desc-toggle-btn {
      color: #4b5563; /* Тонкий, стриманий колір для темної теми */
    }
    .desc-toggle-btn:hover {
      color: #71717a;
    }
    .dark-mode .desc-toggle-btn:hover {
      color: #a1a1aa;
    }
    .site-description {
      font-size: 12.5px;
      color: #6b7280;
      margin-top: -1px;
      padding-left: 24px;
      padding-bottom: 2px;
      line-height: 1.45;
      word-break: break-word;
      font-weight: normal;
      display: none;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      width: 100% !important;
      flex-basis: 100%;
    }
    .dark-mode .site-description {
      color: #a1a1aa;
    }
    .desc-toggle-btn.active {
      transform: rotate(180deg);
      color: #71717a;
    }
    .dark-mode .desc-toggle-btn.active {
      color: #a1a1aa;
    }
  `;
  document.head.appendChild(descStyle);

  // === Dynamic recommendations cards and list placeholders ===
  const contentRow = document.querySelector('.tab-content .row.animated.fadeIn');
  const isHome = window.location.pathname.endsWith('/') || 
                 window.location.pathname.endsWith('/index.html') || 
                 !window.location.pathname.includes('.html');

  if (contentRow) {
    const columns = contentRow.querySelectorAll('.col-sm');
    if (columns.length > 0) {
      const firstColumn = columns[0];
      
      const recCard = document.createElement('div');
      recCard.className = 'group cat-recommendations';
      
      if (isHome) {
        recCard.innerHTML = `
          <div class="group-title"><span class="badge badge-recommend">Рекомендації Сайту</span></div>
          <ul>
            <li>
              <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" title="Тут може бути Ваше посилання і опис на Ваш сайт, магазин, сервіс, тощо. Контакти для розміщення — внизу сторінки."><span class="link-favicon" style="display: none;"></span><span class="placeholder-circle"></span><span class="placeholder-icon">💎</span>Вільне Місце</a>
            </li>
          </ul>
        `;
      } else {
        recCard.innerHTML = `
          <div class="group-title"><span class="badge badge-recommend">Рекомендації Розділу</span></div>
          <ul>
            <li>
              <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" title="Тут може бути Ваше посилання і опис на Ваш сайт, магазин, сервіс, тощо. Контакти для розміщення — внизу сторінки."><span class="link-favicon" style="display: none;"></span><span class="placeholder-circle"></span><span class="placeholder-icon">🔥</span>Вільне Місце</a>
            </li>
          </ul>
        `;
      }
      firstColumn.prepend(recCard);
    }
  }

  // === Dynamic inline placeholders at the end of each card ===
  document.querySelectorAll('.group:not(.cat-recommendations):not(.no-placeholder) ul').forEach(ul => {
    if (!ul.children.length) return;
    if (ul.querySelector('.placeholder-ad-item')) return;
    
    const groupElement = ul.closest('.group');
    const badgeElement = groupElement ? groupElement.querySelector('.group-title span.badge') : null;
    const groupTitle = badgeElement ? badgeElement.textContent.trim() : '';

    if (groupTitle === 'ТЕСТ відтворення') return;

    const li = document.createElement('li');
    
    li.className = 'placeholder-ad-item';
    li.innerHTML = `
      <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" title="Тут може бути Ваше посилання і опис на Ваш сайт, магазин, сервіс, тощо. Контакти для розміщення — внизу сторінки."><span class="link-favicon" style="display: none;"></span><span class="placeholder-circle"></span><span class="placeholder-icon">➤</span>Вільне Місце</a>
    `;
    ul.appendChild(li);
  });

  // Налаштовуємо перемикачі для кожного елемента списку, де є опис у тезі `a[title]`
  const listItems = document.querySelectorAll('.group ul li');
  listItems.forEach(li => {
    const link = li.querySelector('a');
    if (link) {
      const description = link.getAttribute('title');
      if (description && description.trim() !== '') {
        // Запобігаємо появі стандартного спливаючого підказувача браузера
        link.removeAttribute('title');

        // Створюємо елемент-трикутник
        const toggleBtn = document.createElement('span');
        toggleBtn.className = 'desc-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-caret-down"></i>';

        // Додаємо його в кінець елемента списку (після будь-яких іконок чи значків)
        li.appendChild(toggleBtn);

        // Створюємо контейнер для опису
        const descDiv = document.createElement('div');
        descDiv.className = 'site-description';
        descDiv.textContent = description;

        // Вставляємо опис у li
        li.appendChild(descDiv);

        // Функція для перемикання відображення
        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const isActive = toggleBtn.classList.contains('active');
          if (!isActive) {
            // Спочатку закриємо всі інші відкриті описи
            document.querySelectorAll('.desc-toggle-btn.active').forEach(activeBtn => {
              if (activeBtn !== toggleBtn) {
                activeBtn.classList.remove('active');
                const parentLi = activeBtn.closest('li');
                if (parentLi) {
                  const otherDesc = parentLi.querySelector('.site-description');
                  if (otherDesc) {
                    otherDesc.style.opacity = '0';
                    otherDesc.style.display = 'none';
                  }
                }
              }
            });

            // Показати поточний опис
            descDiv.style.display = 'block';
            // Невеликий тайм-аут, щоб спрацював transition opacity
            setTimeout(() => {
              descDiv.style.opacity = '1';
            }, 20);
            toggleBtn.classList.add('active');
          } else {
            // Приховати поточний опис
            descDiv.style.opacity = '0';
            const onTransitionEnd = () => {
              descDiv.style.display = 'none';
              descDiv.removeEventListener('transitionend', onTransitionEnd);
            };
            descDiv.addEventListener('transitionend', onTransitionEnd);
            // Запасний варіант, якщо transitionend не спрацював
            setTimeout(() => {
              if (descDiv.style.opacity === '0') {
                descDiv.style.display = 'none';
              }
            }, 250);
            toggleBtn.classList.remove('active');
          }
        });
      }
    }
  });

  // 5. Динамічне додавання рекламних блоків по боках з різним розташуванням для головної та інших сторінок
  // Визначаємо, чи є поточна сторінка головною (index.html, корінь "/" або пустий шлях)
  const isHomepage = window.location.pathname.endsWith('/') || 
                     window.location.pathname.endsWith('/index.html') || 
                     !window.location.pathname.includes('.html');

  const screenWidth = window.innerWidth;
  let totalAdCount = 0;

  // === 1. БОКОВА РЕКЛАМА (Тільки на великих ПК моніторах від 1800px, де є місце) ===
  if (screenWidth >= 1800) {
    const leftAd = document.createElement('div');
    leftAd.className = 'side-ad-left';
    
    const rightAd = document.createElement('div');
    rightAd.className = 'side-ad-right';

    if (isHomepage) {
      // === ШАБЛОН РЕКЛАМИ ДЛЯ СТОРІНКИ "ГОЛОВНА" ===
      leftAd.innerHTML = `
        <!-- Ліворуч-Вертикально (Головна) - Велика вертикальна реклама на всю висоту -->
        <div class="ad-wrapper-vertical">
          <ins class="adsbygoogle"
               style="display:block;"
               data-ad-client="ca-pub-3065705668384801"
               data-ad-slot="9621533245"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      `;

      rightAd.innerHTML = `
        <!-- Праворуч-Вертикально (Головна) - Велика вертикальна реклама на всю висоту -->
        <div class="ad-wrapper-vertical">
          <ins class="adsbygoogle"
               style="display:block;"
               data-ad-client="ca-pub-3065705668384801"
               data-ad-slot="7662418469"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      `;
    } else {
      // === ШАБЛОН РЕКЛАМИ ДЛЯ ВСІХ ІНШИХ СТОРІНОК ===
      // Трисекційне розділення, верхній блок під 300x300, решта пустують
      leftAd.innerHTML = `
        <div class="ad-sidebar-three-parts">
          <div class="ad-sidebar-part ad-part-top">
            <div class="ad-wrapper-300-300">
              <ins class="adsbygoogle"
                   style="display:inline-block;width:300px;height:300px"
                   data-ad-client="ca-pub-3065705668384801"
                   data-ad-slot="5145579105"
                   data-full-width-responsive="false"></ins>
            </div>
          </div>
          <div class="ad-sidebar-part ad-part-middle"></div>
          <div class="ad-sidebar-part ad-part-bottom"></div>
        </div>
      `;

      rightAd.innerHTML = `
        <div class="ad-sidebar-three-parts">
          <div class="ad-sidebar-part ad-part-top">
            <div class="ad-wrapper-300-300">
              <ins class="adsbygoogle"
                   style="display:inline-block;width:300px;height:300px"
                   data-ad-client="ca-pub-3065705668384801"
                   data-ad-slot="7980314361"
                   data-full-width-responsive="false"></ins>
            </div>
          </div>
          <div class="ad-sidebar-part ad-part-middle"></div>
          <div class="ad-sidebar-part ad-part-bottom"></div>
        </div>
      `;
    }

    document.body.appendChild(leftAd);
    document.body.appendChild(rightAd);
    totalAdCount += 2; // Два бокових блоки
  }

  // Функція для відстеження статусу завантаження реклами (MutationObserver)
  function observeAdStatus(adContainer) {
    const ins = adContainer.querySelector('ins.adsbygoogle');
    if (!ins) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
          const status = ins.getAttribute('data-ad-status');
          if (status === 'filled') {
            adContainer.classList.add('ad-status-filled');
            adContainer.classList.remove('ad-status-unfilled');
          } else if (status === 'unfilled') {
            adContainer.classList.add('ad-status-unfilled');
            adContainer.classList.remove('ad-status-filled');
          }
        }
      });
    });

    observer.observe(ins, { attributes: true });

    // Початкова перевірка
    const initialStatus = ins.getAttribute('data-ad-status');
    if (initialStatus === 'filled') {
      adContainer.classList.add('ad-status-filled');
    } else if (initialStatus === 'unfilled') {
      adContainer.classList.add('ad-status-unfilled');
    }
  }

  // === 2. НИЖНІЙ МУЛЬТИПЛЕКС ПЕРЕД ФУТЕРОМ (На всіх сторінках, окрім Головної, і тільки для ПК екранів >= 1200px) ===
  if (!isHomepage && screenWidth >= 1200) {
    const footer = document.querySelector('footer.footer');
    if (footer) {
      const multiplexContainer = document.createElement('div');
      multiplexContainer.className = 'container bottom-multiplex-container';
      multiplexContainer.innerHTML = `
        <ins class="adsbygoogle"
             style="display:inline-block;width:1110px;height:250px"
             data-ad-client="ca-pub-3065705668384801"
             data-ad-slot="1571652834"></ins>
      `;
      footer.parentNode.insertBefore(multiplexContainer, footer);
      totalAdCount += 1; // 1 блок нижнього мультиплексу
      observeAdStatus(multiplexContainer);
    }
  }

  // === 3. ВПРОВАДЖЕННЯ МОБІЛЬНИХ IN-FEED РЕКЛАМНИХ БЛОКІВ МІЖ КАРТКАМИ (Тільки для мобільних екранів < 1800px) ===
  if (screenWidth < 1800) {
    const groups = document.querySelectorAll('.group');
    const totalGroups = groups.length;

    function insertInFeedAd(afterElement, slot, layoutKey) {
      const adContainer = document.createElement('div');
      adContainer.className = 'infeed-ad-mobile-container';
      adContainer.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block;"
             data-ad-format="fluid"
             data-ad-layout-key="${layoutKey}"
             data-ad-client="ca-pub-3065705668384801"
             data-ad-slot="${slot}"></ins>
      `;

      if (afterElement.parentNode) {
        afterElement.parentNode.insertBefore(adContainer, afterElement.nextSibling);
        totalAdCount += 1; // Кожен доданий блок потребує окремої ініціалізації
        observeAdStatus(adContainer);
      }
    }

    if (totalGroups > 0) {
      // Визначаємо відповідний рекламний блок для першої карти на основі поточної сторінки
      const path = window.location.pathname.toLowerCase();
      let firstAdSlot = '7702092709'; // За замовчуванням (Головна, Медіа, Банкінг, Інше): InFeed-Лише Текст
      let firstAdLayoutKey = '-gw-3+1f-3d+2z';

      if (path.includes('social.html') || path.includes('games.html') || path.includes('market.html') || path.includes('city.html')) {
        // Соціум / Ігри / Ринок / Місто: InFeed-Назва Вгорі
        firstAdSlot = '5930414256';
        firstAdLayoutKey = '-ef+6k-30-ac+ty';
      } else if (path.includes('news.html') || path.includes('communal.html') || path.includes('shops.html') || path.includes('programs.html') || path.includes('ai.html')) {
        // Новини / Комуналка / Магазини / Soft / AI: InFeed-Зображення збоку
        firstAdSlot = '5495299989';
        firstAdLayoutKey = '-fb+5w+4e-db+86';
      }

      groups.forEach((group, index) => {
        let adSlot = null;
        let adLayoutKey = null;

        if (index === totalGroups - 1) {
          // Після останньої карти: InFeed-Зображення вгорі (завжди розміщувати вкінці списку всіх карт)
          adSlot = '4285591871';
          adLayoutKey = '-6t+ed+2i-1n-4w';
        } else if (index === 0) {
          // Після 1-ї карти: відповідний рекламний блок для цього розділу
          adSlot = firstAdSlot;
          adLayoutKey = firstAdLayoutKey;
        }

        if (adSlot) {
          // Якщо всього одна карта, покажемо тільки фінальну рекламу, щоб не було дублювання
          if (index === 0 && index === totalGroups - 1) {
            adSlot = '4285591871';
            adLayoutKey = '-6t+ed+2i-1n-4w';
          }
          insertInFeedAd(group, adSlot, adLayoutKey);
        }
      });
    }
  }

  // Динамічна ініціалізація рекламних оголошень AdSense (кількість відповідає лише відображеним блокам)
  try {
    for (let i = 0; i < totalAdCount; i++) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  } catch (e) {
    console.log("AdSense integration error:", e);
  }

  // === Модальне вікно перегляду CHANGELOG.md ===
  initChangelogModal();

  // === Спливаюче сповіщення про налагоджувальні роботи з таймером (до 2026-10-01) ===
  initMaintenanceNotice();
});

// === Спливаюче повідомлення про налагоджувальні роботи з автоматичним таймером ===
function initMaintenanceNotice() {
  const expiryDate = new Date("2026-10-01T23:59:59");
  const now = new Date();
  if (now > expiryDate) return;

  const backdrop = document.createElement("div");
  backdrop.id = "maintenanceModalBackdrop";
  backdrop.className = "maintenance-modal-backdrop";
  backdrop.innerHTML = `
    <div class="maintenance-modal" id="maintenanceModal" role="dialog" aria-modal="true" aria-labelledby="maintenanceTitle">
      <button class="maintenance-close-btn" id="maintenanceCloseBtn" title="Закрити" aria-label="Закрити">&times;</button>
      <div class="maintenance-content">
        <div class="maintenance-icon-wrap">
          <div class="maintenance-icon">🛠️</div>
        </div>
        <div class="maintenance-text">
          <h4 class="maintenance-title" id="maintenanceTitle">Налагоджувальні роботи</h4>
          <p class="maintenance-desc">
            На сайті проводяться налагоджувальні роботи, які триватимуть до <strong>2026-10-01</strong>. Усі сервіси та посилання доступні у звичному режимі.
          </p>
        </div>
      </div>
      <div class="maintenance-actions">
        <button class="maintenance-confirm-btn" id="maintenanceConfirmBtn">
          <span>Зрозуміло</span>
          <span class="maintenance-timer-badge" id="maintenanceTimerBadge">10 с</span>
        </button>
      </div>
      <div class="maintenance-progress-track">
        <div class="maintenance-progress-bar" id="maintenanceProgressBar"></div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  requestAnimationFrame(() => {
    backdrop.classList.add("show");
  });

  const totalDuration = 10000;
  const startTime = Date.now();
  let closed = false;

  function closeModal() {
    if (closed) return;
    closed = true;
    backdrop.classList.remove("show");
    setTimeout(() => {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }, 300);
  }

  const closeBtn = backdrop.querySelector("#maintenanceCloseBtn");
  const confirmBtn = backdrop.querySelector("#maintenanceConfirmBtn");
  const timerBadge = backdrop.querySelector("#maintenanceTimerBadge");
  const progressBar = backdrop.querySelector("#maintenanceProgressBar");

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (confirmBtn) confirmBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !closed) closeModal();
  });

  const timerInterval = setInterval(() => {
    if (closed) {
      clearInterval(timerInterval);
      return;
    }
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, totalDuration - elapsed);
    const secondsLeft = Math.ceil(remaining / 1000);

    if (timerBadge) {
      timerBadge.textContent = `${secondsLeft} с`;
    }
    if (progressBar) {
      const percentage = (remaining / totalDuration) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    if (remaining <= 0) {
      clearInterval(timerInterval);
      closeModal();
    }
  }, 50);
}

// === Оптимізований рендерер CHANGELOG.md у модальне вікно ===
function renderMarkdownToHtml(md) {
  const sections = md.split(/(?=^## \[)/m);
  let headerPart = sections[0] || '';
  let dateSections = sections.slice(1);

  // Обробка шапки/вступу: менший шрифт для вступного речення
  headerPart = headerPart
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^\*(.*?)\*/gim, '<p class="text-muted small mb-1 font-italic">$1</p>')
    .replace(/---/gim, '');

  function renderBlock(rawBlock, isFirst) {
    const calendarPrefix = '<span class="cl-calendar-prefix" aria-hidden="true"><svg class="cl-calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path></svg></span>';
    let html = rawBlock
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^## (.*$)/gim, `<h5 class="cl-h2 font-weight-bold">${calendarPrefix}<span class="cl-date-badge">$1</span></h5>`)
      .replace(/^### (.*$)/gim, '<h6 class="cl-h3 mt-3 mb-2 font-weight-bold">$1</h6>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/_(.*?)_/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code class="cl-code-tag">$1</code>');

    const lines = html.split('\n');
    let inList = false;
    let result = [];
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        if (!inList) {
          result.push('<ul class="cl-changelog-list">');
          inList = true;
        }
        result.push('<li class="mb-1">' + trimmed.substring(2) + '</li>');
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (trimmed !== '' && !trimmed.startsWith('<h') && !trimmed.startsWith('<hr') && !trimmed.startsWith('<ul')) {
          result.push('<p class="mb-2">' + trimmed + '</p>');
        } else {
          result.push(line);
        }
      }
    });
    if (inList) result.push('</ul>');
    return result.join('\n');
  }

  let finalHtml = headerPart;

  if (dateSections.length <= 10) {
    dateSections.forEach((sec, idx) => {
      finalHtml += renderBlock(sec, idx === 0);
    });
  } else {
    // Перші 10 дат - показуємо
    const visibleSections = dateSections.slice(0, 10);
    const hiddenSections = dateSections.slice(10);

    visibleSections.forEach((sec, idx) => {
      finalHtml += renderBlock(sec, idx === 0);
    });

    // Решта приховані
    finalHtml += '<div id="clMoreSections" style="display: none;">';
    hiddenSections.forEach(sec => {
      finalHtml += renderBlock(sec, false);
    });
    finalHtml += '</div>';

    // Широка кнопка під списком
    finalHtml += `
      <div class="text-center my-4" id="clShowMoreWrapper">
        <button type="button" id="clShowMoreBtn" class="btn btn-outline-primary btn-block py-2 font-weight-bold" style="border-radius: 8px;">
          <i class="fas fa-chevron-down mr-2"></i>Показати всі оновлення (${dateSections.length})
        </button>
      </div>
    `;
  }

  return finalHtml;
}

function initChangelogModal() {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href*="CHANGELOG.md"], .changelog-link');
    if (link) {
      if (e.ctrlKey || e.metaKey || e.button === 1) return;
      e.preventDefault();
      openChangelogModal();
    }

    if (e.target.closest('#clShowMoreBtn')) {
      const moreDiv = document.getElementById('clMoreSections');
      const btnWrapper = document.getElementById('clShowMoreWrapper');
      if (moreDiv) {
        moreDiv.style.display = 'block';
      }
      if (btnWrapper) {
        btnWrapper.style.display = 'none';
      }
    }
  });
}

function openChangelogModal() {
  let backdrop = document.getElementById('clModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'clModalBackdrop';
    backdrop.className = 'cl-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cl-modal" role="dialog" aria-modal="true">
        <div class="cl-modal-header">
          <h5 class="cl-modal-title">📋 Історія оновлень</h5>
          <button type="button" class="btn btn-secondary btn-sm cl-modal-close" aria-label="Закрити">
            <span>Закрити</span>
            <span class="cl-modal-close-sep"></span>
            <span class="cl-modal-close-x">&times;</span>
          </button>
        </div>
        <div class="cl-modal-body" id="clModalBody">
          <div class="text-center py-4">
            <i class="fas fa-spinner fa-spin fa-2x text-muted"></i>
            <p class="mt-2 text-muted">Завантаження історії...</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const closeBtns = backdrop.querySelectorAll('.cl-modal-close, .cl-modal-close-btn');
    closeBtns.forEach(btn => btn.addEventListener('click', closeChangelogModal));
    backdrop.addEventListener('click', (ev) => {
      if (ev.target === backdrop) closeChangelogModal();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && backdrop.classList.contains('show')) {
        closeChangelogModal();
      }
    });
  }

  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';

  fetch('CHANGELOG.md')
    .then(res => {
      if (!res.ok) throw new Error("File not found");
      return res.text();
    })
    .then(text => {
      document.getElementById('clModalBody').innerHTML = renderMarkdownToHtml(text);
    })
    .catch(err => {
      document.getElementById('clModalBody').innerHTML = `
        <div class="alert alert-warning m-0">
          <strong>Не вдалося завантажити CHANGELOG.md</strong>
          <p class="mb-0 mt-1 font-size-sm">Ви можете переглянути оригінальний файл за цим посиланням: <a href="CHANGELOG.md" target="_blank">CHANGELOG.md</a></p>
        </div>
      `;
    });
}

function closeChangelogModal() {
  const backdrop = document.getElementById('clModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// 4. Функція швидкого плавного прокручування вгору
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

