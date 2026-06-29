document.addEventListener("DOMContentLoaded", () => {
    // 0. Инициализация конфигурационных данных из config.js
    const mapIframe = document.querySelector(".map-iframe-premium");
    const routeBtn = document.getElementById("route-btn");
    const heroDateEl = document.getElementById("hero-date");
    const rsvpDeadlineEl = document.getElementById("rsvp-deadline");

    if (mapIframe && CONFIG.MAP_SRC) mapIframe.src = CONFIG.MAP_SRC;
    if (routeBtn && CONFIG.ROUTE_HREF) routeBtn.href = CONFIG.ROUTE_HREF;
    
    // Динамическая подстановка дат на экран
    if (heroDateEl) heroDateEl.innerText = CONFIG.getWeddingTextDate();
    if (rsvpDeadlineEl) rsvpDeadlineEl.innerText = CONFIG.getRSVPTextDate();

    // 1. Динамический таймер обратного отсчета
    const targetDate = new Date(CONFIG.getTimerTargetString()).getTime();

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

        const dEl = document.querySelector("#days-card .timer-digits");
        const hEl = document.querySelector("#hours-card .timer-digits");
        const mEl = document.querySelector("#minutes-card .timer-digits");
        const sEl = document.querySelector("#seconds-card .timer-digits");

        if (dEl && dEl.innerText !== strDays) dEl.innerText = strDays;
        if (hEl && hEl.innerText !== strHours) hEl.innerText = strHours;
        if (mEl && mEl.innerText !== strMinutes) mEl.innerText = strMinutes;
        if (sEl && sEl.innerText !== strSeconds) sEl.innerText = strSeconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 2. Интерактивная палитра дресс-кода
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            colorSwatches.forEach(s => s.classList.remove('active-theme'));
            this.classList.add('active-theme');
        });
    });

    // 3. Умная RSVP форма (Показ/скрытие анкеты напитков)
    const rsvpForm = document.getElementById('rsvpForm');
    const additionalQuestions = document.getElementById('additional-questions');
    const radioAttend = document.querySelectorAll('input[name="attend"]');
    const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]');
    const noAlcoholCheckbox = document.getElementById('no-alcohol');
    const statusDiv = document.getElementById('form-status');

    radioAttend.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === "К сожалению, нет") {
                if (additionalQuestions) additionalQuestions.classList.add('hidden');
            } else {
                if (additionalQuestions) additionalQuestions.classList.remove('hidden');
            }
        });
    });

    if (noAlcoholCheckbox) {
        noAlcoholCheckbox.addEventListener('change', function() {
            if (this.checked) {
                alcoholCheckboxes.forEach(cb => {
                    if (cb !== noAlcoholCheckbox) cb.checked = false;
                });
            }
        });

        alcoholCheckboxes.forEach(cb => {
            if (cb !== noAlcoholCheckbox) {
                cb.addEventListener('change', function() {
                    if (this.checked && noAlcoholCheckbox.checked) {
                        noAlcoholCheckbox.checked = false;
                    }
                });
            }
        });
    }

    // 4. Реальная отправка данных на бэкенд Google Таблицы
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const successCard = document.getElementById('form-success-card');
            
            submitBtn.disabled = true;
            if (statusDiv) {
                statusDiv.innerText = "Синхронизация данных...";
                statusDiv.style.display = "block";
            }

            const guestName = document.getElementById('guest_name').value.trim();
            const attendValue = document.querySelector('input[name="attend"]:checked').value;
            
            const checkedAlcohol = [];
            if (attendValue === "Да, с радостью") {
                document.querySelectorAll('input[name="alcohol"]:checked').forEach(cb => {
                    checkedAlcohol.push(cb.value);
                });
            }

            const params = new URLSearchParams();
            params.append('guest_name', guestName);
            params.append('attend', attendValue);
            params.append('alcohol', checkedAlcohol.length > 0 ? checkedAlcohol.join(', ') : '—');
            params.append('wishes', document.getElementById('wishes') ? document.getElementById('wishes').value.trim() : '—');

            fetch(CONFIG.WEB_APP_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка сети');
                return response.json();
            })
            .then(data => {
                if (statusDiv) statusDiv.style.display = "none";
                rsvpForm.classList.add('collapsed');
                
                const shortName = guestName.split(' ');
                let titleText = "", bodyText = "";

                if (attendValue === "Да, с радостью") {
                    titleText = `${shortName}, до встречи!`;
                    bodyText = "Ваш ответ успешно сохранен. Мы счастливы, что вы разделите с нами этот особенный день!";
                } else {
                    titleText = `${shortName}, спасибо!`;
                    bodyText = "Нам очень жаль, что вы не сможете приехать. Благодарим, что предупредили нас об этом заранее.";
                }

                const successTitleEl = document.getElementById('success-title');
                const successTextEl = document.getElementById('success-text');
                
                if (successCard && successTitleEl && successTextEl) {
                    successTitleEl.innerText = titleText;
                    successTextEl.innerText = bodyText;
                    successCard.style.display = "block";
                    setTimeout(() => { successCard.classList.add('show'); }, 50);
                }
            })
            .catch(error => {
                console.error('Ошибка отправки:', error);
                submitBtn.disabled = false;
                if (statusDiv) {
                    statusDiv.innerText = "Произошла ошибка. Повторите попытку.";
                }
            });
        });
    }
});
