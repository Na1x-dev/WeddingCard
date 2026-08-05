document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'ru';

    // Элементы DOM
    const catalogGrid = document.getElementById('catalog-grid');
    const langButtons = document.querySelectorAll('.lang-btn');
    const modal = document.getElementById('order-modal');
    const closeModalX = document.querySelector('.close-modal');
    const modalProductInfo = document.getElementById('modal-product-info');

    // 1. ФУНКЦИЯ ПЕРЕВОДА СТАТИЧНОГО ТЕКСТА
    function translateInterface() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (SITE_CONFIG.translations[currentLang][key]) {
                element.textContent = SITE_CONFIG.translations[currentLang][key];
            }
        });
    }

        // 2. ОБНОВЛЕННАЯ ФУНКЦИЯ ДИНАМИЧЕСКОЙ СБОРКИ ССЫЛОК С ТЕКСТОМ
    function renderContacts(messageText) {
        // Кодируем текст, чтобы пробелы и кириллица не ломали ссылки в браузере
        const encodedText = encodeURIComponent(messageText);
        
        // Вручную собираем адреса сайтов и наши хвосты из config.js
        const tgLink = "https://t.me" + SITE_CONFIG.contacts.telegram + "?text=" + encodedText;
        const instaLink = "https://instagram.com/" + SITE_CONFIG.contacts.instagram;
        const emailLink = "mailto:" + SITE_CONFIG.contacts.email + "?subject=" + encodeURIComponent("Digital Wedding") + "&body=" + encodedText;

        const contactHTML = `
            <a href="${tgLink}" target="_blank" class="social-icon telegram">
                <i class="fab fa-telegram-plane"></i> Telegram
            </a>
            <a href="${instaLink}" target="_blank" class="social-icon instagram">
                <i class="fab fa-instagram"></i> Instagram
            </a>
            <a href="${emailLink}" class="social-icon email">
                <i class="fas fa-envelope"></i> Email
            </a>
        `;
        
        // Вставляем сгенерированные кнопки в модальное окно
        const modalSocials = document.querySelector('.modal-socials');
        if (modalSocials) modalSocials.innerHTML = contactHTML;
    }

    // Вспомогательная базовая функция для подвала (там всегда идет дефолтное сообщение)
    function renderFooterContacts() {
        const defaultText = SITE_CONFIG.translations[currentLang]['msgDefault'];
        const encodedText = encodeURIComponent(defaultText);
        
        const tgLink = "https://t.me/" + SITE_CONFIG.contacts.telegram + "?text=" + encodedText;
        const instaLink = "https://instagram.com/" + SITE_CONFIG.contacts.instagram;
        const emailLink = "mailto:" + SITE_CONFIG.contacts.email + "?subject=" + encodeURIComponent("Digital Wedding") + "&body=" + encodedText;

        const footerSocials = document.querySelector('.footer-socials');
        if (footerSocials) {
            footerSocials.innerHTML = `
                <a href="${tgLink}" target="_blank" class="social-icon telegram"><i class="fab fa-telegram-plane"></i> Telegram</a>
                <a href="${instaLink}" target="_blank" class="social-icon instagram"><i class="fab fa-instagram"></i> Instagram</a>
                <a href="${emailLink}" class="social-icon email"><i class="fas fa-envelope"></i> Email</a>
            `;
        }
    }

    // 4. УМНАЯ ЛОГИКА ОПРЕДЕЛЕНИЯ КНОПОК И ТЕКСТА В МОДЛАКЕ
        // 4. ИСПРАВЛЕННАЯ ЛОГИКА СБОРКИ СТРОКИ ДЛЯ ТЕЛЕГРАМА
    function openOrderModal(templateId = null) {
        if (!modal || !modalProductInfo) return;

        let dynamicMessage = ""; // Переменная для хранения текста

        if (templateId) {
            // А) Если клиент кликнул по готовому шаблону
            const template = SITE_CONFIG.templates.find(t => t.id === templateId);
            
            // Защита: если вдруг шаблон не найден, берем дефолтный заголовок
            const title = template ? template.title[currentLang] : ""; 
            const label = SITE_CONFIG.translations[currentLang]['modalSelected'];
            
            modalProductInfo.innerHTML = `<strong>${label}</strong><span class="highlight">${title}</span>`;
            
            // ИСПРАВЛЕНО: Явно собираем строку из конфига и названия макета
            const baseText = SITE_CONFIG.translations[currentLang]['msgTemplate'];
            dynamicMessage = baseText + ` "${title}"`;
        } else {
            // Б) Если клиент кликнул по кнопке "Свой макет"
            modalProductInfo.innerHTML = `<span class="highlight">${SITE_CONFIG.translations[currentLang]['modalCustomOrder']}</span>`;
            
            // ИСПРАВЛЕНО: Берем чистый текст из свойства msgCustom
            dynamicMessage = SITE_CONFIG.translations[currentLang]['msgCustom'];
        }

        // Передаем собранную строку в функцию генерации ссылок кнопок
        renderContacts(dynamicMessage);

        // Плавное открытие окна
        modal.classList.remove('closing');
        modal.style.display = 'block';
        setTimeout(() => { modal.classList.add('show'); }, 10);
        document.body.style.overflow = 'hidden'; 
    }



    // 3. ФУНКЦИЯ ОТРИСОВКИ КАРТОЧЕК КАТАЛОГА
       // 3. ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ФУНКЦИЯ ОТРИСОВКИ КАТАЛОГА
    function renderCatalog() {
        if (!catalogGrid) return;
        catalogGrid.innerHTML = '';
        
        const allTemplates = SITE_CONFIG.templates;
        if (!allTemplates || allTemplates.length === 0) {
            catalogGrid.innerHTML = `<p class="no-templates">${SITE_CONFIG.translations[currentLang]['noTemplates']}</p>`;
            return;
        }

        allTemplates.forEach(template => {
            const card = document.createElement('div');
            card.classList.add('card');
            
            const title = template.title[currentLang];
            const desc = template.description[currentLang];
            
            card.innerHTML = `
                <a href="${template.demoUrl}" target="_blank" class="card-image" title="${SITE_CONFIG.translations[currentLang]['btnDemo']}">
                    <img src="${template.image}" alt="${title}" loading="lazy">
                </a>
                <div class="card-content">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <div class="card-actions" style="justify-content: center;">
                        <!-- Кнопка жестко хранит корректный ID макета -->
                        <button class="btn-order" data-id="${template.id}">
                            ${SITE_CONFIG.translations[currentLang]['btnOrder']}
                        </button>
                    </div>
                </div>
            `;
            catalogGrid.appendChild(card);
        });

        // ЖЕСТКИЙ ФИКС: Используем currentTarget вместо target, чтобы исключить undefined при клике на текст
        document.querySelectorAll('.btn-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateId = parseInt(e.currentTarget.getAttribute('data-id'));
                openOrderModal(templateId);
            });
        });
    }

    // 4. ЛОГИКА МОДАЛЬНОГО ОКНА (С КОРРЕКТНЫМ ТАЙМАУТОМ ДЛЯ ЗАКРЫТИЯ)
        // 4. ФИНАЛЬНАЯ НЕУБИВАЕМАЯ ЛОГИКА СБОРКИ СТРОКИ ДЛЯ ТЕЛЕГРАМА
    function openOrderModal(templateId = null) {
        if (!modal || !modalProductInfo) return;

        let dynamicMessage = ""; 

        // 1. ПРОВЕРЯЕМ, ЧТО КЛИКНУЛИ ПО КАРТОЧКЕ (ЕСТЬ ID)
        if (templateId && !isNaN(templateId)) {
            
            // Ищем нужный шаблон в базе
            const template = SITE_CONFIG.templates.find(t => t.id === templateId);
            
            if (template && template.title) {
                // Если шаблон и его имя успешно найдены
                const title = template.title[currentLang] || template.title['ru'];
                const label = SITE_CONFIG.translations[currentLang]['modalSelected'] || "Выбранный шаблон:";
                
                modalProductInfo.innerHTML = `<strong>${label}</strong><span class="highlight"> ${title}</span>`;
                
                // Проверяем, есть ли заготовка фразы в конфиге
                const baseText = SITE_CONFIG.translations[currentLang]['msgTemplate'];
                if (baseText) {
                    dynamicMessage = baseText + ` "${title}"`;
                } else {
                    // НАДЁЖНЫЙ ФОЛБЕК: если в конфиге пусто, пишем текст вручную
                    dynamicMessage = currentLang === 'en' 
                        ? `Hello! I want to order a digital invitation template: "${title}"`
                        : `Здравствуйте! Хочу заказать цифровое пригласительное по шаблону: "${title}"`;
                }
            } else {
                // Если ID передался, но в базе такого шаблона почему-то нет
                modalProductInfo.innerHTML = `<span class="highlight">Заказ пригласительного</span>`;
                dynamicMessage = "Здравствуйте! Хочу сделать заказ пригласительного на свадьбу.";
            }

        } else {
            // 2. ЕСЛИ КЛИКНУЛИ ПО КНОПКЕ "СВОЙ МАКЕТ" (ID НЕТ)
            const labelCustom = SITE_CONFIG.translations[currentLang]['modalCustomOrder'] || "Индивидуальный заказ";
            modalProductInfo.innerHTML = `<span class="highlight">${labelCustom}</span>`;
            
            const customText = SITE_CONFIG.translations[currentLang]['msgCustom'];
            if (customText) {
                dynamicMessage = customText;
            } else {
                // НАДЁЖНЫЙ ФОЛБЕК: текст вручную
                dynamicMessage = currentLang === 'en'
                    ? "Hello! I have my own layout, let's discuss a custom design."
                    : "Здравствуйте! У меня есть свой макет, хочу обсудить индивидуальный заказ.";
            }
        }

        // ЖЕСТКИЙ ПЕРЕХВАТ ОШИБКИ: Если на выходе всё равно получилось undefined, принудительно заменяем текст
        if (!dynamicMessage || dynamicMessage.includes('undefined')) {
            dynamicMessage = "Здравствуйте! Хочу заказать свадебное пригласительное.";
        }

        // Отправляем чистую строку в функцию генерации кнопок
        renderContacts(dynamicMessage);

        // Анимация открытия окна
        modal.classList.remove('closing');
        modal.style.display = 'block';
        setTimeout(() => { modal.classList.add('show'); }, 10);
        document.body.style.overflow = 'hidden'; 
    }

    function closeModal() {
        if (!modal) return;
        
        modal.classList.add('closing');
        modal.classList.remove('show');
        
        // Ожидаем окончания 300ms CSS-анимации, прежде чем убрать display: none
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    if (closeModalX) closeModalX.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });

    // Дополнительное удобство: закрытие окна по клавише ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const openModalBtn = document.querySelector('.open-modal-btn');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openOrderModal(null));
    }

    // 5. ОБРАБОТКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКОВ
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            langButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentLang = e.target.getAttribute('data-lang');
            
            translateInterface();
            renderCatalog();
        });
    });

    // ИНИЦИАЛИЗАЦИЯ
    translateInterface();
    renderFooterContacts();
    renderCatalog();

      window.addEventListener("load", () => {
    const preloader = document.getElementById("main-preloader");
    if (preloader) {
      preloader.classList.add("fade-out");
      // Полностью удаляем из разметки через 600мс, чтобы освободить память
      setTimeout(() => {
        preloader.remove();
      }, 600);
    }
  });
});
