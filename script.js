document.addEventListener("DOMContentLoaded", () => {
    // Инициализация конфигурационных данных локации и ссылок
    const mapIframe = document.querySelector(".map-iframe-premium");
    const routeBtn = document.getElementById("route-btn");
    const heroDateEl = document.getElementById("hero-date");
    const rsvpDeadlineEl = document.getElementById("rsvp-deadline");
    
    if (mapIframe && CONFIG.LOCATION?.MAP_SRC) mapIframe.src = CONFIG.LOCATION.MAP_SRC;
    if (routeBtn && CONFIG.LOCATION?.ROUTE_HREF) routeBtn.href = CONFIG.LOCATION.ROUTE_HREF;
    
    if (heroDateEl) heroDateEl.innerText = CONFIG.getWeddingTextDate();
    if (rsvpDeadlineEl) rsvpDeadlineEl.innerText = CONFIG.getRSVPTextDate();

    // Динамическое заполнение имен пары и локации из CONFIG
    const nameLeftEl = document.querySelector(".name-left");
    const nameRightEl = document.querySelector(".name-right");
    const footerMonogramEl = document.querySelector(".footer-monogram");
    const locationTitleEl = document.querySelector(".location-main-title");
    const locationAddressEl = document.querySelector(".location-sub-address");

    if (nameLeftEl && CONFIG.NAMES?.BRIDE) nameLeftEl.innerText = CONFIG.NAMES.BRIDE;
    if (nameRightEl && CONFIG.NAMES?.GROOM) nameRightEl.innerText = CONFIG.NAMES.GROOM;
    if (footerMonogramEl && CONFIG.NAMES?.MONOGRAM) footerMonogramEl.innerText = CONFIG.NAMES.MONOGRAM;
    if (locationTitleEl && CONFIG.LOCATION?.TITLE) locationTitleEl.innerText = CONFIG.LOCATION.TITLE;
    if (locationAddressEl && CONFIG.LOCATION?.ADDRESS) locationAddressEl.innerText = CONFIG.LOCATION.ADDRESS;
    
    // Стабильный таймер обратного отсчета
    const targetTime = CONFIG.WEDDING_DATE.getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetTime - now;
        
        if (difference < 0) {
            const section = document.getElementById("countdown-section");
            if (section) section.style.display = "none"; 
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        const pad = (num) => String(num).padStart(2, '0');
        const dEl = document.querySelector("#days-card .timer-digits");
        const hEl = document.querySelector("#hours-card .timer-digits");
        const mEl = document.querySelector("#minutes-card .timer-digits");
        const sEl = document.querySelector("#seconds-card .timer-digits");
        
        if (dEl) dEl.innerText = pad(days);
        if (hEl) hEl.innerText = pad(hours);
        if (mEl) mEl.innerText = pad(minutes);
        if (sEl) sEl.innerText = pad(seconds);
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // ГЕНЕРАЦИЯ ПАЛИТРЫ ДРЕСС-КОДА
    const paletteGrid = document.querySelector('.premium-palette-grid');
    if (paletteGrid && CONFIG.PALETTE && CONFIG.PALETTE.length > 0) {
        CONFIG.PALETTE.forEach((color, index) => {
            const node = document.createElement('div');
            node.className = 'palette-node';
            
            // Делаем первый цвет активным по умолчанию, как в исходной верстке
            const activeClass = index === 0 ? 'active-theme' : '';
            
            node.innerHTML = `
                <div class="color-swatch ${activeClass}" 
                     style="background-color: ${color.hex};" 
                     title="${color.name}"></div>
                <span class="swatch-name">${color.name}</span>
            `;
            paletteGrid.appendChild(node);
        });

        // Навешивание событий клика на созданные кружочки
        const colorSwatches = paletteGrid.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', function() {
                colorSwatches.forEach(s => s.classList.remove('active-theme'));
                this.classList.add('active-theme');
            });
        });
    }
    
    // Логика формы RSVP
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
    
    // Отправка формы в Google Таблицы
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
                
                const shortName = guestName.split(' ')[0];
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
