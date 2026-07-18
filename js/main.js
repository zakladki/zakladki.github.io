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
      margin-right: 4px;
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
      groups.forEach((group, index) => {
        let adSlot = null;
        let adLayoutKey = null;

        if (index === totalGroups - 1) {
          // Після останньої карти: InFeed-Зображення вгорі (завжди розміщувати вкінці списку всіх карт)
          adSlot = '4285591871';
          adLayoutKey = '-6t+ed+2i-1n-4w';
        } else if (index === 0) {
          // Після 1-ї карти: InFeed-Лише Текст
          adSlot = '7702092709';
          adLayoutKey = '-gw-3+1f-3d+2z';
        } else if (index === 1) {
          // Після 2-ї карти: InFeed-Назва Вгорі
          adSlot = '5930414256';
          adLayoutKey = '-ef+6k-30-ac+ty';
        } else if (index === 2) {
          // Після 3-ї карти: InFeed-Зображення збоку
          adSlot = '5495299989';
          adLayoutKey = '-fb+5w+4e-db+86';
        }

        if (adSlot) {
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

