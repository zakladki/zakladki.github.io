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

  // Визначаємо, чи є поточна сторінка сторінкою "Соціум" (social.html)
  const isSocialPage = window.location.pathname.includes('social.html');

  const leftAd = document.createElement('div');
  leftAd.className = 'side-ad-left';
  
  const rightAd = document.createElement('div');
  rightAd.className = 'side-ad-right';

  let totalAdCount = 0;

  if (isHomepage) {
    // === ШАБЛОН РЕКЛАМИ ДЛЯ ГОЛОВНОЇ СТОРІНКИ ===
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
    totalAdCount = 2; // 1 зліва (вертикальна) + 1 справа (вертикальна)
  } else if (isSocialPage) {
    // === ШАБЛОН РЕКЛАМИ ДЛЯ СТОРІНКИ "СОЦІУМ" ===
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
    totalAdCount = 2; // Тільки 2 бічні (нижній мультиплекс має власну ініціалізацію в social.html)
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
    totalAdCount = 2; // 1 зліва + 1 справа
  }

  document.body.appendChild(leftAd);
  document.body.appendChild(rightAd);

  // Динамічна ініціалізація рекламних оголошень AdSense (кількість залежить від сторінки)
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

