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
           str.indexOf("evm") !== -1;
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

document.addEventListener("DOMContentLoaded", () => {
  
  // === Fix favicon for subdomains and special services ===
  const base64Favicons = {"accounts.ukr.net": "https://accounts.ukr.net/login/assets/favicon.png", "mail.ukr.net": "https://accounts.ukr.net/login/assets/favicon.png", "ukr.net": "https://upst.fwdcdn.com/favicon-v3.png", "www.ukr.net": "https://upst.fwdcdn.com/favicon-v3.png", "uaflix.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M4 10c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V10z\" fill=\"%230057b7\"/><path d=\"M4 16h24v6c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4v-6z\" fill=\"%23ffd700\"/><polygon points=\"13,10 23,16 13,22\" fill=\"%23ffffff\"/></svg>", "myradio.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><circle cx=\"16\" cy=\"18\" r=\"5\" fill=\"%23ffffff\"/><path d=\"M9 11a10 10 0 0 1 14 0M12 14a6 6 0 0 1 8 0\" stroke=\"%23ffffff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"18\" r=\"2\" fill=\"%23ea580c\"/></svg>", "abuk.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M8 8h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H8V8z\" fill=\"%23ffffff\"/><path d=\"M24 8h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7V8z\" fill=\"%23e0e7ff\"/><path d=\"M16 12v12\" stroke=\"%234f46e5\" stroke-width=\"2\"/></svg>", "podcasts.nv.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><rect x=\"13\" y=\"8\" width=\"6\" height=\"10\" rx=\"3\" fill=\"%23ffffff\"/><path d=\"M9 15a7 7 0 0 0 14 0M16 22v5M12 27h8\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "kick.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><path d=\"M8 6h5v7.5L18.5 6H24l-6.5 8.5L24 26h-5.5l-5.5-8V26H8V6z\" fill=\"%2353fc18\"/></svg>", "youtv.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><rect x=\"5\" y=\"7\" width=\"22\" height=\"15\" rx=\"3\" fill=\"%23ffffff\"/><path d=\"M10 26h12M16 22v4\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\"/><polygon points=\"13,11 20,14.5 13,18\" fill=\"%230284c7\"/></svg>", "tv.kyivstar.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><path d=\"M16 5l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z\" fill=\"%23ffffff\"/></svg>", "radioplayer.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><path d=\"M12 10l10 6-10 6V10z\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"12\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\"/></svg>", "uakino.me": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23eab308\"/><path d=\"M12 9l11 7-11 7V9z\" fill=\"%23111827\"/></svg>", "eneyida.tv": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"23\" font-size=\"20\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">E</text></svg>", "uaserials.pro": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%239333ea\"/><rect x=\"6\" y=\"8\" width=\"20\" height=\"14\" rx=\"3\" fill=\"%23ffffff\"/><polygon points=\"13,11 20,15 13,19\" fill=\"%239333ea\"/></svg>", "takflix.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2318181b\"/><text x=\"16\" y=\"23\" font-size=\"20\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">T</text></svg>", "music.youtube.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23ff0000\"/><circle cx=\"16\" cy=\"16\" r=\"10\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"2\"/><polygon points=\"13,11 21,16 13,21\" fill=\"%23ffffff\"/></svg>", "open.spotify.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%231ed760\"/><path d=\"M8 12c6-1.5 12-1 16 1.5M9 16c5-1.2 10-.8 14 1M11 20c4-1 8-.5 11 1\" stroke=\"%23ffffff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "music.apple.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23fa2d48\"/><path d=\"M18 9v11a3 3 0 1 1-3-3h3V9z\" fill=\"%23ffffff\"/></svg>", "soundcloud.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff5500\"/><path d=\"M8 20v-4M11 21v-7M14 22v-9M17 22v-11M20 22a4 4 0 0 0 0-8 5 5 0 0 0-5 3v5z\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "store.steampowered.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23171a21\"/><path d=\"M16 6a10 10 0 0 0-9.8 8l4.4 1.8a3.5 3.5 0 0 1 4.9-1.3l3-4.3a10 10 0 0 0-2.5-4.2zm-6 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm12-3a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z\" fill=\"%2366c0f4\"/></svg>", "steampowered.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23171a21\"/><path d=\"M16 6a10 10 0 0 0-9.8 8l4.4 1.8a3.5 3.5 0 0 1 4.9-1.3l3-4.3a10 10 0 0 0-2.5-4.2zm-6 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm12-3a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z\" fill=\"%2366c0f4\"/></svg>", "store.epicgames.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23121212\"/><path d=\"M7 6h18v4H11v6h12v4H11v6h14v4H7V6z\" fill=\"%23ffffff\"/></svg>", "epicgames.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23121212\"/><path d=\"M7 6h18v4H11v6h12v4H11v6h14v4H7V6z\" fill=\"%23ffffff\"/></svg>", "gog.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%238a2be2\"/><text x=\"16\" y=\"22\" font-size=\"16\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">GOG</text></svg>", "playua.net": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><path d=\"M10 8l14 8-14 8V8z\" fill=\"%230057b7\"/><path d=\"M10 16l14 0-14 8V16z\" fill=\"%23ffd700\"/></svg>", "gamedev.dou.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231a202c\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%2338bdf8\" text-anchor=\"middle\" font-family=\"sans-serif\">DOU</text></svg>", "itc.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ITC</text></svg>", "boosteroid.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230088cc\"/><path d=\"M8 20l8-12 8 12h-5l-3-4.5-3 4.5H8z\" fill=\"%23ffffff\"/></svg>", "geforcenow.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2376b900\"/><path d=\"M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z\" fill=\"%23ffffff\"/></svg>", "crazygames.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%237c3aed\"/><path d=\"M10 10h12v4H10zM10 18h12v4H10z\" fill=\"%23ffffff\"/></svg>", "kongregate.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"23\" font-size=\"18\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">K</text></svg>", "hltv.org": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232b6cb0\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">HLTV</text></svg>", "liquipedia.net": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%2338bdf8\"/></svg>", "pw.game": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAACXBIWXMAAAsTAAALEwEAmpwYAAABUElEQVR42q1VO27DMAx9owfDgGfv3Tply1ECX6Q38OgLaDOQo2TTpito05wMAlihqKqwpGKh7nuLDYGPH1EkVPSYYWAREBMDLAxmjGjCGwweIIUPmHT6Eh0WZiwZsaCr+7agBjo9jhMCqJEBJ+E9mzcy8Ci6Enwz3XMtFpDGM62J55rEWsJXKv9OV8q4pj9IxpyGAXFOxfhJZJISGxJ67n+gle6k4Z5Oht+tNQIzV/X0Cp7AOYsE9gBOA9hDAhYIhwQCEKWAz4VkBXSaQFQFHIGmL5FsPBHoVhEIugB+TG7sT6ZgGwX0FGzlGh1dmMCFXOUaRSOVJnbkv0vqSkMrjTSyVs7eBHJUspVLEkzE8xbOxpxbfs5RHg70kVNIX0PlOYuBIkWksRwoQAf3h5HWHxyq/zTWeRSufbHo6LAi7qy2Ff3ect2qy3WTvnWM7ev9E1Cd4GW12cjkAAAAAElFTkSuQmCC", "chess.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23689f38\"/><path d=\"M16 6a3 3 0 0 0-3 3c0 .8.3 1.5.8 2H11v3h10v-3h-2.8c.5-.5.8-1.2.8-2a3 3 0 0 0-3-3zm-6 12h12v3H10zm-2 5h16v3H8z\" fill=\"%23ffffff\"/></svg>", "sudoku.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M6 6h20v20H6V6zm2 2v5h5V8H8zm7 0v5h5V8h-5zm7 0v5h4V8h-4zm-14 7v5h5v-5H8zm7 0v5h5v-5h-5zm7 0v5h4v-5h-4z\" fill=\"%23ffffff\"/></svg>", "mezha.media": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M6 8h4l6 10 6-10h4v16h-4v-9.5L16 23.5 10 14.5V24H6V8z\" fill=\"%2338bdf8\"/></svg>", "overclockers.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">OC.UA</text></svg>", "escharts.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230d1117\"/><path d=\"M8 22V16l5 4 6-8 5 4\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "maincast.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff4500\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">MC</text></svg>", "battle.net": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300aeff\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"4\" fill=\"%2300aeff\"/></svg>", "roblox.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><rect x=\"9\" y=\"9\" width=\"14\" height=\"14\" rx=\"2\" fill=\"%23ffffff\" transform=\"rotate(-15 16 16)\"/><rect x=\"14\" y=\"14\" width=\"4\" height=\"4\" fill=\"%23000000\" transform=\"rotate(-15 16 16)\"/></svg>", "xbox.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23107c41\"/><path d=\"M9 9c2 2 5 6 7 10 2-4 5-8 7-10 1.5 2 3 5 3 7 0 5-4 10-10 10S6 21 6 16c0-2 1.5-5 3-7z\" fill=\"%23ffffff\"/></svg>", "ggbet.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23ff6600\" text-anchor=\"middle\" font-family=\"sans-serif\">GG</text></svg>", "favbet.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><path d=\"M8 8h16v4H12v4h10v4H12v8H8V8z\" fill=\"%23ffffff\"/></svg>", "ggpoker.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ef4444\" text-anchor=\"middle\" font-family=\"sans-serif\">GGP</text></svg>", "pokermatch.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23f59e0b\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23000000\" text-anchor=\"middle\" font-family=\"sans-serif\">PM</text></svg>", "pokermatch.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23f59e0b\"/><text x=\"16\" y=\"21\" font-size=\"12\" font-weight=\"900\" fill=\"%23000000\" text-anchor=\"middle\" font-family=\"sans-serif\">PM</text></svg>", "supergra.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M16 6l8 14H8l8-14z\" fill=\"%23facc15\"/></svg>", "t.me": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23229ED9\"/><path d=\"M7.8 15.5l15.8-6.1c.7-.3 1.4.2 1.2 1l-2.7 12.6c-.2.9-.7 1.1-1.5.7l-4.1-3-2 1.9c-.2.2-.4.4-.8.4l.3-4.2 7.6-6.9c.3-.3-.1-.5-.5-.2l-9.4 5.9-4.1-1.3c-.9-.3-.9-.9.2-1.3z\" fill=\"%23ffffff\"/></svg>", "easypay.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23eb2328\"/><text x=\"16\" y=\"22\" font-size=\"13\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">EP</text></svg>", "ipay.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300529b\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">iPay</text></svg>", "city24.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300b0ff\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">C24</text></svg>", "portmone.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ef4444\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">P</text></svg>", "yasno.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ffcc00\"/><path d=\"M16 6l2.5 5.5L24 14l-4 4.5L21 24l-5-3-5 3 1-5.5-4-4.5 5.5-2.5z\" fill=\"%23111827\"/></svg>", "grmu.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 8c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23facc15\"/></svg>", "vodokanal.kiev.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 7c-3.5 5-7 8.5-7 12a7 7 0 0 0 14 0c0-3.5-3.5-7-7-12z\" fill=\"%23ffffff\"/></svg>", "gerc.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><text x=\"16\" y=\"22\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГЕРЦ</text></svg>", "kte.kmda.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><path d=\"M16 6c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23fef08a\"/></svg>", "portal.pfu.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"22\" font-size=\"12\" font-weight=\"900\" fill=\"%23ffd700\" text-anchor=\"middle\" font-family=\"sans-serif\">ПФУ</text></svg>", "diia.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"22\" font-size=\"14\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">дія</text></svg>", "cabinet.tax.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ДПС</text></svg>", "eq.hsc.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e3a8a\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">МВС</text></svg>", "gioc.kiev.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГІОЦ</text></svg>", "mydimonline.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><path d=\"M16 8l8 7v9h-5v-6h-6v6h-5v-9z\" fill=\"%23ffffff\"/></svg>", "infoxvod.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 6c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z\" fill=\"%23ffffff\"/></svg>", "novakom.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">НОВАКОМ</text></svg>", "bankchart.com.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23059669\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">BC</text></svg>", "lycamobile.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300a859\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">Lyca</text></svg>", "cc.ukrtele.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "ukrtele.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "ukrtelecom.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "www.ukrtelecom.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "my.ukrtelecom.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">УТК</text></svg>", "vodokanal.kyiv.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M16 7c-3.5 5-7 8.5-7 12a7 7 0 0 0 14 0c0-3.5-3.5-7-7-12z\" fill=\"%23ffffff\"/></svg>", "gioc.kyivcity.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ГІОЦ</text></svg>", "e-driver.mvs.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e3a8a\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">МВС</text></svg>", "mydim.online": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2316a34a\"/><path d=\"M16 8l8 7v9h-5v-6h-6v6h-5v-9z\" fill=\"%23ffffff\"/></svg>", "mail.google.com": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%234285F4' d='M2 8v10c0 1.1.9 2 2 2h2V9.5L2 6.5z'/><path fill='%2334A853' d='M22 8v10c0 1.1-.9 2-2 2h-2V9.5l4-3z'/><path fill='%23FBBC04' d='M2 8c0-1.1.9-2 2-2h2v3.5L2 6.5z'/><path fill='%23C5221F' d='M22 8c0-1.1-.9-2-2-2h-2v3.5l4-3z'/><path fill='%23EA4335' d='M12 14l8-6.5V6c0-.83-.8-1.4-1.5-.9L12 9.5 5.5 5.1C4.8 4.6 4 5.17 4 6v1.5l8 6.5z'/></svg>", "gmail.com": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%234285F4' d='M2 8v10c0 1.1.9 2 2 2h2V9.5L2 6.5z'/><path fill='%2334A853' d='M22 8v10c0 1.1-.9 2-2 2h-2V9.5l4-3z'/><path fill='%23FBBC04' d='M2 8c0-1.1.9-2 2-2h2v3.5L2 6.5z'/><path fill='%23C5221F' d='M22 8c0-1.1-.9-2-2-2h-2v3.5l4-3z'/><path fill='%23EA4335' d='M12 14l8-6.5V6c0-.83-.8-1.4-1.5-.9L12 9.5 5.5 5.1C4.8 4.6 4 5.17 4 6v1.5l8 6.5z'/></svg>", "subsidii.ioc.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"bold\" fill=\"%23ffd700\" text-anchor=\"middle\" font-family=\"sans-serif\">СУБС</text></svg>", "protonvpn.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%236d4aff\"/><path d=\"M16 6l9 4v7c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V10l9-4z\" fill=\"%23ffffff\"/><path d=\"M16 11l5 2.5v4.5c0 3.1-2.1 6-5 6.7-2.9-.7-5-3.6-5-6.7v-4.5l5-2.5z\" fill=\"%236d4aff\"/></svg>", "windscribe.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231a2b4c\"/><path d=\"M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6\" stroke=\"%2300b0ff\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M8 14c0-4.4 3.6-8 8-8s8 3.6 8 8\" stroke=\"%2300b0ff\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"20\" r=\"2.5\" fill=\"%2300b0ff\"/></svg>", "upchart.in": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M7 23l5-6 5 3 8-10\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20 10h5v5\" stroke=\"%2322c55e\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><rect x=\"8\" y=\"19\" width=\"3\" height=\"5\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"13\" y=\"16\" width=\"3\" height=\"8\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"18\" y=\"13\" width=\"3\" height=\"11\" fill=\"%23ffffff\" opacity=\"0.7\"/><rect x=\"23\" y=\"9\" width=\"3\" height=\"15\" fill=\"%23ffffff\" opacity=\"0.9\"/></svg>", "khartiia.org": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2315803d\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ХАРТІЯ</text></svg>", "koloua.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><circle cx=\"16\" cy=\"16\" r=\"9\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"/></svg>", "vodafone.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23e60000\"/><path d=\"M16 7c-4.4 0-8 3.6-8 8 0 5.5 5 10 8 12 3-2 8-6.5 8-12 0-4.4-3.6-8-8-8zm0 11.5c-2 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z\" fill=\"%23ffffff\"/></svg>", "www.vodafone.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23e60000\"/><path d=\"M16 7c-4.4 0-8 3.6-8 8 0 5.5 5 10 8 12 3-2 8-6.5 8-12 0-4.4-3.6-8-8-8zm0 11.5c-2 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z\" fill=\"%23ffffff\"/></svg>", "kyivstar.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><path d=\"M16 5l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z\" fill=\"%23ffffff\"/></svg>", "www.kyivstar.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><path d=\"M16 5l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z\" fill=\"%23ffffff\"/></svg>", "lifecell.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23ffc800\"/><circle cx=\"16\" cy=\"16\" r=\"6\" fill=\"%23e30613\"/><path d=\"M16 7v6M23 11l-5 3M23 21l-5-3M16 25v-6M9 21l5-3M9 11l5 3\" stroke=\"%23003b7a\" stroke-width=\"2.5\" stroke-linecap=\"round\"/></svg>", "www.lifecell.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23ffc800\"/><circle cx=\"16\" cy=\"16\" r=\"6\" fill=\"%23e30613\"/><path d=\"M16 7v6M23 11l-5 3M23 21l-5-3M16 25v-6M9 21l5-3M9 11l5 3\" stroke=\"%23003b7a\" stroke-width=\"2.5\" stroke-linecap=\"round\"/></svg>", "3mob.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230072bc\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">3Mob</text></svg>", "www.3mob.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230072bc\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">3Mob</text></svg>", "volia.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">VOLIA</text></svg>", "www.volia.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><text x=\"16\" y=\"21\" font-size=\"10\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">VOLIA</text></svg>", "hitfm.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e60000\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ХІТ FM</text></svg>", "www.hitfm.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e60000\"/><text x=\"16\" y=\"21\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ХІТ FM</text></svg>", "pfu.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><circle cx=\"16\" cy=\"12\" r=\"7\" fill=\"%230a4c95\" stroke=\"%23ffd700\" stroke-width=\"1.5\"/><path d=\"M16 7.5v6M14 9.5c0 2 2 3 2 3s2-1 2-3M13 8.5v3M19 8.5v3\" stroke=\"%23ffd700\" stroke-width=\"1.2\" stroke-linecap=\"round\" fill=\"none\"/><text x=\"16\" y=\"27\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffd700\" text-anchor=\"middle\" font-family=\"sans-serif\">ПФУ</text></svg>", "minjust.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230d2346\"/><path d=\"M16 6v19M11 25h10\" stroke=\"%23f59e0b\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M9 11l7-2 7 2\" stroke=\"%23f59e0b\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M9 11l-3 6h6l-3-6zM23 11l-3 6h6l-3-6z\" fill=\"%23fbbf24\" stroke=\"%23f59e0b\" stroke-width=\"1\"/><circle cx=\"16\" cy=\"7\" r=\"1.5\" fill=\"%23ffd700\"/></svg>", "minagro.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2315803d\"/><path d=\"M16 26V8\" stroke=\"%23fde047\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M16 8c-2-3 0-5 0-5s2 2 0 5zM16 12c-3-2-5 0-5 0s2 3 5 0zM16 12c3-2 5 0 5 0s-2 3-5 0zM16 16c-3-2-5 0-5 0s2 3 5 0zM16 16c3-2 5 0 5 0s-2 3-5 0zM16 20c-3-2-5 0-5 0s2 3 5 0zM16 20c3-2 5 0 5 0s-2 3-5 0z\" fill=\"%23facc15\"/></svg>", "drs.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2300458b\"/><path d=\"M16 5l8 4v7c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V9l8-4z\" fill=\"%230284c7\" stroke=\"%23ffd700\" stroke-width=\"1.5\"/><path d=\"M16 8.5v5M14 10c0 1.5 2 2.5 2 2.5s2-1 2-2.5\" stroke=\"%23ffd700\" stroke-width=\"1.2\" stroke-linecap=\"round\" fill=\"none\"/><text x=\"16\" y=\"23\" font-size=\"7\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">ДРС</text></svg>", "ukrstat.gov.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><rect x=\"7\" y=\"18\" width=\"4\" height=\"8\" rx=\"1\" fill=\"%2338bdf8\"/><rect x=\"12\" y=\"14\" width=\"4\" height=\"12\" rx=\"1\" fill=\"%23facc15\"/><rect x=\"17\" y=\"10\" width=\"4\" height=\"16\" rx=\"1\" fill=\"%2322c55e\"/><rect x=\"22\" y=\"6\" width=\"4\" height=\"20\" rx=\"1\" fill=\"%23ec4899\"/><path d=\"M7 16l5-4 5 3 6-7\" stroke=\"%23ffffff\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/><circle cx=\"23\" cy=\"8\" r=\"1.5\" fill=\"%23ffffff\"/></svg>", "audioreads.org": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><path d=\"M8 22c3-1 6-1 8 1 2-2 5-2 8-1v-9c-3-1-6-1-8 1-2-2-5-2-8-1v9z\" fill=\"%23ffffff\"/><path d=\"M10 13a7 7 0 0 1 12 0\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"9\" cy=\"14\" r=\"2\" fill=\"%23ffffff\"/><circle cx=\"23\" cy=\"14\" r=\"2\" fill=\"%23ffffff\"/></svg>", "dimonline.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M6 16l10-8 10 8v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9z\" fill=\"%23ffffff\"/><path d=\"M13 27v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6\" fill=\"%230284c7\"/><circle cx=\"16\" cy=\"13\" r=\"2\" fill=\"%2310b981\"/><path d=\"M21 7a5 5 0 0 1 4 4\" stroke=\"%23facc15\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/></svg>", "ubki.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230a2540\"/><path d=\"M16 5l9 3.5v7.5c0 5.5-3.8 10-9 11.5-5.2-1.5-9-6-9-11.5V8.5L16 5z\" fill=\"%230e3a6c\" stroke=\"%2310b981\" stroke-width=\"1.5\"/><path d=\"M12 16l3 3 6-7\" stroke=\"%2310b981\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>", "herewallet.app": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff4d2e\"/><circle cx=\"16\" cy=\"16\" r=\"8\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"4\" fill=\"%23ff4d2e\"/><circle cx=\"17.5\" cy=\"14.5\" r=\"1.5\" fill=\"%23ffffff\"/></svg>", "neteller.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%238dc63f\"/><path d=\"M9 8h4.5l5.5 9.5V8H23v16h-4.5L13 14.5V24H9V8z\" fill=\"%23ffffff\"/></svg>", "aboutyou.ua": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23111111\"/><circle cx=\"16\" cy=\"16\" r=\"12\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"2\"/><text x=\"16\" y=\"21\" font-size=\"11\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">AY</text></svg>", "sinsay.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><text x=\"16\" y=\"14\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">sin</text><text x=\"16\" y=\"23\" font-size=\"9\" font-weight=\"900\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">say</text></svg>", "correctarium.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea2b49\"/><path d=\"M21 11a7 7 0 1 0 0 10\" stroke=\"%23ffffff\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M18 16l2 2 4-4\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>", "flightradar24.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%231e293b\"/><circle cx=\"16\" cy=\"16\" r=\"11\" fill=\"none\" stroke=\"%23facc15\" stroke-width=\"1\" opacity=\"0.4\"/><circle cx=\"16\" cy=\"16\" r=\"6\" fill=\"none\" stroke=\"%23facc15\" stroke-width=\"1\" opacity=\"0.6\"/><path d=\"M16 8v16M8 16h16\" stroke=\"%23facc15\" stroke-width=\"1\" opacity=\"0.3\"/><path d=\"M16 10l2 4 4 1-4 1-1 4-1-4-4-1 4-1 0-4z\" fill=\"%23ffd700\"/></svg>", "communal.local": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><path d=\"M7 16l9-7 9 7v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9z\" fill=\"%23ffffff\"/><path d=\"M14 17l-2 3h3l-1 4 4-5h-3l2-2h-3z\" fill=\"%23facc15\"/><path d=\"M18 19c0 1.5 1 2.5 2 2.5s2-1 2-2.5c0-1-2-3-2-3s-2 2-2 3z\" fill=\"%2338bdf8\"/></svg>", "copilot.microsoft.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M10 20c-2.2 0-4-1.8-4-4s1.8-4 4-4c1.5 0 2.8.8 3.5 2h5c.7-1.2 2-2 3.5-2 2.2 0 4 1.8 4 4s-1.8 4-4 4h-8z\" fill=\"none\" stroke=\"%2338bdf8\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><path d=\"M8 16c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm12 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z\" fill=\"%23ec4899\"/><circle cx=\"16\" cy=\"16\" r=\"2.5\" fill=\"%23facc15\"/></svg>", "adobe.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ed2224\"/><path d=\"M7 7h18v18H7z\" fill=\"none\"/><path d=\"M19.5 9h5L17.8 24h-3.6L19.5 9zM12.5 9H7.5L14.2 24h3.6L12.5 9zM13.7 17.5l-2.2 5.5h6.2L16 17.5h-2.3z\" fill=\"%23ffffff\"/></svg>", "get.adobe.com": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ed2224\"/><path d=\"M7 7h18v18H7z\" fill=\"none\"/><path d=\"M19.5 9h5L17.8 24h-3.6L19.5 9zM12.5 9H7.5L14.2 24h3.6L12.5 9zM13.7 17.5l-2.2 5.5h6.2L16 17.5h-2.3z\" fill=\"%23ffffff\"/></svg>"};












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

  const fixFavicon = (img) => {
    if (!img) return;
    const parentA = img.closest ? img.closest("a") : null;
    if (parentA) {
      const hrefAttr = parentA.getAttribute("href") || "";
      if (hrefAttr.includes("CHANGELOG.md")) {
        img.src = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23007bff\"/><path d=\"M9 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V8z\" fill=\"%23ffffff\"/><path d=\"M13 11h6M13 15h6M13 19h4\" stroke=\"%23007bff\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>";
        return;
      }
      if (hrefAttr.includes("communal.html") || (parentA.href && parentA.href.includes("communal.html"))) {
        if (base64Favicons["communal.local"]) {
          img.src = base64Favicons["communal.local"];
          return;
        }
      }
      if (parentA.href && (parentA.href.includes("pfu_otd") || parentA.href.includes("pfu.gov.ua"))) {
        if (base64Favicons["pfu.gov.ua"]) {
          img.src = base64Favicons["pfu.gov.ua"];
          return;
        }
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

    if (base64Favicons[domain]) {
      img.src = base64Favicons[domain];
      return;
    }

    if (domainAliases[domain]) {
      const alias = domainAliases[domain];
      if (base64Favicons[alias]) {
        img.src = base64Favicons[alias];
        return;
      } else {
        img.src = "https://www.google.com/s2/favicons?domain=" + alias + "&sz=32";
        return;
      }
    }

    // Match subdomain fallback (e.g. portal.pfu.gov.ua -> pfu.gov.ua)
    for (const key of Object.keys(base64Favicons)) {
      if (domain.endsWith("." + key)) {
        img.src = base64Favicons[key];
        return;
      }
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
          <div class="group-title">
            <span class="badge badge-recommend">Партнери Сайту</span>
            <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" class="group-add-btn" title="Вільне Місце. Добавте свій сайт, магазин, сервіс, тощо (посилання і опис)."><i class="fas fa-plus"></i></a>
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
            <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" class="group-add-btn" title="Вільне Місце. Добавте свій сайт, магазин, сервіс, тощо (посилання і опис)."><i class="fas fa-plus"></i></a>
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
      addBtn.title = 'Вільне Місце. Добавте свій сайт, магазин, сервіс, тощо (посилання і опис).';
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

  // === 2. НИЖНІЙ МУЛЬТИПЛЕКС ПЕРЕД ФУТЕРОМ (На всіх сторінках, окрім Головної, і тільки для ПК екранів >= 1230px) ===
  if (!isHomepage && screenWidth >= 1230) {
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

  // === 3. ВПРОВАДЖЕННЯ МОБІЛЬНИХ IN-FEED РЕКЛАМНИХ БЛОКІВ МІЖ КАРТКАМИ (Тільки для мобільних екранів < 1230px) ===
  if (screenWidth < 1230) {
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
      isActive: now >= start,
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

  const isActive = now >= start && now <= end;
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

  if (unread) {
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
          <div id="announcementsContentContainer">
            ${renderAnnouncementsCardsHtml()}
          </div>
          <div class="text-center pt-2 pb-1">
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
          <h5 class="cl-modal-title"><i class="fas fa-info-circle text-primary"></i> Умовні позначки</h5>
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
                  <span class="rec-beacon-dot" style="margin: 0; display: inline-block;"></span>
                </div>
                <div class="badges-legend-title">Рекомендовано сайтом (Редакція)</div>
              </div>
              <p class="badges-legend-desc">Особливо якісні, перевірені та надійні ресурси, відзначені редакцією нашого каталогу (індикатор розташований наприкінці назви посилання).</p>
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

            <!-- 2. Вільне Місце (+) Додати свій сайт -->
            <div class="badges-legend-item">
              <div class="badges-legend-header">
                <div class="badges-legend-preview" title="Вільне Місце — Додати сайт">
                  <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" class="badges-legend-add-btn" title="Вільне Місце. Добавте свій сайт, магазин, сервіс, тощо"><i class="fas fa-plus"></i></a>
                </div>
                <div class="badges-legend-title">Кнопка «+» (Вільне Місце)</div>
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
  basePriceUah: 100,           // Стандартна БВ для звичайних розділів (100 грн/міс)
  commercialBasePriceUah: 150, // Підвищена БВ для комерційних розділів (150 грн/міс)
  commercialSections: ["Ринок", "Магазини", "Банкінг", "AI"], // Комерційні розділи з високою віддачею
  usdRate: 41.5,               // Орієнтовний курс перерахунку для еквівалента USDT
  cryptoDiscountPercent: 10,   // Постійна знижка 10% при оплаті криптовалютою
  
  // Множники вартості згідно з правилами та зонами сайту
  multipliers: {
    home_vip: 7,     // Головна -> Партнери Сайту (VIP): БВ × 7 = 700 грн/міс
    section_vip: 3,  // Інші розділи -> Партнери Розділу (VIP): БВ × 3 = 300 грн/міс
    home_top: 4,     // Головна -> Вгорі картки: БВ × 4 = 400 грн/міс
    home_bottom: 2,  // Головна -> Внизу картки: БВ × 2 = 200 грн/міс
    other_top: 2,    // Інші розділи -> Вгорі картки: БВ × 2 = 200 грн/міс
    other_bottom: 1  // Інші розділи -> Внизу картки: БВ × 1 = 100 грн/міс
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
      { id: "usdt_trc20", name: "USDT (TRC-20 - Tron)", address: "TZ3cHFT4T5Sv6FruDQsonJvykPLoTLHje2", badge: "⚡ Рекомендовано (низька комісія)" },
      { id: "usdt_bep20", name: "USDT / USDC (BEP-20 - BNB Chain)", address: "0x40C7AC3d39913606f854dF40d8386bbF2b22D87B", badge: "Низька комісія" },
      { id: "ton", name: "TON / USDT (The Open Network)", address: "UQBv5ZgXlNl6eyCGs4q-COY9ya_RTdOdeAmpm2j3oLEaG3cq", badge: "Швидко" },
      { id: "sol", name: "SOL / USDT (Solana)", address: "2tRrdkzJfHyRocQvqDpzGAc56vuKZQW2Jpb5imaT8EH5", badge: "Швидко" },
      { id: "btc", name: "BTC (Bitcoin)", address: "bc1q2pxyrsx7z3d7dc83k880mujmlpqykg7hmsrkqa", badge: "Native SegWit" },
      { id: "eth", name: "ETH (Ethereum / Arbitrum / Polygon / Base)", address: "0x40C7AC3d39913606f854dF40d8386bbF2b22D87B", badge: "EVM" },
      { id: "doge", name: "DOGE (Dogecoin)", address: "DDy3sfatTConkRUQ1vdwGW1joM1JXUYLn3", badge: "Dogecoin" },
      { id: "ltc", name: "LTC (Litecoin)", address: "ltc1qtfaehd4errc3rzpuusne2kd4zu9r7y9hsvc6xt", badge: "Litecoin" },
      { id: "xrp", name: "XRP (Ripple)", address: "rBCqF1MT8B3pEn1MG3FZPg2em97fZ2ZvC6", badge: "Ripple" },
      { id: "near", name: "NEAR (Near Protocol)", address: "weber515sis.near", badge: "NEAR" },
      { id: "atom", name: "ATOM (Cosmos)", address: "cosmos1wz8jr4j9w83vpvxrlgh9uhn2n4e7u3ttevn8ag", badge: "Cosmos" }
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
  if (AD_CONFIG.commercialSections && AD_CONFIG.commercialSections.includes(section)) {
    return AD_CONFIG.commercialBasePriceUah; // 150 грн/міс для комерційних розділів
  }
  return AD_CONFIG.basePriceUah; // 100 грн/міс для стандартних розділів
}

function getSinglePlacementRate(sec, crd, loc) {
  const isHome = sec === 'Головна';
  const isVip = (crd && (crd.includes('Партнери') || crd.includes('Рекомендаці'))) || loc === 'vip' || (loc && loc.startsWith('vip'));
  const baseRate = getSectionBasePrice(sec);

  if (isVip) {
    return isHome ? 700 : (baseRate * 3);
  }
  if (isHome) {
    return loc === 'top' 
      ? (AD_CONFIG.basePriceUah * AD_CONFIG.multipliers.home_top) // 400 грн
      : (AD_CONFIG.basePriceUah * AD_CONFIG.multipliers.home_bottom); // 200 грн
  }
  return loc === 'top' 
    ? (baseRate * AD_CONFIG.multipliers.other_top) // 200 грн (комерційний 300 грн)
    : (baseRate * AD_CONFIG.multipliers.other_bottom); // 100 грн (комерційний 150 грн)
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
          <h5 class="cl-modal-title"><i class="fas fa-bullhorn text-primary"></i> Додати сайт</h5>
        </div>
        <div class="cl-modal-body ad-modal-body">
          
          <!-- КРОК 1: ФОРМА ЗАПОВНЕННЯ ТА КАЛЬКУЛЯТОР -->
          <div id="adStep1">
            
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
                        <i class="fas fa-gem text-warning me-1"></i> <strong>Додати в «Партнери Сайту»</strong>
                      </span>
                      <span class="ad-partner-addon-price" id="adPartnerAddon1Price">700 грн/міс</span>
                    </span>
                  </label>
                </div>

                <!-- Чекбокс активації тематичної картки для Розділу 1 -->
                <div class="ad-thematic-addon-wrap" id="adThematicAddon1Wrap">
                  <label class="ad-thematic-addon-label" for="adThematic1Checkbox">
                    <input type="checkbox" id="adThematic1Checkbox" class="ad-thematic-checkbox" checked>
                    <span class="ad-thematic-addon-content">
                      <span class="ad-thematic-addon-text">
                        <i class="fas fa-th-list text-primary me-1"></i> <strong>Додати в тематичну картку</strong>
                      </span>
                      <span class="ad-thematic-addon-price" id="adThematic1PriceBadge">від 200 грн/міс</span>
                    </span>
                  </label>
                </div>

                <!-- Поля вибору тематичної картки (активні лише коли увімкнено чекбокс вище) -->
                <div class="ad-form-grid-2" id="adThematic1FieldsBox">
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

              <!-- Кнопка додавання другої локації -->
              <div class="ad-add-slot-wrapper" id="adAddSlot2Wrapper">
                <button type="button" id="adAddSlot2Btn" class="ad-add-slot-btn">
                  <i class="fas fa-plus-circle me-1"></i> Додати ще одну локацію (до 2 місць)
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
                    <i class="fas fa-times me-1"></i> Прибрати
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
                        <i class="fas fa-fire text-danger me-1"></i> <strong>Додати в «Партнери Розділу»</strong>
                      </span>
                      <span class="ad-partner-addon-price" id="adPartnerAddon2Price">300 грн/міс</span>
                    </span>
                  </label>
                </div>

                <!-- Чекбокс активації тематичної картки для Розділу 2 -->
                <div class="ad-thematic-addon-wrap" id="adThematicAddon2Wrap">
                  <label class="ad-thematic-addon-label" for="adThematic2Checkbox">
                    <input type="checkbox" id="adThematic2Checkbox" class="ad-thematic-checkbox" checked>
                    <span class="ad-thematic-addon-content">
                      <span class="ad-thematic-addon-text">
                        <i class="fas fa-th-list text-primary me-1"></i> <strong>Додати в тематичну картку</strong>
                      </span>
                      <span class="ad-thematic-addon-price" id="adThematic2PriceBadge">від 200 грн/міс</span>
                    </span>
                  </label>
                </div>

                <!-- Поля вибору тематичної картки (активні лише коли увімкнено чекбокс вище) -->
                <div class="ad-form-grid-2" id="adThematic2FieldsBox">
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
                <div class="ad-preview-header"><i class="fas fa-eye"></i> Живий приклад (як виглядатиме на сайті):</div>
                <div class="ad-preview-item">
                  <img id="adPreviewFavicon" class="ad-preview-favicon" src="favicon.ico" alt="icon">
                  <div class="ad-preview-content">
                    <div class="ad-preview-title">
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
                  <div class="ad-payment-icon" style="color: #1e293b;">⚫</div>
                  <div class="ad-payment-text">
                    <div class="ad-payment-name">Монобанк</div>
                    <div class="ad-payment-sub">Банка / Apple & Google Pay</div>
                  </div>
                </label>

                <label class="ad-payment-option" data-method="privat">
                  <input type="radio" name="adPaymentMethod" value="privat">
                  <div class="ad-payment-icon" style="color: #16a34a;">🟢</div>
                  <div class="ad-payment-text">
                    <div class="ad-payment-name">ПриватБанк</div>
                    <div class="ad-payment-sub">Конверт / Приват24</div>
                  </div>
                </label>

                <label class="ad-payment-option" data-method="crypto">
                  <input type="radio" name="adPaymentMethod" value="crypto">
                  <div class="ad-payment-icon" style="color: #0284c7;">💎</div>
                  <div class="ad-payment-text">
                    <div class="ad-payment-name">Криптовалюта <span class="ad-discount-badge">-10%</span></div>
                    <div class="ad-payment-sub">USDT, BTC, TON, SOL тощо</div>
                  </div>
                </label>
              </div>

              <!-- Підсумковий калькулятор -->
              <div class="ad-calc-summary">
                <div class="ad-calc-row">
                  <span>Базовий тариф:</span>
                  <span id="adCalcBaseRate">100 грн / міс</span>
                </div>
                <div class="ad-calc-row">
                  <span>Обраний період:</span>
                  <span id="adCalcPeriod">1 міс.</span>
                </div>
                <div class="ad-calc-row discount-row" id="adCalcTermDiscountRow" style="display:none;">
                  <span>Знижка за тривалість:</span>
                  <span id="adCalcTermDiscountVal">-0 грн</span>
                </div>
                <div class="ad-calc-row discount-row" id="adCalcPromoDiscountRow" style="display:none;">
                  <span>Знижка за промокодом:</span>
                  <span id="adCalcPromoDiscountVal">-0 грн</span>
                </div>
                <div class="ad-calc-row discount-row" id="adCalcCryptoDiscountRow" style="display:none;">
                  <span>Знижка за оплату криптовалютою (-10%):</span>
                  <span id="adCalcCryptoDiscountVal">-0 грн</span>
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
                <span class="ad-sticky-price-title"><i class="fas fa-coins text-warning me-1"></i> До сплати:</span>
                <span class="ad-sticky-price-uah" id="adStickyPriceUah">100 грн</span>
                <span class="ad-sticky-price-usdt" id="adStickyPriceUsdt">(~ $2.41 USDT)</span>
              </div>
              <div class="ad-sticky-price-right">
                <span class="ad-sticky-badge" id="adStickyTariffBadge">100 грн/міс</span>
                <span class="ad-discount-badge" id="adStickyDiscountBadge" style="display:none;">-10%</span>
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
              <div class="ad-order-success-title"><i class="fas fa-check-circle"></i> Замовлення успішно сформовано!</div>
              <div>Номер Вашого замовлення:</div>
              <div class="ad-order-id-display" id="adSuccessOrderId">#TZ-000000-0000</div>
            </div>

            <!-- Таблиця чека -->
            <div class="ad-section-block">
              <div class="ad-block-title"><i class="fas fa-file-invoice text-primary"></i> Деталі Вашого розміщення</div>
              <table class="ad-receipt-table">
                <tbody>
                  <tr><td>Ресурс:</td><td id="adRecSite"></td></tr>
                  <tr><td>Розташування:</td><td id="adRecPlacement"></td></tr>
                  <tr><td>Термін:</td><td id="adRecTerm"></td></tr>
                  <tr><td>Контакт клієнта:</td><td id="adRecContact"></td></tr>
                  <tr style="border-top: 1.5px solid var(--border-color, #cbd5e1);">
                    <td style="font-weight: 700; font-size: 1rem;">Сума до сплати:</td>
                    <td id="adRecAmount" style="font-size: 1.15rem; color: #2563eb; font-weight: 800;"></td>
                  </tr>
                </tbody>
              </table>
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
              <a href="#" id="adActionTgBtn" target="_blank" class="ad-action-btn ad-btn-tg">
                <i class="fab fa-telegram-plane"></i> Написати в Telegram @WeberSIS
              </a>
              <button type="button" id="adActionCopyBtn" class="ad-action-btn ad-btn-copy-all">
                <i class="fas fa-copy"></i> Скопіювати текст замовлення
              </button>
              <a href="#" id="adActionEmailBtn" class="ad-action-btn ad-btn-email">
                <i class="far fa-envelope"></i> Надіслати на Email
              </a>
              <button type="button" id="adActionBackBtn" class="ad-action-btn ad-btn-back">
                <i class="fas fa-arrow-left"></i> Змінити замовлення
              </button>
            </div>

            <div class="ad-legal-iban-note">
              Потрібен офіційний рахунок IBAN або договір для юридичних осіб / ФОП? Зв'яжіться з адміністратором у Telegram <a href="https://t.me/WeberSIS" target="_blank">@WeberSIS</a> або поштою <a href="mailto:weber515sis@gmail.com">weber515sis@gmail.com</a>.
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

    // Кнопка копіювання тексту замовлення
    document.getElementById('adActionCopyBtn').addEventListener('click', () => {
      if (window.currentAdOrderText) {
        copyToClipboard(window.currentAdOrderText, document.getElementById('adActionCopyBtn'), 'Скопійовано! ✅');
      }
    });
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
  const isHome = section === 'Головна';
  const baseRate = getSectionBasePrice(section);

  const curVal = locSelect.value || 'bottom';
  locSelect.innerHTML = '';
  locSelect.disabled = false;

  const topPrice = isHome 
    ? AD_CONFIG.basePriceUah * AD_CONFIG.multipliers.home_top 
    : baseRate * AD_CONFIG.multipliers.other_top;
  const bottomPrice = isHome 
    ? AD_CONFIG.basePriceUah * AD_CONFIG.multipliers.home_bottom 
    : baseRate * AD_CONFIG.multipliers.other_bottom;

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
  const isHome = section === 'Головна';
  const baseRate = getSectionBasePrice(section);

  const curVal = locSelect.value || 'bottom';
  locSelect.innerHTML = '';
  locSelect.disabled = false;

  const topPrice = isHome 
    ? AD_CONFIG.basePriceUah * AD_CONFIG.multipliers.home_top 
    : baseRate * AD_CONFIG.multipliers.other_top;
  const bottomPrice = isHome 
    ? AD_CONFIG.basePriceUah * AD_CONFIG.multipliers.home_bottom 
    : baseRate * AD_CONFIG.multipliers.other_bottom;

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
  const baseRate = getSectionBasePrice(section);

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

  if (isHome) {
    textEl.innerHTML = `<i class="fas fa-gem text-warning me-1"></i> <strong>Додати в «Партнери Сайту»</strong>`;
    priceEl.textContent = `700 грн/міс`;
  } else {
    const rate = baseRate * 3;
    textEl.innerHTML = `<i class="fas fa-fire text-danger me-1"></i> <strong>Додати в «Партнери Розділу»</strong> (${section})`;
    priceEl.textContent = `${rate} грн/міс`;
  }
}

// Оновлення блоку тематичної картки
function updateThematicAddon(slotNum) {
  const isSlot1 = slotNum === 1;
  const secSelect = document.getElementById(isSlot1 ? 'adSectionSelect' : 'adSlot2SectionSelect');
  const section = secSelect ? secSelect.value : 'Головна';
  const isHome = section === 'Головна';
  const baseRate = getSectionBasePrice(section);
  const bottomPrice = isHome ? (AD_CONFIG.basePriceUah * AD_CONFIG.multipliers.home_bottom) : (baseRate * AD_CONFIG.multipliers.other_bottom);

  const priceBadge = document.getElementById(isSlot1 ? 'adThematic1PriceBadge' : 'adThematic2PriceBadge');
  if (priceBadge) {
    priceBadge.textContent = `від ${bottomPrice} грн/міс`;
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
  const placementDetails = p.placements.map(pl => `${pl.card} (${pl.monthlyRate} грн)`).join(' + ');
  if (p.count === 0) {
    document.getElementById('adCalcBaseRate').textContent = '0 грн / міс (оберіть розміщення)';
  } else if (p.isForever) {
    document.getElementById('adCalcBaseRate').textContent = `${p.monthlyRate} грн / міс (${p.count} місць: ${placementDetails}; розрахунок як 10 років = ${p.baseCost} грн)`;
  } else {
    document.getElementById('adCalcBaseRate').textContent = `${p.monthlyRate} грн / міс` + (p.count > 1 ? ` (${p.count} місць: ${placementDetails})` : (p.isVip ? ' (VIP)' : ''));
  }
  document.getElementById('adCalcPeriod').textContent = p.termLabel;

  // Відображення плашки гарантії для тарифів від 3 років та Назавжди
  const guaranteeNotice = document.getElementById('adGuaranteeNotice');
  if (guaranteeNotice) {
    guaranteeNotice.style.display = p.hasGuarantee ? 'flex' : 'none';
  }

  const termRow = document.getElementById('adCalcTermDiscountRow');
  if (p.termDiscountAmount > 0) {
    termRow.style.display = 'flex';
    document.getElementById('adCalcTermDiscountVal').textContent = `-${p.termDiscountAmount} грн (-${p.termDiscountPercent}%)`;
  } else {
    termRow.style.display = 'none';
  }

  const promoRow = document.getElementById('adCalcPromoDiscountRow');
  if (p.promoDiscountAmount > 0) {
    promoRow.style.display = 'flex';
    document.getElementById('adCalcPromoDiscountVal').textContent = `-${p.promoDiscountAmount} грн (-${p.promoDiscountPercent}%)`;
  } else {
    promoRow.style.display = 'none';
  }

  const cryptoRow = document.getElementById('adCalcCryptoDiscountRow');
  if (p.cryptoDiscountAmount > 0) {
    cryptoRow.style.display = 'flex';
    document.getElementById('adCalcCryptoDiscountVal').textContent = `-${p.cryptoDiscountAmount} грн (-10%)`;
  } else {
    cryptoRow.style.display = 'none';
  }

  document.getElementById('adCalcTotalUah').textContent = `${p.finalUah} грн`;
  document.getElementById('adCalcTotalUsdt').textContent = `~ $${p.finalUsdt} USDT`;

  // === ОНОВЛЕННЯ ПЛАВАЮЧОГО БАРУ ВАРТОСТІ ===
  const stickyUah = document.getElementById('adStickyPriceUah');
  const stickyUsdt = document.getElementById('adStickyPriceUsdt');
  const stickyTariff = document.getElementById('adStickyTariffBadge');
  const stickyDiscount = document.getElementById('adStickyDiscountBadge');

  if (stickyUah) {
    stickyUah.textContent = `${p.finalUah} грн`;
    stickyUah.classList.remove('price-flash');
    void stickyUah.offsetWidth;
    stickyUah.classList.add('price-flash');
    setTimeout(() => stickyUah.classList.remove('price-flash'), 300);
  }
  if (stickyUsdt) {
    stickyUsdt.textContent = `(~ $${p.finalUsdt} USDT)`;
  }
  if (stickyTariff) {
    if (p.count === 0) {
      stickyTariff.textContent = 'Оберіть місце';
    } else {
      const placesLabel = p.count === 1 ? '1 картка' : `${p.count} місця`;
      if (p.isForever) {
        stickyTariff.textContent = `Назавжди (${placesLabel}, -50%)`;
      } else {
        stickyTariff.textContent = `${p.monthlyRate} грн/міс (${placesLabel})`;
      }
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
  document.getElementById('adRecSite').innerHTML = `<strong>${name} ${primaryPlacement.badge.icon}</strong> (<a href="${url}" target="_blank">${url}</a>)`;
  
  let recPlacementHtml = '';
  placements.forEach((p, idx) => {
    recPlacementHtml += `<div><strong>${idx + 1}. ${p.badge.icon} ${p.section}:</strong> «${p.card}» (${p.locationLabel}) <span class="text-muted ms-1">[${p.monthlyRate} грн/міс]</span></div>`;
  });
  document.getElementById('adRecPlacement').innerHTML = recPlacementHtml;
  
  let recTermHtml = pricing.termLabel;
  if (pricing.hasGuarantee) {
    recTermHtml += `<br><span class="badge bg-success text-white" style="font-size:0.75rem;"><i class="fas fa-shield-alt"></i> Гарантія: 1 зміна URL/назви на рік</span>`;
  }
  document.getElementById('adRecTerm').innerHTML = recTermHtml;
  document.getElementById('adRecContact').textContent = `${email}${tg ? ' / ' + tg : ''}`;
  document.getElementById('adRecAmount').textContent = `${pricing.finalUah} грн (~ $${pricing.finalUsdt} USDT)`;

  // Генерація реквізитів
  renderRequisitesBox(paymentMethod, pricing, orderId);

  // Формування тексту для Telegram і копіювання
  let placementTgText = placements.map((p, idx) => `📍 Локація ${idx + 1}: ${p.badge.icon} ${p.section} > ${p.card} (${p.locationLabel}) [${p.monthlyRate} грн/міс]`).join('\n');
  const guaranteeTgText = pricing.hasGuarantee ? `\n🛡️ Гарантія: 1 безкоштовна зміна URL/назви на рік включена` : '';

  const orderSummaryText = 
`🔔 Замовлення на розміщення на ТОП ЗАКЛАДКИ:
🆔 Номер: #${orderId}
🔗 Ресурс: ${name} (${url})
📝 Опис: ${desc}
Кількість обраних місць: ${placements.length}
${placementTgText}
⏱️ Термін: ${pricing.termLabel}${guaranteeTgText}
💳 Оплата: ${paymentMethod === 'mono' ? 'Монобанк' : paymentMethod === 'privat' ? 'ПриватБанк' : 'Криптовалюта'}
💰 До сплати: ${pricing.finalUah} грн (~ $${pricing.finalUsdt} USDT)
📧 Контакти: ${email}${tg ? ' | ' + tg : ''}${phone ? ' | ' + phone : ''}
----------------------------------------
Надсилаю підтвердження замовлення.`;

  window.currentAdOrderText = orderSummaryText;

  // Посилання на Telegram
  const tgBtn = document.getElementById('adActionTgBtn');
  tgBtn.href = `https://t.me/WeberSIS?text=${encodeURIComponent(orderSummaryText)}`;

  // Посилання на Email
  const emailBtn = document.getElementById('adActionEmailBtn');
  emailBtn.href = `mailto:weber515sis@gmail.com?subject=${encodeURIComponent('Оплата замовлення #' + orderId)}&body=${encodeURIComponent(orderSummaryText)}`;

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
        <button type="button" class="ad-copy-btn" onclick="copyToClipboard('${mono.cardRaw}', this)"><i class="fas fa-copy"></i> Копіювати</button>
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
        <button type="button" class="ad-copy-btn" onclick="copyToClipboard('${privat.cardRaw}', this)"><i class="fas fa-copy"></i> Копіювати</button>
      </div>
    `;
  } else if (method === 'crypto') {
    const coins = AD_CONFIG.wallets.crypto;
    let coinsOptionsHtml = coins.map((c, i) => `<option value="${c.id}" ${i === 0 ? 'selected' : ''}>${c.name} ${c.badge ? ' - ' + c.badge : ''}</option>`).join('');
    
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

      <div class="ad-label" style="margin-bottom: 4px;">Адреса гаманця для переказу:</div>
      <div class="ad-copy-field">
        <span class="ad-copy-val" id="adCryptoAddressVal">${coins[0].address}</span>
        <button type="button" class="ad-copy-btn" id="adCryptoCopyBtn"><i class="fas fa-copy"></i> Копіювати</button>
      </div>
    `;

    const coinSelect = box.querySelector('#adCryptoCoinSelect');
    const addrVal = box.querySelector('#adCryptoAddressVal');
    const copyBtn = box.querySelector('#adCryptoCopyBtn');

    coinSelect.addEventListener('change', () => {
      const selected = coins.find(c => c.id === coinSelect.value) || coins[0];
      addrVal.textContent = selected.address;
    });

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
