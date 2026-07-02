const CONFIG = {
    // Ссылка на виджет карты Яндекс (из iframe)
    MAP_SRC: "https://yandex.ru/map-widget/v1/?um=constructor%3A639a338255ff89dcd4396ca7260c5f71c470027ec28b1bd31c8decd7815d7d80&amp;source=constructor",

    // Ссылка на кнопку "Построить маршрут"
    ROUTE_HREF: "https://yandex.by/maps/-/CTAPa8M0",

    // URL вашего веб-приложения Google Apps Script (Бэкенд)
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycbwAbiKYDhv5sG_e60mVBEhtAWUtQ1xCLZ4i4U0m1PNhQMCDxs2eVZK-IDdMI6NfJzEXzg/exec",

    // Дата свадьбы: Год, Месяц (0-11, где 5 = Июнь, 8 = Сентябрь), День, Часы, Минуты
    WEDDING_DATE: new Date(2026, 8, 15, 14, 0, 0), // 15 июня 2026, 14:00
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
