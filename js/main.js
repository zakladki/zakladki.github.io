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
  const base64Favicons = {"uaflix.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230f172a\"/><path d=\"M4 10c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V10z\" fill=\"%230057b7\"/><path d=\"M4 16h24v6c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4v-6z\" fill=\"%23ffd700\"/><polygon points=\"13,10 23,16 13,22\" fill=\"%23ffffff\"/></svg>","myradio.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ea580c\"/><circle cx=\"16\" cy=\"18\" r=\"5\" fill=\"%23ffffff\"/><path d=\"M9 11a10 10 0 0 1 14 0M12 14a6 6 0 0 1 8 0\" stroke=\"%23ffffff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"16\" cy=\"18\" r=\"2\" fill=\"%23ea580c\"/></svg>","abuk.com.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%234f46e5\"/><path d=\"M8 8h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H8V8z\" fill=\"%23ffffff\"/><path d=\"M24 8h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7V8z\" fill=\"%23e0e7ff\"/><path d=\"M16 12v12\" stroke=\"%234f46e5\" stroke-width=\"2\"/></svg>","podcasts.nv.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23dc2626\"/><rect x=\"13\" y=\"8\" width=\"6\" height=\"10\" rx=\"3\" fill=\"%23ffffff\"/><path d=\"M9 15a7 7 0 0 0 14 0M16 22v5M12 27h8\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>","kick.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23000000\"/><path d=\"M8 6h5v7.5L18.5 6H24l-6.5 8.5L24 26h-5.5l-5.5-8V26H8V6z\" fill=\"%2353fc18\"/></svg>","youtv.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230284c7\"/><rect x=\"5\" y=\"7\" width=\"22\" height=\"15\" rx=\"3\" fill=\"%23ffffff\"/><path d=\"M10 26h12M16 22v4\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\"/><polygon points=\"13,11 20,14.5 13,18\" fill=\"%230284c7\"/></svg>","tv.kyivstar.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%230057b7\"/><path d=\"M16 5l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z\" fill=\"%23ffffff\"/></svg>","radioplayer.ua":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23e11d48\"/><path d=\"M12 10l10 6-10 6V10z\" fill=\"%23ffffff\"/><circle cx=\"16\" cy=\"16\" r=\"12\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\"/></svg>","uakino.me":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23eab308\"/><path d=\"M12 9l11 7-11 7V9z\" fill=\"%23111827\"/></svg>","eneyida.tv":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%232563eb\"/><text x=\"16\" y=\"23\" font-size=\"20\" font-weight=\"bold\" fill=\"%23ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">E</text></svg>","uaserials.pro":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%239333ea\"/><rect x=\"6\" y=\"8\" width=\"20\" height=\"14\" rx=\"3\" fill=\"%23ffffff\"/><polygon points=\"13,11 20,15 13,19\" fill=\"%239333ea\"/></svg>","takflix.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%2318181b\"/><text x=\"16\" y=\"23\" font-size=\"20\" font-weight=\"bold\" fill=\"%23facc15\" text-anchor=\"middle\" font-family=\"sans-serif\">T</text></svg>","music.youtube.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%23ff0000\"/><circle cx=\"16\" cy=\"16\" r=\"10\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"2\"/><polygon points=\"13,11 21,16 13,21\" fill=\"%23ffffff\"/></svg>","open.spotify.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"%231ed760\"/><path d=\"M8 12c6-1.5 12-1 16 1.5M9 16c5-1.2 10-.8 14 1M11 20c4-1 8-.5 11 1\" stroke=\"%23ffffff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/></svg>","music.apple.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23fa2d48\"/><path d=\"M18 9v11a3 3 0 1 1-3-3h3V9z\" fill=\"%23ffffff\"/></svg>","soundcloud.com":"data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"%23ff5500\"/><path d=\"M8 20v-4M11 21v-7M14 22v-9M17 22v-11M20 22a4 4 0 0 0 0-8 5 5 0 0 0-5 3v5z\" stroke=\"%23ffffff\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>"};

  const domainAliases = {
  "webmail.meta.ua": "meta.ua",
  "mail.ukr.net": "ukr.net",
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
  "ukr.net": "ukr.net",
  "meta.ua": "meta.ua",
  "i.ua": "i.ua",
  "whatsapp.com": "whatsapp.com"
};

  const fixFavicon = (img) => {
    if (!img) return;
    let domain = "";
    const parentA = img.closest ? img.closest("a") : null;
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
  document.querySelectorAll('.group:not(.cat-recommendations) ul').forEach(ul => {
    if (!ul.children.length) return;
    
    const groupElement = ul.closest('.group');
    const badgeElement = groupElement ? groupElement.querySelector('.group-title span.badge') : null;
    const groupTitle = badgeElement ? badgeElement.textContent.trim() : '';

    const li = document.createElement('li');
    
    if (groupTitle === 'ТОП-Музика-Українська') {
      li.innerHTML = `
        <a href="https://www.youtube.com/@music-hitok-ua" target="_blank" title="ТОП провідник у світ сучасної української музики. Від легендарних хітів до найсвіжіших релізів молодих виконавців.">(YT) Music HitOK - UA</a>
      `;
    } else if (groupTitle === 'ТОП-Музика-Патріотична') {
      li.innerHTML = `
        <a href="https://www.youtube.com/@music-hitok-ua" target="_blank" title="Патріотичний провідник у світ сучасної української музики. Від легендарних хітів до найсвіжіших релізів молодих виконавців.">(YT) Music HitOK - UA</a>
      `;
    } else if (groupTitle === 'ТОП-Музика-WebSIS') {
      li.innerHTML = `
        <a href="https://www.youtube.com/@WebSIS_music" target="_blank" title="WebSIS - незалежний мультижанровий проєкт: український дух, експериментальний звук та сучасні технології.">(YT) WebSIS</a>
      `;
    } else {
      li.className = 'placeholder-ad-item';
      li.innerHTML = `
        <a href="https://docs.google.com/document/d/15S2XrUxYaj1uu68wtfqww3Gkqa-Lq2Ra-P20AHWqKgs" target="_blank" title="Тут може бути Ваше посилання і опис на Ваш сайт, магазин, сервіс, тощо. Контакти для розміщення — внизу сторінки."><span class="link-favicon" style="display: none;"></span><span class="placeholder-circle"></span><span class="placeholder-icon">➤</span>Вільне Місце</a>
      `;
    }
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
      } else if (path.includes('news.html') || path.includes('communal.html') || path.includes('shops.html') || path.includes('programs.html')) {
        // Новини / Комуналка / Магазини / Soft: InFeed-Зображення збоку
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

});

// 4. Функція швидкого плавного прокручування вгору
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

