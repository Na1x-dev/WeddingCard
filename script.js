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

function rollCard(cardId, newValue) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const wrapper = card.querySelector(".digit-wrapper");
    const currentSpan = card.querySelector(".current");
    const nextSpan = card.querySelector(".next");

    // Если цифра не поменялась — ничего не делаем
    if (currentSpan.innerText === newValue) return;

    // 1. Ставим новое значение в нижний скрытый слот
    nextSpan.innerText = newValue;

    // 2. Включаем анимацию улетания вверх
    wrapper.classList.remove("no-transition");
    wrapper.classList.add("animate");

    // 3. После окончания анимации (400мс) бесшовно сбрасываем позицию
    setTimeout(() => {
        // Моментально переносим новое значение наверх
        currentSpan.innerText = newValue; 
        // Отключаем плавность, чтобы сброс позиции не вызвал прыжок вниз
        wrapper.classList.add("no-transition"); 
        wrapper.classList.remove("animate");
    }, 400);
}

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
        const section = document.getElementById("countdown-section");
        if (section) section.style.display = "none";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const strDays = days < 10 ? "0" + days : "" + days;
    const strHours = hours < 10 ? "0" + hours : "" + hours;
    const strMinutes = minutes < 10 ? "0" + minutes : "" + minutes;
    const strSeconds = seconds < 10 ? "0" + seconds : "" + seconds;

    rollCard("days-card", strDays);
    rollCard("hours-card", strHours);
    rollCard("minutes-card", strMinutes);
    rollCard("seconds-card", strSeconds);
}

setInterval(updateCountdown, 1000);
updateCountdown();



document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll('.reveal-text');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Анимируем только один раз
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Срабатывает, когда блок на 10% зашел на экран
        threshold: 0.05
    });

    revealElements.forEach(el => revealObserver.observe(el));
});



