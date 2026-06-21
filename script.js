// Скрипт отправки формы в Google Таблицу
// const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwjrbGpAy_seUWcKBUf1LNVbADViJRPTlRfaYsb4mdFKxA_2d_N2rUdH3vGffI-KNks6Q/exec";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxpal6eaY9GFuvcFbksjCkt1w3zWKXewYNNrJpZXzFa9TQDATTH73hi4ZYMzm3LdN3kUA/exec";
document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvpForm');
    const additionalQuestions = document.getElementById('additional-questions');
    const radioAttend = document.querySelectorAll('input[name="attend"]');
    const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]');
    const noAlcoholCheckbox = document.getElementById('no-alcohol');

    // 1. Динамическое скрытие полей, если гость не придет
    radioAttend.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === "К сожалению, нет") {
                additionalQuestions.classList.add('hidden');
            } else {
                additionalQuestions.classList.remove('hidden');
            }
        });
    });

    // 2. Логика алкогольных чипсов: если выбрано "Не пью", снимаем галочки с остальных
    alcoholCheckboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            if (e.target === noAlcoholCheckbox && noAlcoholCheckbox.checked) {
                alcoholCheckboxes.forEach(item => {
                    if (item !== noAlcoholCheckbox) item.checked = false;
                });
            } else if (e.target !== noAlcoholCheckbox && e.target.checked) {
                noAlcoholCheckbox.checked = false;
            }
        });
    });

    // 3. Безопасная отправка данных
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const statusDiv = document.getElementById('form-status');

            submitBtn.disabled = true;
            submitBtn.innerText = "Отправка...";
            statusDiv.style.color = "var(--text-main)";
            statusDiv.innerText = "Пожалуйста, подождите...";

            const attendValue = document.querySelector('input[name="attend"]:checked').value;
            const checkedAlcohol = [];
            
            // Собираем алкоголь только если гость идет
            if (attendValue !== "К сожалению, нет") {
                document.querySelectorAll('input[name="alcohol"]:checked').forEach(cb => {
                    checkedAlcohol.push(cb.value);
                });
            }

            // Формируем безопасный URLSearchParams формат данных
            const params = new URLSearchParams();
            params.append('guest_name', document.getElementById('guest_name').value);
            params.append('attend', attendValue);
            params.append('alcohol', checkedAlcohol.length > 0 ? checkedAlcohol.join(', ') : '—');
            params.append('wishes', attendValue !== "К сожалению, нет" ? document.getElementById('wishes').value : '—');

            // Используем вашу ссылку на веб-приложение
    
            fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'cors', // ВКЛЮЧАЕМ CORS для обработки ответов сервера
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response error');
                return response.json();
            })
            .then(data => {
                statusDiv.style.color = "#4A634E";
                statusDiv.innerText = "Спасибо! Ваш ответ успешно сохранен.";
                submitBtn.innerText = "Отправлено";
                rsvpForm.reset();
                additionalQuestions.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Ошибка:', error);
                statusDiv.style.color = "#b3261e";
                statusDiv.innerText = "Ошибка отправки. Попробуйте еще раз.";
                submitBtn.disabled = false;
                submitBtn.innerText = "Отправить ответ";
            });
        });
    }
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



