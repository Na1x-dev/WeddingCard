const CONFIG = {
    // Данные молодоженов
    NAMES: {
        BRIDE: "Руслан",
        GROOM: "Вероника",
        MONOGRAM: "R & V"
    },

    WEDDING_DATE: new Date(2027, 7, 15, 17, 0, 0),

    // Локация проведения
    LOCATION: {
        TITLE: "Загородный клуб",
        ADDRESS: "Санкт-Петербург, Английская набережная",
        MAP_SRC: "https://yandex.ru/map-widget/v1/?um=constructor%3A639a338255ff89dcd4396ca7260c5f71c470027ec28b1bd31c8decd7815d7d80&amp;source=constructor",
        ROUTE_HREF: "https://yandex.by/maps/-/CTAPa8M0"
    },

    // Палитра дресс-кода (можно добавлять/удалять любые цвета)
    PALETTE: [
        { hex: "#eddcd2", name: "Песочный" },
        { hex: "#fff1e6", name: "Шампань" },
        { hex: "#e2ecc8", name: "Оливковый" },
        { hex: "#cfe2f3", name: "Голубой" }
    ],
    
    // Программа дня (Таймлайн) — можно добавлять любое количество событий
    TIMELINE: [
        { time: "14:30", title: "Сбор гостей", text: "Приветственные напитки, знакомство и легкий фуршет перед началом" },
        { time: "15:00", title: "Выездная регистрация", text: "Самый трогательный момент нашего дня у лесной арки" },
        { time: "16:00", title: "Свадебный ужин", text: "Праздничный банкет, поздравления, танцы и шоу-программа" },
        { time: "22:00", title: "Свадебный торт и финал", text: "Яркое завершение вечера и десерт" }
    ],

    // URL веб-приложения Google Apps Script (Бэкенд)
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycbwAbiKYDhv5sG_e60mVBEhtAWUtQ1xCLZ4i4U0m1PNhQMCDxs2eVZK-IDdMI6NfJzEXzg/exec"
};

const _monthsRU = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

CONFIG.getWeddingTextDate = function () {
    return `${this.WEDDING_DATE.getDate()} ${_monthsRU[this.WEDDING_DATE.getMonth()]} ${this.WEDDING_DATE.getFullYear()}`;
};

CONFIG.getRSVPTextDate = function () {
    const rsvpDate = new Date(this.WEDDING_DATE);
    rsvpDate.setMonth(rsvpDate.getMonth() - 1); // Ровно на месяц раньше даты свадьбы
    return `${rsvpDate.getDate()} ${_monthsRU[rsvpDate.getMonth()]} ${rsvpDate.getFullYear()} года`;
};
