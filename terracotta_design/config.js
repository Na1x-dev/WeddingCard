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
        ADDRESS: "Укажите адрес площадки",
        MAP_SRC: "",
        ROUTE_HREF: ""
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
        { time: "15:30", title: "Сбор гостей", text: "Приветственные напитки, знакомство и лёгкий фуршет" },
        { time: "16:00", title: "Церемония", text: "Самый трогательный момент нашего дня" },
        { time: "17:00", title: "Банкет", text: "Вкусный ужин, поздравления, танцы и много любви" },
        { time: "23:00", title: "Финал вечера", text: "Обнимемся, загадаем желания и сохраним этот день в памяти" }
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
