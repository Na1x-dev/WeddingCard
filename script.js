// ==========================================================================
// WEDDING CARD - INTEGRATED & OPTIMIZED SCRIPT
// ==========================================================================

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwAbiKYDhv5sG_e60mVBEhtAWUtQ1xCLZ4i4U0m1PNhQMCDxs2eVZK-IDdMI6NfJzEXzg/exec";

// Исправлено: Установлена точная дата свадьбы в соответствии с HTML (15 июня 2026)
const targetDate = new Date("September 15, 2026 14:00:00").getTime();

function rollCard(cardId, newValue) {
    const card = document.getElementById(cardId);
    if (!card) return;
    const wrapper = card.querySelector(".digit-wrapper");
    const currentSpan = card.querySelector(".current");
    const nextSpan = card.querySelector(".next");

    if (currentSpan.innerText === newValue) return;

    nextSpan.innerText = newValue;
    wrapper.classList.remove("no-transition");
    wrapper.classList.add("animate");

    setTimeout(() => {
        currentSpan.innerText = newValue;
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
    // 1. Анимации появления (Reveal)
    const revealElements = document.querySelectorAll('.reveal-text');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Интерактивная форма и палитра
    const rsvpForm = document.getElementById('rsvpForm');
    const additionalQuestions = document.getElementById('additional-questions');
    const radioAttend = document.querySelectorAll('input[name="attend"]');
    const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]');
    const noAlcoholCheckbox = document.getElementById('no-alcohol');
    const colorCircles = document.querySelectorAll('.color-circle');
    const statusDiv = document.getElementById('form-status');

    // Кастомные цветовые темы
    const colorThemes = {
        'Песочный': { accent: '#8c6b53', accentLight: '#eae0d5', bgColor: '#f5ebe0' },
        'Шампань': { accent: '#9a7b66', accentLight: '#f4ece4', bgColor: '#faf3ec' },
        'Оливковый': { accent: '#3a4f3e', accentLight: '#d6e2d3', bgColor: '#eef3ed' },
        'Небесно-голубой': { accent: '#34658a', accentLight: '#dbe6f0', bgColor: '#e6eef5' }
    };

    // Активация темы по умолчанию
    colorCircles.forEach(c => {
        if (c.getAttribute('title') === 'Оливковый') c.classList.add('active-theme');
    });

    colorCircles.forEach(circle => {
        circle.addEventListener('click', function () {
            const colorName = this.getAttribute('title');
            const theme = colorThemes[colorName];
            if (theme) {
                document.documentElement.style.setProperty('--accent', theme.accent);
                document.documentElement.style.setProperty('--accent-light', theme.accentLight);
                document.documentElement.style.setProperty('--bg-color', theme.bgColor);
                
                colorCircles.forEach(c => c.classList.remove('active-theme'));
                this.classList.add('active-theme');
            }
        });
    });

    // Показ/скрытие дополнительных вопросов
    radioAttend.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === "К сожалению, net" || e.target.value.includes("не смогу") || e.target.value === "К сожалению, нет") {
                additionalQuestions.classList.add('hidden');
            } else {
                additionalQuestions.classList.remove('hidden');
            }
        });
    });

    // Исключение алкоголя при выборе "Не пью"
    if (alcoholCheckboxes.length > 0 && noAlcoholCheckbox) {
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
    }

    // Обработка отправки формы
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const successCard = document.getElementById('form-success-card');

            submitBtn.disabled = true;
            if (statusDiv) {
                statusDiv.style.color = "var(--accent)";
                statusDiv.innerText = "Сохраняем ваш ответ...";
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
            params.append('wishes', document.getElementById('wishes') ? document.getElementById('wishes').value : '—');

            fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            })
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(data => {
                setTimeout(() => {
                    if (statusDiv) statusDiv.style.display = "none";
                    rsvpForm.classList.add('collapsed');

                    const shortName = guestName.split(' ')[0];
                    let titleText = "", bodyText = "";

                    if (attendValue === "Да, с радостью") {
                        titleText = `${shortName}, до встречи!`;
                        bodyText = "Ваше присутствие успешно подтверждено. Мы искренне счастливы, что вы разделите с нами этот особенный день! Ждем вас в агроусадьбе «Лесная мечта».";
                    } else {
                        titleText = `${shortName}, спасибо за ответ!`;
                        bodyText = "Нам очень жаль, что у вас не получится приехать. Искренне благодарим, что предупредили нас заранее. Ваша поддержка важна нам даже на расстоянии!";
                    }

                    const successTitleEl = document.getElementById('success-title');
                    const successTextEl = document.getElementById('success-text');
                    if (successCard && successTitleEl && successTextEl) {
                        successTitleEl.innerText = titleText;
                        successTextEl.innerText = bodyText;
                        successCard.style.display = "block";
                        setTimeout(() => { successCard.classList.add('show'); }, 50);
                    }
                    
                    const rsvpSection = document.getElementById('rsvp');
                    if (rsvpSection) {
                        const targetTop = rsvpSection.getBoundingClientRect().top + window.pageYOffset - 20;
                        window.scrollTo({ top: targetTop, behavior: 'smooth' });
                    }
                }, 1200);
            })
            .catch(error => {
                console.error('Ошибка:', error);
                submitBtn.disabled = false;
                if (statusDiv) {
                    statusDiv.style.color = "#b3261e";
                    statusDiv.innerText = "Ошибка отправки. Пожалуйста, попробуйте еще раз.";
                }
            });
        });
    }
});