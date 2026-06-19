// Скрипт отправки формы в Google Таблицу
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwC_m4Qg1UfOv-u60cyOeb3PJA1-fXMe8J5KqO3RMgspUE6nX9q5NV69coaFeakirZE/exec";

document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('form-status');

    submitBtn.disabled = true;
    submitBtn.innerText = "Отправка...";
    statusDiv.style.color = "var(--text-main)";
    statusDiv.innerText = "Пожалуйста, подождите...";

    const checkedAlcohol = [];
    document.querySelectorAll('input[name="alcohol"]:checked').forEach(cb => {
        checkedAlcohol.push(cb.value);
    });

    const formData = {
        guest_name: document.getElementById('guest_name').value,
        attend: document.querySelector('input[name="attend"]:checked').value,
        alcohol: checkedAlcohol.join(', '),
        wishes: document.getElementById('wishes').value
    };

    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(() => {
            statusDiv.style.color = "green";
            statusDiv.innerText = "Спасибо! Ваш ответ успешно сохранен.";
            submitBtn.innerText = "Отправлено";
            document.getElementById('rsvpForm').reset();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            statusDiv.style.color = "red";
            statusDiv.innerText = "Ошибка отправки. Попробуйте еще раз.";
            submitBtn.disabled = false;
            submitBtn.innerText = "Отправить ответ";
        });
});

// Скрипт обратного отсчета (Дата: 15 июня 2026 года)
const targetDate = new Date("July 15, 2026 14:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
        document.getElementById("countdown-section").style.display = "none";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector('.menu');
  const navLinks = document.querySelectorAll('.menu a');
  
  // Создаем невидимый буфер для предотвращения прыжка контента
  const menuPlaceholder = document.createElement('div');
  menuPlaceholder.style.display = 'none';
  menu.parentNode.insertBefore(menuPlaceholder, menu);

  let menuStickyPoint = menu.getBoundingClientRect().top + window.pageYOffset;
  let lastScrollTop = 0;

  // Функция для перерасчета высоты
  const updateMenuDimensions = () => {
    if (!menu.classList.contains('menu--fixed')) {
      menuStickyPoint = menu.getBoundingClientRect().top + window.pageYOffset;
    }
    // Задаем буферу точную высоту меню
    menuPlaceholder.style.height = `${menu.offsetHeight}px`;
  };

  updateMenuDimensions();
  window.addEventListener('resize', updateMenuDimensions);

  // 1. УМНОЕ ФИКСИРОВАНИЕ БЕЗ СУДОРОГ ВЕРСТКИ
  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Включаем буфер, чтобы высота шапки не схлопывалась
    menuPlaceholder.style.height = `${menu.offsetHeight}px`;

    if (scrollTop > menuStickyPoint) {
      if (!menu.classList.contains('menu--fixed')) {
        menu.classList.add('menu--fixed');
        menuPlaceholder.style.display = 'block'; // Показываем заглушку
      }
      
      // Скрытие срабатывает только если пролистали прилично ниже меню (буфер 150px)
      if (scrollTop > lastScrollTop && scrollTop > menuStickyPoint + 150) {
        menu.classList.add('menu--hidden');
      } else if (scrollTop < lastScrollTop) {
        // Показываем при любом скролле вверх
        menu.classList.remove('menu--hidden');
      }
    } else {
      // Возвращаем в обычный поток
      menu.classList.remove('menu--fixed', 'menu--hidden');
      menuPlaceholder.style.display = 'none'; // Прячем заглушку
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });

  // 2. ИДЕАЛЬНЫЙ ПЕРЕХОД ПО КЛИКУ
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('active')) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Включаем фиксацию заранее, чтобы расчет координат не сбился
        if (!menu.classList.contains('menu--fixed')) {
          menu.classList.add('menu--fixed');
          menuPlaceholder.style.display = 'block';
        }

        const elementRect = targetSection.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const elementHeight = elementRect.height;
        const windowHeight = window.innerHeight;
        
        let targetScrollPosition = absoluteElementTop - (windowHeight / 2 - elementHeight / 2);
        
        // Высота меню с запасом
        if (absoluteElementTop - targetScrollPosition < 90) {
          targetScrollPosition = absoluteElementTop - 90;
        }

        window.scrollTo({
          top: targetScrollPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. СЛЕДЯЩИЙ ФОКУС
  const observerOptions = {
    root: null,
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  const targetIds = ['about', 'countdown-section', 'details', 'dress', 'rsvp'];
  targetIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
});
