const SITE_CONFIG = {
  // 1. ВАШИ ЧИСТЫЕ ХВОСТЫ КОНТАКТОВ БЕЗ АДРЕСОВ САЙТОВ
  contacts: {
    telegram: "/bakery_product_driver",
    instagram: "symnearone",
    email: "na1x.1024@gmail.com",
  },

  // 2. ДОБАВЛЕНЫ ШАБЛОНЫ СООБЩЕНИЙ В ПЕРЕВОДЫ ИНТЕРФЕЙСА
  translations: {
    ru: {
      navCatalog: "Каталог",
      navCustom: "Свой макет",
      navContacts: "Контакты",
      heroTitle: "Стильные цифровые пригласительные на вашу свадьбу",
      heroSubtitle:
        "Выберите готовый дизайн или предложите свою идею. Сделаем ваш день незабываемым с первых секунд!",
      catalogTitle: "Каталог шаблонов",
      btnDemo: "Смотреть демо",
      btnOrder: "Заказать",
      customTitle: "У вас есть свой макет или идея?",
      customSubtitle:
        "Мы с радостью воплотим её в жизнь! Отправьте нам референс или ТЗ в любой удобный мессенджер.",
      customBtn: "Обсудить свой дизайн",
      contactsTitle: "Связаться с нами",
      contactsSubtitle:
        "Выберите удобный способ связи для заказа или консультации:",
      modalTitle: "Оформить заказ",
      modalSubtitle:
        "Выберите удобный мессенджер или почту. Напишите нам, и мы обсудим все детали!",
      modalSelected: "Выбранный шаблон:",
      modalCustomOrder: "Индивидуальный заказ по вашему макету",
      noTemplates: "В этой категории пока нет шаблонов.",

      // Тексты автоматических сообщений (RU)
      msgDefault:
        "Здравствуйте! Хочу задать вопрос по поводу свадебных пригласительных.",
      msgCustom:
        "Здравствуйте! У меня есть свой макет, хочу обсудить индивидуальный заказ пригласительного.",
      msgTemplate:
        "Здравствуйте! Хочу заказать цифровое пригласительное по шаблону: ",
    },
    en: {
      navCatalog: "Catalog",
      navCustom: "Custom Design",
      navContacts: "Contacts",
      heroTitle: "Elegant Digital Wedding Invitations",
      heroSubtitle:
        "Choose a ready-made design or bring your own idea to life. Make your day memorable from the very start!",
      catalogTitle: "Our Templates",
      btnDemo: "Live Demo",
      btnOrder: "Order Now",
      customTitle: "Have your own layout or idea?",
      customSubtitle:
        "We will gladly bring it to life! Send us your reference or requirements via any messenger.",
      customBtn: "Discuss Custom Design",
      contactsTitle: "Contact Us",
      contactsSubtitle:
        "Choose a convenient way to contact us for orders or consultations:",
      modalTitle: "Place an Order",
      modalSubtitle:
        "Choose a messenger or email below. Text us, and we will discuss all the details!",
      modalSelected: "Selected template:",
      modalCustomOrder: "Custom design based on your layout",
      noTemplates: "No templates in this category yet.",

      // Тексты автоматических сообщений (EN)
      msgDefault:
        "Hello! I have a question regarding your wedding invitations.",
      msgCustom:
        "Hello! I have my own layout and would like to discuss a custom invitation design.",
      msgTemplate:
        "Hello! I would like to order a digital invitation template: ",
    },
  },

  // 3. БАЗА ДАННЫХ ВАШИХ ШАБЛОНОВ (ПОРТФОЛИО)
  templates: [
    {
      id: 1,
      style: "classic",
      image: "source/pre_img/classic.png", // ИСПРАВЛЕНО: путь к реальному файлу
      demoUrl: "classic_design/index.html", // Можете вставить ссылку на ваш тестовый github-лендинг
      title: {
        ru: "Нежная классика",
        en: "Gentle Classics",
      },
      description: {
        ru: "Минимализм, изящная каллиграфия и пастельные тона.",
        en: "Minimalism, elegant calligraphy, and pastel tones.",
      },
    },
    {
      id: 2,
      style: "elegance",
      image: "terracotta_design/terracotta.png", // ИСПРАВЛЕНО
      demoUrl: "terracotta_design/index.html",
      title: {
        ru: "Весення Элегантность",
        en: "Spring Elegance",
      },
      description: {
        ru: "Геометрические линии и глубокие золотые акценты.",
        en: "Geometric lines and deep golden accents.",
      },
    },
    //     {
    //         id: 3,
    //         style: "boho",
    //         image: "source/3.webp", // ИСПРАВЛЕНО
    //         demoUrl: "https://example.com",
    //         title: {
    //             ru: "Лесное Бохо",
    //             en: "Forest Boho"
    //         },
    //         description: {
    //             ru: "Пампасная трава, акварельные сухоцветы и теплота.",
    //             en: "Pampas grass, watercolor dried flowers, and warmth."
    //         }
    //     }
  ],
};
