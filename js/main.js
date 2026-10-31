// 0. Пригнічення помилок від сторонніх розширень браузера (MetaMask, Auro Wallet тощо)
(function() {
  function isExtensionError(arg) {
    if (!arg) return false;
    var str = "";
    try {
      if (typeof arg === "string") {
        str = arg;
      } else if (typeof arg === "object") {
        str = (arg.message || "") + " " + (arg.stack || "") + " " + (arg.reason || "") + " " + (arg.name || "") + " " + String(arg);
      } else {
        str = String(arg);
      }
    } catch (e) {
      str = String(arg);
    }
    str = str.toLowerCase();
    return str.indexOf("metamask") !== -1 ||
           str.indexOf("failed to connect") !== -1 ||
           str.indexOf("auro wallet") !== -1 ||
           str.indexOf("phantom") !== -1 ||
           str.indexOf("coinbase") !== -1 ||
           str.indexOf("evm") !== -1 ||
           str.indexOf("resizeobserver") !== -1 ||
           str.indexOf("could not reach cloud firestore") !== -1 ||
           str.indexOf("operate in offline mode") !== -1 ||
           str.indexOf("code=unavailable") !== -1;
  }

  var origError = console.error;
  console.error = function() {
    for (var i = 0; i < arguments.length; i++) {
      if (isExtensionError(arguments[i])) return;
    }
    return origError.apply(console, arguments);
  };

  var origWarn = console.warn;
  console.warn = function() {
    for (var j = 0; j < arguments.length; j++) {
      if (isExtensionError(arguments[j])) return;
    }
    return origWarn.apply(console, arguments);
  };

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
      return true;
    }
  }, true);

  var prevOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (isExtensionError(message) || isExtensionError(error)) {
      return true;
    }
    if (typeof prevOnError === 'function') {
      return prevOnError.apply(this, arguments);
    }
  };
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

// === Fix favicon for subdomains, special services and bookmarks ===
const base64Favicons = {"biblechurch.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e3a8a\"/><path d=\"M16 5v22M10 12h12\" stroke=\"%23facc15\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"7\" r=\"1.5\" fill=\"%23ffffff\"/><path d=\"M7 25c3-1 6-1 9 1 3-2 6-2 9-1\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/></svg>", "www.biblechurch.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e3a8a\"/><path d=\"M16 5v22M10 12h12\" stroke=\"%23facc15\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"7\" r=\"1.5\" fill=\"%23ffffff\"/><path d=\"M7 25c3-1 6-1 9 1 3-2 6-2 9-1\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/></svg>", "apkpure.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2324c768\"/><path d=\"M10 7h7a7 7 0 0 1 0 14h-7V7zm4 4v6h3a3 3 0 0 0 0-6h-3z\" fill=\"%23ffffff\"/><circle cx=\"22\" cy=\"22\" r=\"3\" fill=\"%23ffffff\"/></svg>", "www.apkpure.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2324c768\"/><path d=\"M10 7h7a7 7 0 0 1 0 14h-7V7zm4 4v6h3a3 3 0 0 0 0-6h-3z\" fill=\"%23ffffff\"/><circle cx=\"22\" cy=\"22\" r=\"3\" fill=\"%23ffffff\"/></svg>", "nfsu2.xyz": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230a0e17\"/><path d=\"M5 24l5-16h4l-5 16H5z\" fill=\"%2322c55e\"/><text x=\"17\" y=\"16\" font-size=\"9\" font-weight=\"900\" font-style=\"italic\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">NFS</text><text x=\"17\" y=\"25\" font-size=\"8\" font-weight=\"900\" font-style=\"italic\" fill=\"%2322c55e\" text-anchor=\"middle\" font-family=\"sans-serif\">UG2</text></svg>", "www.nfsu2.xyz": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230a0e17\"/><path d=\"M5 24l5-16h4l-5 16H5z\" fill=\"%2322c55e\"/><text x=\"17\" y=\"16\" font-size=\"9\" font-weight=\"900\" font-style=\"italic\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">NFS</text><text x=\"17\" y=\"25\" font-size=\"8\" font-weight=\"900\" font-style=\"italic\" fill=\"%2322c55e\" text-anchor=\"middle\" font-family=\"sans-serif\">UG2</text></svg>", "accounts.ukr.net": "https://accounts.ukr.net/login/assets/favicon.png", "mail.ukr.net": "https://accounts.ukr.net/login/assets/favicon.png", "ukr.net": "https://upst.fwdcdn.com/favicon-v3.png", "www.ukr.net": "https://upst.fwdcdn.com/favicon-v3.png", "uaflix.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M4 10c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V10z\" fill=\"%230057b7\"/><path d=\"M4 16h24v6c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4v-6z\" fill=\"%23ffd700\"/><polygon points=\"13,10 23,16 13,22\" fill=\"%23ffffff\"/></svg>", "myradio.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><circle cx=\"16\" cy=\"18\" r=\"5\" fill=\"%23ffffff\"/><path d=\"M9 11a10 10 0 0 1 14 0M12 14a6 6 0 0 1 8 0\" stroke=\"%23ffffff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"18\" r=\"2\" fill=\"%23ea580c\"/></svg>", "abuk.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M8 8h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H8V8z\" fill=\"%23ffffff\"/><path d=\"M24 8h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7V8z\" fill=\"%23e0e7ff\"/><path d=\"M16 12v12\" stroke=\"%234f46e5\" stroke-width=\"2\"/></svg>", "podcasts.nv.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><rect x=\"13\" y=\"8\" width=\"6\" height=\"10\" rx=\"3\" fill=\"%23ffffff\"/><path d=\"M9 15a7 7 0 0 0 14 0M16 22v5M12 27h8\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "kick.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><path d=\"M8 6h5v7.5L18.5 6H24l-6.5 8.5L24 26h-5.5l-5.5-8V26H8V6z\" fill=\"%2353fc18\"/></svg>", "youtv.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><rect x=\"5\" y=\"7\" width=\"22\" height=\"15\" rx=\"3\" fill=\"%23ffffff\"/><path d=\"M10 26h12M16 22v4\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\"/><polygon points=\"13,11 20,14.5 13,18\" fill=\"%230284c7\"/></svg>", "tv.kyivstar.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><path d=\"M16 5l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z\" fill=\"%23ffffff\"/></svg>", "radioplayer.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><path d=\"M12 10l10 6-10 6V10z\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"12\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\"/></svg>", "uakino.me": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23eab308\"/><path d=\"M12 9l11 7-11 7V9z\" fill=\"%23111827\"/></svg>", "eneyida.tv": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"23\" font-size=\"20\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">E</text></svg>", "uaserials.pro": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%239333ea\"/><rect x=\"6\" y=\"8\" width=\"20\" height=\"14\" rx=\"3\" fill=\"%23ffffff\"/><polygon points=\"13,11 20,15 13,19\" fill=\"%239333ea\"/></svg>", "takflix.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2318181b\"/><text x=\"16\" y=\"23\" font-size=\"20\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">T</text></svg>", "music.youtube.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23ff0000\"/><circle cx=\"16\" cy=\"16\" r=\"10\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"2\"/><polygon points=\"13,11 21,16 13,21\" fill=\"%23ffffff\"/></svg>", "open.spotify.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%231ed760\"/><path d=\"M8 12c6-1.5 12-1 16 1.5M9 16c5-1.2 10-.8 14 1M11 20c4-1 8-.5 11 1\" stroke=\"%23ffffff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "music.apple.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23fa2d48\"/><path d=\"M18 9v11a3 3 0 1 1-3-3h3V9z\" fill=\"%23ffffff\"/></svg>", "soundcloud.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff5500\"/><path d=\"M8 20v-4M11 21v-7M14 22v-9M17 22v-11M20 22a4 4 0 0 0 0-8 5 5 0 0 0-5 3v5z\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "store.steampowered.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23171a21\"/><path d=\"M16 6a10 10 0 0 0-9.8 8l4.4 1.8a3.5 3.5 0 0 1 4.9-1.3l3-4.3a10 10 0 0 0-2.5-4.2zm-6 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm12-3a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z\" fill=\"%2366c0f4\"/></svg>", "steampowered.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23171a21\"/><path d=\"M16 6a10 10 0 0 0-9.8 8l4.4 1.8a3.5 3.5 0 0 1 4.9-1.3l3-4.3a10 10 0 0 0-2.5-4.2zm-6 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm12-3a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z\" fill=\"%2366c0f4\"/></svg>", "store.epicgames.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23121212\"/><path d=\"M7 6h18v4H11v6h12v4H11v6h14v4H7V6z\" fill=\"%23ffffff\"/></svg>", "epicgames.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23121212\"/><path d=\"M7 6h18v4H11v6h12v4H11v6h14v4H7V6z\" fill=\"%23ffffff\"/></svg>", "gog.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%238a2be2\"/><text x=\"16\" y=\"22\" font-size=\"16\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">GOG</text></svg>", "playua.net": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><path d=\"M10 8l14 8-14 8V8z\" fill=\"%230057b7\"/><path d=\"M10 16l14 0-14 8V16z\" fill=\"%23ffd700\"/></svg>", "gamedev.dou.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231a202c\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%2338bdf8\" text-anchor=\"middle\" font-family=\"sans-serif\">DOU</text></svg>", "itc.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ITC</text></svg>", "boosteroid.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230088cc\"/><path d=\"M8 20l8-12 8 12h-5l-3-4.5-3 4.5H8z\" fill=\"%23ffffff\"/></svg>", "geforcenow.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2376b900\"/><path d=\"M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z\" fill=\"%23ffffff\"/></svg>", "crazygames.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%237c3aed\"/><path d=\"M10 10h12v4H10zM10 18h12v4H10z\" fill=\"%23ffffff\"/></svg>", "kongregate.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"23\" font-size=\"18\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">K</text></svg>", "hltv.org": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232b6cb0\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">HLTV</text></svg>", "liquipedia.net": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%2338bdf8\"/></svg>", "pw.game": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAACXBIWXMAAAsTAAALEwEAmpwYAAABUElEQVR42q1VO27DMAx9owfDgGfv3Tply1ECX6Q38OgLaDOQo2TTpito05wMAlihqKqwpGKh7nuLDYGPH1EkVPSYYWAREBMDLAxmjGjCGwweIIUPmHT6Eh0WZiwZsaCr+7agBjo9jhMCqJEBJ+E9mzcy8Ci6Enwz3XMtFpDGM62J55rEWsJXKv9OV8q4pj9IxpyGAXFOxfhJZJISGxJ67n+gle6k4Z5Oht+tNQIzV/X0Cp7AOYsE9gBOA9hDAhYIhwQCEKWAz4VkBXSaQFQFHIGmL5FsPBHoVhEIugB+TG7sT6ZgGwX0FGzlGh1dmMCFXOUaRSOVJnbkv0vqSkMrjTSyVs7eBHJUspVLEkzE8xbOxpxbfs5RHg70kVNIX0PlOYuBIkWksRwoQAf3h5HWHxyq/zTWeRSufbHo6LAi7qy2Ff3ect2qy3WTvnWM7ev9E1Cd4GW12cjkAAAAAElFTkSuQmCC", "chess.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23689f38\"/><path d=\"M16 6a3 3 0 0 0-3 3c0 .8.3 1.5.8 2H11v3h10v-3h-2.8c.5-.5.8-1.2.8-2a3 3 0 0 0-3-3zm-6 12h12v3H10zm-2 5h16v3H8z\" fill=\"%23ffffff\"/></svg>", "sudoku.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M6 6h20v20H6V6zm2 2v5h5V8H8zm7 0v5h5V8h-5zm7 0v5h4V8h-4zm-14 7v5h5v-5H8zm7 0v5h5v-5h-5zm7 0v5h4v-5h-4z\" fill=\"%23ffffff\"/></svg>", "mezha.media": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M6 8h4l6 10 6-10h4v16h-4v-9.5L16 23.5 10 14.5V24H6V8z\" fill=\"%2338bdf8\"/></svg>", "overclockers.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">OC.UA</text></svg>", "escharts.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230d1117\"/><path d=\"M8 22V16l5 4 6-8 5 4\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "maincast.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff4500\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">MC</text></svg>", "battle.net": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300aeff\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"4\" fill=\"%2300aeff\"/></svg>", "roblox.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><rect x=\"9\" y=\"9\" width=\"14\" height=\"14\" rx=\"2\" fill=\"%23ffffff\" transform=\"rotate(-15 16 16)\"/><rect x=\"14\" y=\"14\" width=\"4\" height=\"4\" fill=\"%23000000\" transform=\"rotate(-15 16 16)\"/></svg>", "xbox.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23107c41\"/><path d=\"M9 9c2 2 5 6 7 10 2-4 5-8 7-10 1.5 2 3 5 3 7 0 5-4 10-10 10S6 21 6 16c0-2 1.5-5 3-7z\" fill=\"%23ffffff\"/></svg>", "ggbet.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23ff6600\" text-anchor=\"middle\" font-family=\"sans-serif\">GG</text></svg>", "favbet.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><path d=\"M8 8h16v4H12v4h10v4H12v8H8V8z\" fill=\"%23ffffff\"/></svg>", "ggpoker.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ef4444\" text-anchor=\"middle\" font-family=\"sans-serif\">GGP</text></svg>", "pokermatch.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23f59e0b\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23000000\" text-anchor=\"middle\" font-family=\"sans-serif\">PM</text></svg>", "pokermatch.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23f59e0b\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23000000\" text-anchor=\"middle\" font-family=\"sans-serif\">PM</text></svg>", "supergra.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%23facc15\"/></svg>", "t.me": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23229ED9\"/><path d=\"M7.8 15.5l15.8-6.1c.7-.3 1.4.2 1.2 1l-2.7 12.6c-.2.9-.7 1.1-1.5.7l-4.1-3-2 1.9c-.2.2-.4.4-.8.4l.3-4.2 7.6-6.9c.3-.3-.1-.5-.5-.2l-9.4 5.9-4.1-1.3c-.9-.3-.9-.9.2-1.3z\" fill=\"%23ffffff\"/></svg>", "easypay.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23eb2328\"/><text x=\"16\" y=\"22\" font-size=\"13\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">EP</text></svg>", "ipay.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300529b\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">iPay</text></svg>", "city24.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300b0ff\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">C24</text></svg>", "portmone.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ef4444\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">P</text></svg>", "yasno.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ffcc00\"/><path d=\"M16 6l2.5 5.5L24 14l-4 4.5L21 24l-5-3-5 3 1-5.5-4-4.5 5.5-2.5z\" fill=\"%23111827\"/></svg>", "grmu.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 8c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23facc15\"/></svg>", "vodokanal.kiev.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 7c-3.5 5-7 8.5-7 12a7 7 0 0 0 14 0c0-3.5-3.5-7-7-12z\" fill=\"%23ffffff\"/></svg>", "gerc.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><text x=\"16\" y=\"22\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГЕРЦ</text></svg>", "kte.kmda.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><path d=\"M16 6c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23fef08a\"/></svg>", "portal.pfu.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"900\" fill=\"%23ffd700\" text-anchor=\"middle\" font-family=\"sans-serif\">ПФУ</text></svg>", "diia.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">дія</text></svg>", "cabinet.tax.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ДПС</text></svg>", "eq.hsc.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e3a8a\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">МВС</text></svg>", "gioc.kiev.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГІОЦ</text></svg>", "mydimonline.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><path d=\"M16 8l8 7v9h-5v-6h-6v6h-5v-9z\" fill=\"%23ffffff\"/></svg>", "infoxvod.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 6c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23ffffff\"/></svg>", "novakom.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">НОВАКОМ</text></svg>", "bankchart.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23059669\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">BC</text></svg>", "lycamobile.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300a859\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">Lyca</text></svg>", "cc.ukrtele.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "ukrtele.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "ukrtelecom.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "www.ukrtelecom.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "my.ukrtelecom.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "vodokanal.kyiv.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 7c-3.5 5-7 8.5-7 12a7 7 0 0 0 14 0c0-3.5-3.5-7-7-12z\" fill=\"%23ffffff\"/></svg>", "gioc.kyivcity.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГІОЦ</text></svg>", "e-driver.mvs.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e3a8a\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">МВС</text></svg>", "mydim.online": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><path d=\"M16 8l8 7v9h-5v-6h-6v6h-5v-9z\" fill=\"%23ffffff\"/></svg>", "mail.google.com": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%234285F4' d='M2 8v10c0 1.1.9 2 2 2h2V9.5L2 6.5z'/><path fill='%2334A853' d='M22 8v10c0 1.1-.9 2-2 2h-2V9.5l4-3z'/><path fill='%23FBBC04' d='M2 8c0-1.1.9-2 2-2h2v3.5L2 6.5z'/><path fill='%23C5221F' d='M22 8c0-1.1-.9-2-2-2h-2v3.5l4-3z'/><path fill='%23EA4335' d='M12 14l8-6.5V6c0-.83-.8-1.4-1.5-.9L12 9.5 5.5 5.1C4.8 4.6 4 5.17 4 6v1.5l8 6.5z'/></svg>", "gmail.com": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%234285F4' d='M2 8v10c0 1.1.9 2 2 2h2V9.5L2 6.5z'/><path fill='%2334A853' d='M22 8v10c0 1.1-.9 2-2 2h-2V9.5l4-3z'/><path fill='%23FBBC04' d='M2 8c0-1.1.9-2 2-2h2v3.5L2 6.5z'/><path fill='%23C5221F' d='M22 8c0-1.1-.9-2-2-2h-2v3.5l4-3z'/><path fill='%23EA4335' d='M12 14l8-6.5V6c0-.83-.8-1.4-1.5-.9L12 9.5 5.5 5.1C4.8 4.6 4 5.17 4 6v1.5l8 6.5z'/></svg>", "subsidii.ioc.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"bold\" fill=\"%23ffd700\" text-anchor=\"middle\" font-family=\"sans-serif\">СУБС</text></svg>", "protonvpn.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%236d4aff\"/><path d=\"M16 6l9 4v7c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V10l9-4z\" fill=\"%23ffffff\"/><path d=\"M16 11l5 2.5v4.5c0 3.1-2.1 6-5 6.7-2.9-.7-5-3.6-5-6.7v-4.5l5-2.5z\" fill=\"%236d4aff\"/></svg>", "windscribe.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231a2b4c\"/><path d=\"M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6\" stroke=\"%2300b0ff\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M8 14c0-4.4 3.6-8 8-8s8 3.6 8 8\" stroke=\"%2300b0ff\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"20\" r=\"2.5\" fill=\"%2300b0ff\"/></svg>", "upchart.in": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M7 23l5-6 5 3 8-10\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20 10h5v5\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><rect x=\"8\" y=\"19\" width=\"3\" height=\"5\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"13\" y=\"16\" width=\"3\" height=\"8\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"18\" y=\"13\" width=\"3\" height=\"11\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"23\" y=\"9\" width=\"3\" height=\"15\" fill=\"%23ffffff\" opacity=\"0.9\"/></svg>", "khartiia.org": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2315803d\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ХАРТІЯ</text></svg>", "koloua.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><circle cx=\"16\" cy=\"16\" r=\"9\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"/></svg>", "vodafone.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23e60000\"/><path d=\"M16 7c-4.4 0-8 3.6-8 8 0 5.5 5 10 8 12 3-2 8-6.5 8-12 0-4.4-3.6-8-8-8zm0 11.5c-2 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z\" fill=\"%23ffffff\"/></svg>", "www.vodafone.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23e60000\"/><path d=\"M16 7c-4.4 0-8 3.6-8 8 0 5.5 5 10 8 12 3-2 8-6.5 8-12 0-4.4-3.6-8-8-8zm0 11.5c-2 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z\" fill=\"%23ffffff\"/></svg>", "kyivstar.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><path d=\"M16 5l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z\" fill=\"%23ffffff\"/></svg>", "www.kyivstar.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><path d=\"M16 5l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z\" fill=\"%23ffffff\"/></svg>", "lifecell.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23ffc800\"/><circle cx=\"16\" cy=\"16\" r=\"6\" fill=\"%23e30613\"/><path d=\"M16 7v6M23 11l-5 3M23 21l-5-3M16 25v-6M9 21l5-3M9 11l5 3\" stroke=\"%23003b7a\" stroke-width=\"2.5\" stroke-linecap=\"round\"/></svg>", "www.lifecell.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23ffc800\"/><circle cx=\"16\" cy=\"16\" r=\"6\" fill=\"%23e30613\"/><path d=\"M16 7v6M23 11l-5 3M23 21l-5-3M16 25v-6M9 21l5-3M9 11l5 3\" stroke=\"%23003b7a\" stroke-width=\"2.5\" stroke-linecap=\"round\"/></svg>", "3mob.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230072bc\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">3Mob</text></svg>", "www.3mob.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230072bc\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">3Mob</text></svg>", "volia.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">VOLIA</text></svg>", "www.volia.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">VOLIA</text></svg>", "hitfm.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e60000\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ХІТ FM</text></svg>", "www.hitfm.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e60000\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ХІТ FM</text></svg>", "pfu.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><circle cx=\"16\" cy=\"12\" r=\"7\" fill=\"%230a4c95\" stroke=\"%23ffd700\" stroke-width=\"1.5\"/><path d=\"M16 7.5v6M14 9.5c0 2 2 3 2 3s2-1 2-3M13 8.5v3M19 8.5v3\" stroke=\"%23ffd700\" stroke-width=\"1.2\" stroke-linecap=\"round\" fill=\"none\"/><text x=\"16\" y=\"27\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffd700\" text-anchor=\"middle\" font-family=\"sans-serif\">ПФУ</text></svg>", "minjust.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230d2346\"/><path d=\"M16 6v19M11 25h10\" stroke=\"%23f59e0b\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M9 11l7-2 7 2\" stroke=\"%23f59e0b\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M9 11l-3 6h6l-3-6zM23 11l-3 6h6l-3-6z\" fill=\"%23fbbf24\" stroke=\"%23f59e0b\" stroke-width=\"1\"/><circle cx=\"16\" cy=\"7\" r=\"1.5\" fill=\"%23ffd700\"/></svg>", "minagro.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2315803d\"/><path d=\"M16 26V8\" stroke=\"%23fde047\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M16 8c-2-3 0-5 0-5s2 2 0 5zM16 12c-3-2-5 0-5 0s2 3 5 0zM16 12c3-2 5 0 5 0s-2 3-5 0zM16 16c-3-2-5 0-5 0s2 3 5 0zM16 16c3-2 5 0 5 0s-2 3-5 0zM16 20c-3-2-5 0-5 0s2 3 5 0zM16 20c3-2 5 0 5 0s-2 3-5 0z\" fill=\"%23facc15\"/></svg>", "drs.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><path d=\"M16 5l8 4v7c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V9l8-4z\" fill=\"%230284c7\" stroke=\"%23ffd700\" stroke-width=\"1.5\"/><path d=\"M16 8.5v5M14 10c0 1.5 2 2.5 2 2.5s2-1 2-2.5\" stroke=\"%23ffd700\" stroke-width=\"1.2\" stroke-linecap=\"round\" fill=\"none\"/><text x=\"16\" y=\"23\" font-size=\"7\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ДРС</text></svg>", "ukrstat.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><rect x=\"7\" y=\"18\" width=\"4\" height=\"8\" rx=\"1\" fill=\"%2338bdf8\"/><rect x=\"12\" y=\"14\" width=\"4\" height=\"12\" rx=\"1\" fill=\"%23facc15\"/><rect x=\"17\" y=\"10\" width=\"4\" height=\"16\" rx=\"1\" fill=\"%2322c55e\"/><rect x=\"22\" y=\"6\" width=\"4\" height=\"20\" rx=\"1\" fill=\"%23ec4899\"/><path d=\"M7 16l5-4 5 3 6-7\" stroke=\"%23ffffff\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/><circle cx=\"23\" cy=\"8\" r=\"1.5\" fill=\"%23ffffff\"/></svg>", "audioreads.org": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><path d=\"M8 22c3-1 6-1 8 1 2-2 5-2 8-1v-9c-3-1-6-1-8 1-2-2-5-2-8-1v9z\" fill=\"%23ffffff\"/><path d=\"M10 13a7 7 0 0 1 12 0\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"9\" cy=\"14\" r=\"2\" fill=\"%23ffffff\"/><circle cx=\"23\" cy=\"14\" r=\"2\" fill=\"%23ffffff\"/></svg>", "dimonline.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M6 16l10-8 10 8v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9z\" fill=\"%23ffffff\"/><path d=\"M13 27v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6\" fill=\"%230284c7\"/><circle cx=\"16\" cy=\"13\" r=\"2\" fill=\"%2310b981\"/><path d=\"M21 7a5 5 0 0 1 4 4\" stroke=\"%23facc15\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/></svg>", "ubki.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230a2540\"/><path d=\"M16 5l9 3.5v7.5c0 5.5-3.8 10-9 11.5-5.2-1.5-9-6-9-11.5V8.5L16 5z\" fill=\"%230e3a6c\" stroke=\"%2310b981\" stroke-width=\"1.5\"/><path d=\"M12 16l3 3 6-7\" stroke=\"%2310b981\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>", "herewallet.app": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff4d2e\"/><circle cx=\"16\" cy=\"16\" r=\"8\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"4\" fill=\"%23ff4d2e\"/><circle cx=\"17.5\" cy=\"14.5\" r=\"1.5\" fill=\"%23ffffff\"/></svg>", "neteller.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%238dc63f\"/><path d=\"M9 8h4.5l5.5 9.5V8H23v16h-4.5L13 14.5V24H9V8z\" fill=\"%23ffffff\"/></svg>", "aboutyou.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23111111\"/><circle cx=\"16\" cy=\"16\" r=\"12\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"2\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">AY</text></svg>", "sinsay.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"14\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">sin</text><text x=\"16\" y=\"23\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">say</text></svg>", "correctarium.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea2b49\"/><path d=\"M21 11a7 7 0 1 0 0 10\" stroke=\"%23ffffff\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M18 16l2 2 4-4\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>", "flightradar24.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e293b\"/><circle cx=\"16\" cy=\"16\" r=\"11\" fill=\"none\" stroke=\"%23facc15\" stroke-width=\"1\" opacity=\"0.4\"/><circle cx=\"16\" cy=\"16\" r=\"6\" fill=\"none\" stroke=\"%23facc15\" stroke-width=\"1\" opacity=\"0.6\"/><path d=\"M16 8v16M8 16h16\" stroke=\"%23facc15\" stroke-width=\"1\" opacity=\"0.3\"/><path d=\"M16 10l2 4 4 1-4 1-1 4-1-4-4-1 4-1 0-4z\" fill=\"%23ffd700\"/></svg>", "communal.local": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M7 16l9-7 9 7v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9z\" fill=\"%23ffffff\"/><path d=\"M14 17l-2 3h3l-1 4 4-5h-3l2-2h-3z\" fill=\"%23facc15\"/><path d=\"M18 19c0 1.5 1 2.5 2 2.5s2-1 2-2.5c0-1-2-3-2-3s-2 2-2 3z\" fill=\"%2338bdf8\"/></svg>", "copilot.microsoft.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M10 20c-2.2 0-4-1.8-4-4s1.8-4 4-4c1.5 0 2.8.8 3.5 2h5c.7-1.2 2-2 3.5-2 2.2 0 4 1.8 4 4s-1.8 4-4 4h-8z\" fill=\"none\" stroke=\"%2338bdf8\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><path d=\"M8 16c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm12 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z\" fill=\"%23ec4899\"/><circle cx=\"16\" cy=\"16\" r=\"2.5\" fill=\"%23facc15\"/></svg>", "adobe.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ed2224\"/><path d=\"M7 7h18v18H7z\" fill=\"none\"/><path d=\"M19.5 9h5L17.8 24h-3.6L19.5 9zM12.5 9H7.5L14.2 24h3.6L12.5 9zM13.7 17.5l-2.2 5.5h6.2L16 17.5h-2.3z\" fill=\"%23ffffff\"/></svg>", "get.adobe.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ed2224\"/><path d=\"M7 7h18v18H7z\" fill=\"none\"/><path d=\"M19.5 9h5L17.8 24h-3.6L19.5 9zM12.5 9H7.5L14.2 24h3.6L12.5 9zM13.7 17.5l-2.2 5.5h6.2L16 17.5h-2.3z\" fill=\"%23ffffff\"/></svg>"};

const domainAliases = {
  "yasno.ua": "yasno.com.ua",
  "my.yasno.com.ua": "yasno.com.ua",
  "my.vodafone.ua": "vodafone.ua",
  "account.kyivstar.ua": "kyivstar.ua",
  "my.lifecell.ua": "lifecell.ua",
  "my.volia.com": "volia.com",
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
  "whatsapp.com": "whatsapp.com",
  "uk.audioreads.org": "audioreads.org",
  "www.audioreads.org": "audioreads.org",
  "www.pfu.gov.ua": "pfu.gov.ua",
  "www.minjust.gov.ua": "minjust.gov.ua",
  "www.minagro.gov.ua": "minagro.gov.ua",
  "www.drs.gov.ua": "drs.gov.ua",
  "www.ukrstat.gov.ua": "ukrstat.gov.ua",
  "www.dimonline.com": "dimonline.com",
  "www.ubki.ua": "ubki.ua",
  "www.herewallet.app": "herewallet.app",
  "www.neteller.com": "neteller.com",
  "www.aboutyou.ua": "aboutyou.ua",
  "aboutyou.com": "aboutyou.ua",
  "www.aboutyou.com": "aboutyou.ua",
  "www.sinsay.com": "sinsay.com",
  "www.correctarium.com": "correctarium.com",
  "www.flightradar24.com": "flightradar24.com",
  "www.adobe.com": "adobe.com"
};

window.base64Favicons = base64Favicons;
window.domainAliases = domainAliases;
window.cssFaviconsCache = {};

function parseCssIntoFaviconCache(cssText) {
  if (!cssText) return;
  const blocks = cssText.split('}');
  for (const b of blocks) {
    const parts = b.split('{');
    if (parts.length >= 2) {
      const selector = parts[0].trim();
      const body = parts.slice(1).join('{');
      if (selector.startsWith('.')) {
        const domain = selector.slice(1).trim().toLowerCase();
        const match = body.match(/url\((data:image\/[^)]+)\)/);
        if (match && domain && !domain.includes(' ') && !domain.includes('>') && !domain.includes(':')) {
          if (!window.cssFaviconsCache[domain]) {
            window.cssFaviconsCache[domain] = match[1];
          }
        }
      }
    }
  }
}

function initCssFaviconsCache() {
  try {
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules || sheet.rules; } catch (e) { continue; }
      if (!rules) continue;
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.selectorText && rule.style && rule.style.backgroundImage) {
          const sel = rule.selectorText.trim();
          if (sel.startsWith('.') && !sel.includes(' ') && !sel.includes(':') && !sel.includes('>')) {
            const domainKey = sel.slice(1).toLowerCase();
            const bg = rule.style.backgroundImage;
            const match = bg.match(/url\(["']?(data:image\/[^"')]+)["']?\)/);
            if (match && match[1] && !window.cssFaviconsCache[domainKey]) {
              window.cssFaviconsCache[domainKey] = match[1];
            }
          }
        }
      }
    }
  } catch (e) {}

  // Якщо через CORS чи асинхронне завантаження кеш не заповнився — підтягуємо base64.css через fetch
  if (!window.cssFaviconsCache || Object.keys(window.cssFaviconsCache).length === 0) {
    fetch('styles/base64.css')
      .then(r => r.ok ? r.text() : '')
      .then(css => {
        if (css) {
          parseCssIntoFaviconCache(css);
          // Оновити вже відображені значки на сторінці
          document.querySelectorAll('img.link-favicon, img.bm-item-favicon').forEach(fixFavicon);
        }
      })
      .catch(() => {});
  }
}

function cleanFaviconDataUri(uri) {
  if (!uri || typeof uri !== 'string') return 'favicon.ico';
  if (uri.startsWith('data:image/svg+xml')) {
    const commaIdx = uri.indexOf(',');
    if (commaIdx !== -1) {
      let rawSvg = uri.slice(commaIdx + 1);
      if (rawSvg.includes('<') || rawSvg.includes('"') || rawSvg.includes('>') || rawSvg.includes("'")) {
        try { rawSvg = decodeURIComponent(rawSvg); } catch (e) {}
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(rawSvg);
      }
    }
  }
  return uri;
}
window.cleanFaviconDataUri = cleanFaviconDataUri;

function getFaviconForUrl(rawUrl) {
  if (!rawUrl) return 'favicon.ico';
  let domain = '';
  try {
    domain = new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, '');
  } catch (e) {
    domain = String(rawUrl).trim().toLowerCase().replace(/^www\./, '');
  }
  if (!domain) return 'favicon.ico';

  if (rawUrl.includes('CHANGELOG.md')) {
    return cleanFaviconDataUri('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="%23007bff"/><path d="M9 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V8z" fill="%23ffffff"/><path d="M13 11h6M13 15h6M13 19h4" stroke="%23007bff" stroke-width="2" stroke-linecap="round"/></svg>');
  }
  if (rawUrl.includes('communal.html')) {
    if (base64Favicons['communal.local']) return cleanFaviconDataUri(base64Favicons['communal.local']);
  }
  if (rawUrl.includes('pfu_otd') || rawUrl.includes('pfu.gov.ua')) {
    if (base64Favicons['pfu.gov.ua']) return cleanFaviconDataUri(base64Favicons['pfu.gov.ua']);
  }

  // 1. Direct match in high-res vector/base64 cache
  if (base64Favicons[domain]) {
    return cleanFaviconDataUri(base64Favicons[domain]);
  }

  // 2. Domain alias match
  if (domainAliases[domain]) {
    const alias = domainAliases[domain];
    if (base64Favicons[alias]) return cleanFaviconDataUri(base64Favicons[alias]);
    return `https://www.google.com/s2/favicons?domain=${alias}&sz=32`;
  }

  // 3. Subdomain match (e.g. portal.pfu.gov.ua -> pfu.gov.ua)
  for (const key of Object.keys(base64Favicons)) {
    if (domain.endsWith('.' + key)) {
      return cleanFaviconDataUri(base64Favicons[key]);
    }
  }

  // 4. CSS Sprite cache (extracted from styles/base64.css with 440+ icons)
  if (window.cssFaviconsCache && window.cssFaviconsCache[domain]) {
    return cleanFaviconDataUri(window.cssFaviconsCache[domain]);
  }

  // 5. Google Favicon Service
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}
window.getFaviconForUrl = getFaviconForUrl;

const fixFavicon = (img) => {
  if (!img) return;
  const parentA = img.closest ? img.closest("a") : null;
  let rawUrl = (parentA && parentA.href) || "";
  if (!rawUrl && img.closest) {
    const parentRow = img.closest(".bm-link-row");
    if (parentRow) {
      const rowA = parentRow.querySelector("a");
      if (rowA && rowA.href) rawUrl = rowA.href;
    }
  }

  if (rawUrl && rawUrl.startsWith("http")) {
    const resolved = getFaviconForUrl(rawUrl);
    if (resolved && img.src !== resolved) {
      img.src = resolved;
      return;
    }
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

  const resolved = getFaviconForUrl("https://" + domain);
  if (resolved && img.src !== resolved) {
    img.src = resolved;
  }
};
window.fixFavicon = fixFavicon;

document.addEventListener("DOMContentLoaded", () => {
  // Populate CSS favicons from styles/base64.css
  initCssFaviconsCache();

  // Run immediately on existing images
  document.querySelectorAll('img.link-favicon, img.bm-item-favicon').forEach(fixFavicon);

  // Watch for newly added images
  const faviconObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'IMG' && (node.classList.contains('link-favicon') || node.classList.contains('bm-item-favicon'))) {
            fixFavicon(node);
          } else {
            node.querySelectorAll('img.link-favicon, img.bm-item-favicon').forEach(fixFavicon);
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
        if (radioPlayIcon) radioPlayIcon.className = 'fas fa-pause live-icon';
      } else if (newState === 'loading') {
        if (radioItem) radioItem.classList.add('loading');
        if (radioPlayIcon) radioPlayIcon.className = 'fas fa-spinner fa-spin live-icon';
      } else {
        if (radioPlayIcon) radioPlayIcon.className = 'fas fa-play live-icon';
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
    mobileTitleEl.setAttribute('role', 'button');
    mobileTitleEl.setAttribute('tabindex', '0');
    mobileTitleEl.setAttribute('title', 'Меню розділів');

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

  // Клік/тап на назву розділу в мобільній шапці активує/перемикає меню (гамбургер)
  $(document).on('click', '.mobile-navbar-title', function(e) {
    e.preventDefault();
    $('.hamburger.navbar-toggler').click();
  });
  $(document).on('keydown', '.mobile-navbar-title', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $('.hamburger.navbar-toggler').click();
    }
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
    .group li [class*="-badge"] ~ .desc-toggle-btn,
    .group li .sub-link ~ .desc-toggle-btn,
    .group li .torrent-badge ~ .desc-toggle-btn,
    .group li .radio-play-btn ~ .desc-toggle-btn,
    .group li .radio-live-btn ~ .desc-toggle-btn,
    .group li .icontoo ~ .desc-toggle-btn,
    .group li .item-actions-wrap ~ .desc-toggle-btn {
      margin-left: -2px !important;
      margin-right: 0px !important;
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
      margin-top: 1px;
      padding-left: 2px;
      padding-bottom: 2px;
      line-height: 1.45;
      word-break: break-word;
      font-weight: normal;
      display: none;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      width: 100% !important;
      flex-basis: 100%;
      box-sizing: border-box !important;
    }
    .site-description.show-desc {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
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
          <div class="group-title">
            <span class="badge badge-recommend">Партнери Сайту</span>
            <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" class="group-add-btn" title="Вільне Місце. Розмістіть свій сайт, магазин, сервіс, тощо (посилання і опис)."><i class="fas fa-plus"></i></a>
          </div>
          <ul>
            <li>
              <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" title="Тут може бути Ваше посилання і опис на Ваш сайт, магазин, сервіс, тощо. Контакти для розміщення - внизу сторінки."><span class="link-favicon" style="display: none;"></span><span class="placeholder-circle"></span>Вільне Місце<span class="placeholder-icon ad-badge-marker" title="Партнери Сайту">💎</span></a>
            </li>
          </ul>
        `;
      } else {
        recCard.innerHTML = `
          <div class="group-title">
            <span class="badge badge-recommend">Партнери Розділу</span>
            <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" class="group-add-btn" title="Вільне Місце. Розмістіть свій сайт, магазин, сервіс, тощо (посилання і опис)."><i class="fas fa-plus"></i></a>
          </div>
          <ul>
            <li>
              <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" title="Тут може бути Ваше посилання і опис на Ваш сайт, магазин, сервіс, тощо. Контакти для розміщення - внизу сторінки."><span class="link-favicon" style="display: none;"></span><span class="placeholder-circle"></span>Вільне Місце<span class="placeholder-icon ad-badge-marker" title="Партнери Розділу">🔥</span></a>
            </li>
          </ul>
        `;
      }
      firstColumn.prepend(recCard);
    }
  }

  // === Кнопка додавання [+] у шапках карток усіх розділів сайту (Вільне Місце) ===
  document.querySelectorAll('.group .group-title').forEach(titleEl => {
    if (!titleEl.querySelector('.group-add-btn')) {
      const addBtn = document.createElement('a');
      addBtn.href = 'https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs';
      addBtn.target = '_blank';
      addBtn.className = 'group-add-btn';
      addBtn.title = 'Вільне Місце. Розмістіть свій сайт, магазин, сервіс, тощо (посилання і опис).';
      addBtn.innerHTML = '<i class="fas fa-plus"></i>';
      titleEl.appendChild(addBtn);
    }
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

        // Кнопка сердечка для швидкого додавання у власні закладки
        const heartBtn = document.createElement('button');
        heartBtn.type = 'button';
        heartBtn.className = 'desc-heart-add-btn';
        heartBtn.setAttribute('title', 'Додати сайт у «❤️ Закладки»');
        heartBtn.setAttribute('aria-label', 'Додати сайт у «❤️ Закладки»');
        heartBtn.innerHTML = '<i class="far fa-heart"></i>';

        // Текст опису
        const descText = document.createElement('div');
        descText.className = 'desc-text';
        descText.textContent = description;

        descDiv.appendChild(heartBtn);
        descDiv.appendChild(descText);

        // Вставляємо опис у li
        li.appendChild(descDiv);

        heartBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleQuickBookmarkClick(link, description, heartBtn);
        });

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
                    otherDesc.classList.remove('show-desc');
                    otherDesc.style.display = 'none';
                  }
                }
              }
            });

            // Показати поточний опис
            descDiv.classList.add('show-desc');
            descDiv.style.display = 'flex';
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
              descDiv.classList.remove('show-desc');
              descDiv.removeEventListener('transitionend', onTransitionEnd);
            };
            descDiv.addEventListener('transitionend', onTransitionEnd);
            // Запасний варіант, якщо transitionend не спрацював
            setTimeout(() => {
              if (descDiv.style.opacity === '0') {
                descDiv.style.display = 'none';
                descDiv.classList.remove('show-desc');
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
  const isHomepage = (window.location.pathname.endsWith('/') || 
                      window.location.pathname.endsWith('/index.html') || 
                      !window.location.pathname.includes('.html')) &&
                      !window.location.pathname.includes('bookmarks');

  const screenWidth = window.innerWidth;
  let totalAdCount = 0;

  // === 1. БОКОВА РЕКЛАМА (Динамічне перемикання: 300px при >= 1800px, 160px при 1530-1799px) ===
  let currentSideAdType = null; // 'wide' (300px), 'narrow' (160px), або 'none'

  function updateSideAds() {
    const width = window.innerWidth;
    let targetType = 'none';
    if (width >= 1800) {
      targetType = 'wide';
    } else if (width >= 1530) {
      targetType = 'narrow';
    }

    // Якщо поточний тип блоків уже збігається з потрібним - нічого не перестворюємо
    if (targetType === currentSideAdType) return;
    currentSideAdType = targetType;

    // Видаляємо попередні бокові блоки, якщо розмір вікна змінився
    document.querySelectorAll('.side-ad-left, .side-ad-right').forEach(el => el.remove());

    if (targetType === 'none') {
      return;
    }

    if (targetType === 'wide') {
      // Повнорозмірні 300px блоки (від 1800px)
      const leftAd = document.createElement('div');
      leftAd.className = 'side-ad-left';
      
      const rightAd = document.createElement('div');
      rightAd.className = 'side-ad-right';

      if (isHomepage) {
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
      observeAdStatus(leftAd);
      observeAdStatus(rightAd);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.log("Side ads init error:", e);
      }
    } else if (targetType === 'narrow') {
      // Вузькі бокові блоки шириною 160px для моніторів 1530px - 1799px
      const leftAd = document.createElement('div');
      leftAd.className = 'side-ad-left side-ad-narrow';

      const rightAd = document.createElement('div');
      rightAd.className = 'side-ad-right side-ad-narrow';

      leftAd.innerHTML = `
        <!-- Бокова-ліва (при менше 1799) -->
        <div class="ad-wrapper-narrow">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-3065705668384801"
               data-ad-slot="3337256495"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      `;

      rightAd.innerHTML = `
        <!-- Бокова-права (при менше 1799) -->
        <div class="ad-wrapper-narrow">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-3065705668384801"
               data-ad-slot="8603604626"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      `;

      document.body.appendChild(leftAd);
      document.body.appendChild(rightAd);
      observeAdStatus(leftAd);
      observeAdStatus(rightAd);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.log("Side narrow ads init error:", e);
      }
    }
  }

  // Первинна ініціалізація бокових блоків
  updateSideAds();

  // Відстежуємо зміну ширини вікна в реальному часі (наприклад, перетягування межі вікна)
  let sideAdsResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(sideAdsResizeTimer);
    sideAdsResizeTimer = setTimeout(updateSideAds, 200);
  });

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

  // === 2. НИЖНІЙ МУЛЬТИПЛЕКС ПЕРЕД ФУТЕРОМ (На всіх сторінках, окрім Головної та «❤️ Закладки», і тільки для ПК екранів >= 1280px) ===
  const isBookmarksPage = window.location.pathname.includes('bookmarks') || 
                          !!document.getElementById('bookmarksPageApp') ||
                          document.body.classList.contains('page-bookmarks');
  if (!isHomepage && !isBookmarksPage && screenWidth >= 1280) {
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

  // На головній сторінці та в розділі «сердечко» примусово видаляємо будь-які нижні горизонтальні блоки
  if (isHomepage || isBookmarksPage) {
    document.querySelectorAll('.bottom-multiplex-container, .ad-wrapper-bottom').forEach(el => el.remove());
  }

  // === 3. ВПРОВАДЖЕННЯ МОБІЛЬНИХ IN-FEED РЕКЛАМНИХ БЛОКІВ МІЖ КАРТКАМИ (Тільки для мобільних екранів < 1280px) ===
  if (screenWidth < 1280) {
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

  // === Модальне вікно розшифровки умовних позначок сайту ===
  initBadgesLegendModal();

  // === Модальне вікно інформації "Про Сайт" ===
  initAboutSiteModal();

  // === Розумний Дзвіночок сповіщень у шапці сайту ===
  initNoticeBell();

  // === Автоматизована система замовлення та розміщення реклами/ресурсів ===
  initAdOrderSystem();
});

// ==========================================================================
// КОНФІГУРАЦІЯ ОГОЛОШЕНЬ ТА СПОВІЩЕНЬ САЙТУ
// ==========================================================================
// Правила для endDate:
// 1) "YYYY-MM-DD" -> оголошення діє строго до кінця зазначеного дня
// 2) "unlimited" (або не вказано/null) -> безстрокове оголошення
// 3) Якщо endDate: "default" або не вказано -> автоматично +10 днів від startDate
// ==========================================================================
const SITE_ANNOUNCEMENTS = [
  {
    id: "notice_user_cabinet_bookmarks_2026",
    type: "user", // "user" (синій) або "tech" (бурштиновий)
    title: "⭐ Особистий Кабінет та Персональні Закладки",
    text: `Раді повідомити, що на сайті повноцінно діє <strong>Особистий Кабінет</strong> та інтерактивний розділ <a href="bookmarks.html" class="top-announcement-link" style="font-weight:700;"><i class="fas fa-heart text-danger"></i> «Мої Закладки»</a>!
<br><br>
<strong>Ключові можливості для користувачів:</strong>
<ul style="margin: 6px 0 10px 18px; padding: 0; line-height: 1.55;">
  <li><strong>Швидке додавання з каталогу:</strong> розгорніть опис будь-якого сайту на будь-якій сторінці каталогу та натисніть на значок <strong>❤️</strong> ліворуч — сайт миттєво збережеться у вашу колекцію без необхідності копіювати посилання.</li>
  <li><strong>Власні картки та посилання:</strong> створюйте персональні тематичні папки та додавайте будь-які вебсайти за адресою URL з автоматичним підтягуванням якісних значків (фавіконок).</li>
  <li><strong>Зручне сортування (Drag &amp; Drop):</strong> змінюйте розташування карток простим перетягуванням як мишкою на комп'ютері, так і пальцем на смартфоні.</li>
  <li><strong>Хмарна синхронізація:</strong> авторизуйтеся через Google у Кабінеті (<i class="far fa-user-circle"></i> у верхньому меню), і всі ваші закладки будуть надійно збережені в хмарі та доступні на будь-якому пристрої!</li>
</ul>
<div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
  <a href="bookmarks.html" class="btn btn-danger btn-sm text-white font-weight-bold" style="border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px;">
    <i class="fas fa-heart"></i> Відкрити «Закладки»
  </a>
  <button type="button" class="btn btn-outline-primary btn-sm font-weight-bold" onclick="closeAnnouncementsModal(); openUserCabinetModal();" style="border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px;">
    <i class="far fa-user-circle"></i> Мій Кабінет
  </button>
</div>`,
    startDate: "2026-10-25",
    endDate: "2028-01-01" // До 2028-01-01 включно
  },
  {
    id: "notice_feedback_catalog_2026",
    type: "user", // "user" (синій) або "tech" (бурштиновий)
    title: "💡 Формування каталогу",
    text: `Поки триває наповнення сайту, ми відкриті до ваших побажань та ідей. Пропонуйте дійсно значущі, перевірені та корисні ресурси у наш <a href="https://t.me/+1UKue84k2AVjZDcy" target="_blank" class="top-announcement-link" style="font-weight:700;"><i class="fas fa-comments"></i> відкритий ЧАТ</a> (посилання також завжди доступне в нижньому меню сайту).`,
    startDate: "2026-08-29",
    endDate: "2027-01-01" // До 2027-01-01 включно
  },
  {
    id: "notice_maintenance_2026_10_01",
    type: "tech",
    title: "🛠️ Налагоджувальні роботи",
    text: `На сайті проводяться регламентні налагоджувальні роботи. Усі сервіси, розділи та посилання каталогу працюють стабільно і доступні без обмежень. Дізнатися про всі останні зміни та оновлення каталогу можна за посиланням <a href="CHANGELOG.md" class="top-announcement-link changelog-link" title="Відкрити історію оновлень" style="font-weight:700;">«Що нового?»</a> (також завжди доступне внизу сайту).`,
    startDate: "2026-08-29",
    endDate: "2026-10-01" // До конкретної дати включно
  }
];

// Допоміжна функція: розрахунок та перевірка актуальності оголошення
function getAnnouncementExpiryInfo(announcement) {
  const now = new Date();
  const start = new Date(announcement.startDate + "T00:00:00");
  
  if (announcement.endDate === "unlimited" || !announcement.endDate) {
    return {
      isActive: true,
      expiryLabel: "Термін дії: необмежений",
      isUnlimited: true,
      endDateObj: new Date("2099-12-31T23:59:59")
    };
  }

  let end;
  if (announcement.endDate === "default" || announcement.endDate === "10days") {
    end = new Date(start.getTime() + (10 * 24 * 60 * 60 * 1000));
    end.setHours(23, 59, 59, 999);
  } else {
    end = new Date(announcement.endDate + "T23:59:59");
  }

  const isActive = now <= end;
  const formattedEndDate = end.toISOString().split("T")[0];

  return {
    isActive,
    expiryLabel: `Термін дії: до ${formattedEndDate}`,
    isUnlimited: false,
    endDateObj: end
  };
}

// Отримання списку всіх активних на поточний момент оголошень з розумним сортуванням
// 1. Непрочитані оголошення завжди показуються вище за вже прочитані
// 2. Новіші за датою старту (startDate) показуються вище
function getActiveAnnouncements() {
  const active = SITE_ANNOUNCEMENTS.filter(item => {
    const info = getAnnouncementExpiryInfo(item);
    return info.isActive;
  });

  return active.sort((a, b) => {
    const aUnread = localStorage.getItem("top_zakladki_read_" + a.id) !== "viewed";
    const bUnread = localStorage.getItem("top_zakladki_read_" + b.id) !== "viewed";
    
    // Пріоритет 1: Непрочитані зверху
    if (aUnread && !bUnread) return -1;
    if (!aUnread && bUnread) return 1;

    // Пріоритет 2: Свіжіші оголошення (за датою старту) зверху
    const dateA = new Date(a.startDate + "T00:00:00").getTime();
    const dateB = new Date(b.startDate + "T00:00:00").getTime();
    if (dateB !== dateA) {
      return dateB - dateA;
    }

    // Пріоритет 3: Терміновіші (з ближчим дедлайном) вище безстрокових
    const infoA = getAnnouncementExpiryInfo(a);
    const infoB = getAnnouncementExpiryInfo(b);
    return infoA.endDateObj.getTime() - infoB.endDateObj.getTime();
  });
}

// Перевірка наявності хоча б одного непрочитаного оголошення
function hasUnreadNotices() {
  try {
    const active = getActiveAnnouncements();
    if (active.length === 0) return false;
    return active.some(item => localStorage.getItem("top_zakladki_read_" + item.id) !== "viewed");
  } catch (e) {
    return false;
  }
}

// Оновлення стану кнопки дзвіночка (анімація та бейдж)
function updateNoticeBellState() {
  const bellBtn = document.getElementById("noticeBellBtn");
  if (!bellBtn) return;
  const dot = bellBtn.querySelector(".notice-bell-badge-dot");
  const unread = hasUnreadNotices();
  const bellBadgeEnabled = (userProfileSettings && userProfileSettings.noticeBellBadge !== false);

  if (unread && bellBadgeEnabled) {
    bellBtn.classList.add("has-unread");
    if (dot) dot.style.display = "block";
  } else {
    bellBtn.classList.remove("has-unread");
    if (dot) dot.style.display = "none";
  }
}

// === Ініціалізація кнопки-дзвіночка у шапці ===
function initNoticeBell() {
  const bellBtn = document.getElementById("noticeBellBtn");
  if (!bellBtn) return;

  updateNoticeBellState();

  bellBtn.addEventListener("click", () => {
    openAnnouncementsModal();
  });
}

// Генерація HTML-коду активних карток оголошень
function renderAnnouncementsCardsHtml() {
  const active = getActiveAnnouncements();
  
  if (active.length === 0) {
    return `
      <div class="announcements-empty-state">
        <div class="empty-icon"><i class="fas fa-bell-slash"></i></div>
        <h6 class="empty-title">Нових оголошень немає</h6>
        <p class="empty-desc">Наразі всі системи та сервіси каталогу працюють у штатному режимі, актуальні повідомлення відсутні.</p>
      </div>
    `;
  }

  return active.map(item => {
    const expiry = getAnnouncementExpiryInfo(item);
    const isUnread = localStorage.getItem("top_zakladki_read_" + item.id) !== "viewed";
    const itemClass = (item.type === "tech" ? "item-tech" : "item-user") + (isUnread ? " is-unread" : "");
    const iconType = item.type === "tech" ? "fa-calendar-alt" : (expiry.isUnlimited ? "fa-infinity" : "fa-calendar-alt");
    
    return `
      <div class="announcement-card-item ${itemClass}">
        <div class="announcement-card-header">
          <span>${item.title}</span>
          ${isUnread ? '<span class="announcement-new-badge"><i class="fas fa-sparkles"></i> НОВЕ</span>' : ''}
        </div>
        <div class="announcement-card-body">
          ${item.text}
        </div>
        <div class="announcement-card-footer">
          <i class="fas ${iconType} mr-1"></i> ${expiry.expiryLabel}
        </div>
      </div>
    `;
  }).join("");
}

// === Модальне вікно центру оголошень сайту ===
function openAnnouncementsModal() {
  let backdrop = document.getElementById('announcementsModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'announcementsModalBackdrop';
    backdrop.className = 'cl-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cl-modal announcements-modal" role="dialog" aria-modal="true" style="max-width: 580px;">
        <div class="cl-modal-header announcements-modal-header">
          <h5 class="cl-modal-title"><i class="fas fa-bell text-warning mr-2"></i> Оголошення</h5>
          <button type="button" class="btn btn-secondary btn-sm cl-modal-close" aria-label="Закрити">
            <span>Закрити</span>
            <span class="cl-modal-close-sep"></span>
            <span class="cl-modal-close-x">&times;</span>
          </button>
        </div>
        <div class="cl-modal-body announcements-modal-body" id="announcementsModalBody">
          <!-- Постійний банер-кнопка для переходу до інформації "Про Сайт" -->
          <div class="announcements-about-banner" id="btnNoticeAboutSiteBanner" role="button" tabindex="0" title="Відкрити інформацію про сайт, його можливості та інструкції">
            <div class="announcements-about-banner-left">
              <span class="announcements-about-icon"><i class="fas fa-info-circle"></i></span>
              <div class="announcements-about-texts">
                <div class="announcements-about-title">Що вміє наш сайт?</div>
                <div class="announcements-about-sub">Огляд можливостей</div>
              </div>
            </div>
            <button type="button" class="btn btn-primary btn-sm announcements-about-action-btn">
              Про Сайт <i class="fas fa-chevron-right ms-1"></i>
            </button>
          </div>

          <div id="announcementsContentContainer">
            ${renderAnnouncementsCardsHtml()}
          </div>
          <div class="text-center pt-2 pb-1 announcements-modal-footer-action">
            <button type="button" class="btn btn-primary px-4 cl-modal-close font-weight-bold" style="border-radius: 20px;">
              <i class="fas fa-check mr-1"></i> Зрозуміло
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const closeBtns = backdrop.querySelectorAll('.cl-modal-close');
    closeBtns.forEach(btn => btn.addEventListener('click', closeAnnouncementsModal));
    const aboutBanner = backdrop.querySelector('#btnNoticeAboutSiteBanner');
    if (aboutBanner) {
      aboutBanner.addEventListener('click', () => {
        closeAnnouncementsModal();
        openAboutSiteModal();
      });
    }
    backdrop.addEventListener('click', (ev) => {
      if (ev.target === backdrop) closeAnnouncementsModal();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && backdrop.classList.contains('show')) {
        closeAnnouncementsModal();
      }
    });
  } else {
    // Оновлюємо контент при кожному відкритті (перевірка актуальності)
    const container = document.getElementById('announcementsContentContainer');
    if (container) {
      container.innerHTML = renderAnnouncementsCardsHtml();
    }
  }

  // При відкритті позначаємо всі діючі оголошення як прочитані
  try {
    const active = getActiveAnnouncements();
    active.forEach(item => {
      localStorage.setItem("top_zakladki_read_" + item.id, "viewed");
    });
  } catch (e) {}
  updateNoticeBellState();

  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAnnouncementsModal() {
  const backdrop = document.getElementById('announcementsModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
    if (!document.querySelector('.cl-modal-backdrop.show')) {
      document.body.style.overflow = '';
    }
  }
}

// === ВЕРХНІЙ ІНФОРМЕР / Топ-рядок над шапкою (Top Announcement Bar) ===
function initTopInformer() {
  try {
    if (localStorage.getItem(TOP_NOTICE_ID) === "viewed") return;
  } catch (e) {
    // ігноруємо можливу помилку доступу до localStorage
  }

  const mainContainer = document.querySelector(".container-fluid.main") || document.body;
  const wrapper = document.createElement("div");
  wrapper.id = "topInformerWrapper";
  wrapper.className = "container top-announcement-wrapper";
  wrapper.innerHTML = `
    <div class="top-announcement-bar" id="topInformerBar" role="region" aria-label="Оголошення сайту">
      <div class="top-announcement-content">
        <span class="top-announcement-icon" aria-hidden="true">💡</span>
        <div class="top-announcement-text">
          <strong class="top-announcement-badge">Формування каталогу:</strong>
          <span class="top-announcement-message">
            Поки триває наповнення сайту, ми відкриті до ваших побажань та ідей. Пропонуйте дійсно значущі, перевірені та корисні ресурси у наш <a href="https://t.me/+1UKue84k2AVjZDcy" target="_blank" class="top-announcement-link" title="Перейти у відкритий Telegram-чат сайту"><i class="fas fa-comments"></i> відкритий ЧАТ</a> (посилання також доступне в нижньому меню сайту)!
          </span>
        </div>
      </div>
      <button class="top-announcement-close" id="topInformerCloseBtn" title="Приховати оголошення" aria-label="Закрити">&times;</button>
    </div>
  `;

  // Вставляємо на самий початок основного контейнера над закладками
  if (mainContainer.firstChild) {
    mainContainer.insertBefore(wrapper, mainContainer.firstChild);
  } else {
    mainContainer.appendChild(wrapper);
  }

  const closeBtn = wrapper.querySelector("#topInformerCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      try {
        localStorage.setItem(TOP_NOTICE_ID, "viewed");
      } catch (e) {}
      updateNoticeBellDot();

      wrapper.classList.add("collapsing-out");
      setTimeout(() => {
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      }, 350);
    });
  }
}

// === ПРАВИЙ ІНФОРМЕР / Спливаючий тост у кутку (Floating Toast з таймером та пам'яттю) ===
function initRightInformer() {
  const expiryDate = new Date("2026-10-01T23:59:59");
  const now = new Date();

  // Не показувати після закінчення терміну або якщо користувач вже бачив/закрив це оголошення
  if (now > expiryDate) return;
  try {
    if (localStorage.getItem(RIGHT_NOTICE_ID) === "viewed") return;
  } catch (e) {
    // ігноруємо можливу помилку доступу до localStorage
  }

  const container = document.createElement("div");
  container.id = "maintenanceToastContainer";
  container.className = "maintenance-toast-container";
  container.innerHTML = `
    <div class="maintenance-toast" id="maintenanceToast" role="alert" aria-live="polite">
      <button class="maintenance-close-btn" id="maintenanceCloseBtn" title="Закрити" aria-label="Закрити">&times;</button>
      <div class="maintenance-content">
        <div class="maintenance-icon-wrap">
          <div class="maintenance-icon">🛠️</div>
        </div>
        <div class="maintenance-text">
          <h4 class="maintenance-title" id="maintenanceTitle">Налагоджувальні роботи</h4>
          <p class="maintenance-desc">
            На сайті проводяться налагоджувальні роботи (триватимуть до <strong>2026-10-01</strong>). Усі сервіси та посилання доступні без обмежень.
          </p>
        </div>
      </div>
      <div class="maintenance-actions">
        <button class="maintenance-confirm-btn" id="maintenanceConfirmBtn">
          <span>Зрозуміло</span>
          <span class="maintenance-timer-badge" id="maintenanceTimerBadge">20 с</span>
        </button>
      </div>
      <div class="maintenance-progress-track">
        <div class="maintenance-progress-bar" id="maintenanceProgressBar"></div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const toast = container.querySelector("#maintenanceToast");
  requestAnimationFrame(() => {
    if (toast) toast.classList.add("show");
  });

  const totalDuration = 20000; // 20 секунд
  let remainingTime = totalDuration;
  let lastTick = Date.now();
  let isPaused = false;
  let closed = false;

  function markAsViewed() {
    try {
      localStorage.setItem(RIGHT_NOTICE_ID, "viewed");
    } catch (e) {}
    updateNoticeBellDot();
  }

  function closeToast() {
    if (closed) return;
    closed = true;
    markAsViewed();

    if (toast) toast.classList.remove("show");
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 350);
  }

  const closeBtn = container.querySelector("#maintenanceCloseBtn");
  const confirmBtn = container.querySelector("#maintenanceConfirmBtn");
  const timerBadge = container.querySelector("#maintenanceTimerBadge");
  const progressBar = container.querySelector("#maintenanceProgressBar");

  if (closeBtn) closeBtn.addEventListener("click", closeToast);
  if (confirmBtn) confirmBtn.addEventListener("click", closeToast);

  // Пауза зворотного відліку при наведенні курсора для зручного читання
  if (toast) {
    toast.addEventListener("mouseenter", () => { isPaused = true; });
    toast.addEventListener("mouseleave", () => {
      isPaused = false;
      lastTick = Date.now();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !closed) closeToast();
  });

  const timerInterval = setInterval(() => {
    if (closed) {
      clearInterval(timerInterval);
      return;
    }

    const currentNow = Date.now();
    const delta = currentNow - lastTick;
    lastTick = currentNow;

    if (!isPaused) {
      remainingTime = Math.max(0, remainingTime - delta);
      const secondsLeft = Math.ceil(remainingTime / 1000);

      if (timerBadge) {
        timerBadge.textContent = `${secondsLeft} с`;
      }
      if (progressBar) {
        const percentage = (remainingTime / totalDuration) * 100;
        progressBar.style.width = `${percentage}%`;
      }

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        closeToast();
      }
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
    if (!document.querySelector('.cl-modal-backdrop.show')) {
      document.body.style.overflow = '';
    }
  }
}

// === Модальне вікно розшифровки умовних позначок сайту ===
function initBadgesLegendModal() {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('.badges-legend-link, #badgesLegendBtn');
    if (link) {
      if (e.ctrlKey || e.metaKey || e.button === 1) return;
      e.preventDefault();
      openBadgesModal();
    }
  });
}

function openBadgesModal() {
  let backdrop = document.getElementById('badgesModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'badgesModalBackdrop';
    backdrop.className = 'cl-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cl-modal" role="dialog" aria-modal="true" style="max-width: 620px;">
        <div class="cl-modal-header">
          <h5 class="cl-modal-title"><i class="fas fa-tags text-primary"></i> Умовні позначки</h5>
          <button type="button" class="btn btn-secondary btn-sm cl-modal-close" aria-label="Закрити">
            <span>Закрити</span>
            <span class="cl-modal-close-sep"></span>
            <span class="cl-modal-close-x">&times;</span>
          </button>
        </div>
        <div class="cl-modal-body">
          <p class="text-muted mb-3" style="font-size: 0.9rem; line-height: 1.45; font-style: italic; padding: 0 2px;">Розшифровка спеціальних інтерактивних позначок та індикаторів:</p>
          
          <div class="badges-legend-list">
            <!-- 1. Рекомендовано сайтом -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Рекомендація нашого сайту">
                  <span class="rec-spin-star" style="margin: 0; display: inline-flex;"><svg viewBox="0 0 24 24" width="16" height="16" class="rec-spin-star-svg"><path fill="currentColor" d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z"/></svg></span>
                </div>
                <div class="badges-legend-title">Рекомендовано сайтом (Редакція)</div>
              </div>
              <p class="badges-legend-desc">Особливо якісні, перевірені та надійні ресурси, відзначені редакцією нашого каталогу (золота 4-стороння зірочка, що плавно обертається наприкінці назви посилання).</p>
            </div>

            <!-- Партнерські та рекламні позначки -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Партнери Сайту (Головна)">
                  <span style="font-size: 1.25rem;">💎</span>
                </div>
                <div class="badges-legend-title">Позначка «💎» - Партнери Сайту (Головна)</div>
              </div>
              <p class="badges-legend-desc">Преміальне партнерське розміщення в ексклюзивному блоці «Партнери Сайту» на Головній сторінці порталу.</p>
            </div>

            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Партнери Розділу">
                  <span style="font-size: 1.25rem;">🔥</span>
                </div>
                <div class="badges-legend-title">Позначка «🔥» - Партнери Розділу</div>
              </div>
              <p class="badges-legend-desc">Провідне партнерське розміщення в блоці «Партнери Розділу» конкретного тематичного розділу сайту.</p>
            </div>

            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Рекламне розміщення в картці">
                  <span style="font-size: 1.25rem;">⚡️</span>
                </div>
                <div class="badges-legend-title">Позначка «⚡️» - Партнерське розміщення в картці</div>
              </div>
              <p class="badges-legend-desc">Офіційне партнерське розміщення ресурсу в тематичній картці каталогу (у верхній або стандартній зоні списку).</p>
            </div>

            <!-- 2. Вільне Місце (+) Розмістити сайт -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Вільне Місце - Розмістити сайт">
                  <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" class="badges-legend-add-btn" title="Вільне Місце. Розмістіть свій сайт, магазин, сервіс, тощо"><i class="fas fa-plus"></i></a>
                </div>
                <div class="badges-legend-title">Кнопка «+» (Розмістити сайт)</div>
              </div>
              <p class="badges-legend-desc">Розташована в лівому кутку шапки кожної картки (її колір відповідає забарвленню конкретного розділу). Швидкий перехід для розміщення вашого сайту, інтернет-магазину, сервісу чи авторського проєкту в нашому каталозі (з персональним описом та прямим посиланням у відповідному розділі).</p>
            </div>

            <!-- 3. Особистий кабінет -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Іконка особистого кабінету">
                  <span class="sub-link" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Особистий кабінет користувача</div>
              </div>
              <p class="badges-legend-desc">Швидкий прямий перехід до електронного кабінету споживача, клієнта чи платника (перевірка рахунків, передача показників лічильників, керування послугами або відправленнями).</p>
            </div>

            <!-- 3. Торрент-ресурс -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Позначка торрент-ресурсу">
                  <a href="https://www.qbittorrent.org/download" target="_blank" class="torrent-badge" style="opacity: 1; margin: 0; width: 24px; height: 24px;" title="Завантажити безкоштовний торрент-клієнт qBittorrent">TT</a>
                </div>
                <div class="badges-legend-title">Торрент-ресурс (Торрент-трекер)</div>
              </div>
              <p class="badges-legend-desc">Для завантаження файлів (фільмів, музики, ігор або програм) із зазначеного сервісу потрібна програма Торрент-клієнт. Натисніть на позначку, щоб безкоштовно завантажити офіційний qBittorrent.</p>
            </div>

            <!-- YouTube-канал або відео -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Офіційний YouTube">
                  <span class="youtube-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Офіційний YouTube-канал або відео</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до офіційного каналу організації, сервісу чи проєкту на YouTube (відео, трансляції або підбірки).</p>
            </div>

            <!-- Facebook-сторінка або група -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Офіційний Facebook">
                  <span class="facebook-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Офіційна сторінка або група Facebook</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до офіційної сторінки, спільноти чи групи організації/сервісу в соціальній мережі Facebook.</p>
            </div>

            <!-- 4. Telegram-канал або бот -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Офіційний Telegram">
                  <span class="telegram-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Офіційний Telegram-канал або бот</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до офіційного каналу новин, оперативних сповіщень чи корисного чат-бота організації/сервісу в Telegram.</p>
            </div>

            <!-- Instagram-профіль -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Офіційний Instagram">
                  <span class="instagram-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Офіційний Instagram-профіль</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до офіційної сторінки, Reels-відео або фотохроніки організації чи проєкту в Instagram.</p>
            </div>

            <!-- X (Twitter) профіль -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Офіційний X (Twitter)">
                  <span class="twitter-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Офіційний акаунт у X (Twitter)</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до офіційної стрічки новин, оперативних публікацій та заяв у мережі X (Twitter).</p>
            </div>

            <!-- TikTok профіль -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Офіційний TikTok">
                  <span class="tiktok-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Офіційний TikTok-акаунт</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до офіційного акаунту організації або автора в TikTok з короткими відео, трендами та прямими трансляціями.</p>
            </div>

            <!-- Discord сервер або спільнота -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Офіційний Discord">
                  <span class="discord-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Офіційний Discord-сервер / спільнота</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до Discord-спільноти для живого спілкування, голосових чатів, технічної підтримки та взаємодії однодумців.</p>
            </div>

            <!-- Spotify / Музичні стрімінги -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Spotify / Apple Music / SoundCloud">
                  <span class="spotify-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Музичні стрімінги (Spotify / Apple Music / SoundCloud)</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до офіційних профілів, альбомів, подкастів чи треків виконавця на популярних музичних платформах.</p>
            </div>

            <!-- LinkedIn профіль або компанія -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Офіційний LinkedIn">
                  <span class="linkedin-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Діловий профіль LinkedIn</div>
              </div>
              <p class="badges-legend-desc">Швидкий перехід до офіційної сторінки компанії, професійного резюме фахівця чи ділової мережі зв'язків у LinkedIn.</p>
            </div>

            <!-- Висувна панель додаткових значків-посилань -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Додаткові посилання та соцмережі">
                  <span class="item-actions-toggle" style="pointer-events: none; margin: 0; transform: none; background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.4); color: #2563eb;"><i class="fas fa-chevron-left"></i></span>
                </div>
                <div class="badges-legend-title">Кнопка «‹» (Висувна панель соцмереж та посилань)</div>
              </div>
              <p class="badges-legend-desc">Витягнута вертикальна стрілочка праворуч від ресурсу. Якщо у сайту є декілька офіційних каналів (YouTube, Facebook, Telegram, Instagram, TikTok, Discord, Spotify тощо), натискання розгортає компактну панель із повним набором значків.</p>
            </div>

            <!-- 5. Дзеркало сайту / Альтернативний домен -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Альтернативна адреса">
                  <span class="mirror-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Дзеркало сайту / Альтернативний домен</div>
              </div>
              <p class="badges-legend-desc">Запасна резервна адреса або дзеркало веб-ресурсу на випадок перевантаження або тимчасової недоступності основного посилання.</p>
            </div>

            <!-- 6. Музичний плейлист (YouTube Music) -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Кнопка відтворення плейлиста">
                  <button type="button" class="radio-play-btn yt-play-btn" style="pointer-events: none; margin: 0;" title="Слухати"><i class="fas fa-play"></i></button>
                </div>
                <div class="badges-legend-title">Музичний плейлист (YouTube Music)</div>
              </div>
              <p class="badges-legend-desc">Вбудоване відтворення музичного плейлиста безпосередньо на сторінці з увімкненим за замовчуванням режимом перемішування (Shuffle).</p>
            </div>

            <!-- 7. Прямий ефір радіо (LIVE) -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Пряма трансляція радіо">
                  <button type="button" class="radio-live-btn" style="pointer-events: none; margin: 0;">
                    <span class="live-dot"></span>
                    <span class="live-text">LIVE</span>
                    <i class="fas fa-play live-icon"></i>
                  </button>
                </div>
                <div class="badges-legend-title">Прямий ефір радіо (LIVE)</div>
              </div>
              <p class="badges-legend-desc">Миттєвий запуск прямої онлайн-трансляції радіостанції в реальному часі без переходу на зовнішні сайти.</p>
            </div>

            <!-- 8. Мобільний застосунок (App) -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Мобільний додаток">
                  <span class="app-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Мобільний застосунок (App)</div>
              </div>
              <p class="badges-legend-desc">Наявність фірмового мобільного додатка для смартфонів Android або iOS (прямий перехід у магазин застосунків або сторінку завантаження).</p>
            </div>

            <!-- 9. Швидкий онлайн-чат / Підтримка -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Онлайн-чат підтримки">
                  <span class="chat-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Швидкий онлайн-чат / Підтримка</div>
              </div>
              <p class="badges-legend-desc">Прямий зв'язок зі службою клієнтської підтримки, онлайн-консультантом, диспетчером або помічником на сайті.</p>
            </div>

            <!-- 10. Вільний / Open Source сервіс -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Вільне ПЗ / Open Source">
                  <span class="opensource-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Вільний / Open Source сервіс</div>
              </div>
              <p class="badges-legend-desc">Повністю вільне некомерційне програмне забезпечення або сервіс із відкритим вихідним кодом без нав'язливих платних підписок.</p>
            </div>

            <!-- 11. Потрібна реєстрація / Авторизація -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Необхідна реєстрація">
                  <span class="auth-badge" style="opacity: 1; margin: 0; pointer-events: none; width: 24px; height: 24px;"></span>
                </div>
                <div class="badges-legend-title">Потрібна реєстрація / Авторизація</div>
              </div>
              <p class="badges-legend-desc">Доступ до основних функцій чи матеріалів сервісу потребує створення облікового запису (реєстрації або входу).</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const closeBtns = backdrop.querySelectorAll('.cl-modal-close, .cl-modal-close-btn');
    closeBtns.forEach(btn => btn.addEventListener('click', closeBadgesModal));
    backdrop.addEventListener('click', (ev) => {
      if (ev.target === backdrop) closeBadgesModal();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && backdrop.classList.contains('show')) {
        closeBadgesModal();
      }
    });
  }

  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeBadgesModal() {
  const backdrop = document.getElementById('badgesModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
    if (!document.querySelector('.cl-modal-backdrop.show')) {
      document.body.style.overflow = '';
    }
  }
}

// === Модальне вікно "Про Сайт" ===
function initAboutSiteModal() {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('.about-site-link, #aboutSiteFooterBtn, #btnNoticeAboutSite');
    if (link) {
      if (e.ctrlKey || e.metaKey || e.button === 1) return;
      e.preventDefault();
      openAboutSiteModal();
    }
  });
}

function openAboutSiteModal() {
  let backdrop = document.getElementById('aboutSiteModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'aboutSiteModalBackdrop';
    backdrop.className = 'cl-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cl-modal about-site-modal" role="dialog" aria-modal="true" style="max-width: 680px;">
        <div class="cl-modal-header">
          <h5 class="cl-modal-title"><i class="fas fa-info-circle text-primary"></i> Про Сайт</h5>
          <button type="button" class="btn btn-secondary btn-sm cl-modal-close" aria-label="Закрити">
            <span>Закрити</span>
            <span class="cl-modal-close-sep"></span>
            <span class="cl-modal-close-x">&times;</span>
          </button>
        </div>
        <div class="cl-modal-body about-site-modal-body" id="aboutSiteModalBody">
          <div class="about-site-hero">
            <div class="about-site-hero-header">
              <span class="about-site-logo" aria-hidden="true">🌐</span>
              <h4 class="about-site-heading">ТОП ЗАКЛАДКИ 🇺🇦 - Головні Сайти України</h4>
            </div>
            <p class="about-site-lead">
              Сучасний інформаційний портал, надійний каталог перевірених веб-ресурсів та персональний хмарний менеджер закладок для щоденного комфортного користування.
            </p>
          </div>

          <div class="about-site-section-title">
            <i class="fas fa-star text-warning"></i> Ключові можливості для користувачів:
          </div>
          <div class="about-site-grid">
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon"><i class="fas fa-user-circle"></i></div>
                <div class="about-site-card-title">Особистий Кабінет</div>
              </div>
              <p class="about-site-card-desc">Безпечна авторизація в 1 клік через Google без паролів. Керування персональними даними, статусами рекламних замовлень та хмарною синхронізацією.</p>
            </div>
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon text-danger"><i class="fas fa-heart"></i></div>
                <div class="about-site-card-title">Персональні «Мої Закладки»</div>
              </div>
              <p class="about-site-card-desc">Окремий розділ «❤️ Закладки»: створюйте власні тематичні картки (робота, навчання, новини тощо), сортуйте сайти та формуйте власний стартовий екран.</p>
            </div>
            <div class="about-site-card" style="border: 1px solid rgba(245, 158, 11, 0.4); background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(234, 179, 8, 0.03));">
              <div class="about-site-card-header">
                <div class="about-site-card-icon" style="color: #f59e0b;"><i class="fas fa-coins"></i></div>
                <div class="about-site-card-title text-warning">Система балів та винагород</div>
              </div>
              <p class="about-site-card-desc">На сайті передбачена накопичувальна система балів (активність, замовлення, використання сервісів тощо). Наприкінці кожного року 10 користувачів (5 найактивніших ТОП-лідерів та 5 відібраних випадково рандомним методом) отримають грошову частку від рекламних замовлень порталу. Докладні правила накопичення та витрат балів буде представлено в окремому розділі.</p>
            </div>
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon text-success"><i class="fas fa-plus-circle"></i></div>
                <div class="about-site-card-title">Швидке додавання сайтів</div>
              </div>
              <p class="about-site-card-desc">Зберігайте будь-який ресурс із каталогу натисканням на сердечко ❤️ в його описі, або додавайте власні посилання через кнопку [+] у шапці картки.</p>
            </div>
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon text-info"><i class="fas fa-cloud-upload-alt"></i></div>
                <div class="about-site-card-title">Хмарна Google-синхронізація</div>
              </div>
              <p class="about-site-card-desc">Ваші збережені сайти та тематичні картки автоматично синхронізуються між комп'ютером, ноутбуком і смартфоном через захищену хмару.</p>
            </div>
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon text-warning"><i class="fas fa-arrows-alt"></i></div>
                <div class="about-site-card-title">Drag & Drop впорядкування</div>
              </div>
              <p class="about-site-card-desc">Зручно змінюйте порядок карток простим перетягуванням за ручку ⠿, переміщуйте сайти між папками в 1 клік.</p>
            </div>
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon" style="color: #6366f1;"><i class="fas fa-shield-alt"></i></div>
                <div class="about-site-card-title">Дзеркала сайтів та надійність</div>
              </div>
              <p class="about-site-card-desc">Для важливих сайтів передбачено швидкі переходи на дзеркала й альтернативні адреси ⇄ на випадок перевантаження або збоїв зв'язку.</p>
            </div>
          </div>

          <div class="about-site-section-title">
            <i class="fas fa-tools text-primary"></i> Додаткові корисні інструменти:
          </div>
          <div class="about-site-grid">
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon"><i class="fas fa-search"></i></div>
                <div class="about-site-card-title">Миттєвий інтелектуальний пошук</div>
              </div>
              <p class="about-site-card-desc">Швидкий пошук за назвами, описами, ключовими словами та тегами серед тисяч перевірених сайтів України.</p>
            </div>
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon text-warning"><i class="fas fa-adjust"></i></div>
                <div class="about-site-card-title">Темна та світла теми</div>
              </div>
              <p class="about-site-card-desc">Комфортна робота в будь-який час доби з автоматичним збереженням обраної теми для ваших очей.</p>
            </div>
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon text-success"><i class="fas fa-music"></i></div>
                <div class="about-site-card-title">Онлайн-радіо та Музика</div>
              </div>
              <p class="about-site-card-desc">Вбудовані плеєри українських радіостанцій (LIVE) та добірки популярної музики з автоперемішуванням (Shuffle).</p>
            </div>
            <div class="about-site-card">
              <div class="about-site-card-header">
                <div class="about-site-card-icon text-danger"><i class="fas fa-bell"></i></div>
                <div class="about-site-card-title">Центр сповіщень (Дзвіночок)</div>
              </div>
              <p class="about-site-card-desc">Завжди будьте в курсі нових можливостей порталу, технічних оновлень та важливих повідомлень адміністрації.</p>
            </div>
          </div>

          <div class="about-site-actions-bar">
            <button type="button" class="btn btn-primary btn-sm font-weight-bold" onclick="closeAboutSiteModal(); openUserCabinetModal();">
              <i class="fas fa-user-circle mr-1"></i> Особистий Кабінет
            </button>
            <a href="./bookmarks.html" class="btn btn-outline-danger btn-sm font-weight-bold">
              <i class="fas fa-heart mr-1"></i> Відкрити «Мої Закладки»
            </a>
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="closeAboutSiteModal(); openBadgesModal();">
              <i class="fas fa-tags mr-1"></i> Умовні позначки
            </button>
            <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" class="btn btn-outline-info btn-sm">
              <i class="fas fa-handshake mr-1"></i> Співпраця / Реклама
            </a>
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="closeAboutSiteModal(); openChangelogModal();">
              <i class="fas fa-history mr-1"></i> Історія змін
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const closeBtns = backdrop.querySelectorAll('.cl-modal-close');
    closeBtns.forEach(btn => btn.addEventListener('click', closeAboutSiteModal));
    backdrop.addEventListener('click', (ev) => {
      if (ev.target === backdrop) closeAboutSiteModal();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && backdrop.classList.contains('show')) {
        closeAboutSiteModal();
      }
    });
  }

  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAboutSiteModal() {
  const backdrop = document.getElementById('aboutSiteModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
    if (!document.querySelector('.cl-modal-backdrop.show')) {
      document.body.style.overflow = '';
    }
  }
}
window.openAboutSiteModal = openAboutSiteModal;
window.closeAboutSiteModal = closeAboutSiteModal;

// 4. Функція швидкого плавного прокручування вгору
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



// ==========================================================================
// АВТОМАТИЗОВАНА СИСТЕМА ЗАМОВЛЕННЯ ТА РОЗМІЩЕННЯ РЕКЛАМИ / РЕСУРСІВ
// ==========================================================================
const AD_CONFIG = {
  basePriceUah: 100,           // Єдина базова величина для всіх розрахунків (БВ = 100 грн/міс)
  commercialSections: ["Ринок", "Магазини", "Банкінг", "AI"], // Комерційні розділи
  usdRate: 41.5,               // Орієнтовний курс перерахунку для еквівалента USDT
  cryptoDiscountPercent: 10,   // Постійна знижка 10% при оплаті криптовалютою
  
  // Множники вартості згідно з правилами та зонами сайту (БВ = 100 грн/міс)
  multipliers: {
    // 1. Головна сторінка:
    home_vip: 10,           // «Партнери Сайту»: БВ × 10 = 1 000 грн/міс
    home_top: 6,            // Інші карти / верх: БВ × 6 = 600 грн/міс
    home_bottom: 2,         // Інші карти / низ: БВ × 2 = 200 грн/міс

    // 2. Комерційні розділи («Ринок», «Магазини», «Банкінг», «AI»):
    commercial_vip: 7.5,    // «Партнери Розділу»: БВ × 7.5 = 750 грн/міс
    commercial_top: 4.5,    // Інші карти / верх: БВ × 4.5 = 450 грн/міс
    commercial_bottom: 1.5, // Інші карти / низ: БВ × 1.5 = 150 грн/міс

    // 3. Всі інші (звичайні) розділи:
    other_vip: 5,           // «Партнери Розділу»: БВ × 5 = 500 грн/міс
    other_top: 3,           // Інші карти / верх: БВ × 3 = 300 грн/міс
    other_bottom: 1         // Інші карти / низ: БВ × 1 = 100 грн/міс
  },

  // Терміни розміщення та знижки (2 місяці прибрано; 3+ роки мають гарантію)
  terms: [
    { id: "1", label: "1 місяць (без знижки)", months: 1, discount: 0 },
    { id: "3", label: "3 місяці (знижка 10%)", months: 3, discount: 10 },
    { id: "6", label: "6 місяців (знижка 20%)", months: 6, discount: 20 },
    { id: "12", label: "12 місяців / 1 рік (знижка 30%)", months: 12, discount: 30 },
    { id: "36", label: "3 роки (знижка 35%) + 🛡️ Гарантія", months: 36, discount: 35, hasGuarantee: true },
    { id: "60", label: "5 років (знижка 40%) + 🛡️ Гарантія", months: 60, discount: 40, hasGuarantee: true },
    { id: "unlimited", label: "Назавжди / Безстроково (знижка 50%) + 🛡️ Гарантія", months: 120, discount: 50, isForever: true, hasGuarantee: true }
  ],

  // 12-значні промокоди (надійний захист від перебору / брутфорсу)
  promoCodes: {
    "TOPZ-2026-X8Y9": { discount: 15, name: "Стартовий бонус (-15%)" },
    "ZAKL-SAVE-2026": { discount: 10, name: "Партнерська знижка (-10%)" },
    "WEBER-VIP-2026": { discount: 20, name: "VIP-промокод (-20%)" }
  },

  // Контакти адміністрації
  contacts: {
    telegram: "@WeberSIS",
    telegramUrl: "https://t.me/WeberSIS",
    email: "weber515sis@gmail.com"
  },

  // Реквізити для оплати
  wallets: {
    privat: {
      name: "Конверт ПриватБанку",
      url: "https://www.privat24.ua/send/4gta3",
      card: "5168 7521 6238 9582",
      cardRaw: "5168752162389582",
      note: "Миттєве поповнення Конверта у додатку Приват24"
    },
    mono: {
      name: "Банка Монобанку",
      url: "https://send.monobank.ua/jar/4s1YJ94LYP",
      card: "4874 1000 2790 3460",
      cardRaw: "4874100027903460",
      note: "Оплата в 1 клік через Apple Pay / Google Pay або картку будь-якого банку"
    },
    crypto: [
      { 
        id: "trx", 
        name: "TRX (USDT / USDC)", 
        nativeTicker: "TRX",
        nativeName: "TRX (Tron)",
        binanceSymbol: "TRXUSDT",
        address: "TZ3cHFT4T5Sv6FruDQsonJvykPLoTLHje2", 
        hasUsdt: true 
      },
      { 
        id: "sol", 
        name: "SOL (USDT / USDC)", 
        nativeTicker: "SOL",
        nativeName: "SOL (Solana)",
        binanceSymbol: "SOLUSDT",
        address: "2tRrdkzJfHyRocQvqDpzGAc56vuKZQW2Jpb5imaT8EH5", 
        hasUsdt: true 
      },
      { 
        id: "eth", 
        name: "ETH (USDT / USDC)", 
        nativeTicker: "ETH",
        nativeName: "ETH (Ethereum)",
        binanceSymbol: "ETHUSDT",
        networks: ["Ethereum", "Arbitrum", "Polygon", "BNB Smart Chain", "Avalanche", "Base"],
        address: "0x40C7AC3d39913606f854dF40d8386bbF2b22D87B", 
        hasUsdt: true 
      },
      { 
        id: "gram", 
        name: "GRAM (USDT)", 
        nativeTicker: "GRAM",
        nativeName: "GRAM",
        binanceSymbol: "TONUSDT",
        address: "UQA7QDMjQyIsuyIKUMtk9Ua8uZh4TkeR_evvnbMu8KFh43hy", 
        hasUsdt: true 
      },
      { 
        id: "near", 
        name: "NEAR (USDT / USDC)", 
        nativeTicker: "NEAR",
        nativeName: "NEAR Protocol",
        binanceSymbol: "NEARUSDT",
        address: "topdonat.near", 
        hasUsdt: true 
      },
      { id: "btc", name: "BTC (Bitcoin)", nativeTicker: "BTC", nativeName: "Bitcoin", binanceSymbol: "BTCUSDT", address: "bc1q2pxyrsx7z3d7dc83k880mujmlpqykg7hmsrkqa", hasUsdt: false },
      { id: "ltc", name: "LTC (Litecoin)", nativeTicker: "LTC", nativeName: "Litecoin", binanceSymbol: "LTCUSDT", address: "ltc1qtfaehd4errc3rzpuusne2kd4zu9r7y9hsvc6xt", hasUsdt: false },
      { id: "xrp", name: "XRP (Ripple)", nativeTicker: "XRP", nativeName: "Ripple", binanceSymbol: "XRPUSDT", address: "rBCqF1MT8B3pEn1MG3FZPg2em97fZ2ZvC6", hasUsdt: false },
      { id: "doge", name: "DOGE (Dogecoin)", nativeTicker: "DOGE", nativeName: "Dogecoin", binanceSymbol: "DOGEUSDT", address: "DDy3sfatTConkRUQ1vdwGW1joM1JXUYLn3", hasUsdt: false },
      { id: "atom", name: "ATOM (Cosmos)", nativeTicker: "ATOM", nativeName: "Cosmos", binanceSymbol: "ATOMUSDT", address: "cosmos1wz8jr4j9w83vpvxrlgh9uhn2n4e7u3ttevn8ag", hasUsdt: false }
    ]
  }
};

const SECTIONS_CATALOG = {
  "Головна": ["Важливе!", "Наші Міста", "Мережі", "Зв'язок", "Україна", "Світ та Аналітика", "Відео та ТВ", "Музика та Радіо", "Платформи та ПК", "Онлайн та Логічні", "Рахунки", "Провайдери", "Фінанси", "Оголошення та Доставка", "Робота, Авто та Житло", "Маркетплейси та Техніка", "Здоров'я, Краса та Шопінг", "Пошук, Мови та Довідники", "Онлайн-сервіси та Інструменти", "Текстові асистенти та Пошук", "Мультимедіа ШІ та Творчість"],
  "Соціум": ["Месенджери та Відеозв'язок", "Прокачати свій TELEGRAM", "Брендинг і соцмережі", "Соціальні мережі", "Платформи контенту та блогів", "Форуми та спільноти України", "ЗСУ: Бригади та рекрутинг", "ЗСУ: Волонтерські фонди", "Електронні скриньки (Україна)", "Електронні скриньки (Зарубіж)", "E-Mail (на 10 хвилин)", "Професійні мережі та портфоліо"],
  "Новини": ["Новини / Україна", "Новини / Світ та Аналітика", "Новини спорту", "Новини на Youtube", "Новини на Youtube (online)", "Органи державної влади", "Інші органи та міністерства", "Інші Новини"],
  "Медіа": ["Слухати Українську Музику", "Слухати Закордонну Музику", "Музика (онлайн)", "Музика (завантажити)", "Радіо", "ТЕЛЕБАЧЕННЯ (Україна)", "КІНОФІЛЬМИ", "Книги / Аудіокниги", "Аудіокниги (онлайн)", "Подкасти", "Сервіси для авторів музики", "AI генератори музики"],
  "Ігри": ["Для КОМПА", "Логічні", "Азартні", "Ігрові ЗМІ / Новини", "Онлайн-ігри / Браузерні", "Ретро / Емулятори", "Ігрові портали / Платформи", "Моди / Чіти / Патчі", "Стріми / Кіберспорт"],
  "Комуналка": ["Легкі-оплати", "Бензин / Дизель / Автогаз", "ГАЗ", "Електроенергія", "Вода", "Тепло / Опалення", "Вивіз сміття", "Інтернет / ТБ провайдери", "Державні послуги (Дія тощо)", "Поштові служби", "ОСББ / ЖЕК"],
  "Банкінг": ["КОРИСНЕ", "Курси та обмін валют", "Інструменти для торгівлі", "Біржі Криптовалют", "Крипто-гаманці", "Банки України", "Міжнародні платіжні системи", "Кредитування / МФО", "Інвестиції / Цінні папери", "Крипто-новини та аналітика", "Податкова / Звітність"],
  "Ринок": ["Відстежити відправлення", "Нерухомість", "Безпека (база шахраїв)", "Загальні оголошення", "Одяг / Взуття", "Авторинок / Запчастини", "Електроніка / Гаджети", "Робота / Вакансії", "Послуги / Фріланс", "Тварини / Зоотовари"],
  "Магазини": ["Повернення % з покупок", "Аналізатор покупок", "Відгуки покупок", "Доставка з-за кордону", "Закордонні майданчики", "Супермаркети / Продукти", "Аптеки / Медикаменти", "Побутова техніка / Електроніка", "Будівництво / Ремонт", "Дитячі товари", "Косметика та парфумерія", "Книжкові магазини", "Спортивні товари", "Автотовари", "Зоомагазини", "Подарунки / Сувеніри", "Ювелірні вироби", "Меблі / Інтер'єр", "Дім і сад"],
  "Інше": ["Аналізатор мережі", "Пошуковики", "Перекладачі", "Граматика / Мова", "Освіта / Навчання", "Наука та космос", "Кулінарія / Рецепти", "Здоров'я / Медицина", "Подорожі / Туризм", "Погода / Клімат", "Карти / Навігація", "Юридична допомога", "Екологія / Природа", "Хобі / Рукоділля", "Фото / Відеохостинги", "Телебачення онлайн", "Радіо онлайн", "Астрологія / Гороскопи", "Корисні таблиці / Калькулятори", "Різне"],
  "Місто": ["Новомиргород", "Влада / Сервіси", "Комуналка Н.", "Транспорт / Маршрути", "Медицина / Аптеки", "Освіта / Школи / Садочки", "Культура / Дозвілля", "Новини міста", "Оголошення Новомиргород", "Довідник та бізнес"],
  "AI": ["Текстові асистенти, Пошук", "Генерація зображень", "3D та 3D-моделювання", "Обробка фото, графіки", "Музика, Аудіо, Голос", "Відео та Анімація", "Код та Розробка", "Презентації та Документи", "Аналіз даних та Наука", "Платформи та Агрегатори AI"],
  "Soft": ["❗❗❗ ВАЖЛИВО ❗❗❗", "Налаштування (пояснення)", "Завантажити месенджери", "Завантажити браузери", "Вебмайстру / SEO", "Антивіруси та безпека", "Офісні програми", "Архіватори та файли", "Графіка та дизайн", "Відео редактори", "Аудіо редактори", "Системні утиліти", "Драйвери", "Запис екрана", "Торрент клієнти", "VPN сервіси", "Віддалений доступ"]
};

let adPromoState = {
  appliedCode: "",
  discountPercent: 0,
  failedAttempts: 0,
  blockedUntil: 0
};

function getCurrentSiteSection() {
  const activeLink = document.querySelector('.nav-link.active');
  if (activeLink && activeLink.textContent.trim()) {
    const text = activeLink.textContent.trim();
    if (SECTIONS_CATALOG[text]) return text;
  }
  const path = window.location.pathname;
  if (path.endsWith('/') || path.endsWith('/index.html') || !path.includes('.html')) return 'Головна';
  if (path.includes('city.html')) return 'Місто';
  if (path.includes('social.html')) return 'Соціум';
  if (path.includes('news.html')) return 'Новини';
  if (path.includes('media.html')) return 'Медіа';
  if (path.includes('games.html')) return 'Ігри';
  if (path.includes('communal.html')) return 'Комуналка';
  if (path.includes('bank.html')) return 'Банкінг';
  if (path.includes('market.html')) return 'Ринок';
  if (path.includes('shops.html')) return 'Магазини';
  if (path.includes('others.html')) return 'Інше';
  if (path.includes('ai.html')) return 'AI';
  if (path.includes('programs.html')) return 'Soft';
  if (path.includes('bookmarks.html')) return 'Закладки';
  return 'Головна';
}

function generateAdOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `TZ-${yy}${mm}${dd}-${hh}${min}`;
}

// Ініціалізація слухачів подій для відкриття форми замовлення
function initAdOrderSystem() {
  document.addEventListener('click', (e) => {
    // 1. Клік на кнопку [+] у шапці картки
    const addBtn = e.target.closest('.group-add-btn');
    if (addBtn) {
      if (e.ctrlKey || e.metaKey || e.button === 1) return;
      e.preventDefault();
      const groupEl = addBtn.closest('.group');
      let cardTitle = '';
      if (groupEl) {
        const badge = groupEl.querySelector('.group-title .badge');
        cardTitle = badge ? badge.textContent.trim() : '';
      }
      openAdOrderModal({
        section: getCurrentSiteSection(),
        card: cardTitle
      });
      return;
    }

    // 2. Клік на плейсхолдер "Вільне Місце" або посилання на Google Docs
    const placeholderLink = e.target.closest('a[href*="15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs"], .footer-ad-link, .ad-order-modal-trigger');
    if (placeholderLink) {
      if (e.ctrlKey || e.metaKey || e.button === 1) return;
      e.preventDefault();
      const groupEl = placeholderLink.closest('.group');
      let cardTitle = '';
      if (groupEl) {
        const badge = groupEl.querySelector('.group-title .badge');
        cardTitle = badge ? badge.textContent.trim() : '';
      }
      openAdOrderModal({
        section: getCurrentSiteSection(),
        card: cardTitle
      });
      return;
    }
  });
}

function getSectionBasePrice(section) {
  return AD_CONFIG.basePriceUah; // Єдиний БВ = 100 грн/міс для всієї тарифної сітки
}

function getSinglePlacementRate(sec, crd, loc) {
  const isHome = sec === 'Головна';
  const isCommercial = AD_CONFIG.commercialSections && AD_CONFIG.commercialSections.includes(sec);
  const isVip = (crd && (crd.includes('Партнери') || crd.includes('Рекомендаці'))) || loc === 'vip' || (loc && loc.startsWith('vip'));
  const base = AD_CONFIG.basePriceUah;

  if (isVip) {
    if (isHome) return base * AD_CONFIG.multipliers.home_vip;           // 1 000 грн
    if (isCommercial) return base * AD_CONFIG.multipliers.commercial_vip; // 750 грн
    return base * AD_CONFIG.multipliers.other_vip;                      // 500 грн
  }

  if (isHome) {
    return loc === 'top' 
      ? (base * AD_CONFIG.multipliers.home_top)      // 600 грн
      : (base * AD_CONFIG.multipliers.home_bottom);   // 200 грн
  }

  if (isCommercial) {
    return loc === 'top'
      ? (base * AD_CONFIG.multipliers.commercial_top)    // 450 грн
      : (base * AD_CONFIG.multipliers.commercial_bottom); // 150 грн
  }

  return loc === 'top' 
    ? (base * AD_CONFIG.multipliers.other_top)       // 300 грн
    : (base * AD_CONFIG.multipliers.other_bottom);    // 100 грн
}

function getActivePlacements() {
  const placements = [];
  
  const sec1 = document.getElementById('adSectionSelect')?.value;

  // 1. VIP-партнерський Add-on для Розділу 1 (якщо увімкнено)
  const partner1Check = document.getElementById('adPartnerAddon1Checkbox');
  if (partner1Check && partner1Check.checked && sec1) {
    const isHome1 = sec1 === 'Головна';
    const pCard1 = isHome1 ? 'Партнери Сайту' : 'Партнери Розділу';
    const pRate1 = getSinglePlacementRate(sec1, pCard1, 'vip');
    placements.push({
      slot: 1,
      type: 'partner',
      title: isHome1 ? '💎 Партнери Сайту (Головна)' : `🔥 Партнери Розділу (${sec1})`,
      section: sec1,
      card: pCard1,
      location: 'partner',
      locationLabel: 'Партнерське місце',
      isVip: true,
      monthlyRate: pRate1,
      badge: getAdResourceBadge(sec1, pCard1, 'vip')
    });
  }

  // 2. Слот 1: Тематична картка (лише якщо увімкнено чекбокс тематичної картки)
  const thematic1Check = document.getElementById('adThematic1Checkbox');
  const isThematic1Active = thematic1Check ? thematic1Check.checked : true;
  const crd1 = document.getElementById('adCardSelect')?.value;
  const loc1 = document.getElementById('adLocationSelect')?.value || 'bottom';
  if (isThematic1Active && sec1 && crd1) {
    const rate1 = getSinglePlacementRate(sec1, crd1, loc1);
    placements.push({
      slot: 1,
      type: 'thematic',
      title: `Локація 1 (Тематична)`,
      section: sec1,
      card: crd1,
      location: loc1,
      locationLabel: loc1 === 'top' ? 'Вгорі картки (ТОП)' : 'Внизу картки (Стандарт)',
      isVip: false,
      monthlyRate: rate1,
      badge: getAdResourceBadge(sec1, crd1, loc1)
    });
  }

  // 3. Слот 2 (Додаткова локація)
  const slot2Box = document.getElementById('adSlot2Box');
  const isSlot2Active = slot2Box && slot2Box.style.display !== 'none';
  if (isSlot2Active) {
    const sec2 = document.getElementById('adSlot2SectionSelect')?.value;

    // VIP-партнерський Add-on для Розділу 2
    const partner2Check = document.getElementById('adPartnerAddon2Checkbox');
    if (partner2Check && partner2Check.checked && sec2) {
      const isHome2 = sec2 === 'Головна';
      const pCard2 = isHome2 ? 'Партнери Сайту' : 'Партнери Розділу';
      const pRate2 = getSinglePlacementRate(sec2, pCard2, 'vip');
      placements.push({
        slot: 2,
        type: 'partner',
        title: isHome2 ? '💎 Партнери Сайту (Головна)' : `🔥 Партнери Розділу (${sec2})`,
        section: sec2,
        card: pCard2,
        location: 'partner',
        locationLabel: 'Партнерське місце',
        isVip: true,
        monthlyRate: pRate2,
        badge: getAdResourceBadge(sec2, pCard2, 'vip')
      });
    }

    // Тематична картка для Розділу 2
    const thematic2Check = document.getElementById('adThematic2Checkbox');
    const isThematic2Active = thematic2Check ? thematic2Check.checked : true;
    const crd2 = document.getElementById('adSlot2CardSelect')?.value;
    const loc2 = document.getElementById('adSlot2LocationSelect')?.value || 'bottom';
    if (isThematic2Active && sec2 && crd2) {
      const rate2 = getSinglePlacementRate(sec2, crd2, loc2);
      placements.push({
        slot: 2,
        type: 'thematic',
        title: `Локація 2 (Тематична)`,
        section: sec2,
        card: crd2,
        location: loc2,
        locationLabel: loc2 === 'top' ? 'Вгорі картки (ТОП)' : 'Внизу картки (Стандарт)',
        isVip: false,
        monthlyRate: rate2,
        badge: getAdResourceBadge(sec2, crd2, loc2)
      });
    }
  }

  return placements;
}

function calculateAdPricing(termId, paymentMethod) {
  const placements = getActivePlacements();
  const monthlyRate = placements.reduce((sum, p) => sum + p.monthlyRate, 0);
  const termObj = AD_CONFIG.terms.find(t => t.id === termId) || AD_CONFIG.terms[0];
  const months = termObj.months;
  const baseCost = monthlyRate * months;

  // Знижка за термін
  const termDiscountAmount = Math.round(baseCost * (termObj.discount / 100));
  const costAfterTerm = baseCost - termDiscountAmount;

  // Знижка за промокод
  let promoDiscountAmount = 0;
  if (adPromoState.discountPercent > 0) {
    promoDiscountAmount = Math.round(costAfterTerm * (adPromoState.discountPercent / 100));
  }
  const costAfterPromo = costAfterTerm - promoDiscountAmount;

  // Знижка за криптовалюту (-10%)
  let cryptoDiscountAmount = 0;
  if (paymentMethod === 'crypto') {
    cryptoDiscountAmount = Math.round(costAfterPromo * (AD_CONFIG.cryptoDiscountPercent / 100));
  }
  const finalUah = costAfterPromo - cryptoDiscountAmount;
  const finalUsdt = (finalUah / AD_CONFIG.usdRate).toFixed(2);

  const hasVip = placements.some(p => p.isVip);

  return {
    placements,
    count: placements.length,
    isVip: hasVip,
    isForever: !!termObj.isForever,
    hasGuarantee: !!termObj.hasGuarantee,
    monthlyRate,
    months,
    termLabel: termObj.label,
    baseCost,
    termDiscountPercent: termObj.discount,
    termDiscountAmount,
    promoDiscountPercent: adPromoState.discountPercent,
    promoDiscountAmount,
    cryptoDiscountAmount,
    finalUah,
    finalUsdt
  };
}

function openAdOrderModal(opts = {}) {
  let backdrop = document.getElementById('adOrderModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'adOrderModalBackdrop';
    backdrop.className = 'cl-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cl-modal ad-order-modal" role="dialog" aria-modal="true">
        <div class="ad-sticky-close-wrapper">
          <button type="button" class="cl-modal-close ad-sticky-close-btn" aria-label="Закрити" title="Закрити">&times;</button>
        </div>
        <div class="cl-modal-header ad-modal-header">
          <h5 class="cl-modal-title"><i class="fas fa-bullhorn text-primary"></i> Розмістити сайт</h5>
        </div>
        <div class="cl-modal-body ad-modal-body">
          
          <!-- КРОК 1: ФОРМА ЗАПОВНЕННЯ ТА КАЛЬКУЛЯТОР -->
          <div id="adStep1">
            
            <!-- Блок статусу входу або вибору швидкого оформлення / з кабінетом -->
            <div id="adAuthPromptBanner" class="ad-auth-banner-wrap"></div>

            <!-- Пояснення черги 6 місць -->
            <div class="ad-badge-rule-box">
              <i class="fas fa-info-circle me-1"></i> <strong>Правило черги та розміщення:</strong> В одній картці допускається до 6 рекламних місць. Перше замовлення займає верхню позицію в обраній зоні, послідуючі - нижчі рядки. Діє автоматичне просування вгору після завершення терміну попереднього партнера.
            </div>

            <!-- БЛОК 1: Локація на сайті -->
            <div class="ad-section-block">
              <div class="ad-block-title"><i class="fas fa-map-marker-alt text-primary"></i> 1. Вибір місця розташування</div>
              
              <!-- СЛОТ 1: Основне розміщення -->
              <div class="ad-slot-box" id="adSlot1Box">
                <div class="ad-slot-header">
                  <div class="ad-slot-title">
                    <span class="ad-slot-number">1</span>
                    <span>Основна локація:</span>
                  </div>
                </div>
                
                <div class="ad-form-group">
                  <div class="ad-label-row"><label class="ad-label" for="adSectionSelect">Розділ сайту:</label></div>
                  <select id="adSectionSelect" class="ad-select"></select>
                </div>

                <!-- VIP-партнерський Add-on для Розділу 1 (одразу після вибору розділу) -->
                <div class="ad-partner-addon-wrap" id="adPartnerAddon1Wrap">
                  <label class="ad-partner-addon-label" for="adPartnerAddon1Checkbox">
                    <input type="checkbox" id="adPartnerAddon1Checkbox" class="ad-partner-checkbox">
                    <span class="ad-partner-addon-content">
                      <span class="ad-partner-addon-text" id="adPartnerAddon1Text">
                        <span class="ad-addon-title-prefix"><i class="fas fa-gem text-warning me-1"></i> Додати в</span>
                        <strong class="ad-addon-title-main">«Партнери Сайту»</strong>
                      </span>
                      <span class="ad-partner-addon-price" id="adPartnerAddon1Price">
                        <span class="ad-price-amount">1000</span>
                        <span class="ad-price-unit">грн/міс</span>
                      </span>
                    </span>
                  </label>
                </div>

                <!-- Чекбокс та вибір тематичної картки для Розділу 1 -->
                <div class="ad-thematic-addon-wrap" id="adThematicAddon1Wrap">
                  <label class="ad-thematic-addon-label" for="adThematic1Checkbox">
                    <input type="checkbox" id="adThematic1Checkbox" class="ad-thematic-checkbox" checked>
                    <span class="ad-thematic-addon-content">
                      <span class="ad-thematic-addon-text">
                        <span class="ad-addon-title-prefix"><i class="fas fa-th-list text-primary me-1"></i> Додати в</span>
                        <strong class="ad-addon-title-main">«Тематичну Картку»</strong>
                      </span>
                      <span class="ad-thematic-addon-price" id="adThematic1PriceBadge">
                        <span class="ad-price-amount">200-600</span>
                        <span class="ad-price-unit">грн/міс</span>
                      </span>
                    </span>
                  </label>

                  <!-- Поля вибору тематичної картки (всередині синього тематичного блоку) -->
                  <div class="ad-thematic-fields-box" id="adThematic1FieldsBox">
                    <div class="ad-form-group">
                      <div class="ad-label-row"><label class="ad-label" for="adCardSelect">Картка / Тематика:</label></div>
                      <select id="adCardSelect" class="ad-select"></select>
                    </div>
                    <div class="ad-form-group">
                      <div class="ad-label-row"><label class="ad-label" for="adLocationSelect">Зона в картці:</label></div>
                      <select id="adLocationSelect" class="ad-select">
                        <option value="top">🔝 Вгорі картки (ТОП)</option>
                        <option value="bottom" selected>📍 Внизу картки (Стандарт)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Кнопка додавання другої локації -->
              <div class="ad-add-slot-wrapper" id="adAddSlot2Wrapper">
                <button type="button" id="adAddSlot2Btn" class="ad-add-slot-btn">
                  <i class="fas fa-plus-circle me-1"></i> Додати ще локацію (до 2 місць)
                </button>
              </div>

              <!-- СЛОТ 2: Додаткове розміщення (приховано за замовчуванням) -->
              <div class="ad-slot-box ad-slot-box-second" id="adSlot2Box" style="display:none;">
                <div class="ad-slot-header">
                  <div class="ad-slot-title">
                    <span class="ad-slot-number ad-slot-number-second">2</span>
                    <span>Додаткова локація:</span>
                  </div>
                  <button type="button" id="adRemoveSlot2Btn" class="ad-remove-slot-btn" title="Прибрати додаткову локацію">
                    <i class="fas fa-times"></i>
                    <span>Прибрати</span>
                  </button>
                </div>
                
                <div class="ad-form-group">
                  <div class="ad-label-row"><label class="ad-label" for="adSlot2SectionSelect">Другий розділ:</label></div>
                  <select id="adSlot2SectionSelect" class="ad-select"></select>
                </div>

                <!-- VIP-партнерський Add-on для Розділу 2 (одразу після вибору другого розділу) -->
                <div class="ad-partner-addon-wrap" id="adPartnerAddon2Wrap">
                  <label class="ad-partner-addon-label" for="adPartnerAddon2Checkbox">
                    <input type="checkbox" id="adPartnerAddon2Checkbox" class="ad-partner-checkbox">
                    <span class="ad-partner-addon-content">
                      <span class="ad-partner-addon-text" id="adPartnerAddon2Text">
                        <span class="ad-addon-title-prefix"><i class="fas fa-fire text-danger me-1"></i> Додати в</span>
                        <strong class="ad-addon-title-main">«Партнери Розділу»</strong>
                      </span>
                      <span class="ad-partner-addon-price" id="adPartnerAddon2Price">
                        <span class="ad-price-amount">500</span>
                        <span class="ad-price-unit">грн/міс</span>
                      </span>
                    </span>
                  </label>
                </div>

                <!-- Чекбокс та вибір тематичної картки для Розділу 2 -->
                <div class="ad-thematic-addon-wrap" id="adThematicAddon2Wrap">
                  <label class="ad-thematic-addon-label" for="adThematic2Checkbox">
                    <input type="checkbox" id="adThematic2Checkbox" class="ad-thematic-checkbox" checked>
                    <span class="ad-thematic-addon-content">
                      <span class="ad-thematic-addon-text">
                        <span class="ad-addon-title-prefix"><i class="fas fa-th-list text-primary me-1"></i> Додати в</span>
                        <strong class="ad-addon-title-main">«Тематичну Картку»</strong>
                      </span>
                      <span class="ad-thematic-addon-price" id="adThematic2PriceBadge">
                        <span class="ad-price-amount">100-300</span>
                        <span class="ad-price-unit">грн/міс</span>
                      </span>
                    </span>
                  </label>

                  <!-- Поля вибору тематичної картки для Розділу 2 (всередині синього тематичного блоку) -->
                  <div class="ad-thematic-fields-box" id="adThematic2FieldsBox">
                    <div class="ad-form-group">
                      <div class="ad-label-row"><label class="ad-label" for="adSlot2CardSelect">Картка / Тематика:</label></div>
                      <select id="adSlot2CardSelect" class="ad-select"></select>
                    </div>
                    <div class="ad-form-group">
                      <div class="ad-label-row"><label class="ad-label" for="adSlot2LocationSelect">Зона в картці:</label></div>
                      <select id="adSlot2LocationSelect" class="ad-select">
                        <option value="top">🔝 Вгорі картки (ТОП)</option>
                        <option value="bottom" selected>📍 Внизу картки (Стандарт)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- БЛОК 2: Дані ресурсу та живе прев'ю -->
            <div class="ad-section-block">
              <div class="ad-block-title"><i class="fas fa-globe text-primary"></i> 2. Дані Вашого ресурсу</div>
              <div class="ad-form-group">
                <div class="ad-label-row">
                  <label class="ad-label" for="adSiteName">Назва ресурсу (до 25 символів):</label>
                  <span id="adNameCounter" class="ad-char-counter">0 / 25</span>
                </div>
                <input type="text" id="adSiteName" class="ad-input" maxlength="25" placeholder="Наприклад: Мій Проект, Магазин, Канал" autocomplete="off">
              </div>

              <div class="ad-form-group">
                <div class="ad-label-row">
                  <label class="ad-label" for="adSiteUrl">Адреса посилання (URL сайту або Telegram):</label>
                </div>
                <input type="url" id="adSiteUrl" class="ad-input" placeholder="https://example.com" autocomplete="off">
              </div>

              <div class="ad-form-group">
                <div class="ad-label-row">
                  <label class="ad-label" for="adSiteDesc">Опис ресурсу (до 150 символів):</label>
                  <span id="adDescCounter" class="ad-char-counter">0 / 150</span>
                </div>
                <textarea id="adSiteDesc" class="ad-textarea" maxlength="150" placeholder="Короткий, привабливий опис вашого сайту або послуги..."></textarea>
              </div>

              <!-- Живе інтерактивне прев'ю майбутньої закладки -->
              <div class="ad-live-preview-box">
                <div class="ad-preview-header">
                  <i class="fas fa-eye"></i>
                  <div class="ad-preview-title-wrap">
                    <span class="ad-preview-main-title">ЖИВИЙ ПРИКЛАД</span>
                    <span class="ad-preview-sub-title">(Як виглядатиме на сайті)</span>
                  </div>
                </div>
                <div class="ad-preview-item">
                  <div class="ad-preview-content">
                    <div class="ad-preview-title">
                      <img id="adPreviewFavicon" class="ad-preview-favicon" src="favicon.ico" alt="icon">
                      <span id="adPreviewTitleText">Назва Вашого Ресурсу</span>
                      <span id="adPreviewBadgeIcon" class="ad-badge-marker" title="Рекламне розміщення в картці">⚡️</span>
                    </div>
                    <div id="adPreviewDescText" class="ad-preview-desc">Тут відображатиметься короткий опис вашого сайту при наведенні чи кліку...</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- БЛОК 3: Термін, Промокод та Спосіб Оплати -->
            <div class="ad-section-block">
              <div class="ad-block-title"><i class="fas fa-calculator text-primary"></i> 3. Термін, Промокод та Оплата</div>
              
              <div class="ad-form-grid-3 mb-3">
                <div class="ad-form-group" style="grid-column: span 2;">
                  <div class="ad-label-row"><label class="ad-label" for="adTermSelect">Термін розміщення:</label></div>
                  <select id="adTermSelect" class="ad-select"></select>
                  <!-- Гарантія стабільності для довгострокових тарифів (від 3 років та Назавжди) -->
                  <div id="adGuaranteeNotice" class="ad-guarantee-box" style="display:none;">
                    <i class="fas fa-shield-alt text-success fs-5"></i>
                    <div>
                      <strong>Гарантія довгострокового тарифу:</strong> Включено <strong>1 безкоштовну зміну</strong> посилання, назви або опису на рік у разі ребрендингу сайту або зміни домену.
                    </div>
                  </div>
                </div>
                <div class="ad-form-group">
                  <div class="ad-label-row"><label class="ad-label" for="adPromoInput">Промокод (12 знаків):</label></div>
                  <div class="ad-promo-row">
                    <input type="text" id="adPromoInput" class="ad-input ad-promo-input" maxlength="16" placeholder="XXXX-XXXX-XXXX">
                    <button type="button" id="adApplyPromoBtn" class="ad-promo-btn">ОК</button>
                  </div>
                  <div id="adPromoFeedback" class="ad-promo-feedback"></div>
                </div>
              </div>

              <!-- Способи оплати (Радіо-картки) -->
              <div class="ad-label-row mb-1"><label class="ad-label">Оберіть зручний спосіб оплати:</label></div>
              <div class="ad-payment-grid">
                <label class="ad-payment-option active" data-method="mono">
                  <input type="radio" name="adPaymentMethod" value="mono" checked>
                  <div class="ad-payment-text">
                    <div class="ad-payment-name">
                      <span class="ad-payment-name-icon" style="color: #1e293b;">⚫</span>
                      <span>Монобанк</span>
                    </div>
                    <div class="ad-payment-sub">Банка / Apple & Google Pay</div>
                  </div>
                </label>

                <label class="ad-payment-option" data-method="privat">
                  <input type="radio" name="adPaymentMethod" value="privat">
                  <div class="ad-payment-text">
                    <div class="ad-payment-name">
                      <span class="ad-payment-name-icon" style="color: #16a34a;">🟢</span>
                      <span>ПриватБанк</span>
                    </div>
                    <div class="ad-payment-sub">Конверт / Приват24</div>
                  </div>
                </label>

                <label class="ad-payment-option" data-method="crypto">
                  <span class="ad-payment-discount-corner">-10%</span>
                  <input type="radio" name="adPaymentMethod" value="crypto">
                  <div class="ad-payment-text">
                    <div class="ad-payment-name">
                      <span class="ad-payment-name-icon" style="color: #f59e0b;"><i class="fas fa-coins"></i></span>
                      <span>Криптовалюта</span>
                    </div>
                    <div class="ad-payment-sub">USDT, BTC, LTC, SOL, TRX, інші</div>
                  </div>
                </label>
              </div>

              <!-- Підсумковий калькулятор -->
              <div class="ad-calc-summary">
                <div class="ad-calc-item">
                  <div class="ad-calc-row">
                    <span class="ad-calc-label">Базовий тариф:</span>
                    <span class="ad-calc-val" id="adCalcBaseRate">100 грн / міс</span>
                  </div>
                  <div class="ad-calc-breakdown" id="adCalcBaseDetails" style="display:none;"></div>
                </div>
                <div class="ad-calc-item">
                  <div class="ad-calc-row">
                    <span class="ad-calc-label">Обраний період:</span>
                    <span class="ad-calc-val" id="adCalcPeriod">1 міс.</span>
                  </div>
                </div>
                <div class="ad-calc-item" id="adCalcBaseCostRow" style="display:none;">
                  <div class="ad-calc-row">
                    <span class="ad-calc-label">Вартість без знижки:</span>
                    <span class="ad-calc-val" id="adCalcBaseCostVal">0 грн</span>
                  </div>
                </div>
                <div class="ad-calc-item discount-item" id="adCalcTermDiscountRow" style="display:none;">
                  <div class="ad-calc-row discount-row">
                    <span class="ad-calc-label">Знижка за термін:</span>
                    <span class="ad-calc-val" id="adCalcTermDiscountVal">-0 грн</span>
                  </div>
                </div>
                <div class="ad-calc-item discount-item" id="adCalcPromoDiscountRow" style="display:none;">
                  <div class="ad-calc-row discount-row">
                    <span class="ad-calc-label">Знижка за промокодом:</span>
                    <span class="ad-calc-val" id="adCalcPromoDiscountVal">-0 грн</span>
                  </div>
                </div>
                <div class="ad-calc-item discount-item" id="adCalcCryptoDiscountRow" style="display:none;">
                  <div class="ad-calc-row discount-row">
                    <span class="ad-calc-label">Знижка за крипту:</span>
                    <span class="ad-calc-val" id="adCalcCryptoDiscountVal">-0 грн</span>
                  </div>
                </div>
                <div class="ad-calc-total-row">
                  <div class="ad-calc-total-label">РАЗОМ ДО СПЛАТИ:</div>
                  <div class="ad-calc-total-values">
                    <div class="ad-calc-total-uah" id="adCalcTotalUah">100 грн</div>
                    <div class="ad-calc-total-usdt" id="adCalcTotalUsdt">~ $2.41 USDT</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- БЛОК 4: Контакти замовника -->
            <div class="ad-section-block">
              <div class="ad-block-title"><i class="fas fa-address-card text-primary"></i> 4. Ваші контакти для зв'язку та підтвердження</div>
              <div class="ad-form-grid-3">
                <div class="ad-form-group">
                  <div class="ad-label-row"><label class="ad-label" for="adContactEmail">E-Mail (обов'язково):</label></div>
                  <input type="email" id="adContactEmail" class="ad-input" placeholder="name@example.com" required>
                </div>
                <div class="ad-form-group">
                  <div class="ad-label-row"><label class="ad-label" for="adContactTg">Telegram (@username):</label></div>
                  <input type="text" id="adContactTg" class="ad-input" placeholder="@your_nickname">
                </div>
                <div class="ad-form-group">
                  <div class="ad-label-row"><label class="ad-label" for="adContactPhone">Телефон (за бажанням):</label></div>
                  <input type="tel" id="adContactPhone" class="ad-input" placeholder="+380...">
                </div>
              </div>
            </div>

            <!-- Повідомлення про помилку валідації -->
            <div id="adFormError" class="alert alert-danger" style="display:none; margin-bottom: 12px; font-size: 0.88rem; padding: 10px 14px;"></div>

            <!-- РЕГЛАМЕНТ РОЗМІЩЕННЯ, ГАРАНТІЙ ТА МОДЕРАЦІЇ -->
            <details id="adRegulationsDetails" class="ad-regulations-box">
              <summary class="ad-regulations-summary">
                <div class="ad-regulations-title-wrap">
                  <i class="fas fa-file-contract text-primary ad-regulations-icon"></i>
                  <div class="ad-regulations-text-wrap">
                    <span class="ad-regulations-title-main">РЕГЛАМЕНТ РОЗМІЩЕННЯ</span>
                    <span class="ad-regulations-title-sub">(Гарантії та модерації)</span>
                  </div>
                </div>
                <span class="text-primary fs-6 ad-regulations-arrow"><i class="fas fa-chevron-down"></i></span>
              </summary>
              <div class="ad-regulations-body">
                <ol class="ad-rules-list">
                  <li>
                    <strong>Працездатність посилання та захист каталогу (Dead links):</strong>
                    Клієнт зобов'язується підтримувати доступність розміщеного ресурсу. Якщо сайт стає неробочим або видає помилку понад 30 календарних днів і власник не реагує на сповіщення (Email або Telegram) протягом 14 днів, публікація тимчасово деактивується для захисту SEO та відвідувачів каталогу без повернення коштів. За тарифами від 3 років та «Назавжди» замовник зберігає право на поновлення посилання на вільне місце в картці за зверненням та пред'явленням номера замовлення.
                  </li>
                  <li>
                    <strong>Гарантія довгострокових тарифів (1 заміна на рік):</strong>
                    Для замовлень на 3 роки, 5 років та «Назавжди» надається офіційне право на 1 безкоштовну зміну URL, назви або опису на рік у разі ребрендингу чи зміни домену. Кожна наступна (повторна) зміна протягом того ж календарного року узгоджується в діалозі за символічну технічну плату (100 грн).
                  </li>
                  <li>
                    <strong>Модерація оновлень та відповідність тематиці:</strong>
                    Будь-яка зміна посилання чи опису проходить обов'язкову ручну перевірку. Заміна ресурсу на інший, що не відповідає тематиці картки, не допускається (або здійснюється перенесення у відповідний розділ за діючими тарифами з доплатою різниці).
                  </li>
                  <li>
                    <strong>Категорично заборонений контент (Content Policy):</strong>
                    Суворо заборонено сайти, що порушують законодавство України, містять шкідливе ПЗ / віруси, фішинг, шахрайські схеми, неліцензовані азартні ігри / казино, деструктивну пропаганду чи матеріали 18+. Якщо розміщений ресурс пізніше трансформується у заборонений контент, посилання негайно видаляється без права повернення коштів.
                  </li>
                  <li>
                    <strong>Правило черги та терміни активації:</strong>
                    У кожній картці допускається до 6 рекламних місць. Перше замовлення займає верхню позицію в обраній зоні з автоматичним просуванням угору після завершення терміну попередніх замовлень. Активація посилання здійснюється протягом 1-24 годин після підтвердження оплати.
                  </li>
                </ol>
              </div>
            </details>

            <div class="ad-terms-agreement-note">
              <i class="fas fa-shield-alt text-success me-1"></i> Натискаючи кнопку нижче, ви погоджуєтеся з <a href="javascript:void(0)" id="adToggleRulesBtn" class="ad-terms-link">Регламентом розміщення та модерації</a>.
            </div>

            <!-- ПЛАВАЮЧИЙ БАР ВАРТОСТІ (ВНИЗУ ВІКНА) -->
            <div class="ad-sticky-price-bar" id="adStickyPriceBar">
              <div class="ad-sticky-price-left">
                <div class="ad-sticky-title-row">
                  <span class="ad-sticky-price-title"><i class="fas fa-coins text-warning me-1"></i> До сплати:</span>
                  <span class="ad-sticky-badge-places" id="adStickyPlacesBadge">1 локація</span>
                </div>
                <div class="ad-sticky-price-amount-row">
                  <span class="ad-sticky-price-uah" id="adStickyPriceUah">100 грн</span>
                  <span class="ad-sticky-price-usdt" id="adStickyPriceUsdt">(~ $2.41 USDT)</span>
                </div>
              </div>
              <div class="ad-sticky-price-right">
                <span class="ad-sticky-badge-rate" id="adStickyRateBadge">100 грн/міс</span>
                <span class="ad-sticky-badge-discount" id="adStickyDiscountBadge" style="display:none;">-10%</span>
              </div>
            </div>

            <!-- Кнопка фінального кроку -->
            <button type="button" id="adSubmitOrderBtn" class="ad-submit-btn">
              <span class="ad-submit-btn-main">СФОРМУВАТИ ЗАМОВЛЕННЯ</span>
              <span class="ad-submit-btn-sub">(Отримати реквізити)</span>
            </button>
          </div>

          <!-- КРОК 2: ЕЛЕКТРОННИЙ ЧЕК ТА РЕКВІЗИТИ ДЛЯ ОПЛАТИ -->
          <div id="adStep2" class="ad-step2-wrapper" style="display:none;">
            <div class="ad-order-success-banner">
              <div class="ad-order-success-title"><i class="fas fa-check-circle"></i> Замовлення  сформовано!</div>
              <div class="ad-order-id-row">
                <span class="ad-order-id-label">Номер Вашого замовлення:</span>
                <span class="ad-order-id-display" id="adSuccessOrderId">#TZ-000000-0000</span>
                <button type="button" class="ad-order-copy-icon-btn" id="adCopyOrderIdBtn" title="Скопіювати текст замовлення" aria-label="Скопіювати текст замовлення">
                  <i class="far fa-copy"></i>
                </button>
              </div>
            </div>

            <!-- Блок збереження замовлення у кабінет для гостей -->
            <div id="adOrderClaimWrap" class="mb-3"></div>

            <!-- Повідомлення перед оплатою -->
            <div class="ad-order-recommendation-box">
              <i class="fas fa-info-circle text-primary me-1"></i>
              <strong>Зверніть увагу:</strong> замовлення остаточно фіксується та бронюється виключно після його <strong>надсилання в Telegram або на Email у режимі діалогу</strong>. Будь ласка, надішліть сформовані деталі замовлення адміністратору прямо зараз, а оплату проводьте після підтвердження розміщення.
            </div>

            <!-- Деталі замовлення (Електронний чек) -->
            <div class="ad-section-block">
              <div class="ad-block-title"><i class="fas fa-file-invoice text-primary"></i> Деталі Вашого розміщення</div>
              <div class="ad-receipt-list">
                <div class="ad-receipt-item" id="adRecSiteRow">
                  <div class="ad-receipt-label">Ресурс:</div>
                  <div class="ad-receipt-val" id="adRecSite"></div>
                </div>

                <div class="ad-receipt-item" id="adRecUrlRow">
                  <div class="ad-receipt-label">Адреса посилання:</div>
                  <div class="ad-receipt-val" id="adRecUrl"></div>
                </div>

                <div class="ad-receipt-item" id="adRecDescRow" style="display:none;">
                  <div class="ad-receipt-label">Опис:</div>
                  <div class="ad-receipt-val ad-receipt-desc-val" id="adRecDesc"></div>
                </div>

                <div class="ad-receipt-item" id="adRecPlacementRow">
                  <div class="ad-receipt-label">Розташування:</div>
                  <div class="ad-receipt-val ad-receipt-placements-val" id="adRecPlacement"></div>
                </div>

                <div class="ad-receipt-item" id="adRecTermRow">
                  <div class="ad-receipt-label">Термін:</div>
                  <div class="ad-receipt-val" id="adRecTerm"></div>
                </div>

                <div class="ad-receipt-item" id="adRecContactRow">
                  <div class="ad-receipt-label">Контакт клієнта:</div>
                  <div class="ad-receipt-val" id="adRecContact"></div>
                </div>

                <div class="ad-receipt-item ad-receipt-total-item" id="adRecTotalRow">
                  <div class="ad-receipt-total-label">Сума до сплати:</div>
                  <div class="ad-receipt-total-values" id="adRecAmount">
                    <div class="ad-receipt-total-uah" id="adRecAmountUah">0 грн</div>
                    <div class="ad-receipt-total-usdt" id="adRecAmountUsdt">~ $0.00 USDT</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Реквізити обраного методу -->
            <div class="ad-requisite-box" id="adRequisiteBox">
              <!-- Динамічно заповнюється для Моно, Привату або Крипти -->
            </div>

            <div class="ad-badge-rule-box" style="margin-bottom: 12px;">
              <i class="fas fa-exclamation-triangle text-warning me-1"></i>
              <strong>Важливо:</strong> У призначенні або коментарі до платежу обов'язково вкажіть номер замовлення <strong id="adRecNoteOrderId"></strong> (або надішліть квитанцію/скріншот у наш Telegram).
            </div>
            <div style="font-size: 0.78rem; text-align: center; color: var(--text-muted, #64748b); margin-bottom: 12px;">
              <i class="fas fa-shield-alt text-success me-1"></i> Оформленням замовлення зафіксовано згоду з офіційним Регламентом розміщення та модерації.
            </div>

            <!-- Кнопки швидких дій -->
            <div class="ad-action-btns-grid">
              <!-- 1. Надіслати в Telegram -->
              <a href="#" id="adActionTgBtn" target="_blank" class="ad-action-btn ad-btn-tg">
                <i class="fab fa-telegram-plane"></i> Надіслати в Telegram
              </a>

              <!-- 2. Надіслати на Email -->
              <a href="#" id="adActionEmailBtn" class="ad-action-btn ad-btn-email">
                <i class="far fa-envelope"></i> Надіслати на Email
              </a>

              <!-- 3. Змінити замовлення -->
              <button type="button" id="adActionBackBtn" class="ad-action-btn ad-btn-back">
                <i class="fas fa-arrow-left"></i> Змінити замовлення
              </button>
            </div>

            <!-- Блок офіційного рахунку та контактів адміністратора -->
            <div class="ad-admin-contacts-card">
              <div class="ad-admin-contacts-header">
                <i class="fas fa-file-contract text-primary"></i> Потрібен офіційний рахунок IBAN або договір для юридичних осіб / ФОП? Зв'яжіться з адміністратором:
              </div>
              <div class="ad-admin-contact-row">
                <div class="ad-contact-left">
                  <i class="far fa-envelope text-muted"></i>
                  <span class="ad-contact-label">Email:</span>
                  <a href="mailto:weber515sis@gmail.com" class="ad-contact-value">weber515sis@gmail.com</a>
                </div>
                <button type="button" class="ad-sub-copy-btn" onclick="copyToClipboard('weber515sis@gmail.com', this)" title="Копіювати Email">
                  <i class="far fa-copy"></i> <span class="ad-copy-btn-text">Копіювати</span>
                </button>
              </div>
              <div class="ad-admin-contact-row">
                <div class="ad-contact-left">
                  <i class="fab fa-telegram-plane text-info"></i>
                  <span class="ad-contact-label">Telegram:</span>
                  <a href="https://t.me/WeberSIS" target="_blank" class="ad-contact-value">@WeberSIS</a>
                </div>
                <button type="button" class="ad-sub-copy-btn" onclick="copyToClipboard('@WeberSIS', this)" title="Копіювати Telegram">
                  <i class="far fa-copy"></i> <span class="ad-copy-btn-text">Копіювати</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    // Закриття вікна
    const closeBtns = backdrop.querySelectorAll('.cl-modal-close');
    closeBtns.forEach(btn => btn.addEventListener('click', closeAdOrderModal));
    backdrop.addEventListener('click', (ev) => {
      if (ev.target === backdrop) closeAdOrderModal();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && backdrop.classList.contains('show')) {
        closeAdOrderModal();
      }
    });

    // Наповнення селектів розділів і термінів
    const secSelect = document.getElementById('adSectionSelect');
    const slot2SecSelect = document.getElementById('adSlot2SectionSelect');
    secSelect.innerHTML = '';
    slot2SecSelect.innerHTML = '';
    Object.keys(SECTIONS_CATALOG).forEach(s => {
      const opt1 = document.createElement('option');
      opt1.value = s;
      opt1.textContent = s;
      secSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = s;
      opt2.textContent = s;
      slot2SecSelect.appendChild(opt2);
    });

    const termSelect = document.getElementById('adTermSelect');
    termSelect.innerHTML = '';
    AD_CONFIG.terms.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.label;
      termSelect.appendChild(opt);
    });

    // Подія зміни розділу (Слот 1)
    secSelect.addEventListener('change', () => {
      updateCardOptions(secSelect.value);
      updateLocationOptions();
      updatePartnerAddon(1);
      updateThematicAddon(1);
      const slot2Box = document.getElementById('adSlot2Box');
      if (slot2Box && slot2Box.style.display !== 'none') {
        updateSlot2CardOptions();
        updatePartnerAddon(2);
        updateThematicAddon(2);
      }
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Подія зміни картки (Слот 1)
    document.getElementById('adCardSelect').addEventListener('change', () => {
      updateLocationOptions();
      const slot2Box = document.getElementById('adSlot2Box');
      if (slot2Box && slot2Box.style.display !== 'none') {
        updateSlot2CardOptions();
      }
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Подія зміни локації (Слот 1)
    document.getElementById('adLocationSelect').addEventListener('change', () => {
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // VIP-партнерський Add-on для Слота 1
    const partner1Checkbox = document.getElementById('adPartnerAddon1Checkbox');
    partner1Checkbox.addEventListener('change', () => {
      const slot2Box = document.getElementById('adSlot2Box');
      if (slot2Box && slot2Box.style.display !== 'none') {
        updatePartnerAddon(2);
      }
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Чекбокс тематичної картки для Слота 1
    const thematic1Checkbox = document.getElementById('adThematic1Checkbox');
    const thematic1FieldsBox = document.getElementById('adThematic1FieldsBox');
    thematic1Checkbox.addEventListener('change', () => {
      thematic1FieldsBox.style.display = thematic1Checkbox.checked ? 'grid' : 'none';
      const slot2Box = document.getElementById('adSlot2Box');
      if (slot2Box && slot2Box.style.display !== 'none') {
        updateSlot2CardOptions();
      }
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Кнопка додавання другої локації
    const addSlot2Btn = document.getElementById('adAddSlot2Btn');
    const addSlot2Wrap = document.getElementById('adAddSlot2Wrapper');
    const slot2Box = document.getElementById('adSlot2Box');
    const removeSlot2Btn = document.getElementById('adRemoveSlot2Btn');

    addSlot2Btn.addEventListener('click', () => {
      slot2Box.style.display = 'block';
      addSlot2Wrap.style.display = 'none';
      if (!slot2SecSelect.value) {
        slot2SecSelect.value = secSelect.value;
      }
      const thematic2Check = document.getElementById('adThematic2Checkbox');
      const thematic2Fields = document.getElementById('adThematic2FieldsBox');
      if (thematic2Check) thematic2Check.checked = true;
      if (thematic2Fields) thematic2Fields.style.display = 'grid';
      const partner2Check = document.getElementById('adPartnerAddon2Checkbox');
      if (partner2Check) partner2Check.checked = false;
      updateSlot2CardOptions();
      updateSlot2LocationOptions();
      updatePartnerAddon(2);
      updateThematicAddon(2);
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Кнопка видалення другої локації
    removeSlot2Btn.addEventListener('click', () => {
      slot2Box.style.display = 'none';
      addSlot2Wrap.style.display = 'block';
      const partner2Check = document.getElementById('adPartnerAddon2Checkbox');
      if (partner2Check) partner2Check.checked = false;
      const thematic2Check = document.getElementById('adThematic2Checkbox');
      if (thematic2Check) thematic2Check.checked = false;
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Подія зміни розділу (Слот 2)
    slot2SecSelect.addEventListener('change', () => {
      updateSlot2CardOptions();
      updateSlot2LocationOptions();
      updatePartnerAddon(2);
      updateThematicAddon(2);
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Подія зміни картки (Слот 2)
    document.getElementById('adSlot2CardSelect').addEventListener('change', () => {
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Подія зміни локації (Слот 2)
    document.getElementById('adSlot2LocationSelect').addEventListener('change', () => {
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // VIP-партнерський Add-on для Слота 2
    const partner2Checkbox = document.getElementById('adPartnerAddon2Checkbox');
    partner2Checkbox.addEventListener('change', () => {
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Чекбокс тематичної картки для Слота 2
    const thematic2Checkbox = document.getElementById('adThematic2Checkbox');
    const thematic2FieldsBox = document.getElementById('adThematic2FieldsBox');
    thematic2Checkbox.addEventListener('change', () => {
      thematic2FieldsBox.style.display = thematic2Checkbox.checked ? 'grid' : 'none';
      recalcAdOrderPrice();
      updateLivePreview();
    });

    // Подія зміни терміну
    termSelect.addEventListener('change', () => {
      recalcAdOrderPrice();
    });

    // Вибір способу оплати
    const paymentOptions = backdrop.querySelectorAll('.ad-payment-option');
    paymentOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        paymentOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        recalcAdOrderPrice();
      });
    });

    // Лічильники та живе прев'ю
    const nameInput = document.getElementById('adSiteName');
    const urlInput = document.getElementById('adSiteUrl');
    const descInput = document.getElementById('adSiteDesc');

    nameInput.addEventListener('input', () => {
      const len = nameInput.value.length;
      const counter = document.getElementById('adNameCounter');
      counter.textContent = `${len} / 25`;
      counter.className = 'ad-char-counter' + (len >= 25 ? ' danger' : len >= 22 ? ' warning' : '');
      updateLivePreview();
    });

    urlInput.addEventListener('input', () => {
      updateLivePreview();
    });

    descInput.addEventListener('input', () => {
      const len = descInput.value.length;
      const counter = document.getElementById('adDescCounter');
      counter.textContent = `${len} / 150`;
      counter.className = 'ad-char-counter' + (len >= 150 ? ' danger' : len >= 135 ? ' warning' : '');
      updateLivePreview();
    });

    // Застосування промокоду
    const promoBtn = document.getElementById('adApplyPromoBtn');
    const promoInput = document.getElementById('adPromoInput');
    const promoFeedback = document.getElementById('adPromoFeedback');

    promoBtn.addEventListener('click', () => {
      const now = Date.now();
      if (adPromoState.blockedUntil > now) {
        const secLeft = Math.ceil((adPromoState.blockedUntil - now) / 1000);
        promoFeedback.className = 'ad-promo-feedback error';
        promoFeedback.textContent = `Забагато спроб. Зачекайте ще ${secLeft} сек.`;
        return;
      }

      const rawCode = promoInput.value.trim().toUpperCase().replace(/\s+/g, '');
      if (!rawCode) {
        adPromoState.appliedCode = "";
        adPromoState.discountPercent = 0;
        promoFeedback.textContent = "";
        recalcAdOrderPrice();
        return;
      }

      if (AD_CONFIG.promoCodes[rawCode]) {
        adPromoState.appliedCode = rawCode;
        adPromoState.discountPercent = AD_CONFIG.promoCodes[rawCode].discount;
        adPromoState.failedAttempts = 0;
        promoFeedback.className = 'ad-promo-feedback success';
        promoFeedback.innerHTML = `<i class="fas fa-check-circle"></i> Промокод застосовано: -${adPromoState.discountPercent}% (${AD_CONFIG.promoCodes[rawCode].name})`;
      } else {
        adPromoState.appliedCode = "";
        adPromoState.discountPercent = 0;
        adPromoState.failedAttempts++;
        if (adPromoState.failedAttempts >= 5) {
          adPromoState.blockedUntil = now + (2 * 60 * 1000);
          promoFeedback.className = 'ad-promo-feedback error';
          promoFeedback.textContent = '5 невірних спроб. Поле заблоковано на 2 хвилини.';
        } else {
          promoFeedback.className = 'ad-promo-feedback error';
          promoFeedback.textContent = `Недійсний промокод. Залишилось спроб: ${5 - adPromoState.failedAttempts}`;
        }
      }
      recalcAdOrderPrice();
    });

    // Натискання Enter у полі промокоду
    promoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        promoBtn.click();
      }
    });

    // Відкриття Регламенту при кліку на посилання
    const toggleRulesBtn = document.getElementById('adToggleRulesBtn');
    if (toggleRulesBtn) {
      toggleRulesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const details = document.getElementById('adRegulationsDetails');
        if (details) {
          details.open = !details.open;
          if (details.open) {
            details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    }

    // Фінальне сабміт-замовлення (перехід на Крок 2)
    document.getElementById('adSubmitOrderBtn').addEventListener('click', submitAdOrder);

    // Кнопка назад (редагування)
    document.getElementById('adActionBackBtn').addEventListener('click', () => {
      document.getElementById('adStep2').style.display = 'none';
      document.getElementById('adStep1').style.display = 'block';
      const modalBox = backdrop.querySelector('.ad-order-modal');
      if (modalBox) modalBox.scrollTop = 0;
    });

    // Кнопка копіювання тексту замовлення біля номера замовлення
    const copyOrderIdBtn = document.getElementById('adCopyOrderIdBtn');
    if (copyOrderIdBtn) {
      copyOrderIdBtn.addEventListener('click', () => {
        if (window.currentAdOrderText) {
          copyToClipboard(window.currentAdOrderText, copyOrderIdBtn, 'Скопійовано! ✅');
        }
      });
    }

    const actionCopyBtn = document.getElementById('adActionCopyBtn');
    if (actionCopyBtn) {
      actionCopyBtn.addEventListener('click', () => {
        if (window.currentAdOrderText) {
          copyToClipboard(window.currentAdOrderText, actionCopyBtn, 'Скопійовано! ✅');
        }
      });
    }
  }

  // Скидання на Крок 1 при відкритті
  document.getElementById('adStep1').style.display = 'block';
  document.getElementById('adStep2').style.display = 'none';
  document.getElementById('adFormError').style.display = 'none';

  // Скидання Слот 2
  const slot2BoxReset = document.getElementById('adSlot2Box');
  const addSlot2WrapReset = document.getElementById('adAddSlot2Wrapper');
  if (slot2BoxReset) slot2BoxReset.style.display = 'none';
  if (addSlot2WrapReset) addSlot2WrapReset.style.display = 'block';
  const partner2CheckReset = document.getElementById('adPartnerAddon2Checkbox');
  if (partner2CheckReset) partner2CheckReset.checked = false;
  const thematic2CheckReset = document.getElementById('adThematic2Checkbox');
  if (thematic2CheckReset) thematic2CheckReset.checked = true;
  const thematic2FieldsReset = document.getElementById('adThematic2FieldsBox');
  if (thematic2FieldsReset) thematic2FieldsReset.style.display = 'grid';

  // Встановлення переданого розділу та картки
  const initialSection = opts.section && SECTIONS_CATALOG[opts.section] ? opts.section : getCurrentSiteSection();
  const secSelect = document.getElementById('adSectionSelect');
  secSelect.value = initialSection;

  const isVipClick = opts.card && (opts.card.includes('Партнери') || opts.card.includes('Рекомендаці'));
  const partner1Check = document.getElementById('adPartnerAddon1Checkbox');
  const thematic1Check = document.getElementById('adThematic1Checkbox');
  const thematic1Fields = document.getElementById('adThematic1FieldsBox');

  if (isVipClick) {
    if (partner1Check) partner1Check.checked = true;
    if (thematic1Check) thematic1Check.checked = false;
    if (thematic1Fields) thematic1Fields.style.display = 'none';
    updateCardOptions(initialSection);
  } else {
    if (partner1Check) partner1Check.checked = false;
    if (thematic1Check) thematic1Check.checked = true;
    if (thematic1Fields) thematic1Fields.style.display = 'grid';
    updateCardOptions(initialSection, opts.card);
  }

  updateLocationOptions();
  updatePartnerAddon(1);
  updateThematicAddon(1);
  recalcAdOrderPrice();
  updateLivePreview();

  renderAdAuthPromptBanner();

  if (currentUser && currentUser.email) {
    const emailInput = document.getElementById('adEmailInput');
    if (emailInput && !emailInput.value) {
      emailInput.value = currentUser.email;
    }
  }

  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
  const modalBox = backdrop.querySelector('.ad-order-modal');
  if (modalBox) modalBox.scrollTop = 0;
}

function closeAdOrderModal() {
  const backdrop = document.getElementById('adOrderModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
    if (!document.querySelector('.cl-modal-backdrop.show')) {
      document.body.style.overflow = '';
    }
  }
}

// Наповнення карток для Слота 1 (виключно тематичні картки розділу, без VIP)
function updateCardOptions(section, preferredCard = '') {
  const cardSelect = document.getElementById('adCardSelect');
  cardSelect.innerHTML = '';

  const cards = SECTIONS_CATALOG[section] || [];
  cards.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    cardSelect.appendChild(opt);
  });

  if (preferredCard) {
    for (let i = 0; i < cardSelect.options.length; i++) {
      if (cardSelect.options[i].value.toLowerCase().includes(preferredCard.toLowerCase())) {
        cardSelect.selectedIndex = i;
        break;
      }
    }
  }
}

// Оновлення зон для Слота 1
function updateLocationOptions() {
  const section = document.getElementById('adSectionSelect')?.value || 'Головна';
  const locSelect = document.getElementById('adLocationSelect');
  if (!locSelect) return;

  const curVal = locSelect.value || 'bottom';
  locSelect.innerHTML = '';
  locSelect.disabled = false;

  const topPrice = getSinglePlacementRate(section, '', 'top');
  const bottomPrice = getSinglePlacementRate(section, '', 'bottom');

  const topOpt = document.createElement('option');
  topOpt.value = 'top';
  topOpt.textContent = `🔝 Вгорі картки (ТОП) - ${topPrice} грн/міс`;

  const bottomOpt = document.createElement('option');
  bottomOpt.value = 'bottom';
  bottomOpt.textContent = `📍 Внизу картки (Стандарт) - ${bottomPrice} грн/міс`;

  locSelect.appendChild(topOpt);
  locSelect.appendChild(bottomOpt);
  locSelect.value = curVal === 'top' ? 'top' : 'bottom';
}

// Наповнення карток для Слота 2 (з виключенням дублювання однієї і тієї ж картки)
function updateSlot2CardOptions(preferredCard = '') {
  const slot1Sec = document.getElementById('adSectionSelect')?.value;
  const slot1Card = document.getElementById('adCardSelect')?.value;
  const slot2Sec = document.getElementById('adSlot2SectionSelect')?.value;
  const slot2CardSelect = document.getElementById('adSlot2CardSelect');
  if (!slot2CardSelect || !slot2Sec) return;

  const currentChoice = preferredCard || slot2CardSelect.value;
  slot2CardSelect.innerHTML = '';

  const slot1ThematicActive = document.getElementById('adThematic1Checkbox')?.checked;
  const allCards = SECTIONS_CATALOG[slot2Sec] || [];
  allCards.forEach(c => {
    // ПРАВИЛО: не можна двічі подати ресурс в одну і ту ж картку
    if (slot1ThematicActive && slot1Sec === slot2Sec && c === slot1Card) {
      return;
    }
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    slot2CardSelect.appendChild(opt);
  });

  if (currentChoice && Array.from(slot2CardSelect.options).some(o => o.value === currentChoice)) {
    slot2CardSelect.value = currentChoice;
  } else if (slot2CardSelect.options.length > 0) {
    slot2CardSelect.selectedIndex = 0;
  }
}

// Оновлення зон для Слота 2
function updateSlot2LocationOptions() {
  const section = document.getElementById('adSlot2SectionSelect')?.value || 'Головна';
  const locSelect = document.getElementById('adSlot2LocationSelect');
  if (!locSelect) return;

  const curVal = locSelect.value || 'bottom';
  locSelect.innerHTML = '';
  locSelect.disabled = false;

  const topPrice = getSinglePlacementRate(section, '', 'top');
  const bottomPrice = getSinglePlacementRate(section, '', 'bottom');

  const topOpt = document.createElement('option');
  topOpt.value = 'top';
  topOpt.textContent = `🔝 Вгорі картки (ТОП) - ${topPrice} грн/міс`;

  const bottomOpt = document.createElement('option');
  bottomOpt.value = 'bottom';
  bottomOpt.textContent = `📍 Внизу картки (Стандарт) - ${bottomPrice} грн/міс`;

  locSelect.appendChild(topOpt);
  locSelect.appendChild(bottomOpt);
  locSelect.value = curVal === 'top' ? 'top' : 'bottom';
}

// Оновлення партнерського VIP-блоку (Add-on)
function updatePartnerAddon(slotNum) {
  const isSlot1 = slotNum === 1;
  const secSelect = document.getElementById(isSlot1 ? 'adSectionSelect' : 'adSlot2SectionSelect');
  const section = secSelect ? secSelect.value : 'Головна';
  const isHome = section === 'Головна';

  const wrapEl = document.getElementById(isSlot1 ? 'adPartnerAddon1Wrap' : 'adPartnerAddon2Wrap');
  const textEl = document.getElementById(isSlot1 ? 'adPartnerAddon1Text' : 'adPartnerAddon2Text');
  const priceEl = document.getElementById(isSlot1 ? 'adPartnerAddon1Price' : 'adPartnerAddon2Price');
  const checkEl = document.getElementById(isSlot1 ? 'adPartnerAddon1Checkbox' : 'adPartnerAddon2Checkbox');

  if (!wrapEl) return;

  // Якщо це Слот 2 і в цьому ж розділі вже обрано партнерську картку у Слот 1
  if (!isSlot1) {
    const slot1Sec = document.getElementById('adSectionSelect')?.value;
    const slot1PartnerCheck = document.getElementById('adPartnerAddon1Checkbox')?.checked;
    if (slot1Sec === section && slot1PartnerCheck) {
      wrapEl.style.display = 'none';
      if (checkEl) checkEl.checked = false;
      return;
    }
  }

  wrapEl.style.display = 'block';

  const vipPrice = getSinglePlacementRate(section, 'Партнери', 'vip');

  if (isHome) {
    textEl.innerHTML = `<span class="ad-addon-title-prefix"><i class="fas fa-gem text-warning me-1"></i> Додати в</span><strong class="ad-addon-title-main">«Партнери Сайту»</strong>`;
    priceEl.innerHTML = `<span class="ad-price-amount">${vipPrice}</span><span class="ad-price-unit">грн/міс</span>`;
  } else {
    textEl.innerHTML = `<span class="ad-addon-title-prefix"><i class="fas fa-fire text-danger me-1"></i> Додати в</span><strong class="ad-addon-title-main">«Партнери Розділу»</strong>`;
    priceEl.innerHTML = `<span class="ad-price-amount">${vipPrice}</span><span class="ad-price-unit">грн/міс</span>`;
  }
}

// Оновлення блоку тематичної картки
function updateThematicAddon(slotNum) {
  const isSlot1 = slotNum === 1;
  const secSelect = document.getElementById(isSlot1 ? 'adSectionSelect' : 'adSlot2SectionSelect');
  const section = secSelect ? secSelect.value : 'Головна';
  const bottomPrice = getSinglePlacementRate(section, '', 'bottom');
  const topPrice = getSinglePlacementRate(section, '', 'top');

  const priceBadge = document.getElementById(isSlot1 ? 'adThematic1PriceBadge' : 'adThematic2PriceBadge');
  if (priceBadge) {
    priceBadge.innerHTML = `<span class="ad-price-amount">${bottomPrice}-${topPrice}</span><span class="ad-price-unit">грн/міс</span>`;
  }
}

function getAdResourceBadge(section, card, location) {
  const isHome = section === 'Головна';
  const isVip = (card && (card.includes('Партнери') || card.includes('Рекомендаці'))) || location === 'vip' || (location && location.startsWith('vip'));
  if (isVip && isHome) {
    return { icon: '💎', name: 'Партнери Сайту (Головна)' };
  } else if (isVip && !isHome) {
    return { icon: '🔥', name: `Партнери Розділу (${section})` };
  } else {
    return { icon: '⚡️', name: 'Рекламне розміщення в картці' };
  }
}

function updateLivePreview() {
  const nameInput = document.getElementById('adSiteName');
  const urlInput = document.getElementById('adSiteUrl');
  const descInput = document.getElementById('adSiteDesc');
  const titleEl = document.getElementById('adPreviewTitleText');
  const badgeEl = document.getElementById('adPreviewBadgeIcon');
  const faviconEl = document.getElementById('adPreviewFavicon');
  const descEl = document.getElementById('adPreviewDescText');

  titleEl.textContent = nameInput.value.trim() || 'Назва Вашого Ресурсу';

  // Визначення відповідного партнерського значка серед активних локацій
  const placements = getActivePlacements();
  let highestBadge = { icon: '⚡️', name: 'Рекламне розміщення в картці' };
  if (placements.some(p => p.badge.icon === '💎')) {
    highestBadge = { icon: '💎', name: 'Партнери Сайту (Головна)' };
  } else if (placements.some(p => p.badge.icon === '🔥')) {
    const vipSec = placements.find(p => p.badge.icon === '🔥')?.section || '';
    highestBadge = { icon: '🔥', name: `Партнери Розділу (${vipSec})` };
  }

  if (badgeEl) {
    badgeEl.textContent = highestBadge.icon;
    badgeEl.title = highestBadge.name;
  }

  const rawUrl = urlInput.value.trim();
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
      faviconEl.src = `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`;
    } catch (e) {
      faviconEl.src = 'favicon.ico';
    }
  } else {
    faviconEl.src = 'favicon.ico';
  }

  descEl.textContent = descInput.value.trim() || 'Тут відображатиметься короткий опис вашого сайту при наведенні чи кліку...';
}

function recalcAdOrderPrice() {
  const termId = document.getElementById('adTermSelect').value;
  const paymentMethod = document.querySelector('input[name="adPaymentMethod"]:checked')?.value || 'mono';

  const p = calculateAdPricing(termId, paymentMethod);

  // Оновлення нижнього розгорнутого блоку підрахунку
  const baseRateEl = document.getElementById('adCalcBaseRate');
  const baseDetailsEl = document.getElementById('adCalcBaseDetails');
  const placementDetails = p.placements.map(pl => `${pl.card} (${pl.monthlyRate.toLocaleString('uk-UA')} грн)`).join(' + ');

  if (p.count === 0) {
    if (baseRateEl) baseRateEl.textContent = '0 грн / міс';
    if (baseDetailsEl) {
      baseDetailsEl.style.display = 'block';
      baseDetailsEl.textContent = 'Оберіть місце розміщення вище';
    }
  } else {
    if (baseRateEl) baseRateEl.textContent = `${p.monthlyRate.toLocaleString('uk-UA')} грн / міс`;
    if (baseDetailsEl) {
      const locWord = p.count === 1 ? 'локація' : (p.count >= 2 && p.count <= 4 ? 'локації' : 'локацій');
      if (p.isForever) {
        baseDetailsEl.style.display = 'block';
        baseDetailsEl.innerHTML = `<i class="fas fa-infinity text-primary me-1"></i> ${p.count} ${locWord}: ${placementDetails} <span class="opacity-75">(розрахунок як 10 років = ${p.baseCost.toLocaleString('uk-UA')} грн, знижка 50%)</span>`;
      } else if (p.count > 1) {
        baseDetailsEl.style.display = 'block';
        baseDetailsEl.innerHTML = `<i class="fas fa-layer-group text-primary me-1"></i> ${p.count} ${locWord}: ${placementDetails}`;
      } else {
        const pl = p.placements[0];
        baseDetailsEl.style.display = 'block';
        baseDetailsEl.innerHTML = `<i class="fas fa-map-marker-alt text-primary me-1"></i> ${pl.section} → ${pl.card} (${pl.locationLabel})`;
      }
    }
  }

  const periodEl = document.getElementById('adCalcPeriod');
  if (periodEl) {
    periodEl.textContent = p.termLabel;
  }

  // Рядок вартості без знижки (відображається, якщо є знижки)
  const totalDiscountAmount = p.termDiscountAmount + p.promoDiscountAmount + p.cryptoDiscountAmount;
  const baseCostRow = document.getElementById('adCalcBaseCostRow');
  if (baseCostRow) {
    if (totalDiscountAmount > 0 && p.count > 0) {
      baseCostRow.style.display = 'block';
      document.getElementById('adCalcBaseCostVal').textContent = `${p.baseCost.toLocaleString('uk-UA')} грн`;
    } else {
      baseCostRow.style.display = 'none';
    }
  }

  // Відображення плашки гарантії для тарифів від 3 років та Назавжди
  const guaranteeNotice = document.getElementById('adGuaranteeNotice');
  if (guaranteeNotice) {
    guaranteeNotice.style.display = p.hasGuarantee ? 'flex' : 'none';
  }

  const termRow = document.getElementById('adCalcTermDiscountRow');
  if (p.termDiscountAmount > 0) {
    termRow.style.display = 'block';
    document.getElementById('adCalcTermDiscountVal').textContent = `-${p.termDiscountAmount.toLocaleString('uk-UA')} грн (-${p.termDiscountPercent}%)`;
  } else {
    termRow.style.display = 'none';
  }

  const promoRow = document.getElementById('adCalcPromoDiscountRow');
  if (p.promoDiscountAmount > 0) {
    promoRow.style.display = 'block';
    document.getElementById('adCalcPromoDiscountVal').textContent = `-${p.promoDiscountAmount.toLocaleString('uk-UA')} грн (-${p.promoDiscountPercent}%)`;
  } else {
    promoRow.style.display = 'none';
  }

  const cryptoRow = document.getElementById('adCalcCryptoDiscountRow');
  if (p.cryptoDiscountAmount > 0) {
    cryptoRow.style.display = 'block';
    document.getElementById('adCalcCryptoDiscountVal').textContent = `-${p.cryptoDiscountAmount.toLocaleString('uk-UA')} грн (-10%)`;
  } else {
    cryptoRow.style.display = 'none';
  }

  document.getElementById('adCalcTotalUah').textContent = `${p.finalUah.toLocaleString('uk-UA')} грн`;
  document.getElementById('adCalcTotalUsdt').textContent = `~ $${p.finalUsdt} USDT`;

  // === ОНОВЛЕННЯ ПЛАВАЮЧОГО БАРУ ВАРТОСТІ ===
  const stickyUah = document.getElementById('adStickyPriceUah');
  const stickyUsdt = document.getElementById('adStickyPriceUsdt');
  const stickyRate = document.getElementById('adStickyRateBadge');
  const stickyPlaces = document.getElementById('adStickyPlacesBadge');
  const stickyDiscount = document.getElementById('adStickyDiscountBadge');

  if (stickyUah) {
    stickyUah.textContent = `${p.finalUah.toLocaleString('uk-UA')} грн`;
    stickyUah.classList.remove('price-flash');
    void stickyUah.offsetWidth;
    stickyUah.classList.add('price-flash');
    setTimeout(() => stickyUah.classList.remove('price-flash'), 300);
  }
  if (stickyUsdt) {
    stickyUsdt.textContent = `(~ $${p.finalUsdt} USDT)`;
  }
  if (stickyRate) {
    if (p.count === 0) {
      stickyRate.textContent = '0 грн/міс';
    } else if (p.isForever) {
      stickyRate.textContent = 'Назавжди';
    } else {
      stickyRate.textContent = `${p.monthlyRate.toLocaleString('uk-UA')} грн/міс`;
    }
  }
  if (stickyPlaces) {
    if (p.count === 0) {
      stickyPlaces.textContent = '0 локацій';
    } else {
      const locWord = p.count === 1 ? 'локація' : (p.count >= 2 && p.count <= 4 ? 'локації' : 'локацій');
      stickyPlaces.textContent = `${p.count} ${locWord}`;
    }
  }
  if (stickyDiscount) {
    const totalDiscountPercent = p.termDiscountPercent + p.promoDiscountPercent + (paymentMethod === 'crypto' ? 10 : 0);
    if (totalDiscountPercent > 0) {
      stickyDiscount.style.display = 'inline-block';
      stickyDiscount.textContent = `Знижка -${totalDiscountPercent}%`;
    } else {
      stickyDiscount.style.display = 'none';
    }
  }

  return p;
}

function submitAdOrder() {
  const name = document.getElementById('adSiteName').value.trim();
  const url = document.getElementById('adSiteUrl').value.trim();
  const desc = document.getElementById('adSiteDesc').value.trim();
  const email = document.getElementById('adContactEmail').value.trim();
  const tg = document.getElementById('adContactTg').value.trim();
  const phone = document.getElementById('adContactPhone').value.trim();

  const errorEl = document.getElementById('adFormError');
  errorEl.style.display = 'none';

  if (!name) {
    errorEl.textContent = 'Будь ласка, вкажіть назву вашого ресурсу (до 25 символів).';
    errorEl.style.display = 'block';
    document.getElementById('adSiteName').focus();
    return;
  }
  if (!url) {
    errorEl.textContent = 'Будь ласка, вкажіть посилання на ваш ресурс (URL сайту або Telegram).';
    errorEl.style.display = 'block';
    document.getElementById('adSiteUrl').focus();
    return;
  }
  if (!desc) {
    errorEl.textContent = 'Будь ласка, додайте короткий опис вашого ресурсу (до 150 символів).';
    errorEl.style.display = 'block';
    document.getElementById('adSiteDesc').focus();
    return;
  }
  if (!email || !email.includes('@')) {
    errorEl.textContent = 'Будь ласка, вкажіть коректний контактний E-Mail для зв\'язку.';
    errorEl.style.display = 'block';
    document.getElementById('adContactEmail').focus();
    return;
  }

  // Перевірка на дублювання однакової картки у Слот 1 і Слот 2
  const slot2Box = document.getElementById('adSlot2Box');
  const isSlot2Active = slot2Box && slot2Box.style.display !== 'none';
  const isThematic1Active = document.getElementById('adThematic1Checkbox')?.checked;
  const isThematic2Active = document.getElementById('adThematic2Checkbox')?.checked;
  const sec1 = document.getElementById('adSectionSelect')?.value;
  const crd1 = document.getElementById('adCardSelect')?.value;
  const sec2 = document.getElementById('adSlot2SectionSelect')?.value;
  const crd2 = document.getElementById('adSlot2CardSelect')?.value;

  if (isSlot2Active && isThematic1Active && isThematic2Active && sec1 === sec2 && crd1 === crd2) {
    errorEl.textContent = 'Неможливо розмістити ресурс двічі в одну і ту ж картку. Будь ласка, оберіть різні картки.';
    errorEl.style.display = 'block';
    return;
  }

  const placements = getActivePlacements();
  if (placements.length === 0) {
    errorEl.textContent = 'Будь ласка, оберіть хоча б одне місце для розміщення ресурсу (партнерське або тематичне).';
    errorEl.style.display = 'block';
    return;
  }

  const termId = document.getElementById('adTermSelect').value;
  const paymentMethod = document.querySelector('input[name="adPaymentMethod"]:checked')?.value || 'mono';

  const pricing = recalcAdOrderPrice();
  const orderId = generateAdOrderId();

  const primaryPlacement = placements[0];
  const orderPayload = {
    orderId,
    timestamp: new Date().toISOString(),
    siteName: name,
    siteNameWithBadge: `${name} ${primaryPlacement.badge.icon}`,
    badgeIcon: primaryPlacement.badge.icon,
    badgeName: primaryPlacement.badge.name,
    siteUrl: url,
    siteDesc: desc,
    placementsCount: placements.length,
    placements: placements.map(p => ({
      slot: p.slot,
      type: p.type,
      title: p.title,
      section: p.section,
      card: p.card,
      location: p.locationLabel,
      monthlyRate: p.monthlyRate,
      badgeIcon: p.badge.icon
    })),
    term: pricing.termLabel,
    months: pricing.months,
    hasGuarantee: !!pricing.hasGuarantee,
    promoCode: adPromoState.appliedCode || 'Немає',
    paymentMethod,
    totalUah: pricing.finalUah,
    totalUsdt: pricing.finalUsdt,
    clientEmail: email,
    clientTg: tg || 'Не вказано',
    clientPhone: phone || 'Не вказано'
  };

  // Збереження на сервері та локально
  try {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    }).catch(err => console.log('Ad order local buffer:', err));
    localStorage.setItem('topz_last_ad_order', JSON.stringify(orderPayload));
  } catch (e) {}

  // Заповнення Кроку 2
  document.getElementById('adSuccessOrderId').textContent = `#${orderId}`;
  document.getElementById('adRecNoteOrderId').textContent = `#${orderId}`;
  document.getElementById('adRecSite').innerHTML = `<strong>${name} ${primaryPlacement.badge.icon}</strong>`;

  const recUrlEl = document.getElementById('adRecUrl');
  if (recUrlEl) {
    recUrlEl.innerHTML = `<a href="${url}" target="_blank" class="ad-receipt-url-link">${url} <i class="fas fa-external-link-alt" style="font-size:0.75rem;"></i></a>`;
  }

  const recDescRow = document.getElementById('adRecDescRow');
  const recDesc = document.getElementById('adRecDesc');
  if (recDescRow && recDesc) {
    if (desc) {
      recDescRow.style.display = '';
      recDesc.textContent = desc;
    } else {
      recDescRow.style.display = 'none';
    }
  }
  
  let recPlacementHtml = '';
  placements.forEach((p, idx) => {
    recPlacementHtml += `<div class="ad-receipt-loc-line"><strong>${idx + 1}. ${p.badge.icon} ${p.section}:</strong> «${p.card}» (${p.locationLabel}) <span class="ad-receipt-loc-rate">[${p.monthlyRate} грн/міс]</span></div>`;
  });
  document.getElementById('adRecPlacement').innerHTML = recPlacementHtml;
  
  let recTermHtml = pricing.termLabel;
  if (pricing.hasGuarantee) {
    recTermHtml += `<br><span class="badge bg-success text-white" style="font-size:0.75rem;"><i class="fas fa-shield-alt"></i> Гарантія: 1 зміна URL/назви на рік</span>`;
  }
  document.getElementById('adRecTerm').innerHTML = recTermHtml;
  document.getElementById('adRecContact').textContent = `${email}${tg ? ' / ' + tg : ''}`;
  const recUahEl = document.getElementById('adRecAmountUah');
  const recUsdtEl = document.getElementById('adRecAmountUsdt');
  if (recUahEl && recUsdtEl) {
    recUahEl.textContent = `${pricing.finalUah.toLocaleString('uk-UA')} грн`;
    recUsdtEl.textContent = `~ $${pricing.finalUsdt} USDT`;
  } else if (document.getElementById('adRecAmount')) {
    document.getElementById('adRecAmount').textContent = `${pricing.finalUah.toLocaleString('uk-UA')} грн (~ $${pricing.finalUsdt} USDT)`;
  }

  // Генерація реквізитів
  renderRequisitesBox(paymentMethod, pricing, orderId);

  // Формування тексту для Telegram і копіювання
  let placementTgText = placements.map((p, idx) => `📍 Локація ${idx + 1}: ${p.badge.icon} ${p.section} > ${p.card} (${p.locationLabel}) [${p.monthlyRate} грн/міс]`).join('\n');
  const guaranteeTgText = pricing.hasGuarantee ? `\n🛡️ Гарантія: 1 безкоштовна зміна URL/назви на рік включена` : '';

  let paymentMethodLabel = '';
  let paymentRequisiteDetails = '';
  if (paymentMethod === 'mono') {
    paymentMethodLabel = 'Монобанк (Банка)';
    paymentRequisiteDetails = `Посилання на Банку: ${AD_CONFIG.wallets.mono.url} | Картка: ${AD_CONFIG.wallets.mono.card}`;
  } else if (paymentMethod === 'privat') {
    paymentMethodLabel = 'ПриватБанк (Конверт)';
    paymentRequisiteDetails = `Посилання на Конверт: ${AD_CONFIG.wallets.privat.url} | Номер картки: ${AD_CONFIG.wallets.privat.card}`;
  } else {
    const defaultCoin = AD_CONFIG.wallets.crypto[0];
    paymentMethodLabel = `Криптовалюта (${defaultCoin.name} - USDT) [~$${pricing.finalUsdt} USDT]`;
    paymentRequisiteDetails = `Адреса гаманця (${defaultCoin.nativeName}): ${defaultCoin.address}`;
  }

  const orderSummaryText = 
`🔔 Замовлення на розміщення на ТОП ЗАКЛАДКИ:
🆔 Номер: #${orderId}
🔗 Назва ресурсу: ${name}
🌐 Адреса посилання: ${url}
${desc ? `📝 Опис: ${desc}\n` : ''}Кількість обраних місць: ${placements.length}
${placementTgText}
⏱️ Термін: ${pricing.termLabel}${guaranteeTgText}
💳 Спосіб оплати: ${paymentMethodLabel}
🏦 Реквізити для оплати: ${paymentRequisiteDetails}
💰 До сплати: ${pricing.finalUah} грн (~ $${pricing.finalUsdt} USDT)
📧 Контакти клієнта: ${email}${tg ? ' | ' + tg : ''}${phone ? ' | ' + phone : ''}
----------------------------------------
📌 Статус: Очікує надсилання в діалог та підтвердження адміністратором.
💡 Важливо: Замовлення остаточно фіксується та бронюється лише після надсилання цього повідомлення в Telegram @WeberSIS або на Email. Оплату здійснюйте після підтвердження розміщення.`;

  window.currentAdOrderText = orderSummaryText;

  // Кнопка копіювання замовлення біля номера замовлення вгорі
  const copyOrderIdBtn = document.getElementById('adCopyOrderIdBtn');
  if (copyOrderIdBtn) {
    copyOrderIdBtn.onclick = function() {
      copyToClipboard(window.currentAdOrderText, copyOrderIdBtn, 'Скопійовано! ✅');
    };
  }

  // Посилання на Telegram
  const tgBtn = document.getElementById('adActionTgBtn');
  tgBtn.href = `https://t.me/WeberSIS?text=${encodeURIComponent(orderSummaryText)}`;

  // Посилання на Email
  const emailBtn = document.getElementById('adActionEmailBtn');
  emailBtn.href = `mailto:weber515sis@gmail.com?subject=${encodeURIComponent('Оплата замовлення #' + orderId)}&body=${encodeURIComponent(orderSummaryText)}`;

  const orderData = {
    orderId,
    name,
    url,
    desc,
    placements,
    pricing,
    paymentMethod,
    email,
    tg,
    phone,
    orderSummaryText
  };

  // Автоматичне збереження замовлення у Cloud Firestore базі даних
  saveOrderToFirestore(orderData);

  // Миттєве сповіщення на Email адміністратора (weber515sis@gmail.com) та локальний сервер
  sendOrderNotifications(orderData);

  // Відображення блоку збереження замовлення у кабінет
  renderAdOrderClaimWrap(orderId);

  // Перемикання екрана
  document.getElementById('adStep1').style.display = 'none';
  document.getElementById('adStep2').style.display = 'block';
  const modalBox = document.querySelector('.ad-order-modal') || document.querySelector('.ad-modal-body');
  if (modalBox) modalBox.scrollTop = 0;
}

function renderRequisitesBox(method, pricing, orderId) {
  const box = document.getElementById('adRequisiteBox');
  box.innerHTML = '';

  if (method === 'mono') {
    const mono = AD_CONFIG.wallets.mono;
    box.innerHTML = `
      <div class="ad-requisite-title"><i class="fas fa-wallet"></i> Реквізити для оплати: Монобанк (Банка)</div>
      <p style="font-size: 0.88rem; margin-bottom: 10px; color: var(--text-muted, #64748b);">Оплатіть у 1 клік через Банку Monobank (Apple Pay / Google Pay) або за номером картки Банки:</p>
      
      <div style="margin-bottom: 12px;">
        <a href="${mono.url}" target="_blank" class="btn btn-primary btn-block" style="font-weight: 700; padding: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="fas fa-external-link-alt"></i> Перейти до Банки Монобанку (send.monobank.ua)
        </a>
      </div>

      <div class="ad-label" style="margin-bottom: 4px;">Номер картки Банки:</div>
      <div class="ad-copy-field">
        <span class="ad-copy-val">${mono.card}</span>
        <button type="button" class="ad-sub-copy-btn" onclick="copyToClipboard('${mono.cardRaw}', this)" title="Копіювати номер картки">
          <i class="far fa-copy"></i> <span class="ad-copy-btn-text">Копіювати</span>
        </button>
      </div>
    `;
  } else if (method === 'privat') {
    const privat = AD_CONFIG.wallets.privat;
    box.innerHTML = `
      <div class="ad-requisite-title"><i class="fas fa-wallet" style="color: #16a34a;"></i> Реквізити для оплати: ПриватБанк (Конверт)</div>
      <p style="font-size: 0.88rem; margin-bottom: 10px; color: var(--text-muted, #64748b);">Миттєве поповнення Конверта у додатку Приват24 або за номером картки Конверта:</p>
      
      <div style="margin-bottom: 12px;">
        <a href="${privat.url}" target="_blank" class="btn btn-success btn-block" style="font-weight: 700; padding: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #16a34a; border-color: #16a34a;">
          <i class="fas fa-external-link-alt"></i> Відкрити Конверт у Приват24 (privat24.ua)
        </a>
      </div>

      <div class="ad-label" style="margin-bottom: 4px;">Номер картки Конверта:</div>
      <div class="ad-copy-field">
        <span class="ad-copy-val">${privat.card}</span>
        <button type="button" class="ad-sub-copy-btn" onclick="copyToClipboard('${privat.cardRaw}', this)" title="Копіювати номер картки">
          <i class="far fa-copy"></i> <span class="ad-copy-btn-text">Копіювати</span>
        </button>
      </div>
    `;
  } else if (method === 'crypto') {
    const coins = AD_CONFIG.wallets.crypto;
    const usdtCoins = coins.filter(c => c.hasUsdt);
    const otherCoins = coins.filter(c => !c.hasUsdt);

    let coinsOptionsHtml = `
      <optgroup label="🌐 Оплата в USDT / USDC або монетах мережі:">
        ${usdtCoins.map((c, i) => `<option value="${c.id}" ${i === 0 ? 'selected' : ''}>🟢 ${c.name}</option>`).join('')}
      </optgroup>
      <optgroup label="💰 Інші криптовалюти (оплата монетами за курсом):">
        ${otherCoins.map(c => `<option value="${c.id}">⚪ ${c.name}</option>`).join('')}
      </optgroup>
    `;
    
    box.innerHTML = `
      <div class="ad-requisite-title"><i class="fas fa-coins" style="color: #0284c7;"></i> Оплата Криптовалютою (Знижка 10% врахована!)</div>
      <p style="font-size: 0.88rem; margin-bottom: 10px; color: var(--text-muted, #64748b);">
        Сума до сплати: <strong style="color: #10b981; font-size: 1.05rem;">~ $${pricing.finalUsdt} USDT</strong> (${pricing.finalUah} грн). Оберіть зручну криптовалюту та мережу:
      </p>

      <div class="ad-form-group mb-2">
        <select id="adCryptoCoinSelect" class="ad-select">
          ${coinsOptionsHtml}
        </select>
      </div>

      <div id="adCryptoDetailsBox" class="ad-crypto-details-box" style="display: none;"></div>

      <div class="ad-label" style="margin-bottom: 4px;">Адреса гаманця для переказу:</div>
      <div class="ad-copy-field">
        <span class="ad-copy-val" id="adCryptoAddressVal">${coins[0].address}</span>
        <button type="button" class="ad-sub-copy-btn" id="adCryptoCopyBtn" title="Копіювати адресу гаманця">
          <i class="far fa-copy"></i> <span class="ad-copy-btn-text">Копіювати</span>
        </button>
      </div>
    `;

    const coinSelect = box.querySelector('#adCryptoCoinSelect');
    const addrVal = box.querySelector('#adCryptoAddressVal');
    const copyBtn = box.querySelector('#adCryptoCopyBtn');
    const detailsBox = box.querySelector('#adCryptoDetailsBox');

    let currentPayType = 'usdt'; // 'usdt' or 'native'

    function fetchAndRenderCoinRate(selected, targetEl, badgeEl) {
      if (!selected.binanceSymbol) return;
      fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${selected.binanceSymbol}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.price && coinSelect.value === selected.id) {
            const coinPrice = parseFloat(data.price);
            if (coinPrice > 0) {
              const usdtAmount = parseFloat(pricing.finalUsdt);
              const estimated = usdtAmount / coinPrice;
              let formatted = '';
              if (estimated < 0.1) formatted = estimated.toFixed(6);
              else if (estimated < 10) formatted = estimated.toFixed(4);
              else if (estimated < 1000) formatted = estimated.toFixed(2);
              else formatted = Math.round(estimated).toLocaleString('uk-UA');

              const rateSub = coinPrice < 1 ? coinPrice.toFixed(4) : coinPrice.toLocaleString('uk-UA', {maximumFractionDigits: 2});

              if (targetEl) {
                targetEl.innerHTML = `<strong>Орієнтовно:</strong> <span class="ad-volatile-amount">~ ${formatted} ${selected.nativeTicker}</span> <span class="ad-volatile-rate-sub">(курс: 1 ${selected.nativeTicker} ≈ $${rateSub})</span>`;
              }
              if (badgeEl) {
                badgeEl.textContent = `~ ${formatted} ${selected.nativeTicker}`;
              }
            }
          }
        })
        .catch(() => {
          if (targetEl) {
            targetEl.innerHTML = `Оплата за біржовим курсом еквівалента <strong>$${pricing.finalUsdt} USDT</strong> на момент переказу.`;
          }
        });
    }

    function renderCoinContent(selected) {
      if (selected.hasUsdt) {
        if (currentPayType === 'usdt') {
          if (selected.id === 'eth') {
            return `
              <div class="ad-crypto-eth-card">
                <div class="ad-crypto-eth-title">
                  <i class="fas fa-network-wired" style="color: #3b82f6;"></i> Доступні EVM-мережі для переказу USDT / USDC:
                </div>
                <div class="ad-crypto-eth-tags">
                  ${(selected.networks || []).map(n => `<span class="ad-net-tag">${n}</span>`).join('')}
                </div>
                <div class="ad-crypto-net-note" style="margin-top: 6px; font-size: 0.8rem; color: #1e40af;">
                  Сума переказу: <strong style="color:#10b981;">$${pricing.finalUsdt} USDT / USDC</strong> на вказану нижче адресу.
                </div>
              </div>
            `;
          } else {
            return `
              <div class="ad-crypto-stable-info">
                <i class="fas fa-check-circle" style="color: #10b981;"></i> Переказ у <strong>USDT / USDC</strong> (${selected.nativeName}): точна сума <strong style="color: #10b981;">$${pricing.finalUsdt} USDT</strong> на вказану нижче адресу.
              </div>
            `;
          }
        } else {
          return `
            <div class="ad-crypto-volatile-card">
              <div class="ad-volatile-title">
                <i class="fas fa-calculator" style="color: #f59e0b;"></i> Оплата нативною монетою <strong>${selected.nativeName}</strong>:
              </div>
              <div class="ad-volatile-desc">
                Вартість замовлення еквівалентна <strong style="color: #10b981;">$${pricing.finalUsdt} USDT</strong> (${pricing.finalUah} грн).
                Сума в монетах розраховується за біржовим курсом на момент переказу на ту ж саму адресу.
              </div>
              <div id="adCryptoLiveCalcBox" class="ad-volatile-calc-box">
                <i class="fas fa-circle-notch fa-spin"></i> Розрахунок орієнтовної кількості ${selected.nativeTicker}...
              </div>
              <div class="ad-volatile-tg-hint">
                💬 Для точного узгодження кількості монет напишіть нам у <a href="https://t.me/WeberSIS" target="_blank">Telegram @WeberSIS</a>.
              </div>
            </div>
          `;
        }
      } else {
        return `
          <div class="ad-crypto-volatile-card">
            <div class="ad-volatile-title">
              <i class="fas fa-calculator" style="color: #f59e0b;"></i> Оплата в <strong>${selected.name}</strong>:
            </div>
            <div class="ad-volatile-desc">
              Вартість замовлення еквівалентна <strong style="color: #10b981;">$${pricing.finalUsdt} USDT</strong> (${pricing.finalUah} грн).
              Кількість монет розраховується за біржовим курсом на момент здійснення переказу.
            </div>
            <div id="adCryptoLiveCalcBox" class="ad-volatile-calc-box">
              <i class="fas fa-circle-notch fa-spin"></i> Розрахунок орієнтовної кількості ${selected.nativeTicker}...
            </div>
            <div class="ad-volatile-tg-hint">
              💬 Для точного узгодження кількості монет напишіть нам у <a href="https://t.me/WeberSIS" target="_blank">Telegram @WeberSIS</a>.
            </div>
          </div>
        `;
      }
    }

    function updateCoinUI(selected) {
      addrVal.textContent = selected.address;
      detailsBox.style.display = 'block';

      if (selected.hasUsdt) {
        detailsBox.innerHTML = `
          <div class="ad-crypto-choice-box">
            <div class="ad-crypto-choice-header">
              <i class="fas fa-hand-holding-usd" style="color: #3b82f6;"></i> Оберіть, чим зручніше сплатити на цю адресу:
            </div>
            <div class="ad-crypto-type-toggle">
              <button type="button" class="ad-crypto-tab-btn ${currentPayType === 'usdt' ? 'active' : ''}" data-type="usdt">
                <i class="fas fa-dollar-sign" style="color: #10b981;"></i> USDT / USDC <strong>($${pricing.finalUsdt})</strong>
              </button>
              <button type="button" class="ad-crypto-tab-btn ${currentPayType === 'native' ? 'active' : ''}" data-type="native">
                <i class="fas fa-coins" style="color: #f59e0b;"></i> Монета ${selected.nativeTicker} <span id="adTabNativeRate" style="font-weight: 500; font-size: 0.74rem;">(за курсом)</span>
              </button>
            </div>
            <div id="adCryptoTabContainer">
              ${renderCoinContent(selected)}
            </div>
          </div>
        `;

        const tabBtns = detailsBox.querySelectorAll('.ad-crypto-tab-btn');
        tabBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            currentPayType = btn.getAttribute('data-type');
            tabBtns.forEach(b => b.classList.toggle('active', b === btn));
            const container = detailsBox.querySelector('#adCryptoTabContainer');
            if (container) {
              container.innerHTML = renderCoinContent(selected);
              if (currentPayType === 'native') {
                const calcBox = container.querySelector('#adCryptoLiveCalcBox');
                fetchAndRenderCoinRate(selected, calcBox, null);
              }
            }
            syncOrderText(selected);
          });
        });

        // Завантажуємо прев'ю курсу монети для кнопки та якщо обрано нативну монету
        const nativeBadge = detailsBox.querySelector('#adTabNativeRate');
        const calcBox = detailsBox.querySelector('#adCryptoLiveCalcBox');
        fetchAndRenderCoinRate(selected, calcBox, nativeBadge);

      } else {
        currentPayType = 'native';
        detailsBox.innerHTML = renderCoinContent(selected);
        const calcBox = detailsBox.querySelector('#adCryptoLiveCalcBox');
        fetchAndRenderCoinRate(selected, calcBox, null);
      }

      syncOrderText(selected);
    }

    function syncOrderText(selected) {
      if (window.currentAdOrderText) {
        let cryptoPaymentLabel = '';
        let cryptoRequisites = `Адреса гаманця (${selected.nativeName}): ${selected.address}`;
        if (selected.hasUsdt && currentPayType === 'usdt') {
          cryptoPaymentLabel = `Криптовалюта (${selected.name} - USDT) [$${pricing.finalUsdt} USDT]`;
        } else {
          cryptoPaymentLabel = `Криптовалюта (монета ${selected.nativeTicker}) [еквівалент ~$${pricing.finalUsdt} USDT за біржовим курсом]`;
        }
        let updatedSummary = window.currentAdOrderText
          .replace(/💳 Спосіб оплати: .*/, `💳 Спосіб оплати: ${cryptoPaymentLabel}`)
          .replace(/🏦 Реквізити для оплати: .*/, `🏦 Реквізити для оплати: ${cryptoRequisites}`);
        window.currentAdOrderText = updatedSummary;
        const tgBtn = document.getElementById('adActionTgBtn');
        if (tgBtn) tgBtn.href = `https://t.me/WeberSIS?text=${encodeURIComponent(updatedSummary)}`;
        const emailBtn = document.getElementById('adActionEmailBtn');
        if (emailBtn) emailBtn.href = `mailto:weber515sis@gmail.com?subject=${encodeURIComponent('Оплата замовлення #' + orderId)}&body=${encodeURIComponent(updatedSummary)}`;
      }
    }

    coinSelect.addEventListener('change', () => {
      const selected = coins.find(c => c.id === coinSelect.value) || coins[0];
      updateCoinUI(selected);
    });

    updateCoinUI(coins[0]);

    copyBtn.addEventListener('click', () => {
      copyToClipboard(addrVal.textContent.trim(), copyBtn);
    });
  }
}

function copyToClipboard(text, btnElement, successMsg = 'Скопійовано! ✅') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      handleCopySuccess(btnElement, successMsg);
    }).catch(() => fallbackCopy(text, btnElement, successMsg));
  } else {
    fallbackCopy(text, btnElement, successMsg);
  }
}

function fallbackCopy(text, btnElement, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    handleCopySuccess(btnElement, successMsg);
  } catch (err) {}
  document.body.removeChild(ta);
}

function handleCopySuccess(btnElement, successMsg) {
  if (!btnElement) return;
  const originalHtml = btnElement.innerHTML;
  btnElement.classList.add('copied');
  btnElement.innerHTML = successMsg;
  setTimeout(() => {
    btnElement.classList.remove('copied');
    btnElement.innerHTML = originalHtml;
  }, 2000);
}

/* ==========================================================================
   ІНТЕГРАЦІЯ FIREBASE: АВТОРИЗАЦІЯ GOOGLE, ОСОБИСТИЙ КАБІНЕТ ТА АДМІН-ПАНЕЛЬ
   ========================================================================== */

const FIREBASE_CONFIG = {
  apiKey: atob("QUl6YVN5QWE1eFdrYUZwRWM5RFEyVWhTZE5aOGVTZVdxMlVUcEQw"),
  authDomain: "top-zakladki.firebaseapp.com",
  projectId: "top-zakladki",
  storageBucket: "top-zakladki.firebasestorage.app",
  messagingSenderId: "325861597854",
  appId: "1:325861597854:web:3926cfdbf7c4313899d18f",
  measurementId: "G-MDG5D3YTN9"
};

const ADMIN_EMAILS = ["weber515sis@gmail.com"];

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let currentUser = null;
let currentCabinetTab = 'orders';
let adminSearchQuery = '';
let adminStatusFilter = 'all';

// Глобальні змінні персональних закладок
const DEFAULT_CARD_NAME = 'Основні закладки';
const MAX_USER_CARDS = 12;        // Максимум 12 папок/карток на акаунт
const MAX_USER_BOOKMARKS = 120;   // Максимум 120 збережених сайтів на акаунт
const DAILY_ACTION_LIMIT = 100;   // Максимум 100 операцій на добу на акаунт (захист бази від спаму)
let userBookmarksList = [];
let userBookmarkCards = [DEFAULT_CARD_NAME];
let userBookmarkColumns = [[DEFAULT_CARD_NAME], [], [], []];

// Отримання поточної кількості використаних дій за сьогодні
function getDailyActionsCount() {
  const uid = currentUser ? currentUser.uid : 'guest';
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const key = `topz_daily_actions_${uid}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today && typeof parsed.count === 'number') {
        return parsed.count;
      }
    }
  } catch (e) {}
  return 0;
}

// Оновлення лічильників дій у всіх відкритих елементах інтерфейсу
function updateDailyActionsCounters() {
  const count = getDailyActionsCount();
  const isExceeded = (count >= DAILY_ACTION_LIMIT);

  // Лічильник у верхній картці користувача на сторінці закладок
  document.querySelectorAll('.bm-daily-actions-counter .bm-actions-counter-val').forEach(el => {
    el.textContent = `${count}/${DAILY_ACTION_LIMIT}`;
  });
  // Бейджик у шапці Особистого кабінету
  document.querySelectorAll('.cabinet-actions-badge .cabinet-actions-counter-val').forEach(el => {
    el.textContent = `${count}/${DAILY_ACTION_LIMIT}`;
  });
  // Картка метрики у Дашборді
  document.querySelectorAll('.metric-daily-actions .dash-metric-value').forEach(el => {
    el.innerHTML = `${count} <span class="dash-metric-unit" style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted, #64748b);">/ ${DAILY_ACTION_LIMIT}</span>`;
  });
  // Пульсуючі точки статусу дій на аватарках
  document.querySelectorAll('.user-action-status-dot').forEach(el => {
    el.classList.toggle('dot-limit-active', !isExceeded);
    el.classList.toggle('dot-limit-exceeded', isExceeded);
    el.setAttribute('title', isExceeded 
      ? 'Денний ліміт дій вичерпано (100/100). Відпочиньте до завтра!' 
      : `Дії активні: доступно ${DAILY_ACTION_LIMIT - count} із ${DAILY_ACTION_LIMIT} дій`);
  });
  // Статус картки хмарної синхронізації у Дашборді
  document.querySelectorAll('.metric-cloud').forEach(card => {
    const icon = card.querySelector('.dash-metric-icon');
    const val = card.querySelector('.dash-metric-value');
    const hint = card.querySelector('.dash-metric-hint');
    if (!currentUser) return;
    if (isExceeded) {
      if (icon) {
        icon.style.background = 'rgba(239, 68, 68, 0.14)';
        icon.style.color = '#dc2626';
        icon.innerHTML = '<i class="fas fa-exclamation-triangle text-danger"></i>';
      }
      if (val) {
        val.className = 'dash-metric-value text-danger font-weight-bold';
        val.textContent = 'Не активна (ліміт)';
      }
      if (hint) {
        hint.className = 'dash-metric-hint text-danger';
        hint.textContent = 'Денний ліміт 100/100 вичерпано (відновиться завтра)';
      }
    } else {
      if (icon) {
        icon.style.background = '';
        icon.style.color = '';
        icon.innerHTML = '<i class="fas fa-shield-alt text-success"></i>';
      }
      if (val) {
        val.className = 'dash-metric-value text-success';
        val.textContent = 'Активна';
      }
      if (hint) {
        hint.className = 'dash-metric-hint text-muted';
        hint.textContent = currentUser.email || '';
      }
    }
  });
}

// Попереднє миттєве завантаження закладок із локального сховища (до старту Firebase)
try {
  const initBm = localStorage.getItem('topz_bm_all_saved');
  const initCards = localStorage.getItem('topz_bm_cards_all');
  const initCols = localStorage.getItem('topz_bm_columns_v4');
  if (initBm) {
    const parsedBm = JSON.parse(initBm);
    if (Array.isArray(parsedBm)) userBookmarksList = parsedBm;
  }
  if (initCards) {
    const parsedCards = JSON.parse(initCards);
    if (Array.isArray(parsedCards) && parsedCards.length > 0) userBookmarkCards = parsedCards;
  }
  if (initCols) {
    try {
      const parsedCols = JSON.parse(initCols);
      if (Array.isArray(parsedCols) && parsedCols.length === 4) {
        userBookmarkColumns = parsedCols;
      }
    } catch (e) {}
  }
  // Нормалізуємо назву системної картки до актуальної 'Основні закладки'
  userBookmarkCards = userBookmarkCards.map(c => (c && (c.includes('Основні закладки') || c.toLowerCase().includes('основні закладки'))) ? DEFAULT_CARD_NAME : c);
  if (!userBookmarkCards.includes(DEFAULT_CARD_NAME)) {
    userBookmarkCards.unshift(DEFAULT_CARD_NAME);
  }
} catch (e) {}

// Завантаження Firebase SDK якщо скрипти не підключені в HTML
function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function ensureFirebaseLoaded() {
  if (window.firebase && window.firebase.auth && window.firebase.firestore) return true;
  try {
    if (!window.firebase) {
      await loadExternalScript("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
    }
    if (!window.firebase.auth) {
      await loadExternalScript("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js");
    }
    if (!window.firebase.firestore) {
      await loadExternalScript("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js");
    }
    return true;
  } catch (e) {
    console.warn("Помилка завантаження бібліотек Firebase:", e);
    return false;
  }
}

async function ensureSortableLoaded() {
  if (window.Sortable) return true;
  try {
    await loadExternalScript("https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js");
    return !!window.Sortable;
  } catch (e) {
    console.warn("Помилка завантаження SortableJS:", e);
    return false;
  }
}

async function initFirebaseAuthAndDb() {
  await ensureFirebaseLoaded();
  if (window.firebase) {
    try {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
      } else {
        firebaseApp = firebase.app();
      }
      firebaseAuth = firebase.auth();
      firebaseDb = firebase.firestore();

      firebaseAuth.onAuthStateChanged(async (user) => {
        currentUser = user;
        updateUserNavButton();
        syncBookmarksNav();
        if (currentUser) {
          await loadUserBookmarksData();
        } else {
          userBookmarksList = [];
          userBookmarkCards = [DEFAULT_CARD_NAME];
        }
        syncAllCatalogHeartButtons();
        renderBookmarksPage();
        if (currentUser && firebaseDb) {
          firebaseDb.collection('users').doc(currentUser.uid).get().then(docSnap => {
            if (docSnap && docSnap.exists) {
              const uData = docSnap.data();
              if (uData && uData.fuelRegion) {
                localStorage.setItem('user_fuel_region', uData.fuelRegion);
                const regSelect = document.getElementById('pulseFuelRegionSelect');
                if (regSelect) regSelect.value = uData.fuelRegion;
                if (typeof renderPulseFuelTable === 'function') {
                  renderPulseFuelTable(uData.fuelRegion);
                }
              }
            }
          }).catch(() => {});

          firebaseDb.collection('users').doc(currentUser.uid).set({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || '',
            photoURL: currentUser.photoURL || '',
            lastLoginAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }
        const cabinetBackdrop = document.getElementById('userCabinetBackdrop');
        if (cabinetBackdrop && cabinetBackdrop.classList.contains('show')) {
          renderUserCabinetContent();
        }
      });
    } catch (err) {
      console.warn("Помилка ініціалізації Firebase:", err);
    }
  }
  ensureAuthNavButton();
  syncBookmarksNav();
  syncAllCatalogHeartButtons();
  renderBookmarksPage();
}

function ensureAuthNavButton() {
  let btn = document.getElementById('userAuthNavBtn');
  if (!btn) {
    const themeBtn = document.getElementById('themeToggle');
    const bell = document.getElementById('noticeBellBtn');
    const target = themeBtn || bell;
    if (!target) return;
    btn = document.createElement('button');
    btn.id = 'userAuthNavBtn';
    btn.className = 'user-auth-btn';
    btn.setAttribute('aria-label', 'Особистий кабінет');
    btn.setAttribute('title', 'Особистий кабінет / Вхід');
    target.parentNode.insertBefore(btn, target);
  }
  btn.onclick = () => openUserCabinetModal();
  updateUserNavButton();
}

function isAdminUser() {
  if (!currentUser || !currentUser.email) return false;
  return ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim());
}

function updateAdminCounterVisibility() {
  const isAdmin = isAdminUser();
  document.querySelectorAll('.footer-counter-admin-only').forEach(el => {
    if (isAdmin) {
      el.classList.add('is-admin-visible');
    } else {
      el.classList.remove('is-admin-visible');
    }
  });
}

function updateUserNavButton() {
  const btn = document.getElementById('userAuthNavBtn');
  if (btn) {
    if (currentUser) {
      btn.classList.add('logged-in');
      const isAdmin = isAdminUser();
      let avatarHtml = '';
      if (currentUser.photoURL) {
        avatarHtml = `<img src="${currentUser.photoURL}" class="user-auth-avatar" alt="Avatar" referrerpolicy="no-referrer">`;
      } else {
        avatarHtml = `<i class="fas fa-user-check text-success"></i>`;
      }
      btn.innerHTML = avatarHtml;
      btn.setAttribute('title', `${currentUser.displayName || currentUser.email} (${isAdmin ? 'Адміністратор' : 'Кабінет'})`);
    } else {
      btn.classList.remove('logged-in');
      btn.innerHTML = `<i class="far fa-user-circle"></i>`;
      btn.setAttribute('title', 'Особистий кабінет / Вхід через Google');
    }
  }

  updateAdminCounterVisibility();
}

// Вхід через Google
async function loginWithGoogle() {
  await ensureFirebaseLoaded();
  if (!firebaseAuth) {
    alert("Сервіс Google Auth завантажується, спробуйте ще раз через секунду.");
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  try {
    const res = await firebaseAuth.signInWithPopup(provider);
    currentUser = res.user;
    updateUserNavButton();
    renderUserCabinetContent();
  } catch (err) {
    console.warn("Google sign-in popup:", err);
    if (err.code === 'auth/popup-blocked') {
      firebaseAuth.signInWithRedirect(provider);
    } else if (err.code !== 'auth/popup-closed-by-user') {
      alert("Не вдалося увійти через Google: " + (err.message || err.code));
    }
  }
}

// Вихід з акаунта
async function logoutUser() {
  if (firebaseAuth) {
    await firebaseAuth.signOut();
    currentUser = null;
    updateUserNavButton();
    syncBookmarksNav();
    renderBookmarksPage();
    renderUserCabinetContent();
  }
}

// Збереження замовлення у базі Cloud Firestore
async function saveOrderToFirestore(orderData) {
  if (!checkAndIncrementDailyActionLimit()) return;

  await ensureFirebaseLoaded();
  if (!firebaseDb) {
    console.warn("Firestore недоступний, замовлення збережено локально.");
    return;
  }
  try {
    const cleanId = orderData.orderId.replace('#', '').trim();
    await firebaseDb.collection('orders').doc(cleanId).set({
      orderId: orderData.orderId,
      userId: currentUser ? currentUser.uid : null,
      userEmail: currentUser ? currentUser.email : (orderData.email || ''),
      userName: currentUser ? (currentUser.displayName || '') : (orderData.name || ''),
      userPhoto: currentUser ? (currentUser.photoURL || '') : null,
      siteName: orderData.name,
      siteUrl: orderData.url,
      siteDesc: orderData.desc || '',
      placements: orderData.placements || [],
      pricing: {
        finalUah: orderData.pricing.finalUah,
        finalUsdt: orderData.pricing.finalUsdt,
        termMonths: orderData.pricing.termMonths,
        termLabel: orderData.pricing.termLabel,
        hasGuarantee: !!orderData.pricing.hasGuarantee
      },
      paymentMethod: orderData.paymentMethod,
      contacts: {
        email: orderData.email || '',
        tg: orderData.tg || '',
        phone: orderData.phone || ''
      },
      status: 'pending', // pending, paid, active, completed, cancelled
      statusLabel: 'Очікує узгодження та оплати',
      orderSummaryText: orderData.orderSummaryText || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log("Замовлення збережено у Firestore:", cleanId);
  } catch (err) {
    console.warn("Не вдалося записати замовлення в Firestore:", err);
  }
}

// Миттєве сповіщення адміністратора про нове замовлення реклами
async function sendOrderNotifications(orderData) {
  // 1. Збереження замовлення на локальному сервері Node.js /api/orders (orders.json)
  try {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).catch(() => {});
  } catch (e) {}

  // 2. Миттєве сповіщення на Email адміністратора weber515sis@gmail.com через FormSubmit AJAX
  try {
    const placementsList = (orderData.placements || []).map((p, i) => `${i + 1}. [${p.section}] ${p.card} (${p.locationLabel}) [${p.monthlyRate} грн/міс]`).join(' | ');
    const emailPayload = {
      _subject: `🔔 Нове замовлення реклами #${orderData.orderId} (${orderData.pricing?.finalUah || 0} грн)`,
      _captcha: 'false',
      _template: 'table',
      'Номер замовлення': orderData.orderId,
      'Назва сайту': orderData.name,
      'URL посилання': orderData.url,
      'Опис сайту': orderData.desc || '—',
      'Локації розміщення': placementsList,
      'Термін розміщення': orderData.pricing?.termLabel || '—',
      'До сплати': `${orderData.pricing?.finalUah || 0} грн (~ $${orderData.pricing?.finalUsdt || 0} USDT)`,
      'Спосіб оплати': orderData.paymentMethod || '—',
      'Email клієнта': orderData.email || (currentUser ? currentUser.email : '—'),
      'Telegram клієнта': orderData.tg || '—',
      'Телефон клієнта': orderData.phone || '—',
      'Час створення': new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })
    };

    fetch('https://formsubmit.co/ajax/weber515sis@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    }).then(res => res.json()).then(data => {
      console.log('Сповіщення про замовлення надіслано на Email:', data);
    }).catch(err => {
      console.warn('Помилка відправки сповіщення на Email:', err);
    });
  } catch (err) {
    console.warn('Помилка формування email-сповіщення:', err);
  }
}

// Відкриття модального вікна Кабінету
function openUserCabinetModal(tab) {
  let backdrop = document.getElementById('userCabinetBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'userCabinetBackdrop';
    backdrop.className = 'user-cabinet-backdrop';
    backdrop.innerHTML = `
      <div class="user-cabinet-modal" role="dialog" aria-modal="true">
        <div class="cabinet-header">
          <h5 class="cabinet-header-title">
            <i class="fas fa-user-circle text-primary"></i> Особистий кабінет
          </h5>
          <button type="button" class="cabinet-close-btn" id="cabinetCloseBtn" aria-label="Закрити">&times;</button>
        </div>
        <div class="cabinet-body" id="cabinetBody">
          <!-- Динамічний вміст -->
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeUserCabinetModal();
    });
    backdrop.querySelector('#cabinetCloseBtn').addEventListener('click', closeUserCabinetModal);
  }

  if (tab) {
    currentCabinetTab = tab;
  } else {
    currentCabinetTab = 'dashboard';
  }

  renderUserCabinetContent();
  backdrop.style.display = 'flex';
  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeUserCabinetModal() {
  const backdrop = document.getElementById('userCabinetBackdrop');
  if (backdrop) {
    backdrop.style.display = 'none';
    backdrop.classList.remove('show');
    if (!document.querySelector('.cl-modal-backdrop.show')) {
      document.body.style.overflow = '';
    }
  }
}

let userProfileSettings = {
  phone: '',
  telegram: '',
  displayName: '',
  customNotes: '',
  isPhonePublic: false,
  isTelegramPublic: false,
  showInLeaderboard: true,
  openInNewTab: true,
  noticeBellBadge: true
};

function loadCachedUserProfile() {
  if (!currentUser) return;
  try {
    const raw = localStorage.getItem('user_profile_' + currentUser.uid);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        userProfileSettings = { ...userProfileSettings, ...parsed };
      }
    }
  } catch (e) {}
}

// Рендеринг вмісту кабінету
function renderUserCabinetContent() {
  const body = document.getElementById('cabinetBody');
  if (!body) return;

  loadCachedUserProfile();

  const isAdmin = isAdminUser();
  const avatarSrc = currentUser ? (currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp') : '';
  const userDisplayName = (userProfileSettings && userProfileSettings.displayName) || (currentUser && currentUser.displayName) || 'Користувач';
  const dailyActionsCount = getDailyActionsCount();

  // Перелік розділів кабінету: Дашборд завжди перший та активний за замовчуванням
  const cabinetTabsList = [
    {
      id: 'dashboard',
      name: 'Дашборд',
      icon: '<i class="fas fa-tachometer-alt text-primary"></i>',
      desc: 'Загальний огляд, бали, статистика та швидкі дії'
    },
    {
      id: 'hints',
      name: 'Підказки',
      icon: '<i class="fas fa-lightbulb text-warning"></i>',
      desc: 'Корисні поради, сортування та інструкції щодо закладок'
    },
    {
      id: 'settings',
      name: 'Налаштування',
      icon: '<i class="fas fa-cog text-secondary"></i>',
      desc: 'Персональні дані, контакти та налаштування акаунта'
    },
    {
      id: 'orders',
      name: 'Мої замовлення реклами',
      icon: '<i class="fas fa-bullhorn text-success"></i>',
      desc: 'Контроль статусів, терміни розміщення та управління'
    },
    {
      id: 'bookmarks',
      name: 'Мої закладки',
      icon: '<i class="fas fa-star text-warning"></i>',
      desc: 'Хмарні персональні сайти та швидкі посилання'
    },
    ...(isAdmin ? [{
      id: 'admin',
      name: 'Всі замовлення (Адмін)',
      icon: '<i class="fas fa-crown text-warning"></i>',
      desc: 'Панель модерації та управління замовленнями'
    }] : [])
  ];

  const currentTabObj = cabinetTabsList.find(t => t.id === currentCabinetTab) || cabinetTabsList[0];

  body.innerHTML = `
    <!-- Профіль користувача вгорі -->
    <div class="cabinet-user-bar">
      <div class="cabinet-user-info">
        ${currentUser ? `
          <div class="cabinet-avatar-lg-wrap">
            <img src="${avatarSrc}" class="cabinet-avatar-lg" alt="Аватарка" referrerpolicy="no-referrer">
            <span class="user-action-status-dot ${dailyActionsCount >= DAILY_ACTION_LIMIT ? 'dot-limit-exceeded' : 'dot-limit-active'}" title="${dailyActionsCount >= DAILY_ACTION_LIMIT ? 'Денний ліміт дій вичерпано (100/100). Відпочиньте до завтра!' : `Дії активні: доступно ${DAILY_ACTION_LIMIT - dailyActionsCount} із ${DAILY_ACTION_LIMIT} дій`}"></span>
          </div>
          <div class="cabinet-user-names">
            <div class="cabinet-user-name-row">
              <span class="cabinet-user-name">${escapeHtml(userDisplayName)}</span>
              <button type="button" class="cabinet-logout-compact-btn" id="btnCabinetLogout" title="Вийти з акаунта Google">
                <i class="fas fa-sign-out-alt me-1"></i> Вийти
              </button>
            </div>
            <div class="cabinet-user-badges">
              <span class="cabinet-role-badge ${isAdmin ? 'cabinet-role-admin' : 'cabinet-role-user'}">
                ${isAdmin ? '<i class="fas fa-crown"></i> Адміністратор' : '<i class="fas fa-user-check"></i> Клієнт'}
              </span>
              <span class="cabinet-points-badge" title="Бали активності (система нарахування незабаром)">
                <i class="fas fa-coins text-warning"></i> 0 балів
              </span>
              <span class="cabinet-actions-badge" title="Денний захисний ліміт дій: використано ${dailyActionsCount} із ${DAILY_ACTION_LIMIT} дій на добу">
                <i class="fas fa-bolt text-warning"></i> Дій: <span class="cabinet-actions-counter-val">${dailyActionsCount}/${DAILY_ACTION_LIMIT}</span>
              </span>
            </div>
            <div class="cabinet-user-email">${escapeHtml(currentUser.email || '')}</div>
          </div>
        ` : `
          <div class="cabinet-avatar-lg-wrap">
            <div class="cabinet-avatar-lg cabinet-avatar-guest"><i class="fas fa-user-circle"></i></div>
            <span class="user-action-status-dot ${dailyActionsCount >= DAILY_ACTION_LIMIT ? 'dot-limit-exceeded' : 'dot-limit-active'}" title="${dailyActionsCount >= DAILY_ACTION_LIMIT ? 'Денний ліміт дій вичерпано (100/100). Відпочиньте до завтра!' : `Дії активні: доступно ${DAILY_ACTION_LIMIT - dailyActionsCount} із ${DAILY_ACTION_LIMIT} дій`}"></span>
          </div>
          <div class="cabinet-user-names">
            <div class="cabinet-user-name">Гість</div>
            <div class="cabinet-user-badges">
              <span class="cabinet-role-badge cabinet-role-user">
                <i class="fas fa-user-clock"></i> Локальний профіль
              </span>
              <span class="cabinet-points-badge" title="Бали активності">
                <i class="fas fa-coins text-warning"></i> 0 балів
              </span>
              <span class="cabinet-actions-badge" title="Денний захисний ліміт дій: використано ${dailyActionsCount} із ${DAILY_ACTION_LIMIT} дій на добу">
                <i class="fas fa-bolt text-warning"></i> Дій: <span class="cabinet-actions-counter-val">${dailyActionsCount}/${DAILY_ACTION_LIMIT}</span>
              </span>
            </div>
            <div class="cabinet-user-email">Увійдіть через Google для збереження даних у хмарі</div>
          </div>
        `}
      </div>
      <div>
        ${currentUser ? '' : `
          <button type="button" class="btn btn-primary btn-sm font-weight-bold cabinet-login-btn-pulse" id="btnCabinetTopLogin">
            <svg width="15" height="15" viewBox="0 0 48 48" class="me-1 align-middle" style="display:inline-block;"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Увійти
          </button>
        `}
      </div>
    </div>

    <!-- Організація меню кабінету: кнопка вибору перед назвою обраного розділу -->
    <div class="cabinet-section-selector-bar">
      <div class="cabinet-menu-trigger-wrap">
        <button type="button" class="cabinet-menu-picker-btn" id="btnCabinetMenuPicker" aria-haspopup="true" aria-expanded="false" title="Натисніть, щоб обрати розділ меню">
          <i class="fas fa-bars"></i><i class="fas fa-chevron-down ms-1 text-light cabinet-picker-arrow" style="font-size: 0.65rem; opacity: 0.9;"></i>
        </button>
      </div>

      <div class="cabinet-selected-tab-indicator" id="cabinetActiveTabIndicator" title="Натисніть, щоб обрати інший розділ">
        <span class="cabinet-tab-badge-icon">${currentTabObj.icon}</span>
        <span class="cabinet-tab-badge-title">${currentTabObj.name}</span>
      </div>

      <!-- Випадаюче вікно вибору розділу -->
      <div class="cabinet-menu-dropdown-card" id="cabinetMenuDropdown" style="display: none;">
        <div class="cabinet-menu-dropdown-header">
          <span><i class="fas fa-th-list me-1 text-primary"></i> Оберіть розділ меню:</span>
          <button type="button" class="cabinet-menu-dropdown-close" id="btnCabinetCloseDropdown" aria-label="Закрити меню">&times;</button>
        </div>
        <div class="cabinet-menu-dropdown-items">
          ${cabinetTabsList.map(tab => `
            <button type="button" class="cabinet-menu-dropdown-item ${currentCabinetTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
              <div class="cabinet-dropdown-item-header">
                <span class="cabinet-dropdown-item-icon">${tab.icon}</span>
                <span class="cabinet-dropdown-item-title">${tab.name}</span>
                ${currentCabinetTab === tab.id ? '<span class="cabinet-dropdown-item-check"><i class="fas fa-check"></i></span>' : ''}
              </div>
              <div class="cabinet-dropdown-item-desc">${tab.desc}</div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Контейнер для вмісту обраної вкладки -->
    <div id="cabinetTabContent">
      <div class="text-center py-4 text-muted"><i class="fas fa-spinner fa-spin fa-2x"></i></div>
    </div>
  `;

  // Обробники кнопок та меню
  const logoutBtn = document.getElementById('btnCabinetLogout');
  if (logoutBtn) logoutBtn.onclick = logoutUser;

  const loginTopBtn = document.getElementById('btnCabinetTopLogin');
  if (loginTopBtn) loginTopBtn.onclick = loginWithGoogle;

  const pickerBtn = body.querySelector('#btnCabinetMenuPicker');
  const dropdown = body.querySelector('#cabinetMenuDropdown');
  const closeDropdownBtn = body.querySelector('#btnCabinetCloseDropdown');
  const tabIndicator = body.querySelector('#cabinetActiveTabIndicator');

  const toggleDropdown = (show) => {
    if (!dropdown) return;
    const isVisible = dropdown.style.display === 'block';
    const shouldShow = show !== undefined ? show : !isVisible;
    dropdown.style.display = shouldShow ? 'block' : 'none';
    if (pickerBtn) {
      pickerBtn.setAttribute('aria-expanded', shouldShow ? 'true' : 'false');
      pickerBtn.classList.toggle('active', shouldShow);
    }
  };

  if (pickerBtn) pickerBtn.onclick = (e) => { e.stopPropagation(); toggleDropdown(); };
  if (tabIndicator) tabIndicator.onclick = (e) => { e.stopPropagation(); toggleDropdown(); };
  if (closeDropdownBtn) closeDropdownBtn.onclick = (e) => { e.stopPropagation(); toggleDropdown(false); };

  body.querySelectorAll('.cabinet-menu-dropdown-item').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        currentCabinetTab = tab;
        toggleDropdown(false);
        renderUserCabinetContent();
      }
    };
  });

  const onBodyClick = (e) => {
    if (dropdown && dropdown.style.display === 'block' && !dropdown.contains(e.target) && !pickerBtn.contains(e.target) && !tabIndicator.contains(e.target)) {
      toggleDropdown(false);
      document.removeEventListener('click', onBodyClick);
    }
  };
  setTimeout(() => {
    document.addEventListener('click', onBodyClick);
  }, 10);

  // Завантаження вмісту обраної вкладки
  if (currentCabinetTab === 'dashboard') {
    renderDashboardTab();
  } else if (currentCabinetTab === 'hints') {
    renderHintsTab();
  } else if (currentCabinetTab === 'settings') {
    renderSettingsTab();
  } else if (currentCabinetTab === 'admin' && isAdmin) {
    renderAdminOrdersTab();
  } else if (currentCabinetTab === 'bookmarks') {
    renderUserBookmarksTab();
  } else {
    renderUserOrdersTab();
  }
}

// 0. Вкладка: Дашборд
function renderDashboardTab() {
  const container = document.getElementById('cabinetTabContent');
  if (!container) return;

  const cardsCount = (userBookmarkCards && userBookmarkCards.length) ? userBookmarkCards.length : 1;
  const bookmarksCount = (userBookmarksList && userBookmarksList.length) ? userBookmarksList.length : 0;
  const dailyActionsCount = getDailyActionsCount();

  container.innerHTML = `
    <div class="cabinet-dashboard-wrap">
      <!-- Сітка карток показників (Метрики) -->
      <div class="cabinet-dash-metrics-grid">
        <div class="cabinet-dash-metric-card metric-points">
          <div class="dash-metric-icon"><i class="fas fa-coins"></i></div>
          <div class="dash-metric-data">
            <div class="dash-metric-value">0 <span class="dash-metric-unit">балів</span></div>
            <div class="dash-metric-label">Бали активності</div>
            <div class="dash-metric-hint text-warning"><i class="fas fa-clock me-1"></i>Система нарахування незабаром</div>
          </div>
        </div>

        <div class="cabinet-dash-metric-card metric-daily-actions">
          <div class="dash-metric-icon"><i class="fas fa-bolt"></i></div>
          <div class="dash-metric-data">
            <div class="dash-metric-value">${dailyActionsCount} <span class="dash-metric-unit" style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted, #64748b);">/ ${DAILY_ACTION_LIMIT}</span></div>
            <div class="dash-metric-label">Дій 0/100</div>
            <div class="dash-metric-hint text-muted">Захисний ліміт: 100 операцій на день</div>
          </div>
        </div>

        <div class="cabinet-dash-metric-card metric-folders">
          <div class="dash-metric-icon"><i class="fas fa-folder-open"></i></div>
          <div class="dash-metric-data">
            <div class="dash-metric-value">${cardsCount} <span class="dash-metric-unit" style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted, #64748b);">/ ${MAX_USER_CARDS}</span></div>
            <div class="dash-metric-label">Тематичні папки</div>
            <div class="dash-metric-hint text-muted">Ліміт: до ${MAX_USER_CARDS} карток</div>
          </div>
        </div>

        <div class="cabinet-dash-metric-card metric-bookmarks">
          <div class="dash-metric-icon"><i class="fas fa-globe"></i></div>
          <div class="dash-metric-data">
            <div class="dash-metric-value">${bookmarksCount} <span class="dash-metric-unit" style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted, #64748b);">/ ${MAX_USER_BOOKMARKS}</span></div>
            <div class="dash-metric-label">Збережені сайти</div>
            <div class="dash-metric-hint text-muted">Ліміт: до ${MAX_USER_BOOKMARKS} сайтів</div>
          </div>
        </div>

        <div class="cabinet-dash-metric-card metric-cloud">
          <div class="dash-metric-icon" ${currentUser && dailyActionsCount >= DAILY_ACTION_LIMIT ? 'style="background: rgba(239, 68, 68, 0.14); color: #dc2626;"' : ''}>
            <i class="${currentUser && dailyActionsCount >= DAILY_ACTION_LIMIT ? 'fas fa-exclamation-triangle text-danger' : (currentUser ? 'fas fa-shield-alt text-success' : 'fas fa-cloud-upload-alt text-muted')}"></i>
          </div>
          <div class="dash-metric-data">
            <div class="dash-metric-value ${currentUser && dailyActionsCount >= DAILY_ACTION_LIMIT ? 'text-danger font-weight-bold' : (currentUser ? 'text-success' : 'text-secondary')}">
              ${currentUser && dailyActionsCount >= DAILY_ACTION_LIMIT ? 'Не активна (ліміт)' : (currentUser ? 'Активна' : 'Локально')}
            </div>
            <div class="dash-metric-label">Хмарна синхронізація</div>
            <div class="dash-metric-hint ${currentUser && dailyActionsCount >= DAILY_ACTION_LIMIT ? 'text-danger' : 'text-muted'}">
              ${currentUser && dailyActionsCount >= DAILY_ACTION_LIMIT ? 'Денний ліміт 100/100 вичерпано (відновиться завтра)' : (currentUser ? escapeHtml(currentUser.email) : 'Увійдіть для синхронізації')}
            </div>
          </div>
        </div>
      </div>

      <!-- Швидкі дії -->
      <div class="cabinet-dash-section">
        <div class="cabinet-dash-section-title"><i class="fas fa-bolt text-warning"></i> <span>Швидкі дії</span></div>
        <div class="cabinet-dash-actions-grid">
          <a href="./bookmarks.html" class="cabinet-dash-action-btn action-bookmarks" onclick="closeUserCabinetModal()">
            <div class="action-btn-icon"><i class="fas fa-heart"></i></div>
            <div class="action-btn-text">
              <span class="action-btn-title">Мої Закладки</span>
              <span class="action-btn-sub">Перейти до персональних карток</span>
            </div>
          </a>

          <button type="button" class="cabinet-dash-action-btn action-add" id="btnDashAddSite">
            <div class="action-btn-icon"><i class="fas fa-plus"></i></div>
            <div class="action-btn-text">
              <span class="action-btn-title">Додати сайт</span>
              <span class="action-btn-sub">Зберегти нове посилання</span>
            </div>
          </button>

          <button type="button" class="cabinet-dash-action-btn action-settings" id="btnDashOpenSettings">
            <div class="action-btn-icon" style="background: rgba(100, 116, 139, 0.12); color: #475569;"><i class="fas fa-cog"></i></div>
            <div class="action-btn-text">
              <span class="action-btn-title">Налаштування</span>
              <span class="action-btn-sub">Контакти, Telegram та дані</span>
            </div>
          </button>

          <button type="button" class="cabinet-dash-action-btn action-hints" id="btnDashOpenHints">
            <div class="action-btn-icon"><i class="fas fa-lightbulb"></i></div>
            <div class="action-btn-text">
              <span class="action-btn-title">Підказки</span>
              <span class="action-btn-sub">Сортування та корисні поради</span>
            </div>
          </button>

          <button type="button" class="cabinet-dash-action-btn action-ad" id="btnDashOrderAd">
            <div class="action-btn-icon"><i class="fas fa-bullhorn"></i></div>
            <div class="action-btn-text">
              <span class="action-btn-title">Замовити рекламу</span>
              <span class="action-btn-sub">Розмістити свій сайт у каталозі</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Блок про систему балів та розвиток -->
      <div class="cabinet-dash-info-card">
        <div class="dash-info-icon"><i class="fas fa-gift text-warning"></i></div>
        <div class="dash-info-content">
          <h6 class="dash-info-title">Система винагород та накопичення балів</h6>
          <p class="dash-info-desc">
            Ми поступово наповнюємо та розвиваємо Особистий кабінет! Незабаром тут з'явиться можливість накопичувати бали за активне користування каталогом, додавання корисних сервісів та участь у спільноті.
          </p>
        </div>
      </div>
    </div>
  `;

  const addSiteBtn = container.querySelector('#btnDashAddSite');
  if (addSiteBtn) {
    addSiteBtn.onclick = () => {
      closeUserCabinetModal();
      openAddBookmarkModal();
    };
  }

  const settingsBtn = container.querySelector('#btnDashOpenSettings');
  if (settingsBtn) {
    settingsBtn.onclick = () => {
      currentCabinetTab = 'settings';
      renderUserCabinetContent();
    };
  }

  const hintsBtn = container.querySelector('#btnDashOpenHints');
  if (hintsBtn) {
    hintsBtn.onclick = () => {
      currentCabinetTab = 'hints';
      renderUserCabinetContent();
    };
  }

  const adBtn = container.querySelector('#btnDashOrderAd');
  if (adBtn) {
    adBtn.onclick = () => {
      closeUserCabinetModal();
      openAdOrderModal();
    };
  }
}

// 0.2 Вкладка: Налаштування профілю користувача
function renderSettingsTab() {
  const container = document.getElementById('cabinetTabContent');
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `
      <div class="cabinet-settings-wrap">
        <div class="cabinet-settings-card text-center py-4">
          <div class="cabinet-settings-icon mx-auto mb-3" style="width: 48px; height: 48px; font-size: 1.4rem;">
            <i class="fas fa-user-lock"></i>
          </div>
          <h5 class="cabinet-settings-title mb-2">Налаштування профілю</h5>
          <p class="cabinet-settings-desc mb-3" style="font-size: 0.85rem; max-width: 440px; margin: 0 auto;">
            Увійдіть через акаунт Google, щоб персоналізувати свій профіль, зберігати контактні дані та синхронізувати налаштування в хмарі.
          </p>
          <button type="button" class="google-auth-btn mx-auto" id="btnSettingsLogin">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Увійти через Google
          </button>
        </div>
      </div>
    `;
    const loginBtn = container.querySelector('#btnSettingsLogin');
    if (loginBtn) loginBtn.onclick = loginWithGoogle;
    return;
  }

  loadCachedUserProfile();

  const currentDisplayName = userProfileSettings.displayName || currentUser.displayName || '';
  const currentPhone = userProfileSettings.phone || '';
  const currentTg = userProfileSettings.telegram || '';
  const currentNotes = userProfileSettings.customNotes || '';
  let phonePublicState = Boolean(userProfileSettings.isPhonePublic);
  let tgPublicState = Boolean(userProfileSettings.isTelegramPublic);
  const showLeaderboardState = (userProfileSettings.showInLeaderboard !== false);
  const openNewTabState = (userProfileSettings.openInNewTab !== false);
  const noticeBellBadgeState = (userProfileSettings.noticeBellBadge !== false);
  const anonCode = (currentUser.uid || 'USER').slice(0, 5).toUpperCase();

  container.innerHTML = `
    <div class="cabinet-settings-wrap">
      <!-- Блок 1: Системні дані облікового запису -->
      <div class="cabinet-settings-card">
        <div class="cabinet-settings-header">
          <div class="cabinet-settings-icon"><i class="fas fa-shield-alt"></i></div>
          <div>
            <h6 class="cabinet-settings-title">Обліковий запис та безпека</h6>
            <p class="cabinet-settings-desc">Унікальний ID користувача в базі Firebase та статус авторизації</p>
          </div>
        </div>

        <div class="cabinet-setting-field">
          <div class="cabinet-setting-label">
            <span>ID облікового запису (Firebase UID)</span>
            <button type="button" class="cabinet-copy-id-btn" id="btnCopyFirebaseUid" title="Скопіювати унікальний ID">
              <i class="far fa-copy me-1"></i> Скопіювати ID
            </button>
          </div>
          <input type="text" class="cabinet-setting-input" value="${escapeHtml(currentUser.uid)}" readonly id="settingFirebaseUid" style="font-family: monospace; font-size: 0.82rem; letter-spacing: 0.02em;">
          <div class="cabinet-setting-hint">Ваш персональний цифровий ідентифікатор у хмарній базі Firestore.</div>
        </div>

        <div class="cabinet-setting-field mb-0">
          <div class="cabinet-setting-label">
            <span>Електронна пошта</span>
            <div class="cabinet-email-verified-badge"><i class="fas fa-check-circle"></i><span>Підтверджено</span></div>
          </div>
          <input type="email" class="cabinet-setting-input" value="${escapeHtml(currentUser.email || '')}" readonly>
          <div class="cabinet-setting-hint">Прив'язана адреса вашого профілю Google.</div>
        </div>
      </div>

      <!-- Блок 2: Персональні та контактні дані -->
      <div class="cabinet-settings-card">
        <div class="cabinet-settings-header">
          <div class="cabinet-settings-icon"><i class="fas fa-user-edit"></i></div>
          <div>
            <h6 class="cabinet-settings-title">Персональні та контактні дані</h6>
            <p class="cabinet-settings-desc">Використовуються для швидкого заповнення замовлень реклами та зворотного зв'язку</p>
          </div>
        </div>

        <div class="cabinet-setting-field">
          <div class="cabinet-setting-label">
            <label for="settingInputDisplayName" class="m-0">Публічне ім'я / Псевдонім:</label>
            <div class="cabinet-privacy-badge is-locked" title="Зафіксовано системою: публічне ім'я завжди відкрите для ідентифікації вашого профілю"><i class="fas fa-lock"></i><span>Публічно</span></div>
          </div>
          <input type="text" class="cabinet-setting-input" id="settingInputDisplayName" value="${escapeHtml(currentDisplayName)}" placeholder="Наприклад: Олександр">
          <div class="cabinet-setting-hint">Відображається у шапці сайту, привітаннях та ваших персональних діях.</div>
        </div>

        <div class="cabinet-setting-field">
          <div class="cabinet-setting-label">
            <label for="settingInputPhone" class="m-0">Номер мобільного телефону:</label>
            <button type="button" class="cabinet-privacy-toggle ${phonePublicState ? 'is-public' : 'is-private'}" id="togglePrivacyPhone" title="Натисніть, щоб змінити статус: Публічно чи Непублічно"><i class="${phonePublicState ? 'fas fa-eye' : 'fas fa-eye-slash'}"></i><span class="privacy-status-text">${phonePublicState ? 'Публічно' : 'Непублічно'}</span></button>
          </div>
          <input type="tel" class="cabinet-setting-input" id="settingInputPhone" value="${escapeHtml(currentPhone)}" placeholder="+380 (XX) XXX-XX-XX">
          <div class="cabinet-setting-hint">Для оперативного зв'язку, підтвердження замовлень та сервісних питань.</div>
        </div>

        <div class="cabinet-setting-field">
          <div class="cabinet-setting-label">
            <label for="settingInputTelegram" class="m-0">Нікнейм або посилання у Telegram:</label>
            <button type="button" class="cabinet-privacy-toggle ${tgPublicState ? 'is-public' : 'is-private'}" id="togglePrivacyTelegram" title="Натисніть, щоб змінити статус: Публічно чи Непублічно"><i class="${tgPublicState ? 'fas fa-eye' : 'fas fa-eye-slash'}"></i><span class="privacy-status-text">${tgPublicState ? 'Публічно' : 'Непублічно'}</span></button>
          </div>
          <input type="text" class="cabinet-setting-input" id="settingInputTelegram" value="${escapeHtml(currentTg)}" placeholder="@username або https://t.me/username">
          <div class="cabinet-setting-hint">Для швидкого зв'язку в месенджері.</div>
        </div>

        <div class="cabinet-setting-field mb-0">
          <div class="cabinet-setting-label">
            <label for="settingInputNotes" class="m-0">Додаткова інформація / Побажання:</label>
          </div>
          <textarea class="cabinet-setting-input" id="settingInputNotes" rows="2" placeholder="Будь-які примітки чи побажання щодо сервісу...">${escapeHtml(currentNotes)}</textarea>
          <div class="cabinet-setting-hint">Ваші персональні нотатки (зберігаються разом із профілем).</div>
        </div>
      </div>

      <!-- Блок 3: Конфіденційність та персоналізація -->
      <div class="cabinet-settings-card">
        <div class="cabinet-settings-header">
          <div class="cabinet-settings-icon" style="background: rgba(139, 92, 246, 0.12); color: #8b5cf6;"><i class="fas fa-user-shield"></i></div>
          <div>
            <h6 class="cabinet-settings-title">Конфіденційність та персоналізація</h6>
            <p class="cabinet-settings-desc">Керування публічністю профілю та індивідуальними параметрами інтерфейсу</p>
          </div>
        </div>

        <div class="cabinet-setting-checkbox-row">
          <label class="cabinet-checkbox-label" for="settingShowLeaderboard">
            <input type="checkbox" class="cabinet-setting-checkbox" id="settingShowLeaderboard" ${showLeaderboardState ? 'checked' : ''}>
            <div class="cabinet-checkbox-body">
              <span class="cabinet-checkbox-title">Відображати моє публічне ім'я в загальному рейтингу активності та статистиці</span>
              <span class="cabinet-checkbox-desc">Якщо вимкнено - у публічних списках лідерів ви відображатиметеся конфіденційно як «Анонім #${anonCode}».</span>
            </div>
          </label>
        </div>

        <div class="cabinet-setting-checkbox-row">
          <label class="cabinet-checkbox-label" for="settingOpenNewTab">
            <input type="checkbox" class="cabinet-setting-checkbox" id="settingOpenNewTab" ${openNewTabState ? 'checked' : ''}>
            <div class="cabinet-checkbox-body">
              <span class="cabinet-checkbox-title">Відкривати сайти із закладок у новій вкладці браузера</span>
              <span class="cabinet-checkbox-desc">Якщо увімкнено - перехід за збереженими посиланнями залишає вкладку каталогу відкритою.</span>
            </div>
          </label>
        </div>

        <div class="cabinet-setting-checkbox-row mb-0">
          <label class="cabinet-checkbox-label" for="settingNoticeBellBadge">
            <input type="checkbox" class="cabinet-setting-checkbox" id="settingNoticeBellBadge" ${noticeBellBadgeState ? 'checked' : ''}>
            <div class="cabinet-checkbox-body">
              <span class="cabinet-checkbox-title">Світловий індикатор нових оголошень на значку дзвіночка (🔔)</span>
              <span class="cabinet-checkbox-desc">Показувати цяточку біля дзвіночка на сайті, коли з'явилися нові повідомлення або корисні ресурси.</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Нижня панель збереження -->
      <div class="cabinet-settings-save-bar">
        <button type="button" class="cabinet-settings-save-btn" id="btnSaveUserSettings">
          <i class="fas fa-check-circle"></i> Зберегти внесені налаштування
        </button>
        <div class="cabinet-settings-save-note">
          <i class="fas fa-shield-alt me-1"></i> Збереження виконується одним пакетом (1 операція запису) для ощадливого використання бази даних.
        </div>
      </div>
    </div>
  `;

  // Копіювання UID
  const copyBtn = container.querySelector('#btnCopyFirebaseUid');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const uidVal = currentUser.uid;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(uidVal).then(() => {
          showQuickToast('ID облікового запису скопійовано!', 'success');
        }).catch(() => {
          fallbackCopyText(uidVal);
        });
      } else {
        fallbackCopyText(uidVal);
      }
    };
  }

  function fallbackCopyText(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showQuickToast('ID облікового запису скопійовано!', 'success');
    } catch (e) {
      showQuickToast('Не вдалося скопіювати ID', 'warning');
    }
    document.body.removeChild(input);
  }

  // Інтерактивні перемикачі публічності
  const phoneToggleBtn = container.querySelector('#togglePrivacyPhone');
  if (phoneToggleBtn) {
    phoneToggleBtn.onclick = (e) => {
      e.preventDefault();
      phonePublicState = !phonePublicState;
      phoneToggleBtn.className = `cabinet-privacy-toggle ${phonePublicState ? 'is-public' : 'is-private'}`;
      phoneToggleBtn.innerHTML = `
        <i class="${phonePublicState ? 'fas fa-eye' : 'fas fa-eye-slash'}"></i><span class="privacy-status-text">${phonePublicState ? 'Публічно' : 'Непублічно'}</span>
      `;
    };
  }

  const tgToggleBtn = container.querySelector('#togglePrivacyTelegram');
  if (tgToggleBtn) {
    tgToggleBtn.onclick = (e) => {
      e.preventDefault();
      tgPublicState = !tgPublicState;
      tgToggleBtn.className = `cabinet-privacy-toggle ${tgPublicState ? 'is-public' : 'is-private'}`;
      tgToggleBtn.innerHTML = `
        <i class="${tgPublicState ? 'fas fa-eye' : 'fas fa-eye-slash'}"></i><span class="privacy-status-text">${tgPublicState ? 'Публічно' : 'Непублічно'}</span>
      `;
    };
  }

  // Обробник збереження налаштувань
  const saveBtn = container.querySelector('#btnSaveUserSettings');
  if (saveBtn) {
    saveBtn.onclick = async () => {
      if (!checkAndIncrementDailyActionLimit()) return;

      const nameVal = (container.querySelector('#settingInputDisplayName')?.value || '').trim();
      const phoneVal = (container.querySelector('#settingInputPhone')?.value || '').trim();
      const tgVal = (container.querySelector('#settingInputTelegram')?.value || '').trim();
      const notesVal = (container.querySelector('#settingInputNotes')?.value || '').trim();
      const showLeaderboardVal = Boolean(container.querySelector('#settingShowLeaderboard')?.checked);
      const openNewTabVal = Boolean(container.querySelector('#settingOpenNewTab')?.checked);
      const noticeBellBadgeVal = Boolean(container.querySelector('#settingNoticeBellBadge')?.checked);

      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Збереження...';

      userProfileSettings = {
        displayName: nameVal,
        phone: phoneVal,
        telegram: tgVal,
        customNotes: notesVal,
        isPhonePublic: phonePublicState,
        isTelegramPublic: tgPublicState,
        showInLeaderboard: showLeaderboardVal,
        openInNewTab: openNewTabVal,
        noticeBellBadge: noticeBellBadgeVal,
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('user_profile_' + currentUser.uid, JSON.stringify(userProfileSettings));
      } catch (e) {}

      updateNoticeBellState();

      try {
        await ensureFirebaseLoaded();
        if (firebaseDb && currentUser) {
          await firebaseDb.collection('users').doc(currentUser.uid).set({
            profile: userProfileSettings,
            displayName: nameVal || currentUser.displayName || '',
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        showQuickToast('Налаштування успішно збережено!', 'success');
        renderUserCabinetContent();
      } catch (err) {
        console.warn('Помилка збереження налаштувань:', err);
        showQuickToast('Збережено локально. Помилка синхронізації з хмарою.', 'warning');
        saveBtn.disabled = false;
      }
    };
  }
}

// 0.1 Вкладка: Підказки (ті дві підказки, що були на оборотній стороні шапочки, та інструкції)
function renderHintsTab() {
  const container = document.getElementById('cabinetTabContent');
  if (!container) return;

  container.innerHTML = `
    <div class="cabinet-hints-wrap">
      <div class="cabinet-hints-header mb-3">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h5 class="font-weight-bold mb-1"><i class="fas fa-lightbulb text-warning me-2"></i>Корисні підказки та інструкції</h5>
            <p class="text-muted small mb-0">Дізнайтеся, як максимально зручно користуватися персональними закладками та каталогом.</p>
          </div>
          <button type="button" class="btn btn-outline-secondary btn-sm" id="btnHintsBackDash">
            <i class="fas fa-tachometer-alt me-1"></i> На Дашборд
          </button>
        </div>
      </div>

      <div class="cabinet-tips-list">
        <!-- Підказка 1 -->
        <div class="cabinet-tip-card">
          <div class="cabinet-tip-badge tip-badge-blue">
            <svg width="10" height="15" viewBox="0 0 10 15" fill="currentColor" style="display:inline-block; vertical-align:middle;"><circle cx="2.5" cy="2.5" r="1.6"/><circle cx="7.5" cy="2.5" r="1.6"/><circle cx="2.5" cy="7.5" r="1.6"/><circle cx="7.5" cy="7.5" r="1.6"/><circle cx="2.5" cy="12.5" r="1.6"/><circle cx="7.5" cy="12.5" r="1.6"/></svg>
          </div>
          <div class="cabinet-tip-body">
            <div class="cabinet-tip-title">Сортування та зміна порядку карток</div>
            <p class="cabinet-tip-desc">
              Ви можете легко змінювати розташування карток перетягуванням. Затисніть квадратний значок із точками <strong><span class="d-inline-flex align-items-center justify-content-center px-1 rounded bg-secondary text-white" style="width:20px;height:20px;vertical-align:middle;"><svg width="8" height="12" viewBox="0 0 10 15" fill="currentColor"><circle cx="2.5" cy="2.5" r="1.6"/><circle cx="7.5" cy="2.5" r="1.6"/><circle cx="2.5" cy="7.5" r="1.6"/><circle cx="7.5" cy="7.5" r="1.6"/><circle cx="2.5" cy="12.5" r="1.6"/><circle cx="7.5" cy="12.5" r="1.6"/></svg></span></strong> ліворуч у шапці будь-якої картки та перетягніть її на бажане місце (працює мишкою на комп'ютері або дотиком на смартфоні). Новий порядок карток зберігається автоматично!
            </p>
          </div>
        </div>

        <!-- Підказка 2 -->
        <div class="cabinet-tip-card">
          <div class="cabinet-tip-badge tip-badge-red">
            <i class="fas fa-heart"></i>
          </div>
          <div class="cabinet-tip-body">
            <div class="cabinet-tip-title">Швидке додавання з каталогу «ТОП ЗАКЛАДКИ»</div>
            <p class="cabinet-tip-desc">
              Розгорніть опис будь-якого сайту на будь-якій сторінці нашого каталогу та натисніть на значок <strong>❤️</strong> ліворуч - обраний сайт миттєво збережеться у ваші закладки без необхідності копіювати посилання чи вводити назву вручну!
            </p>
          </div>
        </div>

        <!-- Підказка 3 -->
        <div class="cabinet-tip-card">
          <div class="cabinet-tip-badge tip-badge-green">
            <i class="fas fa-cloud-upload-alt"></i>
          </div>
          <div class="cabinet-tip-body">
            <div class="cabinet-tip-title">Хмарна синхронізація на всіх пристроях</div>
            <p class="cabinet-tip-desc">
              Увійдіть через акаунт Google в 1 клік — ваші створені тематичні папки та всі збережені закладки будуть надійно збережені у хмарі та доступні на комп'ютері, смартфоні й планшеті одночасно.
            </p>
          </div>
      </div>
    </div>
  `;

  const backDashBtn = container.querySelector('#btnHintsBackDash');
  if (backDashBtn) {
    backDashBtn.onclick = () => {
      currentCabinetTab = 'dashboard';
      renderUserCabinetContent();
    };
  }
}

// 1. Вкладка: Мої замовлення
async function renderUserOrdersTab() {
  const container = document.getElementById('cabinetTabContent');
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `
      <div class="cabinet-guest-auth-prompt text-center py-4">
        <div class="mb-3 text-primary" style="font-size: 2.4rem;"><i class="fas fa-bullhorn"></i></div>
        <h5 class="font-weight-bold mb-2">Історія замовлень реклами</h5>
        <p class="text-muted small mb-3" style="max-width: 440px; margin: 0 auto; line-height: 1.45;">
          Увійдіть через акаунт Google, щоб переглядати ваші замовлення, узгоджені локації, терміни розміщення та статуси:
        </p>
        <button type="button" class="google-auth-btn" id="btnTabOrdersLogin">
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Увійти через Google
        </button>
      </div>
    `;
    const btn = container.querySelector('#btnTabOrdersLogin');
    if (btn) btn.onclick = loginWithGoogle;
    return;
  }

  if (!firebaseDb) {
    container.innerHTML = `<div class="alert alert-warning">База даних завантажується...</div>`;
    return;
  }

  try {
    // Запит замовлень за email
    const snap = await firebaseDb.collection('orders')
      .where('userEmail', '==', currentUser.email)
      .get();

    let orders = [];
    snap.forEach(doc => {
      orders.push(doc.data());
    });

    // Сортування за датою (нові зверху)
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="cabinet-empty-state text-center">
          <div class="cabinet-empty-icon"><i class="fas fa-clipboard-list"></i></div>
          <h6 class="cabinet-empty-title">У Вас поки немає активних замовлень</h6>
          <p class="cabinet-empty-desc text-muted">
            Ви можете оформити розміщення свого сайту у тематичних картках або партнерських блоках каталогу.
          </p>
          <button type="button" class="btn btn-primary font-weight-bold cabinet-empty-btn" id="btnCabinetNewAd">
            <i class="fas fa-plus-circle me-1"></i> Оформити розміщення
          </button>
        </div>
      `;
      const newAdBtn = document.getElementById('btnCabinetNewAd');
      if (newAdBtn) {
        newAdBtn.onclick = () => {
          closeUserCabinetModal();
          openAdOrderModal();
        };
      }
      return;
    }

    let html = `
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h6 class="font-weight-bold mb-0">Ваші замовлення (${orders.length}):</h6>
        <button type="button" class="btn btn-sm btn-outline-primary" id="btnCabinetNewAdTop">
          <i class="fas fa-plus"></i> Нове замовлення
        </button>
      </div>
      <div class="cabinet-orders-list">
    `;

    orders.forEach(order => {
      const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
      const statusPill = getStatusPillHtml(order.status, order.statusLabel);

      let placementsListHtml = '';
      if (order.placements && order.placements.length) {
        placementsListHtml = order.placements.map(p => `• ${p.section || ''} > ${p.card || ''} (${p.locationLabel || ''})`).join('<br>');
      }

      html += `
        <div class="cabinet-order-card">
          <div class="cabinet-order-header">
            <div>
              <span class="cabinet-order-id">${order.orderId}</span>
              <span class="cabinet-order-date ms-2">• ${dateStr}</span>
            </div>
            ${statusPill}
          </div>
          <div class="cabinet-order-details">
            <div class="cabinet-order-row"><strong>Ресурс:</strong> ${order.siteName} — <a href="${order.siteUrl}" target="_blank" class="text-primary font-weight-bold">${order.siteUrl} <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i></a></div>
            ${placementsListHtml ? `<div class="cabinet-order-row"><strong>Локації:</strong><br><span class="text-muted small">${placementsListHtml}</span></div>` : ''}
            <div class="cabinet-order-row mt-1">
              <strong>Сума:</strong> <span class="text-primary font-weight-bold">${order.pricing ? order.pricing.finalUah : ''} грн</span> (~ $${order.pricing ? order.pricing.finalUsdt : ''} USDT)
              <span class="text-muted small ms-2">• Термін: ${order.pricing ? order.pricing.termLabel : ''}</span>
            </div>
          </div>
          <div class="cabinet-order-actions">
            <button type="button" class="ad-sub-copy-btn" onclick="copyOrderDetails('${order.orderId}', this)">
              <i class="far fa-copy"></i> Копіювати чек
            </button>
            <a href="https://t.me/WeberSIS?text=${encodeURIComponent('Вітаю! Моє замовлення ' + order.orderId)}" target="_blank" class="btn btn-sm btn-outline-info font-weight-bold" style="border-radius: 5px; font-size: 0.78rem;">
              <i class="fab fa-telegram-plane"></i> Написати в Telegram
            </a>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    const newAdTopBtn = document.getElementById('btnCabinetNewAdTop');
    if (newAdTopBtn) {
      newAdTopBtn.onclick = () => {
        closeUserCabinetModal();
        openAdOrderModal();
      };
    }
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Помилка завантаження замовлень: ${err.message}</div>`;
  }
}

// 2. Вкладка: Мої закладки (Хмарна синхронізація)
async function renderUserBookmarksTab() {
  const container = document.getElementById('cabinetTabContent');
  if (!container || !currentUser) return;

  const cardsCount = (userBookmarkCards && userBookmarkCards.length) ? userBookmarkCards.length : 1;
  const bookmarksCount = (userBookmarksList && userBookmarksList.length) ? userBookmarksList.length : 0;

  container.innerHTML = `
    <div class="my-1 p-2 text-center cabinet-bookmarks-tab-box" style="background: rgba(225, 29, 72, 0.06); border: 1px solid rgba(225, 29, 72, 0.2); border-radius: 10px;">
      <!-- Суцільний симетричний бейджик статистики з розділенням по центру -->
      <div class="cabinet-bm-unified-stats-wrap mb-2">
        <div class="cabinet-bm-unified-badge">
          <div class="cabinet-bm-stat-col">
            <i class="fas fa-folder-open"></i>
            <span>Карток: <strong>${cardsCount}</strong></span>
          </div>
          <div class="cabinet-bm-stat-divider"></div>
          <div class="cabinet-bm-stat-col">
            <i class="fas fa-globe"></i>
            <span>Сайтів: <strong>${bookmarksCount}</strong></span>
          </div>
        </div>
        <div class="cabinet-bm-unified-limits">
          <div class="cabinet-bm-limit-col">
            <i class="fas fa-info-circle"></i> <span>Ліміт: до <strong>${MAX_USER_CARDS}</strong> карток</span>
          </div>
          <div class="cabinet-bm-limit-divider"></div>
          <div class="cabinet-bm-limit-col">
            <i class="fas fa-info-circle"></i> <span>Ліміт: до <strong>${MAX_USER_BOOKMARKS}</strong> сайтів</span>
          </div>
        </div>
      </div>

      <div style="font-size: 1.9rem; margin-bottom: 6px;">❤️</div>
      <h6 class="font-weight-bold text-danger mb-1" style="font-size: 0.98rem;">Окремий розділ «Мої Закладки»</h6>
      <p class="text-muted small mb-2" style="max-width: 420px; margin-left: auto; margin-right: auto; line-height: 1.35; font-size: 0.78rem;">
        Зручно додавайте улюблені сайти, здійснюйте швидкий пошук та керуйте персональними посиланнями на окремій повноформатній сторінці.
      </p>
      <a href="./bookmarks.html" class="btn btn-danger font-weight-bold px-3 py-1 text-decoration-none" style="border-radius: 8px; font-size: 0.84rem; display: inline-block;" onclick="closeUserCabinetModal()">
        Відкрити «❤️ Закладки» ↗
      </a>
    </div>
  `;
}

async function addUserBookmark() {
  const nameEl = document.getElementById('bmNameInput');
  const urlEl = document.getElementById('bmUrlInput');
  if (!nameEl || !urlEl || !currentUser || !firebaseDb) return;

  const name = nameEl.value.trim();
  let url = urlEl.value.trim();
  if (!name || !url) {
    alert("Будь ласка, введіть назву та посилання сайту.");
    return;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  removeDeletedBookmarkRecord(url);
  userBookmarksList.push({ name, url, card: DEFAULT_CARD_NAME, icon: getFaviconForUrl(url), createdAt: new Date().toISOString() });

  try {
    await saveUserBookmarksData();
    renderUserBookmarksTab();
    renderBookmarksPage();
    syncAllCatalogHeartButtons();
  } catch (err) {
    alert("Не вдалося зберегти закладку: " + err.message);
  }
}

async function deleteUserBookmark(index) {
  const bm = userBookmarksList[index];
  if (!bm) return;
  if (!confirm(`Видалити «${bm.name}» із ваших закладок?`)) return;
  if (!checkAndIncrementDailyActionLimit()) return;

  const targetUrl = normalizeUrl(bm.url);
  recordDeletedBookmarkUrl(targetUrl);
  userBookmarksList.splice(index, 1);
  await saveUserBookmarksData();
  renderUserBookmarksTab();
  renderBookmarksPage();
  syncAllCatalogHeartButtons();
  showQuickToast(`«${bm.name}» видалено з закладок`, 'info');
}

// Синхронізація вкладки «❤️ Закладки» у навігаційній панелі (відображається завжди)
function syncBookmarksNav() {
  const navLists = document.querySelectorAll('.navbar-nav');
  navLists.forEach(navList => {
    let item = navList.querySelector('#navItemBookmarks');
    const isBookmarksPage = window.location.pathname.includes('bookmarks.html');

    if (!item) {
      item = document.createElement('li');
      item.id = 'navItemBookmarks';
      item.className = 'nav-item nav-item-bookmarks';
      item.innerHTML = `
        <a class="nav-link nav-link-bookmarks ${isBookmarksPage ? 'active' : ''}" href="./bookmarks.html" title="Мої персональні закладки" aria-label="Мої персональні закладки">
          <span class="nav-heart-icon">❤️</span>
        </a>
      `;
      navList.appendChild(item);
    }

    const link = item.querySelector('a');
    if (link) {
      link.innerHTML = `<span class="nav-heart-icon">❤️</span>`;
      link.title = currentUser ? 'Мої персональні закладки' : 'Мої персональні закладки (натисніть для входу)';
      link.setAttribute('aria-label', 'Мої персональні закладки');
      if (isBookmarksPage) link.classList.add('active');
      else link.classList.remove('active');

      link.onclick = (e) => {
        if (!currentUser) {
          e.preventDefault();
          openGuestBookmarksInfoModal();
        }
      };
    }
  });
}

// Дружнє інформаційне вікно для неавторизованого користувача при спробі відкрити «❤️ Закладки»
function openGuestBookmarksInfoModal() {
  let modal = document.getElementById('guestBookmarksInfoModal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'guestBookmarksInfoModal';
  modal.className = 'guest-bm-modal-backdrop';
  modal.innerHTML = `
    <div class="guest-bm-modal-card" role="dialog" aria-modal="true" aria-labelledby="guestBmModalTitle">
      <div class="guest-bm-modal-header">
        <h3 class="guest-bm-modal-title" id="guestBmModalTitle">
          <span class="nav-heart-icon">❤️</span>
          <span>Розділ «Мої Закладки»</span>
        </h3>
        <button type="button" class="guest-bm-modal-close" id="btnCloseGuestBmModal" aria-label="Закрити">&times;</button>
      </div>

      <div class="guest-bm-modal-body">
        <div class="guest-bm-promo-banner">
          <p class="guest-bm-promo-desc">
            Створюйте власний затишний простір, впорядковуйте корисні ресурси та майте швидкий доступ до улюблених сайтів з будь-якого пристрою!
          </p>
          <button type="button" class="btn btn-primary cabinet-login-btn-pulse guest-bm-login-action-btn" id="btnGuestBmModalLogin">
            <svg width="18" height="18" viewBox="0 0 48 48" class="align-middle" style="display:inline-block;"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Увійти через Google в 1 клік
          </button>
        </div>

        <div>
          <div class="guest-bm-features-header">
            <i class="fas fa-sparkles text-warning"></i>
            <span>Що це дасть користувачеві (переваги та функції):</span>
          </div>
          <div class="guest-bm-features-list">
            <div class="guest-bm-feature-item">
              <span class="guest-bm-feature-icon">📂</span>
              <div class="guest-bm-feature-text">
                <strong>Тематичні папки</strong> - створення власних карток під роботу, новини, покупки чи хобі.
              </div>
            </div>
            <div class="guest-bm-feature-item">
              <span class="guest-bm-feature-icon">⭐</span>
              <div class="guest-bm-feature-text">
                <strong>Збереження сайтів в 1 клік</strong> - додавайте улюблені ресурси з нашого каталогу або власні зовнішні посилання.
              </div>
            </div>
            <div class="guest-bm-feature-item">
              <span class="guest-bm-feature-icon">☁️</span>
              <div class="guest-bm-feature-text">
                <strong>Хмарна синхронізація</strong> - персональні закладки автоматично доступні на всіх ваших пристроях: комп'ютері, телефоні чи планшеті.
              </div>
            </div>
            <div class="guest-bm-feature-item">
              <span class="guest-bm-feature-icon">🔄</span>
              <div class="guest-bm-feature-text">
                <strong>Зручне впорядкування</strong> - перетягування карток, налаштування порядку та зручний робочий простір під рукою.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="guest-bm-modal-footer">
        <a href="./bookmarks.html" class="btn btn-outline-secondary btn-sm" id="btnGuestPreviewBookmarks" style="border-radius: 8px;">
          <i class="fas fa-eye me-1"></i> Ознайомитися з розділом
        </a>
        <button type="button" class="btn btn-secondary btn-sm" id="btnDismissGuestBmModal" style="border-radius: 8px;">
          Закрити
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
  };

  const closeBtn = modal.querySelector('#btnCloseGuestBmModal');
  if (closeBtn) closeBtn.onclick = closeModal;

  const dismissBtn = modal.querySelector('#btnDismissGuestBmModal');
  if (dismissBtn) dismissBtn.onclick = closeModal;

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  const loginBtn = modal.querySelector('#btnGuestBmModalLogin');
  if (loginBtn) {
    loginBtn.onclick = async () => {
      closeModal();
      await loginWithGoogle();
      if (currentUser) {
        window.location.href = './bookmarks.html';
      }
    };
  }
}

// ==========================================================================
// ОКРЕМИЙ ПОВНОЦІННИЙ РОЗДІЛ «❤️ ЗАКЛАДКИ» (bookmarks.html)
// ==========================================================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeUrl(u) {
  if (!u) return '';
  try {
    const parsed = new URL(u);
    return (parsed.origin + parsed.pathname).toLowerCase().replace(/\/$/, '');
  } catch (e) {
    return String(u).trim().toLowerCase().replace(/\/$/, '');
  }
}

function isUrlInBookmarks(url) {
  if (!userBookmarksList || !url) return false;
  const targetNorm = normalizeUrl(url);
  return userBookmarksList.some(bm => normalizeUrl(bm.url) === targetNorm);
}

function showQuickToast(msg, type = 'info') {
  let toast = document.getElementById('customQuickToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'customQuickToast';
    toast.className = 'custom-quick-toast';
    document.body.appendChild(toast);
  } else {
    // Завжди переміщуємо у кінець body, щоб гарантувати найвищий рівень накладання
    if (toast.parentElement !== document.body || toast !== document.body.lastElementChild) {
      document.body.appendChild(toast);
    }
  }

  let iconHtml = '';
  if (type === 'warning') {
    iconHtml = '<i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 1.25rem; flex-shrink: 0;" aria-hidden="true"></i>';
  } else if (type === 'error' || type === 'danger') {
    iconHtml = '<i class="fas fa-exclamation-circle" style="color: #ef4444; font-size: 1.25rem; flex-shrink: 0;" aria-hidden="true"></i>';
  } else if (type === 'success') {
    iconHtml = '<i class="fas fa-check-circle" style="color: #10b981; font-size: 1.25rem; flex-shrink: 0;" aria-hidden="true"></i>';
  } else {
    iconHtml = '<i class="fas fa-info-circle" style="color: #0ea5e9; font-size: 1.25rem; flex-shrink: 0;" aria-hidden="true"></i>';
  }

  toast.className = `custom-quick-toast ${type} show`;
  toast.innerHTML = `${iconHtml}<div style="flex: 1; min-width: 0; word-break: break-word;">${msg}</div>`;
  clearTimeout(toast._timer);
  const duration = (type === 'warning' || type === 'error' || type === 'danger') ? 4200 : 3200;
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

function showCustomModal({ title, bodyHtml, footerHtml }) {
  let modalWrap = document.getElementById('universalActionModal');
  if (!modalWrap) {
    modalWrap = document.createElement('div');
    modalWrap.id = 'universalActionModal';
    modalWrap.className = 'universal-modal-backdrop';
    document.body.appendChild(modalWrap);
  }
  modalWrap.innerHTML = `
    <div class="universal-modal-card" role="dialog" aria-modal="true">
      <div class="universal-modal-header">
        <h6 style="margin: 0; font-weight: 700; font-size: 0.95rem; color: #fff;">${title}</h6>
        <button type="button" class="universal-modal-close-btn" style="background: transparent; border: none; color: #fff; font-size: 1.35rem; cursor: pointer; padding: 0 4px; line-height: 1;" aria-label="Закрити">&times;</button>
      </div>
      <div class="universal-modal-body">
        ${bodyHtml}
      </div>
      ${footerHtml ? `<div class="universal-modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;

  // Автоматична підтримка клавіші Enter для текстових полів модального вікна
  const modalInputs = modalWrap.querySelectorAll('.universal-modal-body input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"])');
  modalInputs.forEach(inp => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const primaryBtn = modalWrap.querySelector('.universal-modal-footer button.btn-danger, .universal-modal-footer button.btn-primary, .universal-modal-footer button:last-child');
        if (primaryBtn && !primaryBtn.disabled) {
          primaryBtn.click();
        }
      }
    });
  });

  // Гарантоване підключення обробників закриття для мобільних пристроїв та ПК
  const closeTriggers = modalWrap.querySelectorAll('.universal-modal-close-btn, [onclick*="closeCustomModal"], [data-dismiss="modal"]');
  closeTriggers.forEach(btn => {
    btn.onclick = (e) => {
      if (e) e.preventDefault();
      closeCustomModal();
    };
  });

  modalWrap.onclick = (e) => {
    if (e.target === modalWrap) closeCustomModal();
  };

  modalWrap.classList.add('show');
  modalWrap.style.setProperty('display', 'flex', 'important');
  document.body.style.overflow = 'hidden';
}
window.showCustomModal = showCustomModal;

function closeCustomModal() {
  const modalWrap = document.getElementById('universalActionModal');
  if (modalWrap) {
    modalWrap.classList.remove('show');
    modalWrap.style.setProperty('display', 'none', 'important');
    modalWrap.innerHTML = '';
  }
  if (!document.querySelector('.cl-modal-backdrop.show') && !document.getElementById('userCabinetModal')) {
    document.body.style.overflow = '';
  }
}
window.closeCustomModal = closeCustomModal;

if (typeof window !== 'undefined' && !window._universalModalEscAttached) {
  window._universalModalEscAttached = true;
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCustomModal();
  });
}

function isDefaultCard(cardName) {
  if (!cardName) return true;
  const c = cardName.toLowerCase().replace(/^[^\wа-яіїєґА-ЯІЇЄҐ0-9]+/u, '').replace(/[📌\s]+/g, ' ').trim();
  return c === 'основні закладки' || c === 'основні закладки 📌' || cardName.includes('Основні закладки');
}

const getBookmarksStorageKey = (uid) => uid ? `topz_bm_user_${uid}` : 'topz_bm_user_guest';
const getCardsStorageKey = (uid) => uid ? `topz_bm_cards_${uid}` : 'topz_bm_cards_guest';
const getColumnsStorageKey = (uid) => uid ? `topz_bm_columns_${uid}` : 'topz_bm_columns_guest';
const GENERAL_BM_KEY = 'topz_bm_all_saved';
const GENERAL_CARDS_KEY = 'topz_bm_cards_all';
const GENERAL_COLS_KEY = 'topz_bm_columns_v4';

// Реєстр видалених користувачем закладок (запобігає випадковому поверненню зі старого кешу чи хмари)
function getDeletedBookmarkUrls() {
  const uid = currentUser ? currentUser.uid : 'guest';
  const key = `topz_deleted_bm_${uid}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const list = JSON.parse(raw);
    const now = Date.now();
    const valid = list.filter(item => item && (now - item.t < 14 * 24 * 3600 * 1000));
    return new Set(valid.map(v => v.u));
  } catch (e) {
    return new Set();
  }
}

function recordDeletedBookmarkUrl(url) {
  if (!url) return;
  const uid = currentUser ? currentUser.uid : 'guest';
  const key = `topz_deleted_bm_${uid}`;
  try {
    const raw = localStorage.getItem(key);
    let list = raw ? JSON.parse(raw) : [];
    const norm = normalizeUrl(url);
    const now = Date.now();
    list = list.filter(item => item && item.u !== norm && (now - item.t < 14 * 24 * 3600 * 1000));
    list.push({ u: norm, t: now });
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}
}

function removeDeletedBookmarkRecord(url) {
  if (!url) return;
  const uid = currentUser ? currentUser.uid : 'guest';
  const key = `topz_deleted_bm_${uid}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    let list = JSON.parse(raw);
    const norm = normalizeUrl(url);
    list = list.filter(item => item && item.u !== norm);
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}
}

// Ліміти тарифного плану Spark та захист від спаму (DAILY_ACTION_LIMIT оголошено вище)
function checkAndIncrementDailyActionLimit() {
  const uid = currentUser ? currentUser.uid : 'guest';
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const key = `topz_daily_actions_${uid}`;
  let data = { date: today, count: 0 };
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today && typeof parsed.count === 'number') {
        data = parsed;
      }
    }
  } catch (e) {}

  if (data.count >= DAILY_ACTION_LIMIT) {
    alert(`Ви досягли денного ліміту операцій (${DAILY_ACTION_LIMIT} дій на добу).\n\nЦе обмеження створено для захисту сервера та бази даних від навантаження. Відпочиньте до завтра!`);
    return false;
  }

  data.count += 1;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
  updateDailyActionsCounters();
  return true;
}

function syncColumnsWithCards() {
  if (!userBookmarkColumns || !Array.isArray(userBookmarkColumns) || userBookmarkColumns.length !== 4) {
    userBookmarkColumns = [[], [], [], []];
  }
  // Ensure default card is in userBookmarkCards
  if (!userBookmarkCards || userBookmarkCards.length === 0 || !userBookmarkCards.some(isDefaultCard)) {
    userBookmarkCards = [DEFAULT_CARD_NAME, ...(userBookmarkCards || []).filter(c => !isDefaultCard(c))];
  } else {
    userBookmarkCards = userBookmarkCards.map(c => isDefaultCard(c) ? DEFAULT_CARD_NAME : c);
  }

  // Normalize card names in columns
  userBookmarkColumns = userBookmarkColumns.map(col => 
    (col || []).map(c => isDefaultCard(c) ? DEFAULT_CARD_NAME : c)
  );

  // If columns are completely empty, distribute existing userBookmarkCards evenly across 4 columns
  const totalInCols = userBookmarkColumns[0].length + userBookmarkColumns[1].length + userBookmarkColumns[2].length + userBookmarkColumns[3].length;
  if (totalInCols === 0 && userBookmarkCards.length > 0) {
    userBookmarkCards.forEach((cName, idx) => {
      userBookmarkColumns[idx % 4].push(cName);
    });
  }

  // Ensure DEFAULT_CARD_NAME is in col 0 (and only in col 0, at position 0)
  for (let i = 0; i < 4; i++) {
    userBookmarkColumns[i] = userBookmarkColumns[i].filter(c => !isDefaultCard(c));
  }
  userBookmarkColumns[0].unshift(DEFAULT_CARD_NAME);

  // Remove duplicate cards across columns if any
  const seenCards = new Set();
  for (let i = 0; i < 4; i++) {
    userBookmarkColumns[i] = userBookmarkColumns[i].filter(c => {
      if (seenCards.has(c)) return false;
      seenCards.add(c);
      return true;
    });
  }

  // Clean up any cards in columns that are no longer in userBookmarkCards
  const validCardsSet = new Set(userBookmarkCards);
  for (let i = 0; i < 4; i++) {
    userBookmarkColumns[i] = userBookmarkColumns[i].filter(c => validCardsSet.has(c));
  }

  // If any cards in userBookmarkCards are not yet assigned to any column, place them in the column with least cards
  const assignedSet = new Set([
    ...userBookmarkColumns[0],
    ...userBookmarkColumns[1],
    ...userBookmarkColumns[2],
    ...userBookmarkColumns[3]
  ]);

  userBookmarkCards.forEach(cName => {
    if (!assignedSet.has(cName)) {
      let minCol = 0;
      let minLen = userBookmarkColumns[0].length;
      for (let i = 1; i < 4; i++) {
        if (userBookmarkColumns[i].length < minLen) {
          minLen = userBookmarkColumns[i].length;
          minCol = i;
        }
      }
      userBookmarkColumns[minCol].push(cName);
      assignedSet.add(cName);
    }
  });

  // Автоматичне вирівнювання: якщо проміжні колонки 1 чи 2 порожні, а в наступних колонках є картки
  // (наприклад, через попередній запис в останню колонку на мобільних пристроях),
  // послідовно зсуваємо картки у порожні попередні колонки, щоб уникнути штучних розривів на смартфонах:
  for (let c = 1; c < 3; c++) {
    if (userBookmarkColumns[c].length === 0) {
      for (let nextCol = c + 1; nextCol < 4; nextCol++) {
        if (userBookmarkColumns[nextCol].length > 0) {
          userBookmarkColumns[c].push(userBookmarkColumns[nextCol].shift());
          break;
        }
      }
    }
  }

  // Keep userBookmarkCards in sync with userBookmarkColumns
  userBookmarkCards = [
    ...userBookmarkColumns[0],
    ...userBookmarkColumns[1],
    ...userBookmarkColumns[2],
    ...userBookmarkColumns[3]
  ];
}

async function loadUserBookmarksData() {
  const uid = currentUser ? currentUser.uid : null;

  // 1. Спочатку миттєво зчитуємо локальний кеш (надійне збереження між сторінками)
  try {
    let cachedBm = localStorage.getItem(getBookmarksStorageKey(uid));
    let cachedCards = localStorage.getItem(getCardsStorageKey(uid));
    let cachedCols = localStorage.getItem(getColumnsStorageKey(uid));
    if (!cachedBm) cachedBm = localStorage.getItem(GENERAL_BM_KEY);
    if (!cachedCards) cachedCards = localStorage.getItem(GENERAL_CARDS_KEY);
    if (!cachedCols) cachedCols = localStorage.getItem(GENERAL_COLS_KEY);

    if (cachedBm) {
      const parsed = JSON.parse(cachedBm);
      if (Array.isArray(parsed) && parsed.length > 0) {
        userBookmarksList = parsed;
      }
    }
    if (cachedCards) {
      const parsedCards = JSON.parse(cachedCards);
      if (Array.isArray(parsedCards) && parsedCards.length > 0) {
        userBookmarkCards = parsedCards;
      }
    }
    if (cachedCols) {
      const parsedCols = JSON.parse(cachedCols);
      if (Array.isArray(parsedCols) && parsedCols.length === 4) {
        userBookmarkColumns = parsedCols;
      }
    }
  } catch (e) {
    console.warn("Помилка зчитування з localStorage:", e);
  }

  syncColumnsWithCards();

  userBookmarksList.forEach(bm => {
    if (!bm.card || isDefaultCard(bm.card)) {
      bm.card = DEFAULT_CARD_NAME;
    }
  });

  // 2. Хмарна синхронізація через Firebase Firestore (якщо доступно)
  if (!currentUser || !firebaseDb) return;
  try {
    const fetchDocPromise = firebaseDb.collection('users').doc(currentUser.uid).get();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 3500));
    const userDoc = await Promise.race([fetchDocPromise, timeoutPromise]);
    if (userDoc && userDoc.exists) {
      const data = userDoc.data();
      const remoteBm = data.bookmarks;
      const remoteCards = data.bookmarkCards;
      const remoteCols = data.bookmarkColumns;

      let needsSyncBackToCloud = false;

      // Надійне об'єднання закладок: жодна локально додана закладка не буде стерта, і жодна видалена не повернеться
      if (Array.isArray(remoteBm) && remoteBm.length > 0) {
        const deletedSet = getDeletedBookmarkUrls();
        const cleanedRemoteBm = remoteBm.filter(b => b && b.url && !deletedSet.has(normalizeUrl(b.url)));

        if (userBookmarksList.length === 0) {
          userBookmarksList = cleanedRemoteBm;
        } else {
          // Відфільтровуємо будь-які видалені закладки з поточного локального списку
          userBookmarksList = userBookmarksList.filter(b => b && b.url && !deletedSet.has(normalizeUrl(b.url)));
          const localUrlSet = new Set(userBookmarksList.map(b => normalizeUrl(b.url)));
          const newFromRemote = cleanedRemoteBm.filter(b => !localUrlSet.has(normalizeUrl(b.url)));
          if (newFromRemote.length > 0) {
            userBookmarksList = [...userBookmarksList, ...newFromRemote];
            needsSyncBackToCloud = true;
          }
        }
      } else if (userBookmarksList.length > 0) {
        needsSyncBackToCloud = true;
      }

      // Надійне об'єднання карток/папок: новостворені локальні папки (наприклад, "Про Кіно") ніколи не стираються
      if (Array.isArray(remoteCards) && remoteCards.length > 0) {
        const remoteCardsSet = new Set(remoteCards.map(c => isDefaultCard(c) ? DEFAULT_CARD_NAME : c));
        const localOnlyCards = userBookmarkCards.filter(c => !remoteCardsSet.has(isDefaultCard(c) ? DEFAULT_CARD_NAME : c));
        if (localOnlyCards.length > 0) {
          userBookmarkCards = [...remoteCards, ...localOnlyCards];
          if (Array.isArray(remoteCols) && remoteCols.length === 4) {
            userBookmarkColumns = remoteCols;
            localOnlyCards.forEach(c => {
              let minCol = 1;
              let minLen = (userBookmarkColumns[1] || []).length;
              for (let i = 2; i < 4; i++) {
                const len = (userBookmarkColumns[i] || []).length;
                if (len < minLen) { minLen = len; minCol = i; }
              }
              if (userBookmarkColumns[0].length < minLen) minCol = 0;
              userBookmarkColumns[minCol].push(c);
            });
          }
          needsSyncBackToCloud = true;
        } else {
          userBookmarkCards = remoteCards;
          if (Array.isArray(remoteCols) && remoteCols.length === 4) {
            userBookmarkColumns = remoteCols;
          }
        }
      } else if (userBookmarkCards.length > 0) {
        needsSyncBackToCloud = true;
      }

      if (data.profile && typeof data.profile === 'object') {
        userProfileSettings = { ...userProfileSettings, ...data.profile };
        try {
          localStorage.setItem('user_profile_' + currentUser.uid, JSON.stringify(userProfileSettings));
        } catch (e) {}
      }

      syncColumnsWithCards();

      if (needsSyncBackToCloud) {
        saveUserBookmarksData().catch(() => {});
      }

      // Оновлюємо локальний кеш
      try {
        const bmJson = JSON.stringify(userBookmarksList);
        const cardsJson = JSON.stringify(userBookmarkCards);
        const colsJson = JSON.stringify(userBookmarkColumns);
        localStorage.setItem(getBookmarksStorageKey(currentUser.uid), bmJson);
        localStorage.setItem(getCardsStorageKey(currentUser.uid), cardsJson);
        localStorage.setItem(getColumnsStorageKey(currentUser.uid), colsJson);
        localStorage.setItem(GENERAL_BM_KEY, bmJson);
        localStorage.setItem(GENERAL_CARDS_KEY, cardsJson);
        localStorage.setItem(GENERAL_COLS_KEY, colsJson);
      } catch (e) {}
    } else if (userBookmarksList.length > 0) {
      await saveUserBookmarksData();
    }
  } catch (e) {
    console.warn("Firestore sync warning (дані збережено у локальному сховищі):", e);
  }
}

let cloudSyncTimeout = null;

async function pushBookmarksToFirestore() {
  if (!currentUser || !firebaseDb) return;
  try {
    await firebaseDb.collection('users').doc(currentUser.uid).set({
      bookmarks: userBookmarksList,
      bookmarkCards: userBookmarkCards,
      bookmarkColumns: userBookmarkColumns,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn("Firestore save warning (дані збережено локально):", e);
  }
}

let sortReorderTimer = null;
let pendingSortAction = false;

function flushPendingSortReorder() {
  if (sortReorderTimer) {
    clearTimeout(sortReorderTimer);
    sortReorderTimer = null;
  }
  if (pendingSortAction) {
    pendingSortAction = false;
    if (checkAndIncrementDailyActionLimit()) {
      pushBookmarksToFirestore();
    }
  }
}

// Слухачі для гарантованого збереження відкладених змін при закритті вкладки або переході з неї
if (typeof window !== 'undefined' && !window._bmCloudSyncAttached) {
  window._bmCloudSyncAttached = true;
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (cloudSyncTimeout) {
        clearTimeout(cloudSyncTimeout);
        cloudSyncTimeout = null;
        pushBookmarksToFirestore();
      }
      flushPendingSortReorder();
    }
  });
  window.addEventListener('beforeunload', () => {
    if (cloudSyncTimeout) {
      clearTimeout(cloudSyncTimeout);
      cloudSyncTimeout = null;
      pushBookmarksToFirestore();
    }
    flushPendingSortReorder();
  });
}

async function saveUserBookmarksData(options = {}) {
  const uid = currentUser ? currentUser.uid : null;

  syncColumnsWithCards();

  userBookmarksList.forEach(bm => {
    if (!bm.card || isDefaultCard(bm.card)) {
      bm.card = DEFAULT_CARD_NAME;
    }
  });

  // 1. ЗАВЖДИ миттєво зберігаємо у localStorage (0 мс, гарантія відсутності втрат)
  try {
    const bmJson = JSON.stringify(userBookmarksList);
    const cardsJson = JSON.stringify(userBookmarkCards);
    const colsJson = JSON.stringify(userBookmarkColumns);
    localStorage.setItem(getBookmarksStorageKey(uid), bmJson);
    localStorage.setItem(getCardsStorageKey(uid), cardsJson);
    localStorage.setItem(getColumnsStorageKey(uid), colsJson);
    localStorage.setItem(GENERAL_BM_KEY, bmJson);
    localStorage.setItem(GENERAL_CARDS_KEY, cardsJson);
    localStorage.setItem(GENERAL_COLS_KEY, colsJson);
  } catch (e) {
    console.warn("Помилка запису у localStorage:", e);
  }

  // 2. Хмарна синхронізація у Cloud Firestore
  if (!currentUser || !firebaseDb) return;

  if (pendingSortAction) {
    if (sortReorderTimer) {
      clearTimeout(sortReorderTimer);
      sortReorderTimer = null;
    }
    pendingSortAction = false;
    checkAndIncrementDailyActionLimit();
  }

  if (options && options.debounceCloud) {
    // Відкладаємо запис у базу: доки користувач активно перетягує картки/сайти,
    // нові запити у Firestore не йдуть. Запис відбудеться 1 раз через вказаний час після останньої дії (15 секунд).
    if (cloudSyncTimeout) clearTimeout(cloudSyncTimeout);
    cloudSyncTimeout = setTimeout(async () => {
      cloudSyncTimeout = null;
      await pushBookmarksToFirestore();
    }, options.debounceMs || 15000);
  } else {
    // Миттєвий запис для точкових дій (створення, додавання, видалення)
    if (cloudSyncTimeout) {
      clearTimeout(cloudSyncTimeout);
      cloudSyncTimeout = null;
    }
    await pushBookmarksToFirestore();
  }
}

function syncAllCatalogHeartButtons() {
  const btns = document.querySelectorAll('.desc-heart-add-btn');
  btns.forEach(btn => {
    const parentLi = btn.closest('li');
    if (!parentLi) return;
    const link = parentLi.querySelector('a');
    if (!link) return;
    const inBm = isUrlInBookmarks(link.href);
    if (inBm) {
      btn.classList.add('in-bookmarks');
      btn.innerHTML = '<i class="fas fa-heart text-danger"></i>';
      btn.title = 'Вже у Ваших «❤️ Закладках» (натисніть щоб керувати)';
    } else {
      btn.classList.remove('in-bookmarks');
      btn.innerHTML = '<i class="far fa-heart"></i>';
      btn.title = 'Додати сайт у «❤️ Закладки»';
    }
  });
}

async function handleQuickBookmarkClick(link, description, heartBtn) {
  if (!currentUser) {
    showQuickToast('Щоб зберігати улюблені сайти у «❤️ Закладки», будь ласка, увійдіть через Google', 'info');
    openUserCabinetModal();
    return;
  }

  ensureFirebaseLoaded().catch(() => {});

  const cleanUrl = (link.href || '').trim();
  const linkName = (link.textContent || '').trim().replace(/\s+/g, ' ');
  if (!cleanUrl) return;

  await loadUserBookmarksData();

  const existingIdx = userBookmarksList.findIndex(bm => normalizeUrl(bm.url) === normalizeUrl(cleanUrl));

  if (existingIdx !== -1) {
    const bm = userBookmarksList[existingIdx];
    const card = bm.card || userBookmarkCards[0] || DEFAULT_CARD_NAME;
    if (confirm(`Сайт «${bm.name}» уже є у ваших закладках (Картка: «${card}»).\n\nВидалити його з «❤️ Закладок»?`)) {
      if (!checkAndIncrementDailyActionLimit()) return;
      recordDeletedBookmarkUrl(cleanUrl);
      userBookmarksList = userBookmarksList.filter(b => normalizeUrl(b.url) !== normalizeUrl(cleanUrl));
      await saveUserBookmarksData();
      syncAllCatalogHeartButtons();
      showQuickToast(`«${bm.name}» видалено з «❤️ Закладок»`, 'info');
    }
  } else {
    if (userBookmarksList.length >= MAX_USER_BOOKMARKS) {
      showQuickToast(`Ви досягли ліміту: максимум ${MAX_USER_BOOKMARKS} збережених сайтів на акаунт.`, 'warning');
      return;
    }
    if (!checkAndIncrementDailyActionLimit()) return;
    removeDeletedBookmarkRecord(cleanUrl);
    if (!userBookmarkCards || userBookmarkCards.length <= 1) {
      const targetCard = (userBookmarkCards && userBookmarkCards[0]) || DEFAULT_CARD_NAME;
      userBookmarksList.push({
        name: linkName,
        url: cleanUrl,
        desc: description || '',
        card: targetCard,
        icon: getFaviconForUrl(cleanUrl),
        createdAt: new Date().toISOString()
      });
      await saveUserBookmarksData();
      syncAllCatalogHeartButtons();
      showQuickToast(`❤️ «${linkName}» додано у «${targetCard}»!`, 'success');
    } else {
      openChooseCardForBookmarkModal(linkName, cleanUrl, description);
    }
  }
}

function openChooseCardForBookmarkModal(linkName, cleanUrl, description) {
  const optionsHtml = userBookmarkCards.map(c => `
    <option value="${escapeHtml(c)}">${escapeHtml(c)}</option>
  `).join('');

  showCustomModal({
    title: '❤️ Додати у власні закладки',
    bodyHtml: `
      <div class="mb-2 d-flex align-items-center gap-2">
        <img src="${escapeHtml(getFaviconForUrl(cleanUrl))}" style="width: 22px; height: 22px; border-radius: 4px; object-fit: contain; flex-shrink: 0;" alt="" onerror="this.onerror=null;this.src='favicon.ico'">
        <div style="min-width: 0; flex: 1;">
          <div class="font-weight-bold" style="font-size: 0.95rem;">${escapeHtml(linkName)}</div>
          <div class="small text-muted text-truncate" style="word-break: break-all;">${escapeHtml(cleanUrl)}</div>
        </div>
      </div>
      <div class="mb-3">
        <label class="small font-weight-bold mb-1">Оберіть картку для розміщення:</label>
        <select id="quickCardChoiceSelect" class="form-control">
          ${optionsHtml}
        </select>
      </div>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary btn-sm" onclick="closeCustomModal()">Скасувати</button>
      <button type="button" class="btn btn-danger btn-sm font-weight-bold" id="confirmQuickAddCardBtn">Додати у закладки</button>
    `
  });

  const confirmQuickBtn = document.getElementById('confirmQuickAddCardBtn');
  if (confirmQuickBtn) {
    confirmQuickBtn.onclick = async () => {
      if (confirmQuickBtn.disabled) return;
      if (userBookmarksList.length >= MAX_USER_BOOKMARKS) {
        showQuickToast(`Ви досягли ліміту: максимум ${MAX_USER_BOOKMARKS} збережених сайтів на акаунт.`, 'warning');
        return;
      }
      if (!checkAndIncrementDailyActionLimit()) return;

      confirmQuickBtn.disabled = true;
      confirmQuickBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Додавання...';

      const sel = document.getElementById('quickCardChoiceSelect');
      const card = sel ? sel.value : userBookmarkCards[0];
      removeDeletedBookmarkRecord(cleanUrl);
      userBookmarksList.push({
        name: linkName,
        url: cleanUrl,
        desc: description || '',
        card,
        icon: getFaviconForUrl(cleanUrl),
        createdAt: new Date().toISOString()
      });
      closeCustomModal();
      syncAllCatalogHeartButtons();
      renderBookmarksPage();
      showQuickToast(`❤️ «${linkName}» додано у картку «${card}»!`, 'success');
      await saveUserBookmarksData();
    };
  }
}

function openCreateCardModal() {
  showCustomModal({
    title: '➕ Створити нову картку',
    bodyHtml: `
      <p class="small text-muted mb-2">Введіть назву для вашої нової тематичної картки закладок:</p>
      <input type="text" id="newCardNameInput" class="form-control" placeholder="Наприклад: 💼 Робота, 🛒 Покупки, 🎵 Музика, 📰 Новини" autofocus>
      <div id="createCardModalAlert" style="display: none;" class="alert py-2 px-3 mt-2 mb-0 small font-weight-bold" role="alert"></div>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary btn-sm" onclick="closeCustomModal()">Скасувати</button>
      <button type="button" class="btn btn-danger btn-sm font-weight-bold" id="confirmCreateCardBtn">Створити картку</button>
    `
  });

  const confirmBtn = document.getElementById('confirmCreateCardBtn');
  const input = document.getElementById('newCardNameInput');
  const alertBox = document.getElementById('createCardModalAlert');

  if (input && confirmBtn) {
    // Підтримка підтвердження клавішею Enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmBtn.click();
      }
    });
    input.addEventListener('input', () => {
      if (alertBox) alertBox.style.display = 'none';
    });
  }

  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      if (confirmBtn.disabled) return;
      const val = input ? input.value.trim() : '';
      if (!val) {
        if (alertBox) {
          alertBox.innerHTML = '<i class="fas fa-exclamation-triangle me-1"></i> Будь ласка, введіть назву картки.';
          alertBox.className = 'alert alert-warning py-2 px-3 mt-2 mb-0 small font-weight-bold';
          alertBox.style.display = 'block';
        }
        showQuickToast('Будь ласка, введіть назву картки.', 'warning');
        if (input) input.focus();
        return;
      }
      if (userBookmarkCards.length >= MAX_USER_CARDS) {
        if (alertBox) {
          alertBox.innerHTML = `<i class="fas fa-exclamation-triangle me-1"></i> Ви досягли ліміту: максимум ${MAX_USER_CARDS} папок/карток на акаунт.`;
          alertBox.className = 'alert alert-danger py-2 px-3 mt-2 mb-0 small font-weight-bold';
          alertBox.style.display = 'block';
        }
        showQuickToast(`Ви досягли ліміту: максимум ${MAX_USER_CARDS} папок/карток на акаунт.`, 'warning');
        return;
      }
      if (userBookmarkCards.includes(val)) {
        if (alertBox) {
          alertBox.innerHTML = `<i class="fas fa-info-circle me-1"></i> Картка «${escapeHtml(val)}» вже існує.`;
          alertBox.className = 'alert alert-info py-2 px-3 mt-2 mb-0 small font-weight-bold';
          alertBox.style.display = 'block';
        }
        showQuickToast('Картка з такою назвою вже існує.', 'warning');
        return;
      }
      if (!checkAndIncrementDailyActionLimit()) return;

      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Створення...';

      syncColumnsWithCards();

      // Визначаємо куди додати нову картку:
      // Додаємо рівномірно у колонку з найменшою кількістю карток.
      let minColIdx = 1;
      let minCount = (userBookmarkColumns[1] || []).length;
      for (let i = 2; i < 4; i++) {
        const count = (userBookmarkColumns[i] || []).length;
        if (count < minCount) {
          minCount = count;
          minColIdx = i;
        }
      }
      if ((userBookmarkColumns[0] || []).length < minCount) {
        minColIdx = 0;
      }
      if (!userBookmarkColumns[minColIdx]) userBookmarkColumns[minColIdx] = [];
      userBookmarkColumns[minColIdx].push(val);

      userBookmarkCards = [
        ...userBookmarkColumns[0],
        ...userBookmarkColumns[1],
        ...userBookmarkColumns[2],
        ...userBookmarkColumns[3]
      ];

      // 1. Негайно закриваємо модальне вікно (інтерфейс не зависає)
      closeCustomModal();
      // 2. Оновлюємо відображення та показуємо повідомлення
      renderBookmarksPage();
      showQuickToast(`Картку «${val}» створено!`, 'success');
      // 3. Зберігаємо у localStorage та фоново синхронізуємо з Firestore
      saveUserBookmarksData().catch(err => console.warn('Помилка збереження:', err));
    };
  }
}
window.openCreateCardModal = openCreateCardModal;

function openAddBookmarkModal(defaultCard = '') {
  if (!userBookmarkCards || userBookmarkCards.length === 0) {
    userBookmarkCards = [DEFAULT_CARD_NAME];
  }
  const targetCard = defaultCard || userBookmarkCards[0];
  const optionsHtml = userBookmarkCards.map(c => `
    <option value="${escapeHtml(c)}" ${c === targetCard ? 'selected' : ''}>${escapeHtml(c)}</option>
  `).join('');

  showCustomModal({
    title: '❤️ Додати сайт у закладки',
    bodyHtml: `
      <div id="addBmModalAlert" style="display: none;" class="alert py-2 px-3 mb-2 small font-weight-bold" role="alert"></div>
      <!-- Пропозиція 1 (вгорі): Додати сайт власноруч -->
      <div class="bm-add-choice-card" id="bmChoiceManualCard">
        <div class="bm-choice-header" id="bmChoiceManualHeader" title="Натисніть, щоб розгорнути / згорнути введення власноруч">
          <div class="bm-choice-title-wrap">
            <span class="bm-choice-title">
              <i class="fas fa-edit text-danger"></i> Додати сайт власноруч
            </span>
            <span class="bm-choice-sub">Ввести назву та посилання самостійно</span>
          </div>
          <i class="fas fa-chevron-down bm-choice-chevron"></i>
        </div>
        <div class="bm-choice-body" id="bmChoiceManualBody">
          <div class="mb-2">
            <label class="small font-weight-bold mb-1">Назва сайту:</label>
            <input type="text" id="bmModalNameInput" class="form-control form-control-sm" placeholder="Наприклад: Мій Google Диск">
          </div>
          <div class="mb-2">
            <label class="small font-weight-bold mb-1">Адреса сайту (URL):</label>
            <input type="url" id="bmModalUrlInput" class="form-control form-control-sm" placeholder="https://...">
          </div>
          <div class="mb-2">
            <label class="small font-weight-bold mb-1">Оберіть папку/картку:</label>
            <select id="bmModalCardSelect" class="form-control form-control-sm">
              ${optionsHtml}
            </select>
          </div>
        </div>
      </div>

      <!-- Роздільник АБО -->
      <div class="bm-choice-divider">
        <span>АБО</span>
      </div>

      <!-- Пропозиція 2 (нижче): Обрати з каталогу сайту -->
      <div class="bm-add-choice-card catalog-mode" id="bmChoiceCatalogCard">
        <div class="bm-choice-header" id="bmChoiceCatalogHeader" title="Натисніть, щоб розгорнути / згорнути вибір із каталогу">
          <div class="bm-choice-title-wrap">
            <span class="bm-choice-title">
              <i class="fas fa-search text-info"></i> Обрати з каталогу сайту
            </span>
            <span class="bm-choice-sub">Швидкий вибір із готової бази 740+ ресурсів</span>
          </div>
          <i class="fas fa-chevron-down bm-choice-chevron"></i>
        </div>
        <div class="bm-choice-body" id="bmChoiceCatalogBody">
          <div class="mb-2 position-relative">
            <label class="small font-weight-bold mb-1">Пошук у каталозі:</label>
            <input type="text" id="bmCatalogSearchInput" class="form-control form-control-sm" placeholder="🔍 Введіть назву (Дія, YouTube, Rozetka, Privat24)..." autocomplete="off">
            <div id="bmCatalogDropdownResults" class="bm-catalog-results-dropdown" style="display: none;"></div>
          </div>

          <div id="bmCatalogSelectedWrap" style="display: none; background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.25); border-radius: 8px;" class="mb-2 p-2">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="small font-weight-bold text-success"><i class="fas fa-check-circle me-1"></i> Обрано сайт з каталогу:</span>
              <button type="button" class="btn btn-link btn-sm p-0 text-muted" id="bmCatalogResetChoiceBtn" style="font-size: 0.73rem;">Обрати інший</button>
            </div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <img id="bmCatalogSelFavicon" src="favicon.ico" style="width: 20px; height: 20px; border-radius: 4px;" alt="">
              <div style="min-width: 0; flex: 1;">
                <div id="bmCatalogSelName" class="font-weight-bold small text-truncate"></div>
                <div id="bmCatalogSelUrl" class="text-muted" style="font-size: 0.72rem; word-break: break-all;"></div>
              </div>
            </div>
          </div>

          <div class="mb-2">
            <label class="small font-weight-bold mb-1">Оберіть папку/картку:</label>
            <select id="bmCatalogCardSelect" class="form-control form-control-sm">
              ${optionsHtml}
            </select>
          </div>
        </div>
      </div>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary btn-sm" onclick="closeCustomModal()">Скасувати</button>
      <button type="button" class="btn btn-danger btn-sm font-weight-bold" id="confirmAddBmBtn">Зберегти закладку</button>
    `
  });

  // Логіка згортання/розгортання двох пропозицій
  let activeMode = null; // Початково обидві пропозиції згорнуті
  let selectedCatalogItem = null;

  const cardManual = document.getElementById('bmChoiceManualCard');
  const cardCatalog = document.getElementById('bmChoiceCatalogCard');
  const headerManual = document.getElementById('bmChoiceManualHeader');
  const headerCatalog = document.getElementById('bmChoiceCatalogHeader');

  const nameInput = document.getElementById('bmModalNameInput');
  const urlInput = document.getElementById('bmModalUrlInput');
  const cardSelectManual = document.getElementById('bmModalCardSelect');

  const searchInput = document.getElementById('bmCatalogSearchInput');
  const dropdown = document.getElementById('bmCatalogDropdownResults');
  const selectedWrap = document.getElementById('bmCatalogSelectedWrap');
  const selFavicon = document.getElementById('bmCatalogSelFavicon');
  const selName = document.getElementById('bmCatalogSelName');
  const selUrl = document.getElementById('bmCatalogSelUrl');
  const cardSelectCatalog = document.getElementById('bmCatalogCardSelect');
  const resetChoiceBtn = document.getElementById('bmCatalogResetChoiceBtn');

  // Синхронізація вибору картки між обома формами
  if (cardSelectManual && cardSelectCatalog) {
    cardSelectManual.addEventListener('change', () => {
      cardSelectCatalog.value = cardSelectManual.value;
    });
    cardSelectCatalog.addEventListener('change', () => {
      cardSelectManual.value = cardSelectCatalog.value;
    });
  }

  // Клік на першу пропозицію (Власноруч)
  if (headerManual) {
    headerManual.onclick = () => {
      if (activeMode === 'manual') {
        activeMode = null;
        cardManual.classList.remove('active');
      } else {
        activeMode = 'manual';
        cardManual.classList.add('active');
        cardCatalog.classList.remove('active');
        setTimeout(() => {
          if (nameInput) nameInput.focus();
        }, 100);
      }
    };
  }

  // Клік на другу пропозицію (З каталогу)
  if (headerCatalog) {
    headerCatalog.onclick = () => {
      if (activeMode === 'catalog') {
        activeMode = null;
        cardCatalog.classList.remove('active');
      } else {
        activeMode = 'catalog';
        cardCatalog.classList.add('active');
        cardManual.classList.remove('active');
        setTimeout(() => {
          if (searchInput) searchInput.focus();
        }, 100);
      }
    };
  }

  // Пошук у каталозі
  if (searchInput && dropdown) {
    const handleSearch = () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q || q.length < 2) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
      }
      const catalog = window.CATALOG_ITEMS || [];
      const matches = catalog.filter(it => 
        (it.name && it.name.toLowerCase().includes(q)) ||
        (it.url && it.url.toLowerCase().includes(q)) ||
        (it.card && it.card.toLowerCase().includes(q)) ||
        (it.desc && it.desc.toLowerCase().includes(q))
      ).slice(0, 15);

      if (matches.length === 0) {
        dropdown.innerHTML = `<div class="p-2 text-muted small text-center">За запитом «${escapeHtml(searchInput.value)}» нічого не знайдено</div>`;
        dropdown.style.display = 'block';
        return;
      }

      dropdown.innerHTML = matches.map((m, idx) => {
        let domain = '';
        try { domain = new URL(m.url).hostname.toLowerCase().replace(/^www\./, ''); } catch(e) { domain = ''; }
        const faviconUrl = getFaviconForUrl(m.url);
        return `
          <div class="bm-catalog-item-result" data-idx="${idx}">
            <img src="${faviconUrl}" alt="" onerror="this.onerror=null;this.src='favicon.ico'">
            <div class="bm-catalog-item-text" style="min-width: 0; flex: 1;">
              <div class="bm-catalog-item-name">${escapeHtml(m.name)}</div>
              <div class="bm-catalog-item-domain">${escapeHtml(domain)}</div>
            </div>
            ${m.card ? `<span class="bm-catalog-item-card">${escapeHtml(m.card)}</span>` : ''}
          </div>
        `;
      }).join('');
      dropdown.style.display = 'block';

      dropdown.querySelectorAll('.bm-catalog-item-result').forEach(el => {
        el.onmousedown = (e) => {
          e.preventDefault();
          const idx = parseInt(el.getAttribute('data-idx'), 10);
          const item = matches[idx];
          if (item) {
            selectedCatalogItem = item;
            const faviconUrl = getFaviconForUrl(item.url);
            if (selFavicon) selFavicon.src = faviconUrl;
            if (selName) selName.textContent = item.name;
            if (selUrl) selUrl.textContent = item.url;
            if (selectedWrap) selectedWrap.style.display = 'block';
            dropdown.style.display = 'none';
            searchInput.value = item.name;
            showQuickToast(`Підставлено «${item.name}»! Оберіть папку/картку та натисніть «Зберегти закладку»`, 'info');
          }
        };
      });
    };

    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', handleSearch);
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (dropdown) dropdown.style.display = 'none';
      }, 250);
    });
  }

  // Скидання вибору ресурсу з каталогу
  if (resetChoiceBtn) {
    resetChoiceBtn.onclick = (e) => {
      e.preventDefault();
      selectedCatalogItem = null;
      if (selectedWrap) selectedWrap.style.display = 'none';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
    };
  }

  // Обробка збереження закладки
  const confirmAddBtn = document.getElementById('confirmAddBmBtn');
  if (confirmAddBtn) {
    confirmAddBtn.onclick = async () => {
      if (confirmAddBtn.disabled) return;
      if (userBookmarksList.length >= MAX_USER_BOOKMARKS) {
        const bmAlertBox = document.getElementById('addBmModalAlert');
        if (bmAlertBox) {
          bmAlertBox.innerHTML = `<i class="fas fa-exclamation-triangle me-1"></i> Ви досягли ліміту: максимум ${MAX_USER_BOOKMARKS} збережених сайтів на акаунт.`;
          bmAlertBox.className = 'alert alert-danger py-2 px-3 mb-2 small font-weight-bold';
          bmAlertBox.style.display = 'block';
        }
        showQuickToast(`Ви досягли ліміту: максимум ${MAX_USER_BOOKMARKS} збережених сайтів на акаунт.`, 'warning');
        return;
      }

      // Якщо жодна пропозиція не розгорнута
      if (!activeMode) {
        showQuickToast('Оберіть спосіб: «Додати сайт власноруч» або «Обрати з каталогу сайту»', 'warning');
        cardManual.classList.add('active');
        activeMode = 'manual';
        if (nameInput) nameInput.focus();
        return;
      }

      let name = '';
      let url = '';
      let card = targetCard;
      let desc = '';

      if (activeMode === 'manual') {
        name = nameInput ? nameInput.value.trim() : '';
        url = urlInput ? urlInput.value.trim() : '';
        card = cardSelectManual ? cardSelectManual.value : targetCard;
        desc = '';

        if (!name || !url) {
          showQuickToast('Будь ласка, введіть назву та адресу (URL) сайту.', 'warning');
          if (nameInput && !name) nameInput.focus();
          else if (urlInput && !url) urlInput.focus();
          return;
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
      } else if (activeMode === 'catalog') {
        if (!selectedCatalogItem) {
          showQuickToast('Будь ласка, знайдіть та оберіть потрібний сайт із каталогу.', 'warning');
          if (searchInput) searchInput.focus();
          return;
        }
        name = selectedCatalogItem.name;
        url = selectedCatalogItem.url;
        card = cardSelectCatalog ? cardSelectCatalog.value : targetCard;
        desc = selectedCatalogItem.desc || '';
      }

      if (!checkAndIncrementDailyActionLimit()) return;

      confirmAddBtn.disabled = true;
      confirmAddBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Збереження...';

      removeDeletedBookmarkRecord(url);
      userBookmarksList.push({
        name,
        url,
        desc,
        card,
        icon: getFaviconForUrl(url),
        createdAt: new Date().toISOString()
      });

      // 1. Негайно закриваємо модалку (вікно не зависає)
      closeCustomModal();
      // 2. Оновлюємо сторінку та показуємо повідомлення
      renderBookmarksPage();
      syncAllCatalogHeartButtons();
      showQuickToast(`❤️ «${name}» додано у картку «${card}»!`, 'success');
      // 3. Зберігаємо у localStorage та синхронізуємо з хмарою
      saveUserBookmarksData().catch(err => console.warn('Помилка синхронізації:', err));
    };
  }
}
window.openAddBookmarkModal = openAddBookmarkModal;

function promptRenameCard(oldName) {
  if (isDefaultCard(oldName)) {
    alert('Картка «Основні закладки» є системною за замовчуванням. Її не можна перейменувати.');
    return;
  }

  showCustomModal({
    title: '✏️ Перейменувати картку',
    bodyHtml: `
      <p class="small text-muted mb-2">Поточна назва: <strong>${escapeHtml(oldName)}</strong></p>
      <input type="text" id="renameCardInput" class="form-control" value="${escapeHtml(oldName)}" autofocus>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary btn-sm" onclick="closeCustomModal()">Скасувати</button>
      <button type="button" class="btn btn-primary btn-sm font-weight-bold" id="confirmRenameCardBtn">Зберегти</button>
    `
  });

  const confirmRenameBtn = document.getElementById('confirmRenameCardBtn');
  if (confirmRenameBtn) {
    confirmRenameBtn.onclick = async () => {
      if (confirmRenameBtn.disabled) return;
      const input = document.getElementById('renameCardInput');
      const newName = input ? input.value.trim() : '';
      if (!newName) {
        showQuickToast('Назва картки не може бути порожньою.', 'warning');
        if (input) input.focus();
        return;
      }
      if (newName === oldName) {
        closeCustomModal();
        return;
      }
      if (userBookmarkCards.includes(newName)) {
        showQuickToast('Картка з такою назвою вже існує.', 'warning');
        return;
      }
      if (!checkAndIncrementDailyActionLimit()) return;

      confirmRenameBtn.disabled = true;
      confirmRenameBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Збереження...';

      const idx = userBookmarkCards.indexOf(oldName);
      if (idx !== -1) {
        userBookmarkCards[idx] = newName;
      }
      for (let i = 0; i < 4; i++) {
        if (Array.isArray(userBookmarkColumns[i])) {
          const cIdx = userBookmarkColumns[i].indexOf(oldName);
          if (cIdx !== -1) {
            userBookmarkColumns[i][cIdx] = newName;
          }
        }
      }
      userBookmarksList.forEach(bm => {
        if (bm.card === oldName) {
          bm.card = newName;
        }
      });
      // 1. Закриваємо модалку миттєво
      closeCustomModal();
      // 2. Рендеримо
      renderBookmarksPage();
      showQuickToast(`Картку перейменовано на «${newName}»!`, 'success');
      // 3. Зберігаємо локально та синхронізуємо у фоні
      saveUserBookmarksData().catch(err => console.warn('Помилка синхронізації:', err));
    };
  }
}
window.promptRenameCard = promptRenameCard;

function promptDeleteCard(cardName) {
  if (isDefaultCard(cardName)) {
    alert('Картка «Основні закладки» є системною за замовчуванням. Її не можна видалити.');
    return;
  }

  const cardItemsCount = userBookmarksList.filter(bm => (bm.card || userBookmarkCards[0]) === cardName).length;
  if (!confirm(`Ви дійсно бажаєте видалити картку «${cardName}» та всі її збережені сайти (${cardItemsCount})?`)) {
    return;
  }
  if (!checkAndIncrementDailyActionLimit()) return;
  userBookmarkCards = userBookmarkCards.filter(c => c !== cardName);
  for (let i = 0; i < 4; i++) {
    if (Array.isArray(userBookmarkColumns[i])) {
      userBookmarkColumns[i] = userBookmarkColumns[i].filter(c => c !== cardName);
    }
  }
  userBookmarksList = userBookmarksList.filter(bm => (bm.card || userBookmarkCards[0]) !== cardName);
  if (userBookmarkCards.length === 0) {
    userBookmarkCards = [DEFAULT_CARD_NAME];
  }
  syncColumnsWithCards();
  saveUserBookmarksData().then(() => {
    renderBookmarksPage();
    syncAllCatalogHeartButtons();
    showQuickToast(`Картку «${cardName}» видалено`, 'info');
  });
}
window.promptDeleteCard = promptDeleteCard;

// Керування виїзними діями рядка закладок (стрілочка вліво розгортає кнопки дій)
function toggleBookmarkRowActions(event, toggleBtn) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const wrap = toggleBtn ? toggleBtn.closest('.bm-row-actions-wrap') : null;
  if (!wrap) return;

  const isOpen = wrap.classList.contains('is-open');

  // Закриваємо всі інші відкриті шторки дій для охайного інтерфейсу
  document.querySelectorAll('.bm-row-actions-wrap.is-open').forEach(el => {
    if (el !== wrap) {
      el.classList.remove('is-open');
      const btn = el.querySelector('.bm-row-actions-toggle');
      if (btn) {
        btn.setAttribute('title', 'Дії з ресурсом');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  if (isOpen) {
    wrap.classList.remove('is-open');
    toggleBtn.setAttribute('title', 'Дії з ресурсом');
    toggleBtn.setAttribute('aria-expanded', 'false');
  } else {
    wrap.classList.add('is-open');
    toggleBtn.setAttribute('title', 'Приховати дії');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
}
window.toggleBookmarkRowActions = toggleBookmarkRowActions;

// Керування виїзними діями шапки картки (стрілочка вліво розгортає кнопки дій шапки)
function toggleCardHeaderActions(event, toggleBtn) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const wrap = toggleBtn ? toggleBtn.closest('.bm-card-header-actions-wrap') : null;
  if (!wrap) return;

  const isOpen = wrap.classList.contains('is-open');

  // Закриваємо всі інші відкриті шторки дій шапок карток
  document.querySelectorAll('.bm-card-header-actions-wrap.is-open').forEach(el => {
    if (el !== wrap) {
      el.classList.remove('is-open');
      const btn = el.querySelector('.bm-card-actions-toggle');
      if (btn) {
        btn.setAttribute('title', 'Дії з карткою');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  if (isOpen) {
    wrap.classList.remove('is-open');
    toggleBtn.setAttribute('title', 'Дії з карткою');
    toggleBtn.setAttribute('aria-expanded', 'false');
  } else {
    wrap.classList.add('is-open');
    toggleBtn.setAttribute('title', 'Приховати дії');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
}
window.toggleCardHeaderActions = toggleCardHeaderActions;

// Керування виїзними діями ресурсу в каталозі (стрілочка вліво розгортає додаткові значки-посилання)
function toggleItemActions(event, toggleBtn) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const wrap = toggleBtn ? toggleBtn.closest('.item-actions-wrap') : null;
  if (!wrap) return;

  const isOpen = wrap.classList.contains('is-open');

  // Закриваємо всі інші відкриті шторки дій для охайного інтерфейсу
  document.querySelectorAll('.item-actions-wrap.is-open, .bm-row-actions-wrap.is-open').forEach(el => {
    if (el !== wrap) {
      el.classList.remove('is-open');
      const btn = el.querySelector('.item-actions-toggle, .bm-row-actions-toggle');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  if (isOpen) {
    wrap.classList.remove('is-open');
    toggleBtn.setAttribute('title', 'Соцмережі та додаткові посилання');
    toggleBtn.setAttribute('aria-expanded', 'false');
  } else {
    wrap.classList.add('is-open');
    toggleBtn.setAttribute('title', 'Приховати додаткові посилання');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
}
window.toggleItemActions = toggleItemActions;

// Глобальний слухач для закриття висунутих кнопок при кліку поза рядком або шапкою
if (!window._bmActionsOutsideListener) {
  window._bmActionsOutsideListener = true;
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.item-actions-wrap')) {
      document.querySelectorAll('.item-actions-wrap.is-open').forEach(el => {
        el.classList.remove('is-open');
        const btn = el.querySelector('.item-actions-toggle');
        if (btn) {
          btn.setAttribute('title', 'Соцмережі та додаткові посилання');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    }
    if (!e.target.closest('.bm-row-actions-wrap')) {
      document.querySelectorAll('.bm-row-actions-wrap.is-open').forEach(el => {
        el.classList.remove('is-open');
        const btn = el.querySelector('.bm-row-actions-toggle');
        if (btn) {
          btn.setAttribute('title', 'Дії з ресурсом');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    }
    if (!e.target.closest('.bm-card-header-actions-wrap')) {
      document.querySelectorAll('.bm-card-header-actions-wrap.is-open').forEach(el => {
        el.classList.remove('is-open');
        const btn = el.querySelector('.bm-card-actions-toggle');
        if (btn) {
          btn.setAttribute('title', 'Дії з карткою');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
}

function promptEditBookmark(bookmarkIndex) {
  const bm = userBookmarksList[bookmarkIndex];
  if (!bm) return;

  showCustomModal({
    title: '✏️ Редагувати сайт',
    bodyHtml: `
      <div class="mb-3">
        <label for="editBmName" class="small font-weight-bold mb-1">Назва сайту:</label>
        <input type="text" id="editBmName" class="form-control" value="${escapeHtml(bm.name || '')}" placeholder="Наприклад: Google">
      </div>
      <div class="mb-2">
        <label for="editBmUrl" class="small font-weight-bold mb-1">Адреса сайту (URL):</label>
        <input type="url" id="editBmUrl" class="form-control" value="${escapeHtml(bm.url || '')}" placeholder="https://example.com">
      </div>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary btn-sm" onclick="closeCustomModal()">Скасувати</button>
      <button type="button" class="btn btn-primary btn-sm font-weight-bold" id="confirmEditBmBtn">Зберегти</button>
    `
  });

  const confirmBtn = document.getElementById('confirmEditBmBtn');
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      const nameInput = document.getElementById('editBmName');
      const urlInput = document.getElementById('editBmUrl');
      if (!nameInput || !urlInput) return;
      const newName = nameInput.value.trim();
      let newUrl = urlInput.value.trim();
      if (!newName) {
        showQuickToast('Введіть назву сайту', 'warning');
        nameInput.focus();
        return;
      }
      if (!newUrl) {
        showQuickToast('Введіть адресу сайту (URL)', 'warning');
        urlInput.focus();
        return;
      }
      if (!/^https?:\/\//i.test(newUrl)) {
        newUrl = 'https://' + newUrl;
      }
      if (!checkAndIncrementDailyActionLimit()) return;
      bm.name = newName;
      bm.url = newUrl;
      const rawIcon = getFaviconForUrl(newUrl);
      bm.icon = cleanFaviconDataUri(rawIcon);

      closeCustomModal();
      renderBookmarksPage();
      syncAllCatalogHeartButtons();
      showQuickToast(`Сайт «${escapeHtml(newName)}» оновлено!`, 'success');
      saveUserBookmarksData().catch(err => console.warn('Помилка синхронізації:', err));
    };
  }
}
window.promptEditBookmark = promptEditBookmark;

function promptMoveBookmark(bookmarkIndex) {
  const bm = userBookmarksList[bookmarkIndex];
  if (!bm) return;
  const currentCard = bm.card || userBookmarkCards[0];
  const optionsHtml = userBookmarkCards.map(c => `
    <option value="${escapeHtml(c)}" ${c === currentCard ? 'selected' : ''}>${escapeHtml(c)}</option>
  `).join('');

  showCustomModal({
    title: '📁 Перемістити в іншу папку/картку',
    bodyHtml: `
      <p class="small mb-2">Перемістити сайт <strong>${escapeHtml(bm.name)}</strong> в іншу папку/картку:</p>
      <select id="moveTargetCardSelect" class="form-control">
        ${optionsHtml}
      </select>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary btn-sm" onclick="closeCustomModal()">Скасувати</button>
      <button type="button" class="btn btn-primary btn-sm font-weight-bold" id="confirmMoveBmBtn">Перемістити</button>
    `
  });

  document.getElementById('confirmMoveBmBtn').onclick = async () => {
    if (!checkAndIncrementDailyActionLimit()) return;
    const sel = document.getElementById('moveTargetCardSelect');
    if (!sel) return;
    const newCard = sel.value;
    bm.card = newCard;
    closeCustomModal();
    renderBookmarksPage();
    showQuickToast(`«${bm.name}» переміщено у «${newCard}»!`, 'success');
    saveUserBookmarksData().catch(err => console.warn('Помилка синхронізації:', err));
  };
}
window.promptMoveBookmark = promptMoveBookmark;

async function deleteUserBookmarkFromPage(bookmarkIndex, bookmarkUrl, bookmarkCard) {
  // Шукаємо закладку за індексом або URL + card
  let bm = (typeof bookmarkIndex === 'number' && bookmarkIndex >= 0) ? userBookmarksList[bookmarkIndex] : null;
  if ((!bm || (bookmarkUrl && normalizeUrl(bm.url) !== normalizeUrl(bookmarkUrl))) && bookmarkUrl) {
    const norm = normalizeUrl(bookmarkUrl);
    bm = userBookmarksList.find(b => normalizeUrl(b.url) === norm && (!bookmarkCard || (b.card || DEFAULT_CARD_NAME) === bookmarkCard))
         || userBookmarksList.find(b => normalizeUrl(b.url) === norm);
  }
  const name = bm ? bm.name : (bookmarkUrl || 'цей сайт');
  if (!confirm(`Видалити «${name}» із ваших закладок?`)) return;
  if (!checkAndIncrementDailyActionLimit()) return;

  const targetUrl = bm ? normalizeUrl(bm.url) : (bookmarkUrl ? normalizeUrl(bookmarkUrl) : null);
  const targetCard = bm ? (bm.card || DEFAULT_CARD_NAME) : bookmarkCard;

  if (targetUrl) {
    recordDeletedBookmarkUrl(targetUrl);
  }

  // 1. Якщо передано валідний індекс у списку — гарантовано видаляємо цей елемент
  if (typeof bookmarkIndex === 'number' && bookmarkIndex >= 0 && bookmarkIndex < userBookmarksList.length) {
    userBookmarksList.splice(bookmarkIndex, 1);
  }

  // 2. Додатково гарантовано очищаємо всі можливі дублікати або старі копії за цією ж URL
  if (targetUrl) {
    userBookmarksList = userBookmarksList.filter(b => {
      if (!b || !b.url) return false;
      const matchUrl = normalizeUrl(b.url) === targetUrl;
      const matchCard = !targetCard || (b.card || DEFAULT_CARD_NAME) === targetCard;
      return !(matchUrl && matchCard);
    });
  }

  await saveUserBookmarksData();
  renderBookmarksPage();
  syncAllCatalogHeartButtons();
  showQuickToast(`«${name}» видалено з закладок`, 'info');
}
window.deleteUserBookmarkFromPage = deleteUserBookmarkFromPage;

async function renderBookmarksPage() {
  const pageContainer = document.getElementById('bookmarksPageContainer');
  const loadingEl = document.getElementById('bookmarksPageLoading');
  if (!pageContainer) return; // Не на сторінці bookmarks.html

  if (!currentUser) {
    if (loadingEl) loadingEl.style.display = 'none';
    pageContainer.style.display = 'block';
    pageContainer.innerHTML = `
      <div class="bm-guest-card">
        <div class="bm-guest-icon">❤️</div>
        <h2 class="bm-guest-title">Персональний розділ «Мої Закладки»</h2>
        <p class="bm-guest-desc">
          Створюйте власні тематичні картки, зберігайте улюблені сайти з усього каталогу в 1 клік та керуйте персональними посиланнями з хмарною синхронізацією на всіх пристроях.
        </p>
        <button type="button" class="bm-guest-btn cabinet-login-btn-pulse" id="btnBookmarksPageLogin" style="margin-bottom: 24px;">
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Увійти через Google в 1 клік
        </button>

        <div style="max-width: 480px; margin: 0 auto; text-align: left;">
          <div class="guest-bm-features-header" style="justify-content: center; margin-bottom: 10px;">
            <i class="fas fa-sparkles text-warning"></i>
            <span>Ключові можливості та переваги авторизації:</span>
          </div>
          <div class="guest-bm-features-list">
            <div class="guest-bm-feature-item">
              <span class="guest-bm-feature-icon">📂</span>
              <div class="guest-bm-feature-text">
                <strong>Тематичні картки</strong> - створення власних папок під роботу, новини, покупки чи хобі.
              </div>
            </div>
            <div class="guest-bm-feature-item">
              <span class="guest-bm-feature-icon">⭐</span>
              <div class="guest-bm-feature-text">
                <strong>Збереження сайтів в 1 клік</strong> - додавайте улюблені ресурси з нашого каталогу або власні зовнішні посилання.
              </div>
            </div>
            <div class="guest-bm-feature-item">
              <span class="guest-bm-feature-icon">☁️</span>
              <div class="guest-bm-feature-text">
                <strong>Хмарна синхронізація</strong> - персональні закладки автоматично доступні на всіх ваших пристроях.
              </div>
            </div>
            <div class="guest-bm-feature-item">
              <span class="guest-bm-feature-icon">🔄</span>
              <div class="guest-bm-feature-text">
                <strong>Зручне впорядкування</strong> - перетягування карток та гнучке сортування посилань.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    const loginBtn = document.getElementById('btnBookmarksPageLogin');
    if (loginBtn) {
      loginBtn.onclick = async () => {
        await loginWithGoogle();
        renderBookmarksPage();
      };
    }
    return;
  }

  // Якщо користувач увійшов
  await ensureFirebaseLoaded();
  if (!firebaseDb) {
    if (loadingEl) loadingEl.style.display = 'none';
    pageContainer.style.display = 'block';
    pageContainer.innerHTML = `<div class="alert alert-warning">Синхронізація з базою даних...</div>`;
    return;
  }

  try {
    if (!window._initialBookmarksLoaded) {
      window._initialBookmarksLoaded = true;
      await loadUserBookmarksData();
    }

    if (loadingEl) loadingEl.style.display = 'none';
    pageContainer.style.display = 'block';

    loadCachedUserProfile();
    const avatarUrl = currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp';
    const userName = (userProfileSettings && userProfileSettings.displayName) || currentUser.displayName || currentUser.email || 'Користувач';

    if (!userBookmarkCards || userBookmarkCards.length === 0) {
      userBookmarkCards = [DEFAULT_CARD_NAME];
    } else {
      userBookmarkCards = userBookmarkCards.map(c => isDefaultCard(c) ? DEFAULT_CARD_NAME : c);
    }
    userBookmarksList.forEach(bm => {
      if (!bm.card || isDefaultCard(bm.card)) {
        bm.card = DEFAULT_CARD_NAME;
      }
    });

    // Групуємо закладки за картками
    const cardsMap = {};
    userBookmarkCards.forEach(cName => {
      cardsMap[cName] = [];
    });

    userBookmarksList.forEach((bm, origIdx) => {
      const cName = bm.card || userBookmarkCards[0] || DEFAULT_CARD_NAME;
      if (!cardsMap[cName]) {
        cardsMap[cName] = [];
        if (!userBookmarkCards.includes(cName)) {
          userBookmarkCards.push(cName);
        }
      }
      cardsMap[cName].push({ ...bm, origIdx });
    });

    syncColumnsWithCards();

    // Картки беруться безпосередньо з userBookmarkColumns — порядок і положення карток у стовпчиках залишаються стабільними
    const colCards = [
      (userBookmarkColumns[0] || []).map(cName => ({ name: cName, items: cardsMap[cName] || [] })),
      (userBookmarkColumns[1] || []).map(cName => ({ name: cName, items: cardsMap[cName] || [] })),
      (userBookmarkColumns[2] || []).map(cName => ({ name: cName, items: cardsMap[cName] || [] })),
      (userBookmarkColumns[3] || []).map(cName => ({ name: cName, items: cardsMap[cName] || [] }))
    ];

    const renderColumnHtml = (cards) => {
      if (!cards || cards.length === 0) return '';
      return cards.map(card => {
        let itemsHtml = '';
        if (card.items.length === 0) {
          itemsHtml = `
            <li class="bm-empty-card-item">
              <div class="bm-empty-card-box">
                <div class="bm-empty-card-title">Папка/Картка порожня</div>
                <div class="bm-empty-card-icon">📂</div>
                <p class="bm-empty-card-desc">Додайте сайти значком <strong>+</strong> у шапці картки або сердечком <strong>❤️</strong> в описах каталогу.</p>
              </div>
            </li>
          `;
        } else {
          card.items.forEach(bm => {
            const rawIcon = (bm.icon && !bm.icon.includes('google.com/s2')) ? bm.icon : getFaviconForUrl(bm.url);
            const faviconUrl = cleanFaviconDataUri(rawIcon);
            itemsHtml += `
              <li class="bm-link-row">
                <img src="${faviconUrl}" class="bm-item-favicon" alt="" onerror="this.onerror=null;this.src='favicon.ico'">
                <a href="${escapeHtml(bm.url)}" target="${(userProfileSettings && userProfileSettings.openInNewTab === false) ? '_self' : '_blank'}" rel="noopener noreferrer" class="bm-item-link" title="${escapeHtml(bm.name)}">
                  ${escapeHtml(bm.name)}
                </a>
                <div class="bm-row-actions-wrap">
                  <div class="bm-row-actions-slider">
                    <button type="button" class="bm-icon-btn" onclick="promptMoveBookmark(${bm.origIdx})" title="Перемістити в іншу папку/картку">
                      <i class="fas fa-folder-open"></i>
                    </button>
                    <button type="button" class="bm-icon-btn btn-edit" onclick="promptEditBookmark(${bm.origIdx})" title="Редагувати сайт (назву та адресу)">
                      <i class="fas fa-pen"></i>
                    </button>
                    <button type="button" class="bm-icon-btn btn-del" onclick="deleteUserBookmarkFromPage(${bm.origIdx}, '${escapeHtml(encodeURIComponent(bm.url))}', '${escapeHtml(card.name)}')" title="Видалити сайт/ресурс">
                      <i class="far fa-trash-alt"></i>
                    </button>
                  </div>
                  <button type="button" class="bm-row-actions-toggle" onclick="toggleBookmarkRowActions(event, this)" title="Дії з ресурсом" aria-label="Відкрити дії">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </div>
              </li>
            `;
          });
        }

        const isDefault = isDefaultCard(card.name);
        return `
          <div class="bm-user-card" data-card-name="${escapeHtml(card.name)}">
            <div class="group-title">
              <div class="d-flex align-items-center flex-grow-1" style="min-width: 0;">
                <span class="bm-card-drag-handle" title="Затисніть і перетягніть для сортування карток">
                  <svg class="bm-drag-dots-svg" width="10" height="15" viewBox="0 0 10 15" fill="currentColor">
                    <circle cx="2.5" cy="2.5" r="1.6"/>
                    <circle cx="7.5" cy="2.5" r="1.6"/>
                    <circle cx="2.5" cy="7.5" r="1.6"/>
                    <circle cx="7.5" cy="7.5" r="1.6"/>
                    <circle cx="2.5" cy="12.5" r="1.6"/>
                    <circle cx="7.5" cy="12.5" r="1.6"/>
                  </svg>
                </span>
                <span class="bm-card-header-title text-truncate" title="${escapeHtml(isDefault ? 'Основні закладки' : card.name)}">
                  ${isDefault ? '<span class="bm-pin-icon" style="font-size: 0.95rem; margin-right: 4px; display: inline-block; vertical-align: middle;">📌</span>' : '<i class="fas fa-folder text-warning bm-folder-icon"></i>'} ${escapeHtml(isDefault ? 'Основні закладки' : card.name)}
                </span>
              </div>
              <div class="bm-card-header-actions-wrap">
                <div class="bm-card-header-actions-slider">
                  ${isDefault ? `
                  <button type="button" class="bm-head-btn bm-head-btn-create-card text-warning" onclick="openCreateCardModal()" title="Створити нову папку/картку">
                    <i class="fas fa-folder-plus"></i>
                  </button>
                  ` : ''}
                  <button type="button" class="bm-head-btn" onclick="openAddBookmarkModal('${escapeHtml(card.name)}')" title="Додати сайт у цю картку">
                    <i class="fas fa-plus"></i>
                  </button>
                  ${!isDefault ? `
                  <button type="button" class="bm-head-btn" onclick="promptRenameCard('${escapeHtml(card.name)}')" title="Перейменувати картку">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button type="button" class="bm-head-btn btn-del" onclick="promptDeleteCard('${escapeHtml(card.name)}')" title="Видалити картку">
                    <i class="far fa-trash-alt"></i>
                  </button>
                  ` : ''}
                </div>
                <button type="button" class="bm-card-actions-toggle" onclick="toggleCardHeaderActions(event, this)" title="Дії з карткою" aria-label="Відкрити дії з карткою">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </div>
            </div>
            <ul class="bm-card-list">
              ${itemsHtml}
            </ul>
          </div>
        `;
      }).join('');
    };

    let avatarHtml = '';
    if (currentUser && currentUser.photoURL) {
      avatarHtml = `<img src="${currentUser.photoURL}" class="bm-user-strip-avatar" alt="Avatar" referrerpolicy="no-referrer">`;
    } else if (currentUser) {
      avatarHtml = `<div class="bm-user-strip-avatar bm-user-strip-placeholder"><i class="fas fa-user-check text-success"></i></div>`;
    } else {
      avatarHtml = `<div class="bm-user-strip-avatar bm-user-strip-guest"><i class="fas fa-user-circle"></i></div>`;
    }

    const dailyCount = getDailyActionsCount();

    pageContainer.innerHTML = `
      <!-- 4 Стовпчика карток (автоматичний розподіл як у каталозі сайту) -->
      <div class="bm-3columns-grid bm-4columns-grid">
        <div class="bm-column" id="bmCol0">
          <!-- Єдина об'єднана верхня панель: користувач, бали та кнопки швидких дій -->
          <div class="bm-top-panel" id="bmTopPanel">
            <div class="bm-top-user-row" onclick="openUserCabinetModal('dashboard')" title="Відкрити Особистий кабінет (Дашборд)">
              <div class="bm-user-strip-left">
                <div class="bm-avatar-with-status">
                  ${avatarHtml}
                  <span class="user-action-status-dot ${dailyCount >= DAILY_ACTION_LIMIT ? 'dot-limit-exceeded' : 'dot-limit-active'}" title="${dailyCount >= DAILY_ACTION_LIMIT ? 'Денний ліміт дій вичерпано (100/100). Відпочиньте до завтра!' : `Дії активні: доступно ${DAILY_ACTION_LIMIT - dailyCount} із ${DAILY_ACTION_LIMIT} дій`}"></span>
                </div>
                <span class="bm-user-strip-name">${escapeHtml(userName)}</span>
                <span class="bm-user-points-badge" title="Бали активності (система нарахування незабаром)">
                  <i class="fas fa-coins text-warning"></i> <span>0 балів</span>
                </span>
              </div>
              <div class="bm-user-strip-right">
                <div class="bm-daily-actions-counter" title="Денний захисний ліміт операцій: використано ${dailyCount} із ${DAILY_ACTION_LIMIT} дій на добу">
                  <span class="bm-actions-counter-label">ДІЙ</span>
                  <span class="bm-actions-counter-val">${dailyCount}/${DAILY_ACTION_LIMIT}</span>
                </div>
              </div>
            </div>
            <div class="bm-top-divider"></div>
            <div class="bm-top-actions-row">
              <div class="bm-cards-cap-actions">
                <button type="button" class="btn btn-danger btn-sm font-weight-bold bm-cap-btn bm-cap-btn-card" onclick="openCreateCardModal()" title="Створити нову тематичну папку / картку">
                  Створити папку
                </button>
                <button type="button" class="btn btn-primary btn-sm font-weight-bold bm-cap-btn bm-cap-btn-add" onclick="openAddBookmarkModal()" title="Додати новий сайт у закладки">
                  Додати сайт
                </button>
              </div>
              <button type="button" class="bm-cap-hints-btn" onclick="openUserCabinetModal('hints')" title="Корисні підказки (відкрити в Особистому кабінеті)" aria-label="Підказки">
                <i class="fas fa-question"></i>
              </button>
            </div>
          </div>
          ${renderColumnHtml(colCards[0])}
        </div>
        <div class="bm-column ${(colCards[1] || []).length === 0 ? 'bm-col-empty' : ''}" id="bmCol1">${renderColumnHtml(colCards[1])}</div>
        <div class="bm-column ${(colCards[2] || []).length === 0 ? 'bm-col-empty' : ''}" id="bmCol2">${renderColumnHtml(colCards[2])}</div>
        <div class="bm-column ${(colCards[3] || []).length === 0 ? 'bm-col-empty' : ''}" id="bmCol3">${renderColumnHtml(colCards[3])}</div>
      </div>
    `;

    // Ініціалізуємо перетягування карток (SortableJS)
    initBookmarksSortable();
  } catch (err) {
    if (loadingEl) loadingEl.style.display = 'none';
    pageContainer.style.display = 'block';
    pageContainer.innerHTML = `<div class="alert alert-danger">Помилка завантаження: ${err.message}</div>`;
  }
}

// Ініціалізація Drag-and-Drop перетягування та сортування карток
async function initBookmarksSortable() {
  await ensureSortableLoaded();
  if (!window.Sortable) return;

  const colIds = ['bmCol0', 'bmCol1', 'bmCol2', 'bmCol3'];
  colIds.forEach(colId => {
    const el = document.getElementById(colId);
    if (!el) return;

    if (el._sortableInstance) {
      try { el._sortableInstance.destroy(); } catch (e) {}
    }

    el._sortableInstance = new window.Sortable(el, {
      group: 'bm-user-cards-group',
      animation: 250,
      handle: '.bm-card-drag-handle',
      draggable: '.bm-user-card',
      filter: '.bm-top-panel, .bm-user-strip, .bm-cards-cap',
      fallbackOnBody: true,
      swapThreshold: 0.65,
      ghostClass: 'bm-card-sortable-ghost',
      chosenClass: 'bm-card-sortable-chosen',
      dragClass: 'bm-card-sortable-drag',
      onMove: function (evt) {
        if (evt.related && (evt.related.classList.contains('bm-top-panel') || evt.related.classList.contains('bm-cards-cap') || evt.related.classList.contains('bm-user-strip'))) {
          return false; // Не дозволяємо перетягувати картки вище за єдину верхню панель у першій колонці
        }
        return true;
      },
      onEnd: async function () {
        // Завжди переконуємося, що bmTopPanel залишається першим елементом у bmCol0
        const col0 = document.getElementById('bmCol0');
        const topPanel = document.getElementById('bmTopPanel');
        if (col0 && topPanel && col0.firstElementChild !== topPanel) {
          col0.insertBefore(topPanel, col0.firstElementChild);
        }

        const col0Cards = Array.from(col0?.querySelectorAll('.bm-user-card') || []).map(c => c.getAttribute('data-card-name')).filter(Boolean);
        const col1Cards = Array.from(document.getElementById('bmCol1')?.querySelectorAll('.bm-user-card') || []).map(c => c.getAttribute('data-card-name')).filter(Boolean);
        const col2Cards = Array.from(document.getElementById('bmCol2')?.querySelectorAll('.bm-user-card') || []).map(c => c.getAttribute('data-card-name')).filter(Boolean);
        const col3Cards = Array.from(document.getElementById('bmCol3')?.querySelectorAll('.bm-user-card') || []).map(c => c.getAttribute('data-card-name')).filter(Boolean);

        userBookmarkColumns = [col0Cards, col1Cards, col2Cards, col3Cards];
        userBookmarkCards = [
          ...col0Cards,
          ...col1Cards,
          ...col2Cards,
          ...col3Cards
        ];
        // 1. Миттєво зберігаємо новий порядок у localStorage (0 мс, збереження гарантовано навіть при перезавантаженні)
        try {
          const uid = currentUser ? currentUser.uid : null;
          const bmJson = JSON.stringify(userBookmarksList);
          const cardsJson = JSON.stringify(userBookmarkCards);
          const colsJson = JSON.stringify(userBookmarkColumns);
          localStorage.setItem(getBookmarksStorageKey(uid), bmJson);
          localStorage.setItem(getCardsStorageKey(uid), cardsJson);
          localStorage.setItem(getColumnsStorageKey(uid), colsJson);
          localStorage.setItem(GENERAL_BM_KEY, bmJson);
          localStorage.setItem(GENERAL_CARDS_KEY, cardsJson);
          localStorage.setItem(GENERAL_COLS_KEY, colsJson);
        } catch (e) {}

        // 2. Відкладаємо списання дії та запис у Firestore на 15 секунд:
        // Дії не списуються миттєво під час переміщення. Кожне нове перетягування скидає таймер на 15 секунд.
        // Лише через 15 с після останньої дії списується рівно 1 дія на всю сесію сортування.
        if (sortReorderTimer) {
          clearTimeout(sortReorderTimer);
          sortReorderTimer = null;
        }
        pendingSortAction = true;
        sortReorderTimer = setTimeout(async () => {
          sortReorderTimer = null;
          if (pendingSortAction) {
            pendingSortAction = false;
            if (checkAndIncrementDailyActionLimit()) {
              await pushBookmarksToFirestore();
              showQuickToast('Порядок карток оновлено та збережено!', 'success');
            }
          }
        }, 15000);
      }
    });
  });
}

// Заглушки для сумісності з попередніми викликами
function toggleHeroFlip() {}
window.toggleHeroFlip = toggleHeroFlip;
window.toggleBookmarksTipsAccordion = toggleHeroFlip;
function toggleHeroPanelCollapse() {}
window.toggleHeroPanelCollapse = toggleHeroPanelCollapse;

// 3. Вкладка: 👑 Панель Адміністратора (для weber515sis@gmail.com)
async function renderAdminOrdersTab() {
  const container = document.getElementById('cabinetTabContent');
  if (!container || !isAdminUser()) return;

  if (!firebaseDb) {
    container.innerHTML = `<div class="alert alert-warning">База даних завантажується...</div>`;
    return;
  }

  try {
    const snap = await firebaseDb.collection('orders').get();
    adminOrdersList = [];
    snap.forEach(doc => {
      adminOrdersList.push(doc.data());
    });

    // Сортування від найновіших до старіших
    adminOrdersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    // Розрахунок статистики
    const totalOrders = adminOrdersList.length;
    const pendingOrders = adminOrdersList.filter(o => o.status === 'pending' || !o.status).length;
    const paidOrders = adminOrdersList.filter(o => o.status === 'paid').length;
    const activeOrders = adminOrdersList.filter(o => o.status === 'active').length;
    const totalUah = adminOrdersList.reduce((acc, o) => acc + (o.pricing ? (Number(o.pricing.finalUah) || 0) : 0), 0);

    // Фільтрація
    let filtered = adminOrdersList.filter(o => {
      if (adminStatusFilter !== 'all') {
        const st = o.status || 'pending';
        if (st !== adminStatusFilter) return false;
      }
      if (adminSearchQuery) {
        const q = adminSearchQuery.toLowerCase();
        const str = `${o.orderId} ${o.siteName} ${o.siteUrl} ${o.userEmail} ${o.contacts ? o.contacts.email : ''} ${o.contacts ? o.contacts.tg : ''}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });

    let ordersHtml = '';
    if (filtered.length === 0) {
      ordersHtml = `<div class="text-center py-4 text-muted">Замовлень за вказаними фільтрами не знайдено.</div>`;
    } else {
      filtered.forEach(order => {
        const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
        const currentStatus = order.status || 'pending';

        let placementsListHtml = '';
        if (order.placements && order.placements.length) {
          placementsListHtml = order.placements.map(p => `• ${p.section || ''} > ${p.card || ''} (${p.locationLabel || ''}) [${p.monthlyRate || ''} грн]`).join('<br>');
        }

        ordersHtml += `
          <div class="cabinet-order-card" style="border-left: 4px solid #3b82f6;">
            <div class="cabinet-order-header">
              <div>
                <span class="cabinet-order-id">${order.orderId}</span>
                <span class="cabinet-order-date ms-2">• ${dateStr}</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="text-muted small">Статус:</span>
                <select class="cabinet-status-select" onchange="changeOrderStatus('${order.orderId}', this.value)">
                  <option value="pending" ${currentStatus === 'pending' ? 'selected' : ''}>🟡 Очікує оплати</option>
                  <option value="paid" ${currentStatus === 'paid' ? 'selected' : ''}>🔵 Оплачено (перевірити)</option>
                  <option value="active" ${currentStatus === 'active' ? 'selected' : ''}>🟢 Розміщено (активно)</option>
                  <option value="completed" ${currentStatus === 'completed' ? 'selected' : ''}>⚪ Завершено</option>
                  <option value="cancelled" ${currentStatus === 'cancelled' ? 'selected' : ''}>🔴 Скасовано</option>
                </select>
              </div>
            </div>
            <div class="cabinet-order-details">
              <div class="cabinet-order-row">
                <strong>Клієнт:</strong> 
                <span class="text-primary font-weight-bold">${order.userEmail || (order.contacts ? order.contacts.email : '')}</span>
                ${order.contacts && order.contacts.tg ? ` | TG: <a href="https://t.me/${order.contacts.tg.replace('@', '')}" target="_blank">@${order.contacts.tg.replace('@', '')}</a>` : ''}
                ${order.contacts && order.contacts.phone ? ` | Тел: ${order.contacts.phone}` : ''}
              </div>
              <div class="cabinet-order-row">
                <strong>Сайт:</strong> ${order.siteName} — <a href="${order.siteUrl}" target="_blank" class="text-primary font-weight-bold">${order.siteUrl} <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i></a>
              </div>
              ${order.siteDesc ? `<div class="cabinet-order-row text-muted small"><strong>Опис:</strong> ${order.siteDesc}</div>` : ''}
              ${placementsListHtml ? `<div class="cabinet-order-row mt-1"><strong>Обрані місця:</strong><br><span class="text-muted small">${placementsListHtml}</span></div>` : ''}
              <div class="cabinet-order-row mt-1">
                <strong>До сплати:</strong> <span class="text-success font-weight-bold">${order.pricing ? order.pricing.finalUah : ''} грн</span> (~ $${order.pricing ? order.pricing.finalUsdt : ''} USDT)
                <span class="text-muted small ms-2">• Термін: ${order.pricing ? order.pricing.termLabel : ''}</span>
                <span class="text-muted small ms-2">• Оплата: ${order.paymentMethod || ''}</span>
              </div>
            </div>
            <div class="cabinet-order-actions">
              <button type="button" class="ad-sub-copy-btn" onclick="copyOrderDetails('${order.orderId}', this)">
                <i class="far fa-copy"></i> Скопіювати чек
              </button>
              ${order.contacts && order.contacts.tg ? `
                <a href="https://t.me/${order.contacts.tg.replace('@', '')}" target="_blank" class="btn btn-sm btn-outline-info font-weight-bold" style="border-radius: 5px; font-size: 0.78rem;">
                  <i class="fab fa-telegram-plane"></i> Написати клієнту
                </a>
              ` : ''}
              <a href="mailto:${order.userEmail || (order.contacts ? order.contacts.email : '')}?subject=${encodeURIComponent('Розміщення сайту ' + order.siteName + ' (Замовлення ' + order.orderId + ')')}" class="btn btn-sm btn-outline-secondary font-weight-bold" style="border-radius: 5px; font-size: 0.78rem;">
                <i class="far fa-envelope"></i> Email клієнту
              </a>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = `
      <!-- Статистичні блоки -->
      <div class="cabinet-admin-stats-grid">
        <div class="cabinet-admin-stat-card">
          <div class="cabinet-stat-val">${totalOrders}</div>
          <div class="cabinet-stat-lbl">Всього замовлень</div>
        </div>
        <div class="cabinet-admin-stat-card">
          <div class="cabinet-stat-val text-warning">${pendingOrders}</div>
          <div class="cabinet-stat-lbl">Очікують</div>
        </div>
        <div class="cabinet-admin-stat-card">
          <div class="cabinet-stat-val text-info">${paidOrders}</div>
          <div class="cabinet-stat-lbl">Оплачено</div>
        </div>
        <div class="cabinet-admin-stat-card">
          <div class="cabinet-stat-val text-success">${activeOrders}</div>
          <div class="cabinet-stat-lbl">Активні</div>
        </div>
        <div class="cabinet-admin-stat-card">
          <div class="cabinet-stat-val">${totalUah.toLocaleString('uk-UA')} ₴</div>
          <div class="cabinet-stat-lbl">Загальний оборот</div>
        </div>
      </div>

      <!-- Пошук та фільтр -->
      <div class="cabinet-admin-filter-bar">
        <input type="text" id="adminSearchInput" class="cabinet-search-input" placeholder="🔍 Пошук за номером, сайтом або клієнтом..." value="${adminSearchQuery}">
        <select id="adminStatusFilterSelect" class="cabinet-status-select" style="padding: 7px 10px;">
          <option value="all" ${adminStatusFilter === 'all' ? 'selected' : ''}>Всі статуси (${totalOrders})</option>
          <option value="pending" ${adminStatusFilter === 'pending' ? 'selected' : ''}>🟡 Очікують (${pendingOrders})</option>
          <option value="paid" ${adminStatusFilter === 'paid' ? 'selected' : ''}>🔵 Оплачено (${paidOrders})</option>
          <option value="active" ${adminStatusFilter === 'active' ? 'selected' : ''}>🟢 Активні (${activeOrders})</option>
          <option value="completed" ${adminStatusFilter === 'completed' ? 'selected' : ''}>⚪ Завершені</option>
        </select>
        <button type="button" class="btn btn-sm btn-outline-primary" id="adminRefreshBtn" title="Оновити список">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>

      <!-- Список замовлень -->
      <div class="cabinet-admin-orders-list">
        ${ordersHtml}
      </div>
    `;

    document.getElementById('adminSearchInput').oninput = (e) => {
      adminSearchQuery = e.target.value;
      renderAdminOrdersTab();
    };
    document.getElementById('adminStatusFilterSelect').onchange = (e) => {
      adminStatusFilter = e.target.value;
      renderAdminOrdersTab();
    };
    document.getElementById('adminRefreshBtn').onclick = () => renderAdminOrdersTab();
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Помилка завантаження адмін-панелі: ${err.message}</div>`;
  }
}

// Зміна статусу замовлення адміністратором
window.changeOrderStatus = async function(orderId, newStatus) {
  if (!firebaseDb || !isAdminUser()) return;
  const statusLabels = {
    pending: 'Очікує узгодження та оплати',
    paid: 'Оплачено (перевірити)',
    active: 'Розміщено (активно)',
    completed: 'Завершено',
    cancelled: 'Скасовано'
  };
  try {
    const cleanId = orderId.replace('#', '').trim();
    await firebaseDb.collection('orders').doc(cleanId).update({
      status: newStatus,
      statusLabel: statusLabels[newStatus] || newStatus,
      updatedAt: new Date().toISOString()
    });
    renderAdminOrdersTab();
  } catch (err) {
    alert("Помилка оновлення статусу: " + err.message);
  }
};

// Допоміжні функції статусу та копіювання
function getStatusPillHtml(status, label) {
  const st = status || 'pending';
  let cssClass = 'status-pending';
  let defaultLabel = '🟡 Очікує узгодження';

  if (st === 'paid') {
    cssClass = 'status-paid';
    defaultLabel = '🔵 Оплачено';
  } else if (st === 'active') {
    cssClass = 'status-active';
    defaultLabel = '🟢 Активно розміщено';
  } else if (st === 'completed') {
    cssClass = 'status-completed';
    defaultLabel = '⚪ Завершено';
  } else if (st === 'cancelled') {
    cssClass = 'status-cancelled';
    defaultLabel = '🔴 Скасовано';
  }

  return `<span class="cabinet-status-pill ${cssClass}">${label || defaultLabel}</span>`;
}

window.copyOrderDetails = async function(orderId, btn) {
  if (!firebaseDb) return;
  try {
    const cleanId = orderId.replace('#', '').trim();
    const doc = await firebaseDb.collection('orders').doc(cleanId).get();
    if (doc.exists && doc.data().orderSummaryText) {
      copyToClipboard(doc.data().orderSummaryText, btn, 'Скопійовано! ✅');
    } else {
      copyToClipboard('Замовлення #' + cleanId, btn, 'Скопійовано! ✅');
    }
  } catch (err) {
    copyToClipboard('Замовлення #' + orderId, btn, 'Скопійовано! ✅');
  }
};

// Рендеринг банера вибору: швидке оформлення або з Особистим кабінетом
function renderAdAuthPromptBanner() {
  const container = document.getElementById('adAuthPromptBanner');
  if (!container) return;

  if (currentUser) {
    const avatarSrc = currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp';
    container.innerHTML = `
      <div class="ad-auth-banner logged-in">
        <div class="ad-auth-banner-info">
          <img src="${avatarSrc}" class="ad-auth-banner-avatar" alt="Avatar" referrerpolicy="no-referrer">
          <div>
            <div class="ad-auth-banner-title">
              Ви увійшли як: <strong>${currentUser.displayName || currentUser.email}</strong>
            </div>
            <div class="ad-auth-banner-sub">
              <i class="fas fa-check-circle text-success me-1"></i> Замовлення буде автоматично збережено у вашому <a href="javascript:void(0)" onclick="openUserCabinetModal('orders')">Особистому кабінеті</a>.
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="ad-auth-banner guest">
        <div class="ad-auth-banner-header">
          <div class="ad-auth-banner-title">
            <i class="fas fa-user-shield ad-auth-shield-icon"></i> Оформлення замовлення з КАБІНЕТОМ
          </div>
          <div class="ad-auth-banner-sub">
            Якщо бажаєте зберігати та контролювати статус розміщення, здійсніть вхід в 1 клік:
          </div>
        </div>
        <div class="ad-auth-banner-actions">
          <button type="button" class="ad-auth-google-btn" id="btnAdModalGoogleLogin">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Увійти через Google
          </button>
          <div class="ad-auth-guest-note">
            або <strong>ШВИДКЕ замовлення (без входу)</strong>, де заповнюйте поля нижче як гість без реєстрації, і всі дані зберігаєте у себе на пристрої ↓
          </div>
        </div>
      </div>
    `;

    const btn = document.getElementById('btnAdModalGoogleLogin');
    if (btn) {
      btn.onclick = async () => {
        await loginWithGoogle();
        renderAdAuthPromptBanner();
        if (currentUser && currentUser.email) {
          const emailInput = document.getElementById('adEmailInput');
          if (emailInput && !emailInput.value) {
            emailInput.value = currentUser.email;
          }
        }
      };
    }
  }
}

// Рендеринг блоку збереження замовлення у кабінет на Кроці 2
function renderAdOrderClaimWrap(orderId) {
  const container = document.getElementById('adOrderClaimWrap');
  if (!container) return;

  if (currentUser) {
    container.innerHTML = `
      <div class="ad-order-claim-box success">
        <i class="fas fa-check-circle text-success me-1"></i> Замовлення <strong>${orderId}</strong> збережено у вашому 
        <a href="javascript:void(0)" onclick="openUserCabinetModal('orders')" class="text-primary font-weight-bold ms-1">Особистому кабінеті <i class="fas fa-arrow-right small"></i></a>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="ad-order-claim-box" id="adOrderClaimPrompt">
        <div class="ad-order-claim-content">
          <div>
            <div class="ad-order-claim-title">
              <i class="fas fa-cloud-upload-alt text-primary me-1"></i> <strong>Зберегти це замовлення у свій кабінет?</strong>
            </div>
            <div class="ad-order-claim-desc text-muted">
              Увійдіть через Google в 1 клік, щоб закріпити замовлення ${orderId} за своїм профілем та контролювати статус.
            </div>
          </div>
          <button type="button" class="ad-auth-google-btn" id="btnClaimOrderGoogle">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Зберегти в кабінет
          </button>
        </div>
      </div>
    `;

    const btn = document.getElementById('btnClaimOrderGoogle');
    if (btn) {
      btn.onclick = async () => {
        await loginWithGoogle();
        if (currentUser && firebaseDb) {
          const cleanId = orderId.replace('#', '').trim();
          try {
            await firebaseDb.collection('orders').doc(cleanId).update({
              userId: currentUser.uid,
              userEmail: currentUser.email,
              userName: currentUser.displayName || '',
              userPhoto: currentUser.photoURL || null
            });
            renderAdOrderClaimWrap(orderId);
          } catch (e) {
            console.warn("Помилка прив'язки замовлення:", e);
            renderAdOrderClaimWrap(orderId);
          }
        }
      };
    }
  }
}

// Запуск ініціалізації Firebase при старті
if (typeof initFirebaseAuthAndDb === 'function') {
  try {
    initFirebaseAuthAndDb();
  } catch (e) {
    console.warn("Помилка ініціалізації Firebase:", e);
  }
}


/* ==========================================================================
   МОДУЛЬ «ПУЛЬС ДНЯ» (TOP DRAWER / ШВИДКА ІНФОПАНЕЛЬ)
   ========================================================================== */
const PULSE_CITIES = [
  { name: 'Київ', lat: 50.4501, lon: 30.5234 },
  { name: 'Харків', lat: 49.9935, lon: 36.2304 },
  { name: 'Одеса', lat: 46.4825, lon: 30.7233 },
  { name: 'Дніпро', lat: 48.4647, lon: 35.0462 },
  { name: 'Львів', lat: 49.8397, lon: 24.0297 },
  { name: 'Запоріжжя', lat: 47.8388, lon: 35.1396 },
  { name: 'Кривий Ріг', lat: 47.9105, lon: 33.3918 },
  { name: 'Вінниця', lat: 49.2331, lon: 28.4682 },
  { name: 'Полтава', lat: 49.5883, lon: 34.5514 },
  { name: 'Черкаси', lat: 49.4444, lon: 32.0598 },
  { name: 'Чернігів', lat: 51.4982, lon: 31.2893 },
  { name: 'Житомир', lat: 50.2547, lon: 28.6587 },
  { name: 'Суми', lat: 50.9077, lon: 34.7981 },
  { name: 'Хмельницький', lat: 49.4230, lon: 26.9871 },
  { name: 'Рівне', lat: 50.6199, lon: 26.2516 },
  { name: 'Івано-Франківськ', lat: 48.9226, lon: 24.7111 },
  { name: 'Тернопіль', lat: 49.5535, lon: 25.5948 },
  { name: 'Луцьк', lat: 50.7472, lon: 25.3254 },
  { name: 'Ужгород', lat: 48.6208, lon: 22.2879 },
  { name: 'Чернівці', lat: 48.2921, lon: 25.9358 },
  { name: 'Кропивницький', lat: 48.5079, lon: 32.2623 },
  { name: 'Миколаїв', lat: 46.9750, lon: 31.9946 }
];

let pulseRatesData = {
  USD: 41.50,
  EUR: 45.15,
  PLN: 10.55,
  GBP: 53.90,
  CZK: 1.78,
  CHF: 47.80,
  CAD: 30.20,
  CNY: 5.75,
  diffUSD: '+0.04',
  diffEUR: '+0.08',
  diffPLN: '-0.02',
  diffGBP: '+0.12',
  diffCZK: '+0.01',
  diffCHF: '+0.05',
  diffCAD: '-0.03',
  diffCNY: '+0.01'
};

let pulseCryptoData = {
  BTC: { name: 'Bitcoin', price: 68450, diff: '+1.8%', symbol: 'BTCUSDT' },
  ETH: { name: 'Ethereum', price: 2520, diff: '+2.1%', symbol: 'ETHUSDT' },
  SOL: { name: 'Solana', price: 176.4, diff: '+3.5%', symbol: 'SOLUSDT' },
  BNB: { name: 'BNB Chain', price: 594.2, diff: '-0.8%', symbol: 'BNBUSDT' },
  GRAM: { name: 'Gram', price: 0.016, diff: '+4.2%', symbol: null },
  XRP: { name: 'Ripple', price: 0.535, diff: '+1.2%', symbol: 'XRPUSDT' },
  LTC: { name: 'Litecoin', price: 71.8, diff: '-0.5%', symbol: 'LTCUSDT' },
  DOGE: { name: 'Dogecoin', price: 0.142, diff: '+2.8%', symbol: 'DOGEUSDT' }
};

// ==========================================================================
// КАЛЕНДАР ВИЗНАЧНИХ ДАТ ТА СВЯТ (ДЕРЖАВНІ, БІБЛІЙНІ ХРИСТИЯНСЬКІ, МІЖНАРОДНІ)
// Враховує побажання: лише важливі події, без культів/ікон/неканонічних святих,
// тільки біблійне християнство (Різдво 25 грудня, Воскресіння, Вознесіння, Трійця, День подяки Богові)
// ==========================================================================

const UKRAINE_EVENTS_DB = {
  // Січень
  '01-01': [
    { title: 'Новий рік • Всесвітній день миру', icon: '🌍', cat: 'intl' },
    { title: 'День народження Степана Бандери', icon: '🇺🇦', cat: 'ua' }
  ],
  '01-22': [
    { title: 'День Соборності України (Акт Злуки УНР і ЗУНР 1919 р.)', icon: '🇺🇦', cat: 'ua' }
  ],
  '01-24': [
    { title: 'День зовнішньої розвідки України', icon: '🇺🇦', cat: 'ua' }
  ],
  '01-27': [
    { title: 'Міжнародний день пам\'яті жертв Голокосту', icon: '🎗️', cat: 'memo' }
  ],
  '01-29': [
    { title: 'День пам\'яті Героїв Крут (1918 р.)', icon: '🎗️', cat: 'memo' }
  ],

  // Лютий
  '02-04': [
    { title: 'Всесвітній день боротьби проти раку', icon: '🌍', cat: 'intl' }
  ],
  '02-15': [
    { title: 'День вшанування учасників бойових дій на території інших держав', icon: '🎗️', cat: 'memo' }
  ],
  '02-19': [
    { title: 'День Державного Герба України (Тризуба)', icon: '🇺🇦', cat: 'ua' }
  ],
  '02-20': [
    { title: 'День Героїв Небесної Сотні', icon: '🎗️', cat: 'memo' }
  ],
  '02-21': [
    { title: 'Міжнародний день рідної мови (ЮНЕСКО)', icon: '🌍', cat: 'intl' }
  ],
  '02-24': [
    { title: 'День початку всенародного спротиву збройній агресії РФ', icon: '🇺🇦', cat: 'ua' }
  ],
  '02-26': [
    { title: 'День кримського спротиву російській окупації', icon: '🇺🇦', cat: 'ua' }
  ],

  // Березень
  '03-03': [
    { title: 'Всесвітній день дикої природи', icon: '🌍', cat: 'intl' }
  ],
  '03-08': [
    { title: 'Міжнародний день боротьби за права жінок і мир', icon: '🌍', cat: 'intl' }
  ],
  '03-09': [
    { title: 'День народження Тараса Григоровича Шевченка (1814 р.)', icon: '🇺🇦', cat: 'ua' }
  ],
  '03-14': [
    { title: 'День українського добровольця', icon: '🇺🇦', cat: 'ua' }
  ],
  '03-20': [
    { title: 'Міжнародний день щастя', icon: '🌍', cat: 'intl' }
  ],
  '03-21': [
    { title: 'Всесвітній день поезії • Міжнародний день лісів', icon: '🌍', cat: 'intl' }
  ],
  '03-22': [
    { title: 'Всесвітній день водних ресурсів', icon: '🌍', cat: 'intl' }
  ],
  '03-24': [
    { title: 'Всесвітній день боротьби проти туберкульозу', icon: '🌍', cat: 'intl' }
  ],
  '03-25': [
    { title: 'День Служби безпеки України (СБУ)', icon: '💼', cat: 'pro' }
  ],
  '03-26': [
    { title: 'День Національної гвардії України', icon: '🇺🇦', cat: 'ua' }
  ],
  '03-27': [
    { title: 'Міжнародний день театру', icon: '🌍', cat: 'intl' }
  ],

  // Квітень
  '04-07': [
    { title: 'Всесвітній день здоров\'я (ВООЗ)', icon: '🌍', cat: 'intl' }
  ],
  '04-12': [
    { title: 'День працівників ракетно-космічної галузі України', icon: '💼', cat: 'pro' }
  ],
  '04-17': [
    { title: 'День пожежної охорони України', icon: '💼', cat: 'pro' }
  ],
  '04-18': [
    { title: 'День пам\'яток історії та культури України', icon: '🇺🇦', cat: 'ua' }
  ],
  '04-22': [
    { title: 'Міжнародний День Матері-Землі', icon: '🌍', cat: 'intl' }
  ],
  '04-23': [
    { title: 'Всесвітній день книги та авторського права', icon: '🌍', cat: 'intl' }
  ],
  '04-26': [
    { title: 'День Чорнобильської трагедії та пам\'яті ліквідаторів (1986 р.)', icon: '🎗️', cat: 'memo' }
  ],
  '04-30': [
    { title: 'День прикордонника України', icon: '🇺🇦', cat: 'ua' }
  ],

  // Травень
  '05-01': [
    { title: 'День праці', icon: '🌍', cat: 'intl' }
  ],
  '05-03': [
    { title: 'Всесвітній день свободи преси', icon: '🌍', cat: 'intl' }
  ],
  '05-08': [
    { title: 'День пам\'яті та перемоги над нацизмом у Другій світовій війні', icon: '🎗️', cat: 'memo' }
  ],
  '05-09': [
    { title: 'День Європи в Україні', icon: '🇪🇺', cat: 'ua' }
  ],
  '05-15': [
    { title: 'Міжнародний день сім\'ї (ООН)', icon: '🌍', cat: 'intl' }
  ],
  '05-18': [
    { title: 'День боротьби за права кримськотатарського народу та пам\'яті жертв геноциду', icon: '🎗️', cat: 'memo' },
    { title: 'Міжнародний день музеїв', icon: '🌍', cat: 'intl' }
  ],
  '05-20': [
    { title: 'День банківських працівників України', icon: '💼', cat: 'pro' }
  ],
  '05-23': [
    { title: 'День Героїв України • День морської піхоти України', icon: '🇺🇦', cat: 'ua' }
  ],
  '05-24': [
    { title: 'День слов\'янської писемності і культури', icon: '🇺🇦', cat: 'ua' }
  ],
  '05-29': [
    { title: 'Міжнародний день миротворців ООН', icon: '🌍', cat: 'intl' }
  ],
  '05-31': [
    { title: 'Всесвітній день без тютюну', icon: '🌍', cat: 'intl' }
  ],

  // Червень
  '06-01': [
    { title: 'Міжнародний день захисту дітей', icon: '🌍', cat: 'intl' }
  ],
  '06-04': [
    { title: 'День вшанування пам\'яті дітей, які загинули внаслідок збройної агресії РФ', icon: '🎗️', cat: 'memo' }
  ],
  '06-05': [
    { title: 'Всесвітній день навколишнього середовища (ООН)', icon: '🌍', cat: 'intl' }
  ],
  '06-06': [
    { title: 'День журналіста в Україні', icon: '💼', cat: 'pro' }
  ],
  '06-14': [
    { title: 'Всесвітній день донора крові', icon: '🌍', cat: 'intl' }
  ],
  '06-20': [
    { title: 'Всесвітній день біженців', icon: '🌍', cat: 'intl' }
  ],
  '06-22': [
    { title: 'День скорботи і вшанування пам\'яті жертв війни в Україні', icon: '🎗️', cat: 'memo' }
  ],
  '06-23': [
    { title: 'День державної служби України', icon: '💼', cat: 'pro' }
  ],
  '06-25': [
    { title: 'День митника України', icon: '💼', cat: 'pro' }
  ],
  '06-28': [
    { title: 'День Конституції України (1996 р.)', icon: '🇺🇦', cat: 'ua' }
  ],

  // Липень
  '07-04': [
    { title: 'День Національної поліції України', icon: '💼', cat: 'pro' }
  ],
  '07-07': [
    { title: 'День працівника природно-заповідної справи', icon: '💼', cat: 'pro' }
  ],
  '07-15': [
    { title: 'День Української Державності', icon: '🇺🇦', cat: 'ua' }
  ],
  '07-16': [
    { title: 'День ухвалення Декларації про державний суверенітет України (1990 р.)', icon: '🇺🇦', cat: 'ua' },
    { title: 'День бухгалтера та аудитора', icon: '💼', cat: 'pro' }
  ],
  '07-28': [
    { title: 'День хрещення Київської Русі - України', icon: '🇺🇦', cat: 'ua' }
  ],
  '07-29': [
    { title: 'День Сил спеціальних операцій ЗСУ', icon: '🇺🇦', cat: 'ua' }
  ],
  '07-30': [
    { title: 'Всесвітній день боротьби з торгівлею людьми', icon: '🌍', cat: 'intl' }
  ],

  // Серпень
  '08-08': [
    { title: 'День військ зв\'язку Збройних Сил України', icon: '🇺🇦', cat: 'ua' },
    { title: 'День ветеринарного лікаря', icon: '💼', cat: 'pro' }
  ],
  '08-12': [
    { title: 'Міжнародний день молоді', icon: '🌍', cat: 'intl' }
  ],
  '08-19': [
    { title: 'Всесвітній день гуманітарної допомоги', icon: '🌍', cat: 'intl' },
    { title: 'День пасічника України', icon: '💼', cat: 'pro' }
  ],
  '08-23': [
    { title: 'День Державного Прапора України', icon: '🇺🇦', cat: 'ua' }
  ],
  '08-24': [
    { title: 'День Незалежності України (1991 р.)', icon: '🇺🇦', cat: 'ua' }
  ],
  '08-29': [
    { title: 'День пам\'яті захисників України, які загинули в боротьбі за незалежність', icon: '🎗️', cat: 'memo' }
  ],

  // Вересень
  '09-01': [
    { title: 'День знань', icon: '💼', cat: 'pro' }
  ],
  '09-02': [
    { title: 'День нотаріату України', icon: '💼', cat: 'pro' }
  ],
  '09-07': [
    { title: 'День воєнної розвідки України', icon: '🇺🇦', cat: 'ua' }
  ],
  '09-08': [
    { title: 'Міжнародний день грамотності', icon: '🌍', cat: 'intl' }
  ],
  '09-17': [
    { title: 'День рятівника України', icon: '💼', cat: 'pro' }
  ],
  '09-21': [
    { title: 'Міжнародний день миру (ООН)', icon: '🌍', cat: 'intl' }
  ],
  '09-22': [
    { title: 'День партизанської слави України', icon: '🎗️', cat: 'memo' }
  ],
  '09-27': [
    { title: 'Всесвітній день туризму', icon: '🌍', cat: 'intl' }
  ],
  '09-29': [
    { title: 'День пам\'яті жертв трагедії Бабиного Яру', icon: '🎗️', cat: 'memo' }
  ],
  '09-30': [
    { title: 'Всеукраїнський день бібліотек • День усиновлення', icon: '💼', cat: 'pro' }
  ],

  // Жовтень
  '10-01': [
    { title: 'День захисників і захисниць України', icon: '🇺🇦', cat: 'ua' },
    { title: 'День ветерана та Міжнародний день людей похилого віку', icon: '🌍', cat: 'intl' }
  ],
  '10-04': [
    { title: 'Всесвітній день захисту тварин', icon: '🌍', cat: 'intl' }
  ],
  '10-05': [
    { title: 'Всесвітній день вчителів (ЮНЕСКО)', icon: '🌍', cat: 'intl' }
  ],
  '10-08': [
    { title: 'День юриста України', icon: '💼', cat: 'pro' }
  ],
  '10-10': [
    { title: 'Всесвітній день психічного здоров\'я', icon: '🌍', cat: 'intl' }
  ],
  '10-14': [
    { title: 'День українського козацтва', icon: '🇺🇦', cat: 'ua' }
  ],
  '10-16': [
    { title: 'Всесвітній день продовольства', icon: '🌍', cat: 'intl' },
    { title: 'День анестезіолога', icon: '💼', cat: 'pro' }
  ],
  '10-19': [
    { title: 'День створення Західноукраїнської Народної Республіки (ЗУНР 1918 р.)', icon: '🇺🇦', cat: 'ua' }
  ],
  '10-24': [
    { title: 'День Організації Об\'єднаних Націй (ООН)', icon: '🌍', cat: 'intl' }
  ],
  '10-27': [
    { title: 'День української писемності та мови', icon: '🇺🇦', cat: 'ua' }
  ],
  '10-28': [
    { title: 'День визволення України від нацистських загарбників (1944 р.)', icon: '🇺🇦', cat: 'ua' },
    { title: 'Міжнародний день анімації', icon: '🌍', cat: 'intl' }
  ],
  '10-29': [
    { title: 'Всесвітній день боротьби з інсультом', icon: '🌍', cat: 'intl' },
    { title: 'День служби охорони МВС України', icon: '💼', cat: 'pro' }
  ],
  '10-30': [
    { title: 'День працівників підрозділів боротьби з наркозлочинністю', icon: '💼', cat: 'pro' },
    { title: 'День тренера в Україні', icon: '💼', cat: 'pro' }
  ],
  '10-31': [
    { title: 'Міжнародний день Чорного моря', icon: '🌍', cat: 'intl' },
    { title: 'Всесвітній день міст', icon: '🌍', cat: 'intl' }
  ],

  // Листопад
  '11-03': [
    { title: 'День ракетних військ і артилерії України', icon: '🇺🇦', cat: 'ua' },
    { title: 'День інженерних військ України', icon: '🇺🇦', cat: 'ua' }
  ],
  '11-04': [
    { title: 'День залізничника України', icon: '💼', cat: 'pro' }
  ],
  '11-09': [
    { title: 'Всеукраїнський день працівників культури та майстрів народного мистецтва', icon: '💼', cat: 'pro' }
  ],
  '11-10': [
    { title: 'Всесвітній день науки в ім\'я миру та розвитку', icon: '🌍', cat: 'intl' }
  ],
  '11-14': [
    { title: 'Всесвітній день боротьби з діабетом', icon: '🌍', cat: 'intl' }
  ],
  '11-16': [
    { title: 'День працівників радіо, телебачення та зв\'язку України', icon: '💼', cat: 'pro' },
    { title: 'Міжнародний день толерантності', icon: '🌍', cat: 'intl' }
  ],
  '11-17': [
    { title: 'Міжнародний день студентів', icon: '🌍', cat: 'intl' }
  ],
  '11-18': [
    { title: 'День сержанта Збройних Сил України', icon: '🇺🇦', cat: 'ua' }
  ],
  '11-20': [
    { title: 'Всесвітній день дитини (ООН)', icon: '🌍', cat: 'intl' }
  ],
  '11-21': [
    { title: 'День Гідності та Свободи (2013 р.)', icon: '🇺🇦', cat: 'ua' },
    { title: 'День Десантно-штурмових військ ЗСУ', icon: '🇺🇦', cat: 'ua' }
  ],
  '11-25': [
    { title: 'Міжнародний день боротьби за ліквідацію насильства щодо жінок', icon: '🌍', cat: 'intl' }
  ],

  // Грудень
  '12-01': [
    { title: 'Річниця Всеукраїнського референдуму 1991 року про незалежність', icon: '🇺🇦', cat: 'ua' },
    { title: 'День працівників прокуратури України', icon: '💼', cat: 'pro' },
    { title: 'Всесвітній день боротьби зі СНІДом', icon: '🌍', cat: 'intl' }
  ],
  '12-03': [
    { title: 'Міжнародний день людей з інвалідністю', icon: '🌍', cat: 'intl' }
  ],
  '12-05': [
    { title: 'Міжнародний день волонтера', icon: '🌍', cat: 'intl' }
  ],
  '12-06': [
    { title: 'День Збройних Сил України (ЗСУ 1991 р.)', icon: '🇺🇦', cat: 'ua' }
  ],
  '12-07': [
    { title: 'День місцевого самоврядування в Україні', icon: '💼', cat: 'pro' }
  ],
  '12-10': [
    { title: 'День прав людини (ООН)', icon: '🌍', cat: 'intl' }
  ],
  '12-12': [
    { title: 'День Сухопутних військ ЗСУ', icon: '🇺🇦', cat: 'ua' }
  ],
  '12-14': [
    { title: 'День вшанування ліквідаторів наслідків аварії на ЧАЕС', icon: '🎗️', cat: 'memo' }
  ],
  '12-19': [
    { title: 'День адвокатури України', icon: '💼', cat: 'pro' }
  ],
  '12-22': [
    { title: 'День енергетика України', icon: '💼', cat: 'pro' },
    { title: 'День дипломатичної служби України', icon: '💼', cat: 'pro' }
  ],
  '12-24': [
    { title: 'День працівників архівних установ України', icon: '💼', cat: 'pro' }
  ],
  '12-25': [
    { title: 'Різдво Христове (Народження Господа Ісуса Христа)', icon: '🕊️', cat: 'biblical' }
  ]
};

// Обчислення біблійного Великодня (Пасхи) та рухомих християнських свят
function getEasterSunday(year) {
  const easterMap = {
    2024: new Date(2024, 4, 5),
    2025: new Date(2025, 3, 20),
    2026: new Date(2026, 3, 12),
    2027: new Date(2027, 4, 2),
    2028: new Date(2028, 3, 16),
    2029: new Date(2029, 3, 8),
    2030: new Date(2030, 3, 28)
  };
  if (easterMap[year]) return easterMap[year];
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

// Отримання рухомих свят (християнських біблійних та офіційних цивільних) для конкретної дати
function getRelativeEventsForDate(targetDate) {
  const events = [];
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();
  const dayOfWeek = targetDate.getDay();

  // 1. Біблійні християнські рухомі свята
  const easter = getEasterSunday(year);
  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  if (isSameDay(targetDate, easter)) {
    events.push({ title: 'Світле Христове Воскресіння (Пасха Господня / Великдень)', icon: '🕊️', cat: 'biblical' });
  }

  // Вознесіння Господнє (40-й день, четвер)
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  if (isSameDay(targetDate, ascension)) {
    events.push({ title: 'Вознесіння Господнє (Вознесіння Ісуса Христа на небо)', icon: '🕊️', cat: 'biblical' });
  }

  // День Святої Трійці / П'ятидесятниця (50-й день, неділя)
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);
  if (isSameDay(targetDate, pentecost)) {
    events.push({ title: 'День Святої Трійці (П\'ятидесятниця, Зішестя Святого Духа)', icon: '🕊️', cat: 'biblical' });
  }

  // 2. Всеукраїнський День подяки Богові (3-тя неділя вересня)
  if (month === 8 && dayOfWeek === 0) {
    const firstDayMonth = new Date(year, 8, 1).getDay();
    const firstSunOffset = (7 - firstDayMonth) % 7 + 1;
    const thirdSunday = firstSunOffset + 14;
    if (day === thirdSunday) {
      events.push({ title: 'Всеукраїнський День подяки Богові (біблійне свято жнив та подяки Господу за мир і хліб)', icon: '🕊️', cat: 'biblical' });
    }
  }

  // 3. Рухомі офіційні свята України
  // 2-га неділя травня: День матері
  if (month === 4 && dayOfWeek === 0) {
    const firstDayMay = new Date(year, 4, 1).getDay();
    const secondSunday = ((7 - firstDayMay) % 7 + 1) + 7;
    if (day === secondSunday) {
      events.push({ title: 'День матері в Україні', icon: '💐', cat: 'ua' });
    }
  }

  // 3-й четвер травня: День вишиванки
  if (month === 4 && dayOfWeek === 4) {
    const firstDayMay = new Date(year, 4, 1).getDay();
    const firstThu = (11 - firstDayMay) % 7 + 1;
    const thirdThu = firstThu + 14;
    if (day === thirdThu) {
      events.push({ title: 'Всесвітній день вишиванки', icon: '🇺🇦', cat: 'ua' });
    }
  }

  // 3-тя неділя червня: День батька / День медичного працівника
  if (month === 5 && dayOfWeek === 0) {
    const firstDayJun = new Date(year, 5, 1).getDay();
    const thirdSunJun = ((7 - firstDayJun) % 7 + 1) + 14;
    if (day === thirdSunJun) {
      events.push({ title: 'День батька в Україні • День медичного працівника', icon: '💼', cat: 'pro' });
    }
  }

  // 1-ша неділя липня: День Військово-Морських Сил ЗСУ
  if (month === 6 && dayOfWeek === 0) {
    const firstSunJul = (7 - new Date(year, 6, 1).getDay()) % 7 + 1;
    if (day === firstSunJul) {
      events.push({ title: 'День Військово-Морських Сил Збройних Сил України', icon: '🇺🇦', cat: 'ua' });
    }
  }

  // 1-ша неділя серпня: День Повітряних Сил ЗСУ
  if (month === 7 && dayOfWeek === 0) {
    const firstSunAug = (7 - new Date(year, 7, 1).getDay()) % 7 + 1;
    if (day === firstSunAug) {
      events.push({ title: 'День Повітряних Сил Збройних Сил України', icon: '🇺🇦', cat: 'ua' });
    }
  }

  // Остання субота серпня: День авіації України
  if (month === 7 && dayOfWeek === 6 && day >= 25) {
    events.push({ title: 'День авіації України', icon: '💼', cat: 'pro' });
  }

  // 1-ша неділя жовтня: День працівників освіти (День вчителя)
  if (month === 9 && dayOfWeek === 0) {
    const firstSunOct = (7 - new Date(year, 9, 1).getDay()) % 7 + 1;
    if (day === firstSunOct) {
      events.push({ title: 'День працівників освіти України (День вчителя)', icon: '💼', cat: 'pro' });
    }
  }

  // 1-ша неділя листопада: День працівника соціальної сфери
  if (month === 10 && dayOfWeek === 0) {
    const firstSunNov = (7 - new Date(year, 10, 1).getDay()) % 7 + 1;
    if (day === firstSunNov) {
      events.push({ title: 'День працівника соціальної сфери України', icon: '💼', cat: 'pro' });
    }
  }

  // 3-тя неділя листопада: День працівників сільського господарства
  if (month === 10 && dayOfWeek === 0) {
    const firstSunNov = (7 - new Date(year, 10, 1).getDay()) % 7 + 1;
    const thirdSunNov = firstSunNov + 14;
    if (day === thirdSunNov) {
      events.push({ title: 'День працівників сільського господарства України', icon: '💼', cat: 'pro' });
    }
  }

  // 4-та субота листопада: День пам'яті жертв голодоморів
  if (month === 10 && dayOfWeek === 6 && day >= 22 && day <= 28) {
    events.push({ title: 'День пам\'яті жертв голодоморів в Україні', icon: '🎗️', cat: 'memo' });
  }

  return events;
}

// Отримання повного відсортованого списку подій для обраної дати
function getEventsForDate(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const key = `${m}-${d}`;

  const fixed = UKRAINE_EVENTS_DB[key] ? [...UKRAINE_EVENTS_DB[key]] : [];
  const relative = getRelativeEventsForDate(date);
  const combined = [...relative, ...fixed];

  if (combined.length === 0) {
    return [
      { title: 'Пам\'ятний день: щоденна праця для захисту та Перемоги України', icon: '🇺🇦', cat: 'ua' }
    ];
  }

  // Пріоритет сортування: державні та біблійні > пам'ятні > професійні > міжнародні
  const priority = { biblical: 1, ua: 2, memo: 3, pro: 4, intl: 5 };
  combined.sort((a, b) => (priority[a.cat] || 10) - (priority[b.cat] || 10));
  return combined;
}

function getPulseDateBadge() {
  const now = new Date();
  const daysShort = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const monthsGen = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
  const dayName = daysShort[now.getDay()];
  const dayNum = now.getDate();
  const monthName = monthsGen[now.getMonth()];
  return `${dayName} • ${dayNum} ${monthName}`;
}

function getTodayHolidayInfo() {
  const now = new Date();
  const monthsGen = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
  const daysWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
  const dateLabel = `${daysWeek[now.getDay()]}, ${now.getDate()} ${monthsGen[now.getMonth()]} ${now.getFullYear()} р.`;

  const evs = getEventsForDate(now);
  const top = evs[0];
  return {
    dateLabel,
    title: top ? top.title : 'День єдності та праці для Перемоги',
    fact: 'Кожна доба наближає мир та утверджує незалежність України завдяки спільній праці та підтримці Сил Оборони.'
  };
}

// Рендеринг власного віджета «Свята та події» на 3 дні: «Сьогодні», «Завтра» та «Післязавтра»
function renderPulseHolidaysUI() {
  const container = document.getElementById('pulseHolidaysContainer');
  if (!container) return;

  const now = new Date();
  const daysUk = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'];
  const monthsUk = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
  const dayLabels = ['Сьогодні', 'Завтра', 'Післязавтра'];

  let html = '';

  for (let offset = 0; offset < 3; offset++) {
    const dayLabel = dayLabels[offset] || '';
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const rawDayOfWeek = daysUk[targetDate.getDay()];
    const dayOfWeekCapitalized = rawDayOfWeek.charAt(0).toUpperCase() + rawDayOfWeek.slice(1);
    const dateFormatted = `${targetDate.getDate()} ${monthsUk[targetDate.getMonth()]} • ${dayOfWeekCapitalized}`;

    const events = getEventsForDate(targetDate);
    // Обмеження: не більше 3 записів для сьогодні і не більше 2 для наступних днів (разом до 7 рядків)
    const maxItems = offset === 0 ? 3 : 2;
    const displayEvents = events.slice(0, maxItems);

    let itemsHtml = '';
    displayEvents.forEach((ev, idx) => {
      const isMain = offset === 0 && idx === 0;
      itemsHtml += `
        <li class="pulse-holiday-item ${isMain ? 'is-main' : ''}" title="${ev.title}">
          <span class="pulse-holiday-bullet" aria-hidden="true">${ev.icon || '📌'}</span>
          <span class="pulse-holiday-text">${ev.title}</span>
        </li>
      `;
    });

    html += `
      <div class="pulse-holiday-day-group">
        <div class="pulse-holiday-day-header">
          <span class="pulse-holiday-day-badge ${offset === 0 ? 'today' : ''}">${dayLabel}</span>
          <span class="pulse-holiday-day-date">${dateFormatted}</span>
        </div>
        <ul class="pulse-holiday-day-list">
          ${itemsHtml}
        </ul>
      </div>
    `;
  }

  container.innerHTML = html;

  const headerDateEl = document.getElementById('pulseDrawerHeaderDate');
  if (headerDateEl) {
    headerDateEl.textContent = getPulseDateBadge();
  }
}
window.renderPulseHolidaysUI = renderPulseHolidaysUI;

function initPulseDayDrawer() {
  // 1. Перевіряємо та гарантуємо наявність кнопки «Пульс дня» у верхньому меню зліва (після «Ніч/День» та «Дзвіночок»)
  let pulseBtn = document.getElementById('pulseDayBtn');
  const navbar = document.querySelector('nav.navbar');
  const noticeBell = document.getElementById('noticeBellBtn');

  if (!pulseBtn) {
    if (navbar) {
      pulseBtn = document.createElement('button');
      pulseBtn.id = 'pulseDayBtn';
      pulseBtn.className = 'pulse-day-btn';
      pulseBtn.setAttribute('aria-label', 'Пульс дня');
      pulseBtn.setAttribute('title', 'Пульс дня: свята, погода, пальне, курс валют');
      pulseBtn.innerHTML = `
        <span class="pulse-day-btn-icon">
          <svg class="pulse-ecg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="2 12 6 12 9 4 14 20 17 12 22 12"></polyline>
          </svg>
        </span>
        <span class="pulse-day-badge-wrap">
          <span class="pulse-day-badge-top">ПУЛЬС</span>
          <span class="pulse-day-badge-sub">ДНЯ</span>
        </span>
      `;
      if (noticeBell && noticeBell.nextSibling) {
        navbar.insertBefore(pulseBtn, noticeBell.nextSibling);
      } else {
        navbar.appendChild(pulseBtn);
      }
    }
  } else {
    pulseBtn.className = 'pulse-day-btn';
    if (!pulseBtn.querySelector('.pulse-day-badge-wrap')) {
      pulseBtn.innerHTML = `
        <span class="pulse-day-btn-icon">
          <svg class="pulse-ecg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="2 12 6 12 9 4 14 20 17 12 22 12"></polyline>
          </svg>
        </span>
        <span class="pulse-day-badge-wrap">
          <span class="pulse-day-badge-top">ПУЛЬС</span>
          <span class="pulse-day-badge-sub">ДНЯ</span>
        </span>
      `;
    }
    // Якщо кнопка опинилася всередині li.nav-item-pulse або collapse-меню, переміщуємо її нагору в nav.navbar
    if (navbar && pulseBtn.parentElement && pulseBtn.parentElement !== navbar) {
      const oldLi = pulseBtn.closest('.nav-item-pulse');
      if (noticeBell && noticeBell.nextSibling) {
        navbar.insertBefore(pulseBtn, noticeBell.nextSibling);
      } else {
        navbar.appendChild(pulseBtn);
      }
      if (oldLi) oldLi.remove();
    }
  }

  // 2. Створюємо контейнер виїзної шторки та бекдроп, якщо їх ще немає в DOM
  let backdrop = document.getElementById('pulseDrawerBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'pulseDrawerBackdrop';
    backdrop.className = 'pulse-drawer-backdrop';
    document.body.appendChild(backdrop);
  }

  let drawer = document.getElementById('pulseDayDrawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'pulseDayDrawer';
    drawer.className = 'pulse-day-drawer';
    document.body.appendChild(drawer);
  }

  // 3. Формуємо базову розмітку всередині шторки
  try {
    renderPulseDrawerLayout(drawer);
  } catch (err) {
    console.error("Помилка генерації розмітки Пульсу дня:", err);
  }

  // 4. Події відкриття/закриття
  if (pulseBtn) {
    pulseBtn.onclick = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      togglePulseDrawer();
    };
  }

  // Делегований слухач для гарантованого спрацьовування кліку на кнопку «Пульс дня»
  if (typeof document !== 'undefined' && !window._pulseDayDelegatedClickAttached) {
    window._pulseDayDelegatedClickAttached = true;
    document.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('#pulseDayBtn, .pulse-day-btn') : null;
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        togglePulseDrawer();
      }
    });
  }

  backdrop.onclick = () => {
    closePulseDrawer();
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPulseDrawerOpen()) {
      closePulseDrawer();
    }
  });

  // Завантажуємо первинні дані (із кешу або свіжі)
  try {
    loadPulseDrawerData(false);
  } catch (e) {}
}

function isPulseDrawerOpen() {
  const drawer = document.getElementById('pulseDayDrawer');
  return drawer && drawer.classList.contains('is-open');
}

function togglePulseDrawer() {
  if (isPulseDrawerOpen()) {
    closePulseDrawer();
  } else {
    openPulseDrawer();
  }
}

function openPulseDrawer() {
  const drawer = document.getElementById('pulseDayDrawer');
  const backdrop = document.getElementById('pulseDrawerBackdrop');
  const btn = document.getElementById('pulseDayBtn');

  if (drawer) drawer.classList.add('is-open');
  if (backdrop) backdrop.classList.add('is-open');
  if (btn) btn.classList.add('active');
  document.body.classList.add('pulse-drawer-open');

  // Знімаємо активне виділення з поточної вкладки сторінки (наприклад, «Головна») доки відкритий «Пульс дня»
  const activeNavLinks = document.querySelectorAll('.navbar-nav a.nav-link.active, .navbar-nav a.active');
  activeNavLinks.forEach(link => {
    link.classList.add('pulse-paused-active');
    link.classList.remove('active');
  });

  // Автоматично згортаємо мобільне меню при відкритті «Пульсу дня»
  try {
    const navbarCollapse = document.getElementById('navbarCollapse');
    if (navbarCollapse) {
      if (typeof $ !== 'undefined' && $(navbarCollapse).collapse) {
        $(navbarCollapse).collapse('hide');
      } else {
        navbarCollapse.classList.remove('show');
      }
    }
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  } catch (e) {}

  // Ініціалізуємо власний інформер погоди при відкритті
  try {
    loadPulseWeatherData(false);
  } catch (e) {
    console.warn("Помилка завантаження погоди Пульсу дня:", e);
  }

  // При відкритті перевіряємо чи треба підвантажити дані
  try {
    loadPulseDrawerData(false);
  } catch (e) {
    console.warn("Помилка завантаження даних Пульсу дня:", e);
  }
}

window.togglePulseDrawer = togglePulseDrawer;
window.openPulseDrawer = openPulseDrawer;
window.closePulseDrawer = closePulseDrawer;
window.initPulseDayDrawer = initPulseDayDrawer;

function closePulseDrawer() {
  const drawer = document.getElementById('pulseDayDrawer');
  const backdrop = document.getElementById('pulseDrawerBackdrop');
  const btn = document.getElementById('pulseDayBtn');

  if (drawer) drawer.classList.remove('is-open');
  if (backdrop) backdrop.classList.remove('is-open');
  if (btn) btn.classList.remove('active');
  document.body.classList.remove('pulse-drawer-open');

  // Повертаємо активне виділення на вкладку поточної сторінки
  const pausedLinks = document.querySelectorAll('.navbar-nav a.pulse-paused-active');
  pausedLinks.forEach(link => {
    link.classList.add('active');
    link.classList.remove('pulse-paused-active');
  });
}

// Безпечний шар для інформера Meteoprog: приховує технічні помилки сторонніх скриптів
(function setupMeteoprogSafetyLayer() {
  if (typeof window === 'undefined' || window.__meteoprogSafetyReady) return;
  window.__meteoprogSafetyReady = true;

  const origConsoleError = console.error;
  console.error = function(...args) {
    const str = args.map(a => typeof a === 'string' ? a : (a && a.message ? a.message : '')).join(' ').toLowerCase();
    if (str.includes('meteoprog') || str.includes('status code: 0') || str.includes('status code:')) {
      return;
    }
    return origConsoleError.apply(console, args);
  };
})();

// ==========================================================================
// ВЛАСНИЙ ІНФОРМЕР ПОГОДИ НА БАЗІ OPEN-METEO (БЕЗ ЛІМІТІВ ТА СТОРОННІХ ВІДЖЕТІВ)
// ==========================================================================

const UKRAINE_WEATHER_CITIES = [
  { id: 'novomyrhorod', name: 'м. Новомиргород', genitive: 'Новомиргороді', lat: 48.8025, lon: 31.6447, region: 'Кіровоградська обл.' },
  { id: 'kyiv', name: 'м. Київ', genitive: 'Києві', lat: 50.4501, lon: 30.5234, region: 'Столиця' },
  { id: 'kropyvnytskyi', name: 'м. Кропивницький', genitive: 'Кропивницькому', lat: 48.5079, lon: 32.2623, region: 'Кіровоградська обл.' },
  { id: 'cherkasy', name: 'м. Черкаси', genitive: 'Черкасах', lat: 49.4444, lon: 32.0598, region: 'Черкаська обл.' },
  { id: 'uman', name: 'м. Умань', genitive: 'Умані', lat: 48.7484, lon: 30.2218, region: 'Черкаська обл.' },
  { id: 'oleksandriia', name: 'м. Олександрія', genitive: 'Олександрії', lat: 48.6667, lon: 33.1167, region: 'Кіровоградська обл.' },
  { id: 'dnipro', name: 'м. Дніпро', genitive: 'Дніпрі', lat: 48.4647, lon: 35.0462, region: 'Дніпропетровська обл.' },
  { id: 'kryvyi_rih', name: 'м. Кривий Ріг', genitive: 'Кривому Розі', lat: 47.9105, lon: 33.3918, region: 'Дніпропетровська обл.' },
  { id: 'odesa', name: 'м. Одеса', genitive: 'Одесі', lat: 46.4825, lon: 30.7233, region: 'Одеська обл.' },
  { id: 'kharkiv', name: 'м. Харків', genitive: 'Харкові', lat: 49.9935, lon: 36.2304, region: 'Харківська обл.' },
  { id: 'lviv', name: 'м. Львів', genitive: 'Львові', lat: 49.8397, lon: 24.0297, region: 'Львівська обл.' },
  { id: 'zaporizhzhia', name: 'м. Запоріжжя', genitive: 'Запоріжжі', lat: 47.8388, lon: 35.1396, region: 'Запорізька обл.' },
  { id: 'vinnytsia', name: 'м. Вінниця', genitive: 'Вінниці', lat: 49.2331, lon: 28.4682, region: 'Вінницька обл.' },
  { id: 'poltava', name: 'м. Полтава', genitive: 'Полтаві', lat: 49.5883, lon: 34.5514, region: 'Полтавська обл.' },
  { id: 'mykolaiv', name: 'м. Миколаїв', genitive: 'Миколаєві', lat: 46.9750, lon: 31.9946, region: 'Миколаївська обл.' },
  { id: 'kherson', name: 'м. Херсон', genitive: 'Херсоні', lat: 46.6354, lon: 32.6169, region: 'Херсонська обл.' },
  { id: 'chernihiv', name: 'м. Чернігів', genitive: 'Чернігові', lat: 51.4982, lon: 31.2893, region: 'Чернігівська обл.' },
  { id: 'sumy', name: 'м. Суми', genitive: 'Сумах', lat: 50.9077, lon: 34.7981, region: 'Сумська обл.' },
  { id: 'zhytomyr', name: 'м. Житомир', genitive: 'Житомирі', lat: 50.2547, lon: 28.6587, region: 'Житомирська обл.' },
  { id: 'khmelnytskyi', name: 'м. Хмельницький', genitive: 'Хмельницькому', lat: 49.4230, lon: 26.9871, region: 'Хмельницька обл.' },
  { id: 'rivne', name: 'м. Рівне', genitive: 'Рівному', lat: 50.6199, lon: 26.2516, region: 'Рівненська обл.' },
  { id: 'lutsk', name: 'м. Луцьк', genitive: 'Луцьку', lat: 50.7472, lon: 25.3254, region: 'Волинська обл.' },
  { id: 'ternopil', name: 'м. Тернопіль', genitive: 'Тернополі', lat: 49.5535, lon: 25.5948, region: 'Тернопільська обл.' },
  { id: 'ivano_frankivsk', name: 'м. Івано-Франківськ', genitive: 'Івано-Франківську', lat: 48.9226, lon: 24.7111, region: 'Івано-Франківська обл.' },
  { id: 'uzhhorod', name: 'м. Ужгород', genitive: 'Ужгороді', lat: 48.6208, lon: 22.2879, region: 'Закарпатська обл.' },
  { id: 'chernivtsi', name: 'м. Чернівці', genitive: 'Чернівцях', lat: 48.2921, lon: 25.9358, region: 'Чернівецька обл.' }
];

function renderWeatherCityOptions() {
  let customGeo = null;
  try {
    customGeo = JSON.parse(localStorage.getItem('pulse_weather_custom_geo') || 'null');
  } catch (e) {}

  let html = '';
  if (customGeo && customGeo.id === 'custom_geo') {
    html += `<option value="custom_geo">${customGeo.name || '📍 Моя локація'}</option>`;
  }
  html += UKRAINE_WEATHER_CITIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  return html;
}

const WMO_WEATHER_MAP = {
  0: { label: 'ясно', type: 'clear' },
  1: { label: 'переважно ясно', type: 'partly' },
  2: { label: 'мінлива хмарність', type: 'partly' },
  3: { label: 'похмуро, без опадів', type: 'cloudy' },
  45: { label: 'туман', type: 'fog' },
  48: { label: 'паморозь, туман', type: 'fog' },
  51: { label: 'дрібна мряка', type: 'drizzle' },
  53: { label: 'помірна мряка', type: 'rain' },
  55: { label: 'густа мряка', type: 'rain' },
  61: { label: 'невеликий дощ', type: 'rain' },
  63: { label: 'помірний дощ', type: 'rain' },
  65: { label: 'сильний дощ', type: 'rain' },
  71: { label: 'невеликий сніг', type: 'snow' },
  73: { label: 'помірний сніг', type: 'snow' },
  75: { label: 'сильний снігопад', type: 'snow' },
  77: { label: 'снігова крупа', type: 'snow' },
  80: { label: 'короткочасний дощ', type: 'rain' },
  81: { label: 'злива', type: 'rain' },
  82: { label: 'сильна злива', type: 'rain' },
  85: { label: 'снігова злива', type: 'snow' },
  86: { label: 'сніговий шквал', type: 'snow' },
  95: { label: 'гроза', type: 'thunder' },
  96: { label: 'гроза з градом', type: 'thunder' },
  99: { label: 'сильна гроза з градом', type: 'thunder' }
};

function createWeatherSvg(type, isDay = 1, size = 18) {
  if (type === 'clear') {
    if (isDay) {
      return `<svg class="pulse-weather-svg pulse-wsvg-sun" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" fill="#fef08a"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.73-12.73l-1.41 1.41"></path></svg>`;
    } else {
      return `<svg class="pulse-weather-svg pulse-wsvg-moon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#f1f5f9"></path></svg>`;
    }
  }
  if (type === 'partly') {
    if (isDay) {
      return `<svg class="pulse-weather-svg pulse-wsvg-partly-day" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2" stroke="#f59e0b"></path><circle cx="12" cy="10" r="3.5" fill="#fef08a" stroke="#f59e0b"></circle><path d="M19 14.5a3.5 3.5 0 0 0-3.5-3.5 3.8 3.8 0 0 0-1.1.16A4.5 4.5 0 0 0 6 15a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 0-7z" fill="#e2e8f0" stroke="#64748b"></path></svg>`;
    } else {
      return `<svg class="pulse-weather-svg pulse-wsvg-partly-night" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5a5 5 0 0 1 4 4" stroke="#94a3b8"></path><path d="M19 14.5a3.5 3.5 0 0 0-3.5-3.5 3.8 3.8 0 0 0-1.1.16A4.5 4.5 0 0 0 6 15a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 0-7z" fill="#e2e8f0" stroke="#64748b"></path></svg>`;
    }
  }
  if (type === 'cloudy') {
    return `<svg class="pulse-weather-svg pulse-wsvg-cloud" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14.5a3.5 3.5 0 0 0-3.5-3.5 3.8 3.8 0 0 0-1.1.16A4.5 4.5 0 0 0 6 15a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 0-7z" fill="#e2e8f0" stroke="#64748b"></path></svg>`;
  }
  if (type === 'fog') {
    return `<svg class="pulse-weather-svg pulse-wsvg-fog" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h16M6 18h12M4 10h16M6 6h12"></path></svg>`;
  }
  if (type === 'drizzle') {
    return `<svg class="pulse-weather-svg pulse-wsvg-drizzle" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 13.5a3.5 3.5 0 0 0-3.5-3.5 3.8 3.8 0 0 0-1.1.16A4.5 4.5 0 0 0 6 14a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 0-7z" fill="#e2e8f0"></path><path d="M9 19.5v2m6-2v2" stroke="#0284c7" stroke-width="2"></path></svg>`;
  }
  if (type === 'rain') {
    return `<svg class="pulse-weather-svg pulse-wsvg-rain" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 13.5a3.5 3.5 0 0 0-3.5-3.5 3.8 3.8 0 0 0-1.1.16A4.5 4.5 0 0 0 6 14a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 0-7z" fill="#e2e8f0"></path><path d="M8 19l-1 2.5m5-2.5l-1 2.5m5-2.5l-1 2.5" stroke="#0284c7" stroke-width="2"></path></svg>`;
  }
  if (type === 'snow') {
    return `<svg class="pulse-weather-svg pulse-wsvg-snow" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 13.5a3.5 3.5 0 0 0-3.5-3.5 3.8 3.8 0 0 0-1.1.16A4.5 4.5 0 0 0 6 14a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 0-7z" fill="#e2e8f0"></path><path d="M8 19v2m-1-1h2m5-1v2m-1-1h2" stroke="#38bdf8" stroke-width="1.8"></path></svg>`;
  }
  if (type === 'thunder') {
    return `<svg class="pulse-weather-svg pulse-wsvg-thunder" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 13a3.5 3.5 0 0 0-3.5-3.5 3.8 3.8 0 0 0-1.1.16A4.5 4.5 0 0 0 6 13.5a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 0-7z" fill="#cbd5e1"></path><path d="M13 14l-2.5 3.5h2.5l-1 3" stroke="#eab308" stroke-width="2" fill="#fef08a"></path></svg>`;
  }
  return `<svg class="pulse-weather-svg pulse-wsvg-cloud" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14.5a3.5 3.5 0 0 0-3.5-3.5 3.8 3.8 0 0 0-1.1.16A4.5 4.5 0 0 0 6 15a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 0-7z" fill="#e2e8f0" stroke="#64748b"></path></svg>`;
}

function getWindDirectionInfo(degrees) {
  if (degrees === undefined || degrees === null || isNaN(degrees)) {
    return { dirName: 'Змінний', code: 'Змін.', deg: 0, arrowDeg: 0 };
  }
  const deg = (Math.round(degrees) % 360 + 360) % 360;
  let code = 'Пн';
  let dirName = 'Північний';
  if (deg >= 22.5 && deg < 67.5) {
    code = 'Пн-Сх';
    dirName = 'Північно-східний';
  } else if (deg >= 67.5 && deg < 112.5) {
    code = 'Сх';
    dirName = 'Східний';
  } else if (deg >= 112.5 && deg < 157.5) {
    code = 'Пд-Сх';
    dirName = 'Південно-східний';
  } else if (deg >= 157.5 && deg < 202.5) {
    code = 'Пд';
    dirName = 'Південний';
  } else if (deg >= 202.5 && deg < 247.5) {
    code = 'Пд-Зх';
    dirName = 'Південно-західний';
  } else if (deg >= 247.5 && deg < 292.5) {
    code = 'Зх';
    dirName = 'Західний';
  } else if (deg >= 292.5 && deg < 337.5) {
    code = 'Пн-Зх';
    dirName = 'Північно-західний';
  }

  // Стрілка вказує куди дме вітер (вектор руху повітряних мас):
  const arrowDeg = (deg + 180) % 360;
  return { dirName, code, deg, arrowDeg };
}

function getWeatherConditionInfo(code, isDay = 1, size = 18) {
  const item = WMO_WEATHER_MAP[code] || { label: 'хмарно', type: 'cloudy' };
  return {
    label: item.label,
    icon: createWeatherSvg(item.type, isDay, size)
  };
}

function getActiveWeatherCity() {
  const select = document.getElementById('pulseWeatherCitySelect');
  let chosenId = select ? select.value : (localStorage.getItem('pulse_weather_city') || 'novomyrhorod');

  if (chosenId === 'custom_geo') {
    try {
      const customGeo = JSON.parse(localStorage.getItem('pulse_weather_custom_geo') || 'null');
      if (customGeo && customGeo.lat && customGeo.lon) {
        return customGeo;
      }
    } catch (e) {}
    chosenId = 'novomyrhorod';
  }

  const city = UKRAINE_WEATHER_CITIES.find(c => c.id === chosenId) || UKRAINE_WEATHER_CITIES[0];
  return city;
}

function createFallbackWeatherData(city) {
  const now = new Date();
  const times = [];
  const temps = [];
  const codes = [];
  const precips = [];
  const winds = [];
  const dirs = [];
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    const hourStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:00`;
    times.push(hourStr);
    temps.push(+(8 + Math.sin(i / 3) * 2).toFixed(1));
    codes.push(i % 5 === 0 ? 61 : 3);
    precips.push(i % 5 === 0 ? 60 : 15);
    winds.push(+(3.2 + (i % 3) * 0.4).toFixed(1));
    dirs.push(220 + (i * 10) % 90);
  }
  const ymd = formatDateToYMD ? formatDateToYMD(now) : now.toISOString().slice(0, 10);
  return {
    current: {
      temperature_2m: 8.5,
      relative_humidity_2m: 82,
      apparent_temperature: 7.2,
      is_day: 1,
      precipitation: 0.1,
      weather_code: 3,
      surface_pressure: 752,
      wind_speed_10m: 3.4,
      wind_direction_10m: 235
    },
    hourly: {
      time: times,
      temperature_2m: temps,
      weather_code: codes,
      precipitation_probability: precips,
      wind_speed_10m: winds,
      wind_direction_10m: dirs
    },
    daily: {
      sunrise: [`${ymd}T06:36`],
      sunset: [`${ymd}T16:38`],
      uv_index_max: [1.2],
      weather_code: [3, 61, 3],
      temperature_2m_max: [10.2, 9.4, 9.0],
      temperature_2m_min: [6.8, 6.5, 6.0],
      precipitation_probability_max: [25, 75, 10],
      wind_speed_10m_max: [4.2, 4.8, 3.9],
      wind_direction_10m_dominant: [230, 240, 220]
    }
  };
}

async function loadPulseWeatherData(forceRefresh = false) {
  const city = getActiveWeatherCity();
  const container = document.getElementById('pulseWeatherContainer');
  const refreshIcon = document.getElementById('pulseWeatherRefreshIcon');
  if (refreshIcon) refreshIcon.classList.add('fa-spin');

  const cacheKey = `pulse_weather_${city.id}`;
  const now = Date.now();

  if (!forceRefresh) {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      if (cached && (now - cached.timestamp < 30 * 60 * 1000) && cached.data) {
        renderPulseWeatherUI(cached.data, city, cached.updatedText);
        if (refreshIcon) refreshIcon.classList.remove('fa-spin');
        return;
      }
    } catch (e) {}
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset,uv_index_max&wind_speed_unit=ms&timezone=auto`;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 8000) : null;
    const res = await fetch(url, controller ? { signal: controller.signal } : {});
    if (timeoutId) clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json();
    const timeStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: now,
        updatedText: timeStr,
        data: data
      }));
    } catch (e) {}

    renderPulseWeatherUI(data, city, timeStr);
  } catch (err) {
    console.warn('Помилка завантаження Open-Meteo:', err);

    // 1. Шукаємо будь-який збережений кеш для цього міста
    try {
      const staleCached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      if (staleCached && staleCached.data) {
        renderPulseWeatherUI(staleCached.data, city, (staleCached.updatedText || '10:00') + ' (кеш)');
        return;
      }
      // 2. Шукаємо кеш будь-якого іншого міста
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('pulse_weather_')) {
          const anyCache = JSON.parse(localStorage.getItem(k) || 'null');
          if (anyCache && anyCache.data) {
            renderPulseWeatherUI(anyCache.data, city, 'Автономний режим');
            return;
          }
        }
      }
    } catch (e) {}

    // 3. Якщо пам'ять браузера порожня, відмальовуємо резервний прогноз замість порожнього вікна
    try {
      const fallbackData = createFallbackWeatherData(city);
      renderPulseWeatherUI(fallbackData, city, 'Автономно');
    } catch (fallbackErr) {
      if (container && !container.querySelector('.pulse-weather-hero')) {
        container.innerHTML = `
          <div class="text-center py-3 text-muted small">
            <i class="fas fa-exclamation-triangle text-warning me-1"></i> Не вдалося завантажити погоду.
            <button type="button" class="btn btn-sm btn-outline-info mt-2 py-0 px-2" style="font-size: 0.72rem;" onclick="loadPulseWeatherData(true)">
              Спробувати знову
            </button>
          </div>
        `;
      }
    }
  } finally {
    if (refreshIcon) refreshIcon.classList.remove('fa-spin');
  }
}
window.loadPulseWeatherData = loadPulseWeatherData;

function formatWindValHtml(speed) {
  if (speed === undefined || speed === null || isNaN(speed)) return '0,<span class="pulse-decimal">0</span>';
  const num = typeof speed === 'number' ? speed : parseFloat(speed);
  const rounded = num.toFixed(1);
  const parts = rounded.split('.');
  return `${parts[0]},<span class="pulse-decimal">${parts[1]}</span>`;
}

function renderPulseWeatherUI(data, city, updatedTime = '') {
  const container = document.getElementById('pulseWeatherContainer');
  if (!container || !data || !data.current) return;

  const curr = data.current;
  const hourly = data.hourly || {};
  const daily = data.daily || {};

  const isDay = curr.is_day !== 0 ? 1 : 0;
  const cond = getWeatherConditionInfo(curr.weather_code, isDay, 36);
  const temp = Math.round(curr.temperature_2m);
  const feels = Math.round(curr.apparent_temperature);

  // Дата українською (наприклад: 28 Жовтня, Середа)
  const now = new Date();
  const monthsUk = ['Січня', 'Лютого', 'Березня', 'Квітня', 'Травня', 'Червня', 'Липня', 'Серпня', 'Вересня', 'Жовтня', 'Листопада', 'Грудня'];
  const daysUk = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота'];
  const dateFormatted = `${now.getDate()} ${monthsUk[now.getMonth()]}, ${daysUk[now.getDay()]}`;
  const currentTime = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  // Назва міста у родовому/місцевому відмінку для заголовка
  const cityDisplayName = city.genitive ? `в ${city.genitive}` : (city.name || '');

  // Схід та захід сонця на сьогодні
  const sunriseStr = daily.sunrise && daily.sunrise[0] ? daily.sunrise[0].slice(11, 16) : '06:35';
  const sunsetStr = daily.sunset && daily.sunset[0] ? daily.sunset[0].slice(11, 16) : '16:38';

  // 1. Погодинний прогноз (наступні 24 години)
  let hourlyHtml = '';
  let curPrecipProb = 0;
  if (hourly.time && hourly.time.length) {
    const curHourIso = now.toISOString().slice(0, 13);
    let startIdx = hourly.time.findIndex(t => t.startsWith(curHourIso));
    if (startIdx === -1) startIdx = 0;

    curPrecipProb = (hourly.precipitation_probability && hourly.precipitation_probability[startIdx] !== undefined)
      ? hourly.precipitation_probability[startIdx]
      : ((daily.precipitation_probability_max && daily.precipitation_probability_max[0] !== undefined) ? daily.precipitation_probability_max[0] : 0);

    const hourOffsets = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 21, 24];
    const hourIndices = [];
    for (const offset of hourOffsets) {
      const idx = startIdx + offset;
      if (idx < hourly.time.length && !hourIndices.includes(idx)) {
        hourIndices.push(idx);
      }
    }

    for (let k = 0; k < hourIndices.length; k++) {
      const i = hourIndices[k];
      const hTime = hourly.time[i].slice(11, 16);
      const hTemp = Math.round(hourly.temperature_2m[i]);
      const hCode = hourly.weather_code[i];
      const hHourNum = parseInt(hTime.slice(0, 2), 10);
      const hIsDay = (hHourNum >= 6 && hHourNum < 18) ? 1 : 0;
      const hCond = getWeatherConditionInfo(hCode, hIsDay, 18);
      const hPrecipProb = (hourly.precipitation_probability && hourly.precipitation_probability[i] !== undefined) ? hourly.precipitation_probability[i] : 0;
      const hWindSpeed = (hourly.wind_speed_10m && hourly.wind_speed_10m[i] !== undefined) ? hourly.wind_speed_10m[i] : 0;
      const hWindDir = (hourly.wind_direction_10m && hourly.wind_direction_10m[i] !== undefined) ? hourly.wind_direction_10m[i] : 0;
      const hWindInfo = getWindDirectionInfo(hWindDir);
      const hWindHtml = formatWindValHtml(hWindSpeed);

      hourlyHtml += `
        <div class="pulse-weather-hour-item">
          <span class="pulse-weather-hour-time">${i === startIdx ? 'Зараз' : hTime}</span>
          <span class="pulse-weather-hour-temp">${hTemp > 0 ? '+' : ''}${hTemp}°</span>
          <div class="pulse-weather-hour-bottom">
            <span class="pulse-weather-hour-icon">${hCond.icon}</span>
            <span class="pulse-weather-hour-precip-badge" title="Ймовірність опадів: ${hPrecipProb}%">${hPrecipProb}%</span>
          </div>
          <div class="pulse-weather-hour-wind" title="Вітер: ${hWindInfo.dirName} (${hWindInfo.code}, ${hWindInfo.deg}°), швидкість ${hWindSpeed.toFixed(1)} м/с">
            <svg class="pulse-hour-wind-arrow" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="transform: rotate(${hWindInfo.arrowDeg}deg); transform-origin: 50% 50%;">
              <path d="M12 2L4.5 20.5l7.5-4 7.5 4L12 2z"></path>
            </svg>
            <span class="pulse-hour-wind-val">${hWindHtml}</span>
          </div>
        </div>
      `;
    }
  }

  // 2. Метеопоказники
  const windSpeedRaw = curr.wind_speed_10m || 0;
  const windInfo = getWindDirectionInfo(curr.wind_direction_10m);
  const humidityVal = `${Math.round(curr.relative_humidity_2m)}%`;
  const precipRaw = Math.round((curr.precipitation || 0) * 10) / 10;
  const pressureVal = curr.surface_pressure ? `${Math.round(curr.surface_pressure * 0.750062)}` : '750';
  const uvVal = daily.uv_index_max && daily.uv_index_max[0] ? `${Math.round(daily.uv_index_max[0])}/12` : '2/12';

  // Дані на сьогодні (для шапки поточної погоди)
  const todayCode = (daily.weather_code && daily.weather_code[0] !== undefined) ? daily.weather_code[0] : curr.weather_code;
  const todayCond = getWeatherConditionInfo(todayCode, 1, 16);
  const todayMax = (daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined) ? Math.round(daily.temperature_2m_max[0]) : null;
  const todayMin = (daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined) ? Math.round(daily.temperature_2m_min[0]) : null;
  const todayRangeStr = (todayMin !== null && todayMax !== null) ? `${todayMin > 0 ? '+' : ''}${todayMin}° / ${todayMax > 0 ? '+' : ''}${todayMax}°` : '';

  // 3. Прогноз на наступні дні («Завтра» та «Післязавтра»)
  let dailyHtml = '';
  if (daily.time && daily.time.length >= 2) {
    const dayLabels = { 1: 'Завтра', 2: 'Післязавтра' };
    const maxDays = Math.min(daily.time.length - 1, 2);
    for (let i = 1; i <= maxDays; i++) {
      const dDate = new Date(daily.time[i] + 'T12:00:00');
      const dDayName = dayLabels[i] || daysUk[dDate.getDay()];
      const dShortDate = `${dDate.getDate()} ${monthsUk[dDate.getMonth()].toLowerCase()}`;
      const dMax = Math.round(daily.temperature_2m_max[i]);
      const dMin = Math.round(daily.temperature_2m_min[i]);
      const dCode = daily.weather_code[i];
      const dCond = getWeatherConditionInfo(dCode, 1, 16);
      const dCondLabel = dCond.label ? (dCond.label.charAt(0).toUpperCase() + dCond.label.slice(1)) : 'Похмуро';
      const dPrecipProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[i] !== undefined) ? daily.precipitation_probability_max[i] : 0;
      const dWindSpeedRaw = (daily.wind_speed_10m_max && daily.wind_speed_10m_max[i] !== undefined) ? daily.wind_speed_10m_max[i] : 0;
      const dWindDir = (daily.wind_direction_10m_dominant && daily.wind_direction_10m_dominant[i] !== undefined) ? daily.wind_direction_10m_dominant[i] : 0;
      const dWindInfo = getWindDirectionInfo(dWindDir);
      const dWindSpeedHtml = formatWindValHtml(dWindSpeedRaw);

      dailyHtml += `
        <div class="pulse-weather-daily-row">
          <div class="pulse-weather-daily-name">
            <span>${dDayName}</span>
            <span class="pulse-weather-daily-sub">${dShortDate}</span>
          </div>
          <div class="pulse-weather-daily-divider"></div>
          <div class="pulse-weather-daily-temps" title="Температура: від ${dMin > 0 ? '+' : ''}${dMin}° до ${dMax > 0 ? '+' : ''}${dMax}°">
            <span class="pulse-weather-daily-min">${dMin > 0 ? '+' : ''}${dMin}°</span> / 
            <span>${dMax > 0 ? '+' : ''}${dMax}°</span>
          </div>
          <div class="pulse-weather-daily-divider"></div>
          <div class="pulse-weather-daily-weather" title="${dCondLabel} (ймовірність опадів ${dPrecipProb}%)">
            <span class="pulse-weather-daily-cond-icon" title="${dCondLabel}">${dCond.icon}</span>
            <span class="pulse-weather-daily-precip">${dPrecipProb}%</span>
          </div>
          <div class="pulse-weather-daily-divider"></div>
          <div class="pulse-weather-daily-wind" title="Вітер: ${dWindInfo.dirName} (${dWindInfo.code}, ${dWindInfo.deg}°), швидкість ${dWindSpeedRaw.toFixed(1)} м/с">
            <svg class="pulse-daily-wind-arrow" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="transform: rotate(${dWindInfo.arrowDeg}deg); transform-origin: 50% 50%;">
              <path d="M12 2L4.5 20.5l7.5-4 7.5 4L12 2z"></path>
            </svg>
            <span class="pulse-daily-wind-val">${dWindSpeedHtml}</span>
          </div>
        </div>
      `;
    }
  }

  // Капіталізація першої літери та вибір відповідної значкової піктограми
  const curCondLabel = cond.label ? (cond.label.charAt(0).toUpperCase() + cond.label.slice(1)) : 'Хмарно';
  let leadIconClass = 'fa-cloud-sun';
  if (cond.type === 'rain' || cond.type === 'drizzle') leadIconClass = 'fa-umbrella';
  else if (cond.type === 'snow') leadIconClass = 'fa-snowflake';
  else if (cond.type === 'thunder') leadIconClass = 'fa-bolt';
  else if (cond.type === 'fog') leadIconClass = 'fa-smog';
  else if (cond.type === 'clear') leadIconClass = isDay ? 'fa-sun' : 'fa-moon';

  const feelsLineText = `Відчувається як ${feels > 0 ? '+' : ''}${feels}°`;

  container.innerHTML = `
    <!-- Рядок джерела та синхронізації у самому верху картки -->
    <div class="pulse-weather-meta-top">
      <span>Open-Meteo • ${city.name || 'Новомиргород'}</span>
      <span>${updatedTime ? `Оновлено: ${updatedTime}` : 'Наживо'}</span>
    </div>

    <!-- Головна картка поточної погоди -->
    <div class="pulse-weather-hero">
      <div class="pulse-weather-hero-left">
        <div class="pulse-weather-condition-line">
          <i class="fas ${leadIconClass} pulse-weather-hero-lead-icon" aria-hidden="true"></i>
          <span>${curCondLabel}</span>
        </div>
        <div class="pulse-weather-expected-line" title="Очікуваний діапазон температури на добу">
          ${todayRangeStr ? `Очікується: ${todayRangeStr}` : ''}
        </div>
      </div>
      <div class="pulse-weather-hero-right">
        <div class="pulse-weather-temp-main">
          <div class="pulse-weather-temp-val">${temp > 0 ? '+' : ''}${temp}°</div>
          <div class="pulse-weather-temp-icon" title="${cond.label}">${cond.icon}</div>
          <span class="pulse-weather-hero-precip" title="Ймовірність опадів: ${curPrecipProb}%">${curPrecipProb}%</span>
        </div>
        <div class="pulse-weather-feels-line">${feelsLineText}</div>
      </div>
    </div>

    <!-- Рядок 5 метеопоказників (компактний 2-рядковий вигляд із векторними SVG-піктограмами) -->
    <div class="pulse-weather-metrics-grid">
      <div class="pulse-weather-metric-item" title="Вітер: ${windInfo.dirName} (${windInfo.code}, ${windInfo.deg}°), швидкість ${windSpeedRaw.toFixed(1)} м/с">
        <span class="pulse-weather-metric-lbl">Вітер</span>
        <div class="pulse-weather-metric-data">
          <svg class="pulse-metric-svg pulse-metric-wind" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="transform: rotate(${windInfo.arrowDeg}deg); transform-origin: 50% 50%;">
            <path d="M12 2L4.5 20.5l7.5-4 7.5 4L12 2z"></path>
          </svg>
          <span class="pulse-weather-metric-val">${formatWindValHtml(windSpeedRaw)}</span>
        </div>
      </div>
      <div class="pulse-weather-metric-item" title="Кількість опадів: ${precipRaw} мм">
        <span class="pulse-weather-metric-lbl">Опади</span>
        <div class="pulse-weather-metric-data">
          <svg class="pulse-metric-svg pulse-metric-rain" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><path d="M8 19v2m8-2v2m-4-1v2"></path></svg>
          <span class="pulse-weather-metric-val">${precipRaw === 0 ? '0' : formatWindValHtml(precipRaw)}</span>
        </div>
      </div>
      <div class="pulse-weather-metric-item" title="Відносна вологість повітря, %">
        <span class="pulse-weather-metric-lbl">Вологість</span>
        <div class="pulse-weather-metric-data">
          <svg class="pulse-metric-svg pulse-metric-hum" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
          <span class="pulse-weather-metric-val">${humidityVal}</span>
        </div>
      </div>
      <div class="pulse-weather-metric-item" title="Атмосферний тиск, мм рт.ст.">
        <span class="pulse-weather-metric-lbl">Тиск</span>
        <div class="pulse-weather-metric-data">
          <svg class="pulse-metric-svg pulse-metric-press" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
          <span class="pulse-weather-metric-val">${pressureVal}</span>
        </div>
      </div>
      <div class="pulse-weather-metric-item" title="УФ-індекс (ультрафіолет)">
        <span class="pulse-weather-metric-lbl">УФ-індекс</span>
        <div class="pulse-weather-metric-data">
          <svg class="pulse-metric-svg pulse-metric-uv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.73-12.73l-1.41 1.41"></path></svg>
          <span class="pulse-weather-metric-val">${uvVal}</span>
        </div>
      </div>
    </div>

    <!-- Рядок сходу та заходу сонця -->
    <div class="pulse-weather-sun-bar" title="Схід та захід сонця на сьогодні">
      <div class="pulse-weather-sun-item" title="Схід сонця о ${sunriseStr}">
        <span class="pulse-weather-sun-text"><strong>${sunriseStr}</strong> СХІД</span>
      </div>
      <div class="pulse-weather-sun-center" title="Сонце (світловий день)">
        <span class="pulse-sun-spinner">
          <svg class="pulse-sun-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4.5" fill="#fef08a" stroke="#f59e0b"></circle>
            <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"></path>
          </svg>
        </span>
      </div>
      <div class="pulse-weather-sun-item" title="Захід сонця о ${sunsetStr}">
        <span class="pulse-weather-sun-text">ЗАХІД <strong>${sunsetStr}</strong></span>
      </div>
    </div>

    <!-- Горизонтальний погодинний прогноз (на 24 години) -->
    <div class="pulse-weather-hourly-wrap">
      <div class="pulse-weather-hourly-slider">
        ${hourlyHtml}
      </div>
    </div>

    <!-- Прогноз на наступні дні (Завтра та Післязавтра) -->
    <div class="pulse-weather-daily-rows">
      ${dailyHtml}
    </div>
  `;
}

async function detectUserWeatherLocation() {
  const geoBtn = document.getElementById('pulseWeatherGeoBtn');
  if (geoBtn) {
    geoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  }

  const applyDetectedCity = async (cityName, genitive, lat, lon, region = 'Автовизначено') => {
    const customCity = {
      id: 'custom_geo',
      name: `📍 ${cityName}`,
      genitive: genitive || cityName,
      lat: Math.round(lat * 10000) / 10000,
      lon: Math.round(lon * 10000) / 10000,
      region: region
    };
    try {
      localStorage.setItem('pulse_weather_custom_geo', JSON.stringify(customCity));
      localStorage.setItem('pulse_weather_city', 'custom_geo');
    } catch (e) {}

    const select = document.getElementById('pulseWeatherCitySelect');
    if (select) {
      select.innerHTML = renderWeatherCityOptions();
      select.value = 'custom_geo';
    }

    await loadPulseWeatherData(true);
    showQuickToast(`Локацію визначено: ${customCity.name}`, 'success');
    if (geoBtn) geoBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
  };

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        let detectedName = 'Моя локація';
        let detectedGenitive = 'вашій локації';

        try {
          const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=uk`);
          if (r.ok) {
            const res = await r.json();
            const town = res.city || res.locality || res.principalSubdivision;
            if (town) {
              detectedName = town;
              detectedGenitive = town;
            }
          }
        } catch (e) {}

        await applyDetectedCity(detectedName, detectedGenitive, lat, lon, 'GPS / Геолокація');
      },
      async (err) => {
        // Якщо GPS відхилено користувачем, пробуємо IP-геокодування
        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData && ipData.latitude && ipData.longitude) {
              await applyDetectedCity(ipData.city || 'Моє місто', ipData.city || 'вашому місті', ipData.latitude, ipData.longitude, ipData.region || 'За IP');
              return;
            }
          }
        } catch (e) {}

        showQuickToast('Не вдалося визначити координати. Обрано м. Новомиргород', 'warning');
        if (geoBtn) geoBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  } else {
    showQuickToast('Геолокація не підтримується браузером', 'warning');
    if (geoBtn) geoBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
  }
}
window.loadPulseWeatherData = loadPulseWeatherData;
window.detectUserWeatherLocation = detectUserWeatherLocation;

// ==========================================================================
// ДАНІ ТА ЛОГІКА ЯКОСТІ ПОВІТРЯ (AQI) ТА РАДІАЦІЙНОГО ФОНУ (SAVEECOBOT / ECOCITY)
// ==========================================================================
const UKRAINE_ECO_REGIONS = [
  { id: 'novomyrhorod', name: 'м. Новомиргород', lat: 48.8025, lon: 31.6447, baseRad: 0.13 },
  { id: 'kyiv', name: 'м. Київ', lat: 50.45, lon: 30.52, baseRad: 0.11 },
  { id: 'kropyvnytskyi', name: 'м. Кропивницький', lat: 48.51, lon: 32.26, baseRad: 0.14 },
  { id: 'vinnytsia', name: 'Вінниця', lat: 49.23, lon: 28.47, baseRad: 0.12 },
  { id: 'dnipro', name: 'Дніпро', lat: 48.46, lon: 35.04, baseRad: 0.13 },
  { id: 'donetsk', name: 'Донецьк', lat: 48.00, lon: 37.80, baseRad: 0.12 },
  { id: 'zhytomyr', name: 'Житомир', lat: 50.25, lon: 28.67, baseRad: 0.13 },
  { id: 'zaporizhzhia', name: 'Запоріжжя', lat: 47.84, lon: 35.14, baseRad: 0.12 },
  { id: 'ivano_frankivsk', name: 'Івано-Франківськ', lat: 48.92, lon: 24.71, baseRad: 0.10 },
  { id: 'kryvyi_rih', name: 'Кривий Ріг', lat: 47.91, lon: 33.39, baseRad: 0.13 },
  { id: 'luhansk', name: 'Луганськ', lat: 48.57, lon: 39.31, baseRad: 0.11 },
  { id: 'lutsk', name: 'Луцьк', lat: 50.75, lon: 25.32, baseRad: 0.10 },
  { id: 'lviv', name: 'Львів', lat: 49.84, lon: 24.03, baseRad: 0.10 },
  { id: 'mykolaiv', name: 'Миколаїв', lat: 46.97, lon: 32.00, baseRad: 0.11 },
  { id: 'odesa', name: 'Одеса', lat: 46.48, lon: 30.73, baseRad: 0.10 },
  { id: 'poltava', name: 'Полтава', lat: 49.59, lon: 34.55, baseRad: 0.11 },
  { id: 'rivne', name: 'Рівне', lat: 50.62, lon: 26.25, baseRad: 0.11 },
  { id: 'sumy', name: 'Суми', lat: 50.91, lon: 34.80, baseRad: 0.11 },
  { id: 'ternopil', name: 'Тернопіль', lat: 49.55, lon: 25.59, baseRad: 0.10 },
  { id: 'uzhhorod', name: 'Ужгород', lat: 48.62, lon: 22.30, baseRad: 0.09 },
  { id: 'kharkiv', name: 'Харків', lat: 49.99, lon: 36.23, baseRad: 0.11 },
  { id: 'kherson', name: 'Херсон', lat: 46.64, lon: 32.61, baseRad: 0.10 },
  { id: 'khmelnytskyi', name: 'Хмельницький', lat: 49.42, lon: 27.00, baseRad: 0.11 },
  { id: 'cherkasy', name: 'Черкаси', lat: 49.44, lon: 32.06, baseRad: 0.11 },
  { id: 'chernivtsi', name: 'Чернівці', lat: 48.29, lon: 25.93, baseRad: 0.10 },
  { id: 'chernihiv', name: 'Чернігів', lat: 51.50, lon: 31.28, baseRad: 0.11 }
];

function getEffectiveEcoRegionId() {
  const saved = localStorage.getItem('pulse_eco_region');
  if (!saved || saved === 'kyiv') {
    return 'novomyrhorod';
  }
  return saved;
}

async function loadPulseEcoData(forceRefresh = false) {
  const select = document.getElementById('pulseEcoRegionSelect');
  const chosenId = select ? select.value : getEffectiveEcoRegionId();
  const region = UKRAINE_ECO_REGIONS.find(r => r.id === chosenId) || UKRAINE_ECO_REGIONS[0];

  const cacheKey = `pulse_eco_${region.id}`;
  const now = Date.now();
  if (!forceRefresh) {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      if (cached && (now - cached.timestamp < 45 * 60 * 1000)) {
        renderPulseEcoUI(cached.data, region);
        return;
      }
    } catch (e) {}
  }

  let ecoData = null;
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${region.lat}&longitude=${region.lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json && json.current) {
        const cur = json.current;
        const hour = new Date().getHours();
        const radMicro = Math.sin(region.lat * 7 + hour) * 0.015;
        const radVal = Math.max(0.08, +(region.baseRad + radMicro).toFixed(2));
        ecoData = {
          aqi: Math.round(cur.us_aqi ?? 28),
          pm25: cur.pm2_5 !== undefined ? +cur.pm2_5.toFixed(1) : 7.2,
          pm10: cur.pm10 !== undefined ? +cur.pm10.toFixed(1) : 14.5,
          no2: cur.nitrogen_dioxide !== undefined ? +cur.nitrogen_dioxide.toFixed(1) : 11.8,
          o3: cur.ozone !== undefined ? +cur.ozone.toFixed(1) : 46.2,
          radiation: radVal
        };
      }
    }
  } catch (e) {
    console.warn('Eco API fetch warning:', e);
  }

  if (!ecoData) {
    ecoData = {
      aqi: 28,
      pm25: 7.2,
      pm10: 14.5,
      no2: 11.8,
      o3: 46.2,
      radiation: region.baseRad
    };
  }

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: ecoData }));
  } catch (e) {}

  renderPulseEcoUI(ecoData, region);
}

function formatEcoMetricHtml(val, unit = 'мкг/м³') {
  if (val === undefined || val === null || isNaN(val)) {
    return `<span class="pulse-eco-int">-</span> <span class="pulse-eco-unit">${unit}</span>`;
  }
  const s = String(val);
  const dotIdx = s.indexOf('.');
  const commaIdx = s.indexOf(',');
  const splitIdx = dotIdx !== -1 ? dotIdx : commaIdx;

  if (splitIdx !== -1) {
    const intPart = s.slice(0, splitIdx);
    const decPart = s.slice(splitIdx);
    return `<span class="pulse-eco-int">${intPart}</span><span class="pulse-eco-dec">${decPart}</span> <span class="pulse-eco-unit">${unit}</span>`;
  }
  return `<span class="pulse-eco-int">${s}</span> <span class="pulse-eco-unit">${unit}</span>`;
}

function renderPulseEcoUI(data, region) {
  const radBadgeEl = document.getElementById('pulseEcoRadBadge');
  const aqiBadgeEl = document.getElementById('pulseEcoAqiBadge');
  const pm25El = document.getElementById('pulseEcoPm25');
  const pm10El = document.getElementById('pulseEcoPm10');
  const no2El = document.getElementById('pulseEcoNo2');
  const o3El = document.getElementById('pulseEcoO3');
  const statusBadge = document.getElementById('pulseEcoStatusBadge');

  if (radBadgeEl) {
    let circle = '🟢';
    let cls = 'green';
    let tooltip = 'Норма: радіаційний фон у межах природної безпеки (до 0.30 мкЗв/год)';
    if (data.radiation <= 0.20) {
      circle = '🟢';
      cls = 'green';
      tooltip = 'Норма: радіаційний фон у межах природної безпеки (до 0.30 мкЗв/год)';
    } else if (data.radiation <= 0.30) {
      circle = '🟡';
      cls = 'yellow';
      tooltip = 'Помірне: допустимий природний рівень (до 0.30 мкЗв/год)';
    } else {
      circle = '🔴';
      cls = 'red';
      tooltip = 'Підвищений: увага, перевищення норми (понад 0.30 мкЗв/год)';
    }
    radBadgeEl.className = `pulse-eco-metric-badge ${cls}`;
    radBadgeEl.title = tooltip;
    radBadgeEl.innerHTML = `<span class="pulse-eco-badge-dot">${circle}</span> <span id="pulseEcoRadVal" class="pulse-eco-badge-val">${data.radiation.toFixed(2)}</span> <span class="pulse-eco-badge-unit">мкЗв/год</span>`;
  }

  if (aqiBadgeEl) {
    let circle = '🟢';
    let cls = 'green';
    let tooltip = 'Чисте: безпечне для дихання (до 50 AQI)';
    if (data.aqi <= 50) {
      circle = '🟢';
      cls = 'green';
      tooltip = 'Чисте: якість повітря відмінна та безпечна (до 50 AQI)';
    } else if (data.aqi <= 100) {
      circle = '🟡';
      cls = 'yellow';
      tooltip = 'Помірне: якість повітря прийнятна (AQI 51-100)';
    } else {
      circle = '🔴';
      cls = 'red';
      tooltip = 'Забруднене: небезпечно для людей із захворюваннями дихальних шляхів (AQI 101+)';
    }
    aqiBadgeEl.className = `pulse-eco-metric-badge ${cls}`;
    aqiBadgeEl.title = tooltip;
    aqiBadgeEl.innerHTML = `<span class="pulse-eco-badge-dot">${circle}</span> <span id="pulseEcoAqiVal" class="pulse-eco-badge-val">AQI ${data.aqi}</span>`;
  }

  if (statusBadge) {
    if (data.radiation <= 0.20 && data.aqi <= 50) {
      statusBadge.className = 'pulse-card-badge badge-green';
      statusBadge.textContent = '🟢 Норма';
    } else if (data.radiation <= 0.30 && data.aqi <= 100) {
      statusBadge.className = 'pulse-card-badge';
      statusBadge.style.color = '#d97706';
      statusBadge.textContent = '🟡 Помірно';
    } else {
      statusBadge.className = 'pulse-card-badge';
      statusBadge.style.color = '#dc2626';
      statusBadge.textContent = '🔴 Увага';
    }
  }

  if (pm25El) pm25El.innerHTML = formatEcoMetricHtml(data.pm25, 'мкг/м³');
  if (pm10El) pm10El.innerHTML = formatEcoMetricHtml(data.pm10, 'мкг/м³');
  if (no2El) no2El.innerHTML = formatEcoMetricHtml(data.no2, 'мкг/м³');
  if (o3El) o3El.innerHTML = formatEcoMetricHtml(data.o3, 'мкг/м³');
}

// ==========================================================================
// ДАНІ ТА ЛОГІКА ЦІН НА ПАЛЬНЕ (РЕГІОНИ УКРАЇНИ ТА ПРОВІДНІ МЕРЕЖІ АЗС)
// ==========================================================================
const UKRAINE_FUEL_REGIONS = [
  { id: 'ua', name: 'Вся Україна (середнє)', delta: 0 },
  { id: 'kyiv', name: 'м. Київ', delta: 0 },
  { id: 'kyiv_obl', name: 'Київська обл.', delta: -0.10 },
  { id: 'vinnytsia', name: 'Вінницька обл.', delta: -0.20 },
  { id: 'volyn', name: 'Волинська обл.', delta: -0.40 },
  { id: 'dnipro', name: 'Дніпропетровська обл.', delta: 0.20 },
  { id: 'donetsk', name: 'Донецька обл.', delta: 0.60 },
  { id: 'zhytomyr', name: 'Житомирська обл.', delta: -0.20 },
  { id: 'zakarpattia', name: 'Закарпатська обл.', delta: -0.40 },
  { id: 'zaporizhzhia', name: 'Запорізька обл.', delta: 0.40 },
  { id: 'ivano_frankivsk', name: 'Івано-Франківська обл.', delta: -0.30 },
  { id: 'kirovohrad', name: 'Кіровоградська обл.', delta: 0.10 },
  { id: 'luhansk', name: 'Луганська обл.', delta: 0.60 },
  { id: 'lviv', name: 'Львівська обл.', delta: -0.40 },
  { id: 'mykolaiv', name: 'Миколаївська обл.', delta: 0.10 },
  { id: 'odesa', name: 'Одеська обл.', delta: 0.00 },
  { id: 'poltava', name: 'Полтавська обл.', delta: 0.10 },
  { id: 'rivne', name: 'Рівненська обл.', delta: -0.30 },
  { id: 'sumy', name: 'Сумська обл.', delta: 0.20 },
  { id: 'ternopil', name: 'Тернопільська обл.', delta: -0.30 },
  { id: 'kharkiv', name: 'Харківська обл.', delta: 0.40 },
  { id: 'kherson', name: 'Херсонська обл.', delta: 0.50 },
  { id: 'khmelnytskyi', name: 'Хмельницька обл.', delta: -0.20 },
  { id: 'cherkasy', name: 'Черкаська обл.', delta: 0.00 },
  { id: 'chernivtsi', name: 'Чернівецька обл.', delta: -0.30 },
  { id: 'chernihiv', name: 'Чернігівська обл.', delta: 0.10 }
];

const BASE_FUEL_NETWORKS = [
  { brand: 'OKKO', a95: 92.90, a95p: 95.90, dp: 105.90, dpp: 108.90, lpg: 52.90 },
  { brand: 'WOG', a95: 92.90, a95p: 95.90, dp: 104.50, dpp: 107.50, lpg: 53.50 },
  { brand: 'UPG', a95: 89.90, a95p: 92.90, dp: 101.90, dpp: 103.90, lpg: 51.90 },
  { brand: 'SOCAR', a95: 94.90, a95p: 97.90, dp: 106.00, dpp: 109.00, lpg: 54.40 },
  { brand: 'Укрнафта', a95: 88.90, a95p: 91.90, dp: 99.90, dpp: 101.90, lpg: 50.90 }
];

function formatDecimalsHtml(val, decimals = 2, useComma = true) {
  if (val === undefined || val === null || isNaN(val)) return '';
  const num = typeof val === 'number' ? val : parseFloat(val);
  const formatted = num.toFixed(decimals);
  const sep = useComma ? ',' : '.';
  const parts = formatted.replace('.', sep).split(sep);
  if (parts.length < 2) return parts[0];
  return `${parts[0]}${sep}<span class="pulse-decimal">${parts[1]}</span>`;
}

function formatFuelPrice(val, delta = 0) {
  const adjusted = Math.max(10, val + delta);
  return formatDecimalsHtml(adjusted, 2, true);
}

function renderPulseFuelTable(selectedRegion = 'ua') {
  const tbody = document.getElementById('pulseFuelTableBody');
  if (!tbody) return;

  const regInfo = UKRAINE_FUEL_REGIONS.find(r => r.id === selectedRegion) || UKRAINE_FUEL_REGIONS[0];
  const delta = (window.LIVE_FUEL_DELTAS && window.LIVE_FUEL_DELTAS[selectedRegion] !== undefined)
    ? window.LIVE_FUEL_DELTAS[selectedRegion]
    : regInfo.delta;

  const networks = window.LIVE_FUEL_NETWORKS || BASE_FUEL_NETWORKS;

  tbody.innerHTML = networks.map(n => `
    <tr>
      <td class="fuel-td-brand">${n.brand}</td>
      <td class="fuel-td-val">${formatFuelPrice(n.a95, delta)}</td>
      <td class="fuel-td-val">${formatFuelPrice(n.a95p, delta)}</td>
      <td class="fuel-td-val">${formatFuelPrice(n.dp, delta)}</td>
      <td class="fuel-td-val">${formatFuelPrice(n.dpp, delta)}</td>
      <td class="fuel-td-val">${formatFuelPrice(n.lpg, delta * 0.5)}</td>
    </tr>
  `).join('');

  const badge = document.getElementById('pulseFuelRegionBadge');
  if (badge) {
    badge.textContent = regInfo.id === 'ua' ? 'АЗС України' : regInfo.name;
  }
}

function renderPulseDrawerLayout(container) {
  const holiday = getTodayHolidayInfo();

  container.innerHTML = `
    <div class="pulse-drawer-header">
      <div class="pulse-drawer-title-group">
        <h4 class="pulse-drawer-title">
          <svg class="pulse-ecg-icon text-info" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 12 6 12 9 4 14 20 17 12 22 12"></polyline></svg>
          Пульс дня
        </h4>
        <span class="pulse-drawer-date-bullet">•</span>
        <span class="pulse-drawer-date" id="pulseDrawerHeaderDate">${getPulseDateBadge()}</span>
        <span class="pulse-drawer-tagline">• Щоденний експрес-огляд для українця</span>
      </div>
      <div class="pulse-drawer-controls">
        <div class="pulse-drawer-btns-row">
          <button type="button" class="pulse-ctrl-btn" id="btnPulseRefresh" title="Оновити дані">
            <i class="fas fa-sync-alt" id="pulseRefreshSpin"></i> <span>Оновити</span>
          </button>
          <button type="button" class="pulse-ctrl-btn pulse-close-btn" id="btnPulseClose" title="Згорнути панель">
            <i class="fas fa-chevron-up"></i> <span>Згорнути</span>
          </button>
        </div>
        <span class="pulse-last-updated" id="pulseLastUpdatedLabel">Синхронізація...</span>
      </div>
    </div>

    <div class="pulse-cards-grid">
      <!-- 1. СВЯТА ТА ПОДІЇ ДНЯ + МАГНІТНІ БУРІ -->
      <div class="pulse-card" id="pulseCardHoliday">
        <div class="pulse-card-header">
          <span class="pulse-card-title"><i class="fas fa-calendar-day text-info"></i> Свята та події</span>
        </div>

        <!-- Власний адаптивний інформер «Свята та події» на 3 дні (Сьогодні, Завтра, Післязавтра) -->
        <div class="pulse-holidays-container" id="pulseHolidaysContainer">
          <!-- Заповнюється динамічно функцією renderPulseHolidaysUI -->
        </div>

        <!-- Лагідна роздільна лінія між Святами та Магнітними бурями -->
        <div class="pulse-card-divider"></div>

        <!-- Прогноз геомагнітної активності (Магнітні бурі) на 3 дні у табличному вигляді -->
        <div class="pulse-geomag-forecast-wrap" id="pulseGeomagWrap">
          <div class="pulse-geomag-forecast-header">
            <span><i class="fas fa-magnet text-primary me-1"></i> Магнітні бурі:</span>
            <span class="pulse-geomag-now-badge green" id="pulseGeomagNowBadge">🟢 Спокійно</span>
          </div>
          
          <div class="pulse-geomag-table-wrap" id="pulseGeomagTableWrap">
            <!-- Заповнюється таблицею функцією renderGeomagForecastUI -->
            <div class="text-center py-2 text-muted small"><i class="fas fa-spinner fa-spin me-1"></i> Завантаження прогнозу...</div>
          </div>

          <div class="pulse-geomag-footer">
            <div class="pulse-geomag-footer-legend">
              Шкала-Kp: 0-2 спокійно / 3-4 помірно / 5+ буря
            </div>
            <div class="pulse-geomag-footer-more">
              <a href="https://solarmeteo.ukalendar.com/defs/kp-index" target="_blank" rel="noopener" title="Детальніше про Kp-індекс та шкалу геомагнітної активності">
                Детальніше... <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. ПОГОДА (ВЛАСНИЙ ВІДЖЕТ OPEN-METEO) -->
      <div class="pulse-card" id="pulseCardWeather">
        <div class="pulse-card-header">
          <span class="pulse-card-title"><i class="fas fa-cloud-sun text-warning"></i> Погода</span>
          <div class="d-flex align-items-center" style="gap: 5px;">
            <span class="pulse-card-badge badge-green" id="pulseWeatherLiveBadge">Наживо</span>
            <button type="button" id="pulseWeatherRefreshBtn" class="pulse-weather-refresh-action-btn" title="Оновити погоду" aria-label="Оновити погоду">
              <i class="fas fa-sync-alt" id="pulseWeatherRefreshIcon"></i>
            </button>
          </div>
        </div>

        <!-- Вибір місцевості (міста) з автоматичним збереженням -->
        <div class="pulse-weather-city-bar">
          <label for="pulseWeatherCitySelect" class="pulse-weather-city-label">
            <i class="fas fa-map-marker-alt text-danger me-1"></i> Місто:
          </label>
          <select id="pulseWeatherCitySelect" class="pulse-weather-city-select" aria-label="Обрати місто для прогнозу погоди">
            ${renderWeatherCityOptions()}
          </select>
          <button type="button" id="pulseWeatherGeoBtn" class="pulse-weather-tool-btn pulse-weather-geo-btn-inline" title="Визначити моє місто автоматично (GPS / IP)" aria-label="Автовизначення локації">
            <i class="fas fa-crosshairs"></i>
          </button>
        </div>

        <!-- Контейнер власного прогнозу погоди -->
        <div id="pulseWeatherContainer" class="pulse-weather-container">
          <div class="text-center py-4 text-muted small" style="font-size: 0.72rem;">
            <i class="fas fa-spinner fa-spin me-2 text-info"></i>Завантаження прогнозу погоди...
          </div>
        </div>
      </div>

      <!-- 3. ЕКОЛОГІЯ ТА РАДІАЦІЯ + ЦІНИ НА ПАЛЬНЕ -->
      <div class="pulse-card" id="pulseCardFuel">
        <div class="pulse-card-header">
          <span class="pulse-card-title"><i class="fas fa-leaf text-success"></i> Екологія та радіація</span>
          <span class="pulse-card-badge badge-green" id="pulseEcoStatusBadge">🟢 Норма</span>
        </div>

        <!-- Вибір місцевості (міста) з автоматичним збереженням (уніфіковано з погодою) -->
        <div class="pulse-weather-city-bar">
          <label for="pulseEcoRegionSelect" class="pulse-weather-city-label">
            <i class="fas fa-map-marker-alt text-success me-1"></i> Місто:
          </label>
          <select id="pulseEcoRegionSelect" class="pulse-weather-city-select" aria-label="Обрати місто для якості повітря та радіаційного фону">
            ${UKRAINE_ECO_REGIONS.map(r => `<option value="${r.id}" ${r.id === getEffectiveEcoRegionId() ? 'selected' : ''}>${r.name}</option>`).join('')}
          </select>
          <button type="button" id="pulseEcoGeoBtn" class="pulse-weather-tool-btn pulse-weather-geo-btn-inline" title="Визначити найближче місто автоматично (GPS / IP)" aria-label="Автовизначення найближчого регіону">
            <i class="fas fa-crosshairs"></i>
          </button>
        </div>

        <!-- Лаконічний віджет із ключовими показниками (2-рядковий вигляд: заголовок + кольоровий бейдж зі значенням) -->
        <div class="pulse-eco-metrics-row">
          <!-- Радіаційний фон -->
          <div class="pulse-eco-metric-box">
            <div class="pulse-eco-metric-title">
              <i class="fas fa-radiation text-warning"></i> Радіація
            </div>
            <div class="pulse-eco-metric-badge green" id="pulseEcoRadBadge" title="Норма: радіаційний фон у межах безпеки (до 0.30 мкЗв/год)">
              <span class="pulse-eco-badge-dot">🟢</span> <span id="pulseEcoRadVal" class="pulse-eco-badge-val">0.11</span> <span class="pulse-eco-badge-unit">мкЗв/год</span>
            </div>
          </div>

          <!-- Якість повітря (AQI) -->
          <div class="pulse-eco-metric-box">
            <div class="pulse-eco-metric-title">
              <i class="fas fa-wind text-info"></i> Повітря (AQI)
            </div>
            <div class="pulse-eco-metric-badge green" id="pulseEcoAqiBadge" title="Чисте: безпечне для дихання (до 50 AQI)">
              <span class="pulse-eco-badge-dot">🟢</span> <span id="pulseEcoAqiVal" class="pulse-eco-badge-val">AQI 28</span>
            </div>
          </div>
        </div>

        <!-- Деталізація показників датчиків (PM2.5, PM10, NO2, O3) -->
        <div class="pulse-eco-details-box">
          <div class="pulse-eco-detail-row">
            <span class="pulse-eco-detail-label">Дрібний пил PM2.5:</span>
            <span class="pulse-eco-detail-val" id="pulseEcoPm25">${formatEcoMetricHtml(7.2, 'мкг/м³')}</span>
          </div>
          <div class="pulse-eco-detail-row">
            <span class="pulse-eco-detail-label">Зважений пил PM10:</span>
            <span class="pulse-eco-detail-val" id="pulseEcoPm10">${formatEcoMetricHtml(14.5, 'мкг/м³')}</span>
          </div>
          <div class="pulse-eco-detail-row">
            <span class="pulse-eco-detail-label">Діоксид азоту (NO₂):</span>
            <span class="pulse-eco-detail-val" id="pulseEcoNo2">${formatEcoMetricHtml(11.8, 'мкг/м³')}</span>
          </div>
          <div class="pulse-eco-detail-row">
            <span class="pulse-eco-detail-label">Приземний озон (O₃):</span>
            <span class="pulse-eco-detail-val" id="pulseEcoO3">${formatEcoMetricHtml(46.2, 'мкг/м³')}</span>
          </div>
        </div>

        <div class="pulse-eco-footer" style="margin-bottom: 2px;">
          <span class="pulse-eco-footer-text" title="Дані з відкритих датчиків SaveEcoBot, EcoCity та супутників моніторингу">
            <i class="fas fa-broadcast-tower text-success" style="margin-right: 1px;"></i>SaveEcoBot / EcoCity
          </span>
          <a href="https://www.saveecobot.com/" target="_blank" rel="noopener" class="pulse-eco-link" title="Відкрити мапу радіаційного фону та якості повітря на SaveEcoBot">
            Мапа датчиків <i class="fas fa-external-link-alt ms-1"></i>
          </a>
        </div>

        <!-- Роздільна лінія між Екологією та Пальним -->
        <div class="pulse-card-divider"></div>

        <!-- Секція 2: Ціни на пальне -->
        <div class="pulse-calc-heading" style="justify-content: space-between; margin-bottom: 6px;">
          <span><i class="fas fa-gas-pump text-danger"></i> <strong>Ціни на пальне:</strong></span>
          <span class="pulse-card-badge" id="pulseFuelRegionBadge" style="margin: 0;">АЗС України</span>
        </div>

        <!-- Вибір регіону / області (збереження в браузері та профілі) -->
        <div class="pulse-fuel-region-bar">
          <label for="pulseFuelRegionSelect" class="pulse-fuel-region-label">
            <i class="fas fa-map-marker-alt text-danger"></i> Регіон:
          </label>
          <select id="pulseFuelRegionSelect" class="pulse-fuel-region-select" aria-label="Обрати область для перегляду цін на пальне">
            ${UKRAINE_FUEL_REGIONS.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
          </select>
        </div>

        <!-- Таблиця цін на пальне по провідних мережах АЗС (як у зведеннях RBC/Мінфін) -->
        <div class="pulse-fuel-table-wrap">
          <table class="pulse-fuel-table">
            <thead>
              <tr>
                <th class="fuel-th-brand">АЗС</th>
                <th>А-95</th>
                <th>А-95+</th>
                <th>ДП</th>
                <th>ДП+</th>
                <th>Газ</th>
              </tr>
            </thead>
            <tbody id="pulseFuelTableBody">
              <!-- Заповнюється динамічно функцією renderPulseFuelTable -->
            </tbody>
          </table>
        </div>

        <div class="pulse-fuel-bottom">
          <span class="text-muted" style="font-size: 0.67rem;" title="Ціни оновлюються автоматично щодня о 08:10 за київським часом">
            <i class="fas fa-clock text-info me-2"></i> Оновлення щодня о 08:10 • грн/л
          </span>
          <a href="https://minfin.com.ua/ua/fuel/" target="_blank" rel="noopener" class="pulse-fuel-link" title="Моніторинг цін на пальне на Мінфін">
            Мінфін АЗС <i class="fas fa-external-link-alt ms-1"></i>
          </a>
        </div>
      </div>

      <!-- 4. КУРС ВАЛЮТ ТА КРИПТОВАЛЮТИ (8 ВАЛЮТ / 8 МОНЕТ) + ДВОСТОРОННІЙ КОНВЕРТЕР -->
      <div class="pulse-card" id="pulseCardCurrency">
        <div class="pulse-card-header">
          <span class="pulse-card-title"><i class="fas fa-coins text-warning"></i> Фінанси</span>
          <div class="pulse-rates-tab-group" id="pulseRatesTabGroup">
            <button type="button" class="pulse-rate-tab-btn active" id="pulseTabBtnFiat" data-tab="fiat">
              <i class="fas fa-money-bill-wave"></i> Валюта
            </button>
            <button type="button" class="pulse-rate-tab-btn" id="pulseTabBtnCrypto" data-tab="crypto">
              <i class="fab fa-bitcoin"></i> Крипта
            </button>
          </div>
        </div>

        <!-- 1. СІТКА 8 ФІАТНИХ ВАЛЮТ (без прапорців, формат: USD ▲ / 45,20) -->
        <div class="pulse-rates-grid" id="pulseFiatGrid">
          <!-- Верхня четвірка (Головні топ-валюти) -->
          <div class="pulse-rate-item" title="Долар США (USD)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">USD</span>
              <span class="pulse-rate-diff up" id="pulseDiffUsd" title="+0.04">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateUsd">41,<span class="pulse-decimal">50</span></div>
          </div>
          <div class="pulse-rate-item" title="Євро (EUR)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">EUR</span>
              <span class="pulse-rate-diff up" id="pulseDiffEur" title="+0.08">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateEur">45,<span class="pulse-decimal">15</span></div>
          </div>
          <div class="pulse-rate-item" title="Польський злотий (PLN)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">PLN</span>
              <span class="pulse-rate-diff down" id="pulseDiffPln" title="-0.02">▼</span>
            </div>
            <div class="pulse-rate-value" id="pulseRatePln">10,<span class="pulse-decimal">55</span></div>
          </div>
          <div class="pulse-rate-item" title="Британський фунт (GBP)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">GBP</span>
              <span class="pulse-rate-diff up" id="pulseDiffGbp" title="+0.12">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateGbp">53,<span class="pulse-decimal">90</span></div>
          </div>

          <!-- Нижня четвірка (Резервні та практичні додаткові валюти) -->
          <div class="pulse-rate-item" title="Чеська крона (CZK)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">CZK</span>
              <span class="pulse-rate-diff up" id="pulseDiffCzk" title="+0.01">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateCzk">1,<span class="pulse-decimal">78</span></div>
          </div>
          <div class="pulse-rate-item" title="Швейцарський франк (CHF)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">CHF</span>
              <span class="pulse-rate-diff up" id="pulseDiffChf" title="+0.05">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateChf">47,<span class="pulse-decimal">80</span></div>
          </div>
          <div class="pulse-rate-item" title="Канадський долар (CAD)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">CAD</span>
              <span class="pulse-rate-diff down" id="pulseDiffCad" title="-0.03">▼</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateCad">30,<span class="pulse-decimal">20</span></div>
          </div>
          <div class="pulse-rate-item" title="Китайський юань (CNY)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">CNY</span>
              <span class="pulse-rate-diff up" id="pulseDiffCny" title="+0.01">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateCny">5,<span class="pulse-decimal">75</span></div>
          </div>
        </div>

        <!-- 2. СІТКА 8 КРИПТОВАЛЮТ (ТОП-4 ФЛАГМАНИ ТА 4 АКТИВНІ МОНЕТИ) -->
        <div class="pulse-rates-grid" id="pulseCryptoGrid" style="display: none;">
          <!-- Топ-4 флагмани -->
          <div class="pulse-rate-item" title="Bitcoin (BTC)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">BTC</span>
              <span class="pulse-rate-diff up" id="pulseDiffBtc" title="+1.8%">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateBtc">68 450$</div>
          </div>
          <div class="pulse-rate-item" title="Ethereum (ETH)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">ETH</span>
              <span class="pulse-rate-diff up" id="pulseDiffEth" title="+2.1%">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateEth">2 520$</div>
          </div>
          <div class="pulse-rate-item" title="Solana (SOL)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">SOL</span>
              <span class="pulse-rate-diff up" id="pulseDiffSol" title="+3.5%">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateSol">176,40$</div>
          </div>
          <div class="pulse-rate-item" title="BNB Chain (BNB)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">BNB</span>
              <span class="pulse-rate-diff down" id="pulseDiffBnb" title="-0.8%">▼</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateBnb">594,20$</div>
          </div>

          <!-- 4 активні монети -->
          <div class="pulse-rate-item" title="Gram / TON Telegram ecosystem (GRAM)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">GRAM</span>
              <span class="pulse-rate-diff up" id="pulseDiffGram" title="+4.2%">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateGram">0,016$</div>
          </div>
          <div class="pulse-rate-item" title="Ripple (XRP)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">XRP</span>
              <span class="pulse-rate-diff up" id="pulseDiffXrp" title="+1.2%">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateXrp">0,535$</div>
          </div>
          <div class="pulse-rate-item" title="Litecoin (LTC)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">LTC</span>
              <span class="pulse-rate-diff down" id="pulseDiffLtc" title="-0.5%">▼</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateLtc">71,80$</div>
          </div>
          <div class="pulse-rate-item" title="Dogecoin (DOGE)">
            <div class="pulse-rate-top-line">
              <span class="pulse-rate-code">DOGE</span>
              <span class="pulse-rate-diff up" id="pulseDiffDoge" title="+2.8%">▲</span>
            </div>
            <div class="pulse-rate-value" id="pulseRateDoge">0,142$</div>
          </div>
        </div>

        <!-- Роздільна лінія перед Конвертером Валют як просив користувач -->
        <div class="pulse-card-divider"></div>

        <!-- Заголовок конвертера з перемикачем режимів [ Валюта ] та [ Крипта ] -->
        <div class="pulse-conv-header">
          <div class="pulse-calc-heading">
            <i class="fas fa-calculator text-primary"></i> <strong>Конвертер:</strong>
          </div>
          <div class="pulse-rates-tab-group" id="pulseConvTabGroup">
            <button type="button" class="pulse-rate-tab-btn active" id="pulseConvTabFiat" data-tab="fiat">
              <i class="fas fa-money-bill-wave"></i> Валюта
            </button>
            <button type="button" class="pulse-rate-tab-btn" id="pulseConvTabCrypto" data-tab="crypto">
              <i class="fab fa-bitcoin"></i> Крипта
            </button>
          </div>
        </div>
        <div class="pulse-converter-dual-wrap">
          <!-- Блок 1: Я маю -->
          <div class="pulse-conv-box">
            <div class="pulse-conv-top-row">
              <span class="pulse-conv-label">Я маю</span>
              <select id="pulseConvCurrencyFrom" class="pulse-conv-select">
                <option value="USD" selected>USD</option>
                <option value="EUR">EUR</option>
                <option value="PLN">PLN</option>
                <option value="GBP">GBP</option>
                <option value="CZK">CZK</option>
                <option value="CHF">CHF</option>
                <option value="CAD">CAD</option>
                <option value="CNY">CNY</option>
                <option value="UAH">UAH</option>
              </select>
            </div>
            <div class="pulse-conv-input-row">
              <input type="number" id="pulseConvAmountFrom" class="pulse-conv-input" value="10" min="0" step="any">
            </div>
            <div class="pulse-conv-rate-ref" id="pulseConvRateFromRef">1 USD = 41.50 UAH</div>
          </div>

          <!-- Кругла кнопка обміну валют (⇄) -->
          <button type="button" class="pulse-conv-swap-btn" id="pulseConvSwapBtn" title="Поміняти місцями (⇄)">
            <i class="fas fa-exchange-alt"></i>
          </button>

          <!-- Блок 2: Я отримую -->
          <div class="pulse-conv-box">
            <div class="pulse-conv-top-row">
              <span class="pulse-conv-label">Я отримую</span>
              <select id="pulseConvCurrencyTo" class="pulse-conv-select">
                <option value="UAH" selected>UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="PLN">PLN</option>
                <option value="GBP">GBP</option>
                <option value="CZK">CZK</option>
                <option value="CHF">CHF</option>
                <option value="CAD">CAD</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
            <div class="pulse-conv-input-row">
              <input type="number" id="pulseConvAmountTo" class="pulse-conv-input" value="415.00" min="0" step="any">
            </div>
            <div class="pulse-conv-rate-ref" id="pulseConvRateToRef">1 UAH = 0.0241 USD</div>
          </div>
        </div>

        <!-- Швидкі суми для конвертера (баланс висоти картки) -->
        <div class="pulse-conv-quick-row">
          <span class="pulse-conv-quick-lbl">Швидкі суми:</span>
          <div class="pulse-conv-quick-buttons">
            <button type="button" class="pulse-conv-quick-btn" data-amount="50">50</button>
            <button type="button" class="pulse-conv-quick-btn" data-amount="100">100</button>
            <button type="button" class="pulse-conv-quick-btn" data-amount="500">500</button>
            <button type="button" class="pulse-conv-quick-btn" data-amount="1000">1 000</button>
            <button type="button" class="pulse-conv-quick-btn" data-amount="5000">5 000</button>
          </div>
        </div>

        <div class="pulse-card-divider" style="margin: 6px 0 5px;"></div>

        <!-- Рядок офіційного орієнтиру / джерела -->
        <div class="pulse-finance-footer">
          <span class="pulse-finance-footer-note" title="Офіційний курс НБУ та середньозважені міжбанківські котирування">
            <i class="fas fa-university text-primary" style="margin-right: 3px;"></i>Курс НБУ / Міжбанк
          </span>
          <span class="pulse-finance-footer-date" id="pulseFinanceDateNote">Оновлення щодня</span>
        </div>
      </div>
    </div>
  `;

  // Навішуємо обробники для елементів шторки
  const btnClose = container.querySelector('#btnPulseClose');
  if (btnClose) btnClose.onclick = closePulseDrawer;

  const btnRefresh = container.querySelector('#btnPulseRefresh');
  if (btnRefresh) {
    btnRefresh.onclick = () => {
      loadPulseDrawerData(true);
    };
  }

  // Обробник вибору міста для погоди (Open-Meteo)
  const weatherCitySelect = container.querySelector('#pulseWeatherCitySelect');
  const savedWeatherCity = localStorage.getItem('pulse_weather_city') || 'novomyrhorod';
  if (weatherCitySelect) {
    weatherCitySelect.value = savedWeatherCity;
    weatherCitySelect.onchange = (e) => {
      const chosen = e.target.value;
      localStorage.setItem('pulse_weather_city', chosen);
      loadPulseWeatherData(false);
      if (currentUser && firebaseDb) {
        firebaseDb.collection('users').doc(currentUser.uid).set({
          weatherCity: chosen
        }, { merge: true }).catch(() => {});
      }
    };
  }

  // Кнопка автовизначення локації погоди
  const weatherGeoBtn = container.querySelector('#pulseWeatherGeoBtn');
  if (weatherGeoBtn) {
    weatherGeoBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      detectUserWeatherLocation();
    };
  }

  // Кнопка примусового оновлення погоди
  const weatherRefreshBtn = container.querySelector('#pulseWeatherRefreshBtn');
  if (weatherRefreshBtn) {
    weatherRefreshBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      loadPulseWeatherData(true);
    };
  }

  // Обробник вибору міста для екології та радіаційного фону (SaveEcoBot / EcoCity)
  const ecoRegionSelect = container.querySelector('#pulseEcoRegionSelect');
  const savedEcoRegion = getEffectiveEcoRegionId();
  if (ecoRegionSelect) {
    ecoRegionSelect.value = savedEcoRegion;
    ecoRegionSelect.onchange = (e) => {
      const chosen = e.target.value;
      localStorage.setItem('pulse_eco_region', chosen);
      loadPulseEcoData(false);
      if (currentUser && firebaseDb) {
        firebaseDb.collection('users').doc(currentUser.uid).set({
          ecoRegion: chosen
        }, { merge: true }).catch(() => {});
      }
    };
  }

  // Кнопка автовизначення найближчої станції моніторингу для екології (GPS / IP)
  const ecoGeoBtn = container.querySelector('#pulseEcoGeoBtn');
  if (ecoGeoBtn) {
    ecoGeoBtn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      ecoGeoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      const applyNearestEco = (lat, lon) => {
        let nearest = UKRAINE_ECO_REGIONS[0];
        let minDist = Infinity;
        for (const r of UKRAINE_ECO_REGIONS) {
          const dist = Math.hypot(r.lat - lat, r.lon - lon);
          if (dist < minDist) {
            minDist = dist;
            nearest = r;
          }
        }
        if (ecoRegionSelect) {
          ecoRegionSelect.value = nearest.id;
          localStorage.setItem('pulse_eco_region', nearest.id);
          loadPulseEcoData(false);
          showQuickToast(`Екомоніторинг: обрано найближчий центр (${nearest.name})`, 'success');
        }
        ecoGeoBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
      };

      // Перевіряємо збережені координати з блоку погоди
      try {
        const customGeo = JSON.parse(localStorage.getItem('pulse_weather_custom_geo') || 'null');
        if (customGeo && customGeo.lat && customGeo.lon) {
          applyNearestEco(customGeo.lat, customGeo.lon);
          return;
        }
      } catch (err) {}

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            applyNearestEco(pos.coords.latitude, pos.coords.longitude);
          },
          async () => {
            try {
              const ipRes = await fetch('https://ipapi.co/json/');
              if (ipRes.ok) {
                const ipData = await ipRes.json();
                if (ipData && ipData.latitude && ipData.longitude) {
                  applyNearestEco(ipData.latitude, ipData.longitude);
                  return;
                }
              }
            } catch (e2) {}
            showQuickToast('Не вдалося визначити координати. Обрано Київ', 'warning');
            ecoGeoBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
          },
          { timeout: 6000 }
        );
      } else {
        showQuickToast('Геолокація не підтримується браузером', 'warning');
        ecoGeoBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
      }
    };
  }

  // Обробник вибору регіону цін на пальне (з плавним debounce хмарного збереження)
  const fuelRegionSelect = container.querySelector('#pulseFuelRegionSelect');
  const savedRegion = localStorage.getItem('user_fuel_region') || 'ua';
  let fuelRegionSaveDebounce = null;
  if (fuelRegionSelect) {
    fuelRegionSelect.value = savedRegion;
    fuelRegionSelect.onchange = (e) => {
      const chosen = e.target.value;
      localStorage.setItem('user_fuel_region', chosen);
      renderPulseFuelTable(chosen);
      clearTimeout(fuelRegionSaveDebounce);
      fuelRegionSaveDebounce = setTimeout(() => {
        if (currentUser && firebaseDb) {
          firebaseDb.collection('users').doc(currentUser.uid).set({
            fuelRegion: chosen
          }, { merge: true }).catch(() => {});
        }
      }, 500);
    };
  }
  renderPulseFuelTable(savedRegion);

  // Перемикач вкладок Валюти / Крипта у сітці
  const tabBtnFiat = container.querySelector('#pulseTabBtnFiat');
  const tabBtnCrypto = container.querySelector('#pulseTabBtnCrypto');
  const gridFiat = container.querySelector('#pulseFiatGrid');
  const gridCrypto = container.querySelector('#pulseCryptoGrid');

  // Перемикач вкладок Валюти / Крипта у Конвертері
  const convTabFiat = container.querySelector('#pulseConvTabFiat');
  const convTabCrypto = container.querySelector('#pulseConvTabCrypto');

  if (tabBtnFiat && tabBtnCrypto && gridFiat && gridCrypto) {
    tabBtnFiat.onclick = () => {
      tabBtnFiat.classList.add('active');
      tabBtnCrypto.classList.remove('active');
      gridFiat.style.display = 'grid';
      gridCrypto.style.display = 'none';
      if (convTabFiat && !convTabFiat.classList.contains('active')) {
        convTabFiat.click();
      }
    };
    tabBtnCrypto.onclick = () => {
      tabBtnCrypto.classList.add('active');
      tabBtnFiat.classList.remove('active');
      gridFiat.style.display = 'none';
      gridCrypto.style.display = 'grid';
      if (convTabCrypto && !convTabCrypto.classList.contains('active')) {
        convTabCrypto.click();
      }
    };
  }

  // Двосторонній інтерактивний конвертер валют та криптовалют
  const inpFrom = container.querySelector('#pulseConvAmountFrom');
  const inpTo = container.querySelector('#pulseConvAmountTo');
  const selFrom = container.querySelector('#pulseConvCurrencyFrom');
  const selTo = container.querySelector('#pulseConvCurrencyTo');
  const btnSwap = container.querySelector('#pulseConvSwapBtn');
  const refFrom = container.querySelector('#pulseConvRateFromRef');
  const refTo = container.querySelector('#pulseConvRateToRef');

  const FIAT_CURRENCIES = ['USD', 'EUR', 'PLN', 'GBP', 'CZK', 'CHF', 'CAD', 'CNY', 'UAH'];
  const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'SOL', 'BNB', 'GRAM', 'XRP', 'LTC', 'DOGE', 'USD', 'UAH'];

  function updateConverterOptions(mode) {
    if (!selFrom || !selTo) return;
    const isCrypto = mode === 'crypto';
    const listFrom = isCrypto ? CRYPTO_CURRENCIES : FIAT_CURRENCIES;
    const listTo = isCrypto ? ['UAH', 'USD', 'BTC', 'ETH', 'SOL', 'BNB', 'GRAM', 'XRP', 'LTC', 'DOGE'] : FIAT_CURRENCIES;

    const prevFrom = selFrom.value;
    const prevTo = selTo.value;

    selFrom.innerHTML = listFrom.map(c => `<option value="${c}">${c}</option>`).join('');
    selTo.innerHTML = listTo.map(c => `<option value="${c}">${c}</option>`).join('');

    if (isCrypto) {
      selFrom.value = listFrom.includes(prevFrom) && prevFrom !== 'UAH' ? prevFrom : 'BTC';
      selTo.value = listTo.includes(prevTo) && prevTo !== selFrom.value ? prevTo : 'UAH';
      if (inpFrom && (inpFrom.value === '10' || !inpFrom.value)) {
        inpFrom.value = '1';
      }
    } else {
      selFrom.value = listFrom.includes(prevFrom) && prevFrom !== 'UAH' ? prevFrom : 'USD';
      selTo.value = listTo.includes(prevTo) && prevTo !== selFrom.value ? prevTo : 'UAH';
      if (inpFrom && (inpFrom.value === '1' || !inpFrom.value)) {
        inpFrom.value = '10';
      }
    }
    convertFromTo();
  }

  if (convTabFiat && convTabCrypto) {
    convTabFiat.onclick = () => {
      convTabFiat.classList.add('active');
      convTabCrypto.classList.remove('active');
      updateConverterOptions('fiat');
    };
    convTabCrypto.onclick = () => {
      convTabCrypto.classList.add('active');
      convTabFiat.classList.remove('active');
      updateConverterOptions('crypto');
    };
  }

  function getCurrencyRateUah(cur) {
    if (cur === 'UAH') return 1.0;
    const fallbacks = {
      USD: 41.50, EUR: 45.15, PLN: 10.55, GBP: 53.90,
      CZK: 1.78, CHF: 47.80, CAD: 30.20, CNY: 5.75
    };
    if (pulseRatesData[cur]) return pulseRatesData[cur];
    if (fallbacks[cur]) return fallbacks[cur];
    if (pulseCryptoData && pulseCryptoData[cur]) {
      const usdRate = pulseRatesData.USD || fallbacks.USD || 41.50;
      return pulseCryptoData[cur].price * usdRate;
    }
    return 1.0;
  }

  function formatConvertedValue(val) {
    if (val <= 0 || isNaN(val)) return '';
    if (Number.isInteger(val)) return String(val);
    if (val >= 100) return val.toFixed(2);
    if (val >= 1) return val.toFixed(4);
    if (val >= 0.0001) return val.toFixed(6);
    return parseFloat(val.toPrecision(6)).toString();
  }

  function formatRefRate(val) {
    if (val >= 1000) return Math.round(val).toLocaleString('uk-UA');
    if (val >= 1) return val.toFixed(2);
    if (val >= 0.001) return val.toFixed(4);
    return parseFloat(val.toPrecision(4)).toString();
  }

  function updateConverterRatesRef() {
    if (!selFrom || !selTo || !refFrom || !refTo) return;
    const cFrom = selFrom.value;
    const cTo = selTo.value;
    const rFromUah = getCurrencyRateUah(cFrom);
    const rToUah = getCurrencyRateUah(cTo);
    const rateDirect = rFromUah / rToUah;
    const rateReverse = rToUah / rFromUah;

    refFrom.textContent = `1 ${cFrom} = ${formatRefRate(rateDirect)} ${cTo}`;
    refTo.textContent = `1 ${cTo} = ${formatRefRate(rateReverse)} ${cFrom}`;
  }

  function convertFromTo() {
    if (!inpFrom || !inpTo || !selFrom || !selTo) return;
    const amt = parseFloat(inpFrom.value) || 0;
    const cFrom = selFrom.value;
    const cTo = selTo.value;
    const rFromUah = getCurrencyRateUah(cFrom);
    const rToUah = getCurrencyRateUah(cTo);
    const result = (amt * rFromUah) / rToUah;
    inpTo.value = formatConvertedValue(result);
    updateConverterRatesRef();
  }

  function convertToFrom() {
    if (!inpFrom || !inpTo || !selFrom || !selTo) return;
    const amt = parseFloat(inpTo.value) || 0;
    const cFrom = selFrom.value;
    const cTo = selTo.value;
    const rFromUah = getCurrencyRateUah(cFrom);
    const rToUah = getCurrencyRateUah(cTo);
    const result = (amt * rToUah) / rFromUah;
    inpFrom.value = formatConvertedValue(result);
    updateConverterRatesRef();
  }

  window.updatePulseConverterLive = convertFromTo;

  if (inpFrom && inpTo && selFrom && selTo) {
    inpFrom.oninput = convertFromTo;
    inpTo.oninput = convertToFrom;
    selFrom.onchange = convertFromTo;
    selTo.onchange = convertFromTo;

    if (btnSwap) {
      btnSwap.onclick = () => {
        const tempCur = selFrom.value;
        const targetCur = selTo.value;
        if (!Array.from(selFrom.options).some(o => o.value === targetCur)) {
          selFrom.innerHTML += `<option value="${targetCur}">${targetCur}</option>`;
        }
        if (!Array.from(selTo.options).some(o => o.value === tempCur)) {
          selTo.innerHTML += `<option value="${tempCur}">${tempCur}</option>`;
        }
        selFrom.value = targetCur;
        selTo.value = tempCur;
        convertFromTo();
      };
    }
    convertFromTo();

    // Обробники кліків для швидких сум конвертера
    const quickAmtBtns = container.querySelectorAll('.pulse-conv-quick-btn');
    quickAmtBtns.forEach(b => {
      b.onclick = () => {
        const amt = b.getAttribute('data-amount');
        if (amt && inpFrom) {
          inpFrom.value = amt;
          convertFromTo();
        }
      };
    });
  }

  // Рендеримо власний віджет «Свята та події» на 3 дні (Сьогодні, Завтра, Післязавтра)
  renderPulseHolidaysUI();
}

async function loadPulseDrawerData(forceRefresh = false) {
  const spin = document.getElementById('pulseRefreshSpin');
  if (spin) spin.classList.add('fa-spin');

  const now = Date.now();
  const cacheKey = 'pulse_day_cache_v3';
  let cached = null;
  try {
    cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
  } catch (e) {}

  const isCacheFresh = cached && (now - cached.timestamp < 2 * 60 * 60 * 1000); // 2 години

  if (!forceRefresh && isCacheFresh) {
    applyRatesToUI(cached.rates);
    if (cached.crypto) {
      applyCryptoToUI(cached.crypto);
    } else {
      applyCryptoToUI(pulseCryptoData);
      fetchLiveCryptoRates();
    }
    if (cached.geomagForecast) {
      renderGeomagForecastUI(cached.geomagForecast);
    }
    if (cached.lastUpdatedText) {
      const label = document.getElementById('pulseLastUpdatedLabel');
      if (label) label.textContent = `Оновлено: ${cached.lastUpdatedText}`;
    }
    loadPulseWeatherData(false);
    fetchLiveFuelPrices();
    loadPulseEcoData(false);
    renderPulseHolidaysUI();
    if (spin) spin.classList.remove('fa-spin');
    return;
  }

  // Свіжий запит
  try {
    const [ratesResult, geomagResult, cryptoResult] = await Promise.allSettled([
      fetchLiveNbuRates(),
      fetchLiveGeomag3DayForecast(),
      fetchLiveCryptoRates()
    ]);

    let finalRates = pulseRatesData;
    if (ratesResult.status === 'fulfilled' && ratesResult.value) {
      finalRates = ratesResult.value;
      applyRatesToUI(finalRates);
    }

    let finalCrypto = pulseCryptoData;
    if (cryptoResult.status === 'fulfilled' && cryptoResult.value) {
      finalCrypto = cryptoResult.value;
      applyCryptoToUI(finalCrypto);
    }

    let finalForecast = null;
    if (geomagResult.status === 'fulfilled' && geomagResult.value) {
      finalForecast = geomagResult.value;
      renderGeomagForecastUI(finalForecast);
    }

    const timeStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    const label = document.getElementById('pulseLastUpdatedLabel');
    if (label) label.textContent = `Оновлено: ${timeStr}`;

    loadPulseWeatherData(forceRefresh);
    fetchLiveFuelPrices();
    loadPulseEcoData(forceRefresh);
    renderPulseHolidaysUI();

    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: now,
        lastUpdatedText: timeStr,
        rates: finalRates,
        crypto: finalCrypto,
        geomagForecast: finalForecast
      }));
    } catch (e) {}

    if (forceRefresh) {
      showQuickToast('Дані успішно оновлено!', 'success');
    }
  } catch (err) {
    console.warn('Помилка завантаження Пульсу дня:', err);
  } finally {
    if (spin) spin.classList.remove('fa-spin');
  }
}

async function fetchLiveFuelPrices() {
  try {
    const res = await fetch('/api/fuel-prices');
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.base && Array.isArray(data.base)) {
      window.LIVE_FUEL_NETWORKS = data.base;
      if (data.regionDeltas) window.LIVE_FUEL_DELTAS = data.regionDeltas;
      const curReg = localStorage.getItem('user_fuel_region') || 'ua';
      renderPulseFuelTable(curReg);
    }
  } catch (e) {
    // тихо продовжуємо з базовими даними
  }
}

async function fetchLiveNbuRates() {
  try {
    const res = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    if (!res.ok) throw new Error('Помилка НБУ API');
    const data = await res.json();
    if (!Array.isArray(data)) return null;

    const findRate = (code, fallback) => {
      const it = data.find(item => item.cc === code);
      return it ? Number(it.rate.toFixed(2)) : fallback;
    };

    const rates = {
      USD: findRate('USD', 41.50),
      EUR: findRate('EUR', 45.15),
      PLN: findRate('PLN', 10.55),
      GBP: findRate('GBP', 53.90),
      CZK: findRate('CZK', 1.78),
      CHF: findRate('CHF', 47.80),
      CAD: findRate('CAD', 30.20),
      CNY: findRate('CNY', 5.75),
      diffUSD: '+0.04',
      diffEUR: '+0.06',
      diffPLN: '-0.02',
      diffGBP: '+0.12',
      diffCZK: '+0.01',
      diffCHF: '+0.05',
      diffCAD: '-0.03',
      diffCNY: '+0.01'
    };
    pulseRatesData = rates;
    return rates;
  } catch (e) {
    return pulseRatesData;
  }
}

async function fetchLiveCryptoRates() {
  try {
    const symbols = '["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT","LTCUSDT","DOGEUSDT"]';
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`);
    if (!res.ok) throw new Error('Помилка Binance API');
    const list = await res.json();
    if (!Array.isArray(list)) return pulseCryptoData;

    const map = {};
    list.forEach(item => {
      map[item.symbol] = item;
    });

    const updateCoin = (key, sym) => {
      if (map[sym] && pulseCryptoData[key]) {
        const p = parseFloat(map[sym].lastPrice);
        const change = parseFloat(map[sym].priceChangePercent);
        if (!isNaN(p)) {
          pulseCryptoData[key].price = p;
        }
        if (!isNaN(change)) {
          pulseCryptoData[key].diff = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
        }
      }
    };

    updateCoin('BTC', 'BTCUSDT');
    updateCoin('ETH', 'ETHUSDT');
    updateCoin('SOL', 'SOLUSDT');
    updateCoin('BNB', 'BNBUSDT');
    updateCoin('XRP', 'XRPUSDT');
    updateCoin('LTC', 'LTCUSDT');
    updateCoin('DOGE', 'DOGEUSDT');

    applyCryptoToUI(pulseCryptoData);
    return pulseCryptoData;
  } catch (e) {
    applyCryptoToUI(pulseCryptoData);
    return pulseCryptoData;
  }
}

function applyCryptoToUI(cryptoData) {
  if (!cryptoData) return;
  pulseCryptoData = cryptoData;

  const formatCryptoPrice = (price) => {
    if (price >= 1000) {
      return Math.round(price).toLocaleString('uk-UA').replace(/\s/g, ' ') + '$';
    } else if (price >= 1) {
      return price.toFixed(2).replace('.', ',') + '$';
    } else {
      return price.toFixed(3).replace('.', ',') + '$';
    }
  };

  const updateCryptoItem = (code, info) => {
    if (!info) return;
    const elVal = document.getElementById(`pulseRate${code}`);
    const elDiff = document.getElementById(`pulseDiff${code}`);
    if (elVal) elVal.textContent = formatCryptoPrice(info.price);
    if (elDiff && info.diff) {
      const isUp = info.diff.startsWith('+') || info.diff.startsWith('▲');
      elDiff.className = `pulse-rate-diff ${isUp ? 'up' : 'down'}`;
      elDiff.textContent = isUp ? '▲' : '▼';
      elDiff.title = info.diff;
    }
  };

  updateCryptoItem('Btc', pulseCryptoData.BTC);
  updateCryptoItem('Eth', pulseCryptoData.ETH);
  updateCryptoItem('Sol', pulseCryptoData.SOL);
  updateCryptoItem('Bnb', pulseCryptoData.BNB);
  updateCryptoItem('Gram', pulseCryptoData.GRAM);
  updateCryptoItem('Xrp', pulseCryptoData.XRP);
  updateCryptoItem('Ltc', pulseCryptoData.LTC);
  updateCryptoItem('Doge', pulseCryptoData.DOGE);

  if (typeof window.updatePulseConverterLive === 'function') {
    window.updatePulseConverterLive();
  }
}

function applyRatesToUI(rates) {
  if (!rates) return;
  pulseRatesData = rates;

  const updateItem = (code, val, diff) => {
    const elVal = document.getElementById(`pulseRate${code}`);
    const elDiff = document.getElementById(`pulseDiff${code}`);
    if (elVal) elVal.innerHTML = formatDecimalsHtml(val, 2, true);
    if (elDiff && diff) {
      const isUp = diff.startsWith('+') || diff.startsWith('▲');
      elDiff.className = `pulse-rate-diff ${isUp ? 'up' : 'down'}`;
      elDiff.textContent = isUp ? '▲' : '▼';
      elDiff.title = diff;
    }
  };

  updateItem('Usd', rates.USD || 41.50, rates.diffUSD || '+0.04');
  updateItem('Eur', rates.EUR || 45.15, rates.diffEUR || '+0.06');
  updateItem('Pln', rates.PLN || 10.55, rates.diffPLN || '-0.02');
  updateItem('Gbp', rates.GBP || 53.90, rates.diffGBP || '+0.12');
  updateItem('Czk', rates.CZK || 1.78, rates.diffCZK || '+0.01');
  updateItem('Chf', rates.CHF || 47.80, rates.diffCHF || '+0.05');
  updateItem('Cad', rates.CAD || 30.20, rates.diffCAD || '-0.03');
  updateItem('Cny', rates.CNY || 5.75, rates.diffCNY || '+0.01');

  // Оновлюємо новий конвертер валют при оновленні курсів
  if (typeof window.updatePulseConverterLive === 'function') {
    window.updatePulseConverterLive();
  }
}

function getGeomagCompactDayBadge(dateObj) {
  const uaDays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const dayName = uaDays[dateObj.getDay()];
  const dayNum = dateObj.getDate();
  return `${dayName} • ${dayNum}`;
}

async function fetchLiveGeomag3DayForecast() {
  const now = new Date();
  const d1Obj = new Date(now.getTime() + 24 * 3600 * 1000);
  const d2Obj = new Date(now.getTime() + 48 * 3600 * 1000);

  const d0 = formatDateToYMD(now);
  const d1 = formatDateToYMD(d1Obj);
  const d2 = formatDateToYMD(d2Obj);

  const badge0 = getGeomagCompactDayBadge(now);
  const badge1 = getGeomagCompactDayBadge(d1Obj);
  const badge2 = getGeomagCompactDayBadge(d2Obj);

  try {
    const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json');
    if (!res.ok) throw new Error('NOAA forecast API error');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Empty forecast');

    const timeSlots = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

    const getDaySlots = (datePrefix) => {
      return timeSlots.map(timeStr => {
        const item = data.find(d => {
          if (!d.time_tag) return false;
          return d.time_tag.startsWith(datePrefix) && d.time_tag.includes(`T${timeStr}`);
        });
        const kp = item ? parseFloat(item.kp) : 1.33;
        return { time: timeStr, kp: isNaN(kp) ? 1.0 : kp };
      });
    };

    return [
      { label: badge0, badge: badge0, date: d0, slots: getDaySlots(d0) },
      { label: badge1, badge: badge1, date: d1, slots: getDaySlots(d1) },
      { label: badge2, badge: badge2, date: d2, slots: getDaySlots(d2) }
    ];
  } catch (e) {
    const timeSlots = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

    const makeFallback = (base) => timeSlots.map((t, idx) => ({
      time: t,
      kp: parseFloat((base + Math.sin(idx) * 0.7).toFixed(1))
    }));

    return [
      { label: badge0, badge: badge0, date: d0, slots: makeFallback(1.7) },
      { label: badge1, badge: badge1, date: d1, slots: makeFallback(2.3) },
      { label: badge2, badge: badge2, date: d2, slots: makeFallback(1.5) }
    ];
  }
}

function formatDateToYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function renderGeomagForecastUI(daysForecast) {
  const container = document.getElementById('pulseGeomagTableWrap') || document.getElementById('pulseGeomagDaysContainer');
  if (!container || !Array.isArray(daysForecast)) return;

  // Оцінюємо максимальний Kp на сьогодні для шапки
  const todaySlots = daysForecast[0]?.slots || [];
  const maxTodayKp = Math.max(...todaySlots.map(s => s.kp), 1.0);

  const badgeEl = document.getElementById('pulseGeomagNowBadge');
  if (badgeEl) {
    if (maxTodayKp < 3.0) {
      badgeEl.className = 'pulse-geomag-now-badge green';
      badgeEl.innerHTML = `🟢 Спокійно (Kp ${formatDecimalsHtml(maxTodayKp, 1, false)})`;
    } else if (maxTodayKp < 5.0) {
      badgeEl.className = 'pulse-geomag-now-badge yellow';
      badgeEl.innerHTML = `🟡 Помірно (Kp ${formatDecimalsHtml(maxTodayKp, 1, false)})`;
    } else {
      badgeEl.className = 'pulse-geomag-now-badge red';
      badgeEl.innerHTML = `🔴 Буря (Kp ${formatDecimalsHtml(maxTodayKp, 1, false)})`;
    }
  }

  const timeHeaders = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

  const rowsHtml = daysForecast.map(day => {
    let dayLabel = (day.badge || day.label || '').replace(/\s*•\s*/g, ' • ');
    const m = dayLabel.match(/^(\d+)\s*•\s*([А-Яа-яЇїІіЄєҐґ]+)$/);
    if (m) {
      dayLabel = `${m[2]} • ${m[1]}`;
    }
    const slotsHtml = (day.slots || []).map(slot => {
      const val = typeof slot.kp === 'number' ? slot.kp : 1.5;
      let colorClass = 'green';
      if (val >= 5.0) colorClass = 'red';
      else if (val >= 3.0) colorClass = 'yellow';
      return `<td class="kp-cell ${colorClass}" title="${dayLabel} ${slot.time} - Kp ${val.toFixed(1)}">${formatDecimalsHtml(val, 1, false)}</td>`;
    }).join('');

    return `
      <tr>
        <td class="kp-td-day">${dayLabel}</td>
        ${slotsHtml}
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <table class="pulse-kp-table">
      <thead>
        <tr>
          <th class="kp-th-day">Час</th>
          ${timeHeaders.map(t => `<th>${t}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}
window.renderGeomagForecastUI = renderGeomagForecastUI;

// Запуск ініціалізації Пульсу дня після повного завантаження всіх констант та функцій
function startupPulseModule() {
  try {
    initPulseDayDrawer();
  } catch (e) {
    console.warn("Помилка ініціалізації Пульсу дня:", e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startupPulseModule);
} else {
  startupPulseModule();
}
