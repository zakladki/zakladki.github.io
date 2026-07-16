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
      color: #9ca3af;
      cursor: pointer;
      transition: transform 0.2s ease, color 0.2s ease;
      vertical-align: middle;
      flex-shrink: 0;
    }
    .desc-toggle-btn:hover {
      color: #4b5563;
    }
    .dark-mode .desc-toggle-btn:hover {
      color: #e5e7eb;
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
      color: #4b5563;
    }
    .dark-mode .desc-toggle-btn.active {
      color: #f4f4f5;
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

        // Додаємо його одразу після посилання
        link.after(toggleBtn);

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

});

// 4. Функція швидкого плавного прокручування вгору
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

