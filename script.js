// ==========================================================================
// WEDDING CARD - MAIN SCRIPT (PART 1)
// ==========================================================================

// Константа URL веб-приложения Google Скрипта для RSVP
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzbGCOgvgGijKkzxKfvTMw-QyKSaDbjW3_mEyp0rQDozYQxx7LNTEd6iSOWhJ1mxZs-uA/exec";
// Установка целевой даты торжества (15 июня 2026 года)
const targetDate = new Date("June 15, 2026 14:00:00").getTime();

/**
 * Функция перелистывания карточки таймера (Rolling Clock)
 * @param {string} cardId - ID контейнера карточки
 * @param {string} newValue - Двузначное строковое значение цифры
 */
function rollCard(cardId, newValue) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const wrapper = card.querySelector(".digit-wrapper");
    const currentSpan = card.querySelector(".current");
    const nextSpan = card.querySelector(".next");

    // Если цифра не поменялась — анимацию не запускаем
    if (currentSpan.innerText === newValue) return;

    // 1. Загружаем новое значение в нижний невидимый слот
    nextSpan.innerText = newValue;

    // 2. Запускаем аппаратный сдвиг каретки вверх
    wrapper.classList.remove("no-transition");
    wrapper.classList.add("animate");

    // 3. По окончании перехода бесшовно сбрасываем позицию
    setTimeout(() => {
        currentSpan.innerText = newValue;
        wrapper.classList.add("no-transition");
        wrapper.classList.remove("animate");
    }, 400);
}

/**
 * Расчет оставшегося времени и обновление счетчиков
 */
function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    // Если свадьба уже наступила — скрываем секцию таймера
    if (difference < 0) {
        const section = document.getElementById("countdown-section");
        if (section) section.style.display = "none";
        return;
    }

    // Математический расчет единиц времени
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Форматирование в двузначный вид (01, 02 и т.д.)
    const strDays = days < 10 ? "0" + days : "" + days;
    const strHours = hours < 10 ? "0" + hours : "" + hours;
    const strMinutes = minutes < 10 ? "0" + minutes : "" + minutes;
    const strSeconds = seconds < 10 ? "0" + seconds : "" + seconds;

    // Запуск прокрутки для каждой карточки
    rollCard("days-card", strDays);
    rollCard("hours-card", strHours);
    rollCard("minutes-card", strMinutes);
    rollCard("seconds-card", strSeconds);
}

// Запуск интервала таймера (1 раз в секунду) и первичная инициализация
setInterval(updateCountdown, 1000);
updateCountdown();

// Инициализация Reveal-анимаций появления элементов при скролле страницы
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll('.reveal-text');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Анимируем строго один раз за сессию
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Срабатывает, когда блок на 10% зашел в область экрана
        threshold: 0.05
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
// ==========================================================================
// WEDDING CARD - MAIN SCRIPT (PART 2) - UPDATED & FIXED
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvpForm');
    const additionalQuestions = document.getElementById('additional-questions');
    const radioAttend = document.querySelectorAll('input[name="attend"]');
    const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]');
    const noAlcoholCheckbox = document.getElementById('no-alcohol');
    const colorCircles = document.querySelectorAll('.color-circle');
    const statusDiv = document.getElementById('form-status'); // ИСПРАВЛЕНО: Объявили недостающий элемент

    // По умолчанию подсвечиваем оливковый как активный (базовый)
    colorCircles.forEach(c => {
        if (c.getAttribute('title') === 'Оливковый') c.classList.add('active-theme');
    });

    // 1. ДИНАМИЧЕСКАЯ СМЕНА РАСЦВЕТКИ ВСЕЙ СТРАНИЦЫ
    const colorThemes = {
        'Песочный': {
            accent: '#8c6b53',
            accentLight: '#eae0d5',
            bgColor: '#f5ebe0'
        },
        'Шампань': {
            accent: '#9a7b66',
            accentLight: '#f4ece4',
            bgColor: '#faf3ec'
        },
        'Оливковый': {
            accent: '#3a4f3e',
            accentLight: '#d6e2d3',
            bgColor: '#eef3ed'
        },
        'Небесно-голубой': {
            accent: '#34658a',
            accentLight: '#dbe6f0',
            bgColor: '#e6eef5'
        }
    };

    colorCircles.forEach(circle => {
        circle.addEventListener('click', function () {
            const colorName = this.getAttribute('title');
            const theme = colorThemes[colorName];
            if (theme) {
                // Переназначаем переменные на :root
                document.documentElement.style.setProperty('--accent', theme.accent);
                document.documentElement.style.setProperty('--accent-light', theme.accentLight);
                document.documentElement.style.setProperty('--bg-color', theme.bgColor);

                // Анимация переключения классов на кнопках цветов
                colorCircles.forEach(c => c.classList.remove('active-theme'));
                this.classList.add('active-theme');

                // Эффект упругого тапа
                this.style.transform = 'scale(0.95)';
                setTimeout(() => { this.style.transform = ''; }, 100);
            }
        });
    });

    // 2. ДИНАМИЧЕСКОЕ СКРЫТИЕ ПОЛЕЙ АНКЕТЫ ДО ОТПРАВКИ
    radioAttend.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === "К сожалению, нет") {
                additionalQuestions.classList.add('hidden');
            } else {
                additionalQuestions.classList.remove('hidden');
            }
        });
    });

    // 3. ЛОГИКА ЧИПСОВ АЛКОГОЛЯ (Взаимоисключение для "Не пью")
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

    // 4. ОБРАБОТКА И ОТПРАВКА RSVP ФОРМЫ
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const successCard = document.getElementById('form-success-card');

            // Включаем визуальный лоадер (текст скроется через CSS, появится спиннер)
            submitBtn.disabled = true;

            if (statusDiv) {
                statusDiv.style.color = "var(--accent)";
                statusDiv.innerText = "Сохраняем ваш ответ...";
                statusDiv.style.display = "block";
            }

            const guestName = document.getElementById('guest_name').value.trim();
            const attendValue = document.querySelector('input[name="attend"]:checked').value;
            const checkedAlcohol = [];

            if (attendValue !== "К сожалению, нет") {
                document.querySelectorAll('input[name="alcohol"]:checked').forEach(cb => {
                    checkedAlcohol.push(cb.value);
                });
            }

            const params = new URLSearchParams();
            params.append('guest_name', guestName);
            params.append('attend', attendValue);
            params.append('alcohol', checkedAlcohol.length > 0 ? checkedAlcohol.join(', ') : '—');
            params.append('wishes', (attendValue !== "К сожалению, нет" && document.getElementById('wishes')) ? document.getElementById('wishes').value : '—');

            fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            })
                // ... (выше идет код отправки fetch)
                .then(response => {
                    if (!response.ok) throw new Error('Network response error');
                    return response.json();
                })
                .then(data => {
                    const rsvpSection = document.getElementById('rsvp');
                    let targetTop = 0;
                    if (rsvpSection) {
                        targetTop = rsvpSection.getBoundingClientRect().top + window.pageYOffset - 20;
                    }

                    // Благородная пауза для лоадера
                    setTimeout(() => {
                        if (statusDiv) statusDiv.style.display = "none";

                        // Плавное вертикальное схлопывание формы
                        rsvpForm.classList.add('collapsed');

                        // Берем имя для обращения
                        const nameArray = guestName.split(' ');
                        const shortName = nameArray[0];
                        let titleText = "";
                        let bodyText = "";

                        if (attendValue === "Да, с радостью") {
                            titleText = `${shortName}, до встречи!`;
                            bodyText = "Ваше присутствие успешно подтверждено. Мы искренне счастливы, что вы разделите с нами этот особенный день! Ждем вас в агроусадьбе «Лесная мечта».";
                        } else {
                            titleText = `${shortName}, спасибо за ответ!`;
                            bodyText = "Нам очень жаль, что у вас не получится приехать. Искренне благодарим, что предупредили нас заранее. Ваша поддержка важна нам даже на расстоянии!";
                        }

                        // ИСПРАВЛЕНО: Меняем только текст, не пересоздавая DOM-узлы
                        const successTitleEl = document.getElementById('success-title');
                        const successTextEl = document.getElementById('success-text');

                        if (successCard && successTitleEl && successTextEl) {
                            successTitleEl.innerText = titleText;
                            successTextEl.innerText = bodyText;

                            // Мягкий скролл к началу блока RSVP
                            window.scrollTo({ top: targetTop, behavior: 'smooth' });

                            // Эффектно проявляем карточку
                            successCard.style.display = "block";
                            setTimeout(() => {
                                successCard.classList.add('show');
                            }, 50);
                        }
                    }, 1200);
                })
                // ... (дальше идет catch)

                .catch(error => {
                    console.error('Ошибка:', error);
                    submitBtn.disabled = false; // Возвращаем кнопку в рабочее состояние при ошибке
                    if (statusDiv) {
                        statusDiv.style.color = "#b3261e";
                        statusDiv.innerText = "Ошибка отправки. Пожалуйста, попробуйте еще раз.";
                    }
                });
        });
    }

});
