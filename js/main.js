// 1. Швидке застосування темної теми (застосовується до html, запобігає білому спалаху)
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark-mode");
}

// Safety stubs for legacy playerjs calls
window.playerjs = window.playerjs || {
  emit: function() { return this; },
  addListener: function() { return this; },
  on: function() { return this; },
  api: function() { return this; }
};
window.Playerjs = window.Playerjs || function() {
  return window.playerjs;
};

document.addEventListener("DOMContentLoaded", () => {
  
  // 2. Логіка перемикання теми
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    // Синхронізація візуального стану елемента (наприклад, якщо це чекбокс)
    if (localStorage.getItem("theme") === "dark") {
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark-mode");
      
      if (document.documentElement.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }

  // 3. Анімація кнопки меню (гамбургера) - легкий варіант
  const hamburgers = document.querySelectorAll(".hamburger");
  hamburgers.forEach(hamburger => {
    hamburger.addEventListener("click", function() {
      this.classList.toggle("is-active");
    });
  });

});

// 4. Функція швидкого плавного прокручування вгору
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

$(document).ready(function() {
  $('.hamburger').on('click', function() {
    $(this).toggleClass('is-active');
  });
});