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

