document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Данные свадьбы и места проведения берутся из config.js
  const mapIframe = $(".map-iframe-premium");
  const mapEmpty = $(".map-empty");
  const routeBtn = $("#route-btn");
  const heroDate = $("#hero-date");
  const deadline = $("#rsvp-deadline");
  const names = CONFIG.NAMES || {};
  if (heroDate && CONFIG.getWeddingTextDate) heroDate.textContent = CONFIG.getWeddingTextDate();
  if (deadline && CONFIG.getRSVPTextDate) deadline.textContent = CONFIG.getRSVPTextDate();
  if ($(".name-left") && names.BRIDE) $(".name-left").textContent = names.BRIDE;
  if ($(".name-right") && names.GROOM) $(".name-right").textContent = names.GROOM;
  if ($(".footer-monogram") && names.MONOGRAM) $(".footer-monogram").innerHTML = names.MONOGRAM.replace("&", "<i>&</i>");
  if ($(".location-main-title") && CONFIG.LOCATION?.TITLE) $(".location-main-title").textContent = CONFIG.LOCATION.TITLE;
  if ($(".location-sub-address") && CONFIG.LOCATION?.ADDRESS) $(".location-sub-address").textContent = CONFIG.LOCATION.ADDRESS;
  if (mapIframe && CONFIG.LOCATION?.MAP_SRC) {
    mapIframe.src = CONFIG.LOCATION.MAP_SRC;
    if (mapEmpty) mapEmpty.hidden = true;
  }
  if (routeBtn && CONFIG.LOCATION?.ROUTE_HREF) routeBtn.href = CONFIG.LOCATION.ROUTE_HREF;
  else if (routeBtn) routeBtn.hidden = true;

  // Обратный отсчёт до даты свадьбы
  const targetTime = new Date(CONFIG.WEDDING_DATE).getTime();
  function updateCountdown() {
    const difference = targetTime - Date.now();
    const section = $("#countdown-section");
    if (difference <= 0) { if (section) section.hidden = true; return; }
    const values = {
      "#days-card .timer-digits": Math.floor(difference / 86400000),
      "#hours-card .timer-digits": Math.floor((difference % 86400000) / 3600000),
      "#minutes-card .timer-digits": Math.floor((difference % 3600000) / 60000),
      "#seconds-card .timer-digits": Math.floor((difference % 60000) / 1000)
    };
    Object.entries(values).forEach(([selector, value]) => {
      const el = $(selector);
      if (el) el.textContent = String(value).padStart(selector.includes("days") ? 3 : 2, "0");
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Палитра дресс-кода
  const paletteGrid = $(".premium-palette-grid");
  (CONFIG.PALETTE || []).forEach(color => {
    const node = document.createElement("div");
    node.className = "palette-node";
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = color.hex;
    swatch.title = color.name;
    const label = document.createElement("span");
    label.className = "swatch-name";
    label.textContent = color.name;
    node.append(swatch, label);
    paletteGrid?.appendChild(node);
  });

  // Программа дня
  const timeline = $(".fine-art-timeline");
  (CONFIG.TIMELINE || []).forEach(item => {
    const row = document.createElement("div");
    row.className = "timeline-row";
    const time = document.createElement("div");
    time.className = "row-time";
    time.textContent = item.time;
    const content = document.createElement("div");
    content.className = "row-content";
    const title = document.createElement("div");
    title.className = "row-title";
    title.textContent = item.title;
    const description = document.createElement("div");
    description.className = "row-text";
    description.textContent = item.text;
    content.append(title, description);
    row.append(time, content);
    timeline?.appendChild(row);
  });

  // RSVP: скрываем дополнительные вопросы, если гость не сможет прийти
  const form = $("#rsvpForm");
  const extra = $("#additional-questions");
  const status = $("#form-status");
  const submit = $("#submitBtn");
  const success = $("#form-success-card");
  const alcohol = $$('input[name="alcohol"]');
  const noAlcohol = $("#no-alcohol");

  $$('input[name="attend"]').forEach(radio => radio.addEventListener("change", event => {
    extra?.classList.toggle("hidden", event.target.value !== "Да, с радостью");
  }));
  noAlcohol?.addEventListener("change", () => {
    if (noAlcohol.checked) alcohol.filter(input => input !== noAlcohol).forEach(input => input.checked = false);
  });
  alcohol.filter(input => input !== noAlcohol).forEach(input => input.addEventListener("change", () => {
    if (input.checked && noAlcohol) noAlcohol.checked = false;
  }));

  form?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!CONFIG.WEB_APP_URL) {
      if (status) status.textContent = "Отправка пока не настроена. Пожалуйста, свяжитесь с молодожёнами.";
      return;
    }
    submit.disabled = true;
    if (status) status.textContent = "Отправляем ваш ответ…";
    const guestName = $("#guest_name").value.trim();
    const attend = $('input[name="attend"]:checked')?.value || "";
    const selectedDrinks = attend === "Да, с радостью" ? alcohol.filter(input => input.checked).map(input => input.value) : [];
    const payload = new URLSearchParams({
      guest_name: guestName,
      attend,
      alcohol: selectedDrinks.length ? selectedDrinks.join(", ") : "—",
      wishes: $("#wishes")?.value.trim() || "—"
    });
    try {
      const response = await fetch(CONFIG.WEB_APP_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: payload
      });
      if (!response.ok) throw new Error("Сервер вернул ошибку");
      const data = await response.json();
      if (data && data.result === "error") throw new Error(data.message || "Не удалось сохранить ответ");
      if (status) status.textContent = "";
      form.classList.add("collapsed");
      const firstName = guestName.split(/\s+/)[0];
      $("#success-title").textContent = attend === "Да, с радостью" ? firstName + ", до встречи!" : firstName + ", спасибо!";
      $("#success-text").textContent = attend === "Да, с радостью"
        ? "Ваш ответ сохранён. Мы счастливы, что вы разделите с нами этот особенный день!"
        : "Нам очень жаль, что вы не сможете приехать. Спасибо, что предупредили нас.";
      success.style.display = "block";
      requestAnimationFrame(() => success.classList.add("show"));
    } catch (error) {
      console.error("Ошибка отправки RSVP:", error);
      if (status) status.textContent = "Не удалось отправить ответ. Проверьте соединение и попробуйте ещё раз.";
      submit.disabled = false;
    }
  });
});

// Прелоадер скрывается после полной загрузки страницы
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  preloader.classList.add("fade-out");
  window.setTimeout(() => preloader.remove(), 500);
});
