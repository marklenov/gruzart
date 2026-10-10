// Переводы черновые — казахский текст рекомендуется проверить носителем перед запуском.
const fmt = (n) => n.toLocaleString('ru-RU');

function ruPlural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export const translations = {
  ru: {
    nav: { services: 'Услуги', fleet: 'Автопарк', reviews: 'Отзывы' },
    header: { call: 'Позвонить', calc: 'Рассчитать' },
    hero: {
      eyebrow: 'Грузоперевозки в Астане',
      titleLine1: 'Перевезём всё.',
      titleLine2: 'От дивана до офиса.',
      lede: 'Газель, грузчики и доп. услуги — с ценой, которую видно заранее, до звонка.',
      ctaCall: 'Позвонить сейчас',
      ctaFleet: 'Смотреть автопарк',
    },
    calc: {
      title: 'Умный калькулятор',
      hint: 'Выберите, что везём — цену увидите сразу',
      cargoLabel: 'Что перевозим',
      loadersLabel: 'Нужны грузчики',
      resultHint: 'Точная цена фиксируется в WhatsApp перед выездом',
      waButton: 'Отправить в WhatsApp',
      manualTitle: 'Нужен индивидуальный расчёт',
      manualHint: 'Напишите параметры в WhatsApp — ответим в течение рабочего дня',
    },
    fleet: { title: 'Автопарк', sub: 'Берём машину с запасом — лишнее не оплачивается' },
    vehicles: {
      minivan: { name: 'Минивэн', dims: 'до 4–5 м³, до 1 т' },
      gazelle_standard: { name: 'Газель', dims: 'до 12–14 м³, до 1.5 т' },
      gazelle_long: { name: 'Газель увеличенная (4,2 м)', dims: 'до 18–20 м³, до 2 т' },
      truck: { name: 'Грузовик', dims: 'до 30+ м³, до 5 т' },
    },
    cargo: {
      few_boxes: 'Несколько коробок',
      appliances: 'Бытовая техника',
      disposal: 'Утилизация старой техники/мебели',
      one_room: '1 комната',
      two_rooms: '2 комнаты',
      three_plus_or_office: '3+ комнат / офис',
      commercial: 'Коммерческий груз',
    },
    services: {
      title: 'Что входит в заявку',
      sub: 'Можно собрать всё в одном сообщении в WhatsApp',
      transportTitle: 'Грузоперевозки',
      transportBody: 'По Астане, почасово, любой класс транспорта из автопарка.',
      loadersTitle: 'Грузчики',
      loadersBody: 'Погрузка, разгрузка, подъём на этаж без лифта.',
      extraTitle: 'Доп. услуги',
      extraBody: 'Упаковка и сборка мебели — уточняйте в заявке, считаем индивидуально.',
    },
    trust: {
      title: 'Почему GRUZART',
      items: [
        'Цена видна заранее — считает калькулятор, а не «на глаз»',
        'Связь в один клик — пишем в WhatsApp, без долгих звонков',
        'Выбор машины под объём — не платите за лишний тоннаж',
        'Прозрачный расчёт грузчиков — часы и количество видно заранее',
      ],
    },
    reviews: { title: 'Отзывы', placeholder: 'Здесь появятся отзывы первых клиентов GRUZART.' },
    finalCta: { title: 'Нужно перевезти? GRUZART сделает это за вас.', button: 'Рассчитать стоимость' },
    footer: { copyright: '© GRUZART, Астана', privacy: 'Политика конфиденциальности' },
    privacy: {
      title: 'Политика конфиденциальности',
      home: 'На главную',
      back: '← На главную',
      pendingNotice:
        'Юридический текст на этой странице пока только на русском — казахский перевод добавим после проверки юристом.',
    },
    common: {
      hourlyFrom: (price) => `от ${fmt(price)} ₸/ч`,
      resultPrice: (price) => `≈ ${fmt(price)} ₸`,
      loaderLabel: (n) => (n === 0 ? 'Без грузчиков' : `${n} ${ruPlural(n, 'грузчик', 'грузчика', 'грузчиков')}`),
      resultMeta: (vehicleName, hours, loaders) =>
        `${vehicleName}, ${hours} ч${loaders ? ', ' + loaders + ' груз.' : ''}`,
      waOrder: (cargoName, vehicleName, price) =>
        `Здравствуйте! Хочу заказать: ${cargoName}, ${vehicleName}, ориентировочно ${fmt(price)} ₸.`,
      waManual: () => 'Здравствуйте! Хочу уточнить стоимость перевозки коммерческого груза.',
    },
  },
  kk: {
    nav: { services: 'Қызметтер', fleet: 'Автопарк', reviews: 'Пікірлер' },
    header: { call: 'Қоңырау шалу', calc: 'Есептеу' },
    hero: {
      eyebrow: 'Астанадағы жүк тасымалы',
      titleLine1: 'Бәрін тасымалдаймыз.',
      titleLine2: 'Диваннан офиске дейін.',
      lede: 'Газель, жүк тасушылар және қосымша қызметтер — бағасы қоңырау шалмай-ақ алдын ала белгілі.',
      ctaCall: 'Қазір қоңырау шалу',
      ctaFleet: 'Автопаркті көру',
    },
    calc: {
      title: 'Ақылды калькулятор',
      hint: 'Не тасымалдайтыныңызды таңдаңыз — бағасы бірден көрінеді',
      cargoLabel: 'Не тасымалдаймыз',
      loadersLabel: 'Жүк тасушылар қажет пе',
      resultHint: 'Нақты баға шығу алдында WhatsApp-та бекітіледі',
      waButton: 'WhatsApp-қа жіберу',
      manualTitle: 'Жеке есептеу қажет',
      manualHint: 'Параметрлерді WhatsApp-қа жазыңыз — жұмыс күні ішінде жауап береміз',
    },
    fleet: { title: 'Автопарк', sub: 'Көлікті қорымен аламыз — артығына төлемейсіз' },
    vehicles: {
      minivan: { name: 'Минивэн', dims: '4–5 м³-ге дейін, 1 т-ға дейін' },
      gazelle_standard: { name: 'Газель', dims: '12–14 м³-ге дейін, 1.5 т-ға дейін' },
      gazelle_long: { name: 'Ұзартылған Газель (4,2 м)', dims: '18–20 м³-ге дейін, 2 т-ға дейін' },
      truck: { name: 'Жүк көлігі', dims: '30+ м³-ге дейін, 5 т-ға дейін' },
    },
    cargo: {
      few_boxes: 'Бірнеше қорап',
      appliances: 'Тұрмыстық техника',
      disposal: 'Ескі техника мен жиһазды шығару',
      one_room: '1 бөлме',
      two_rooms: '2 бөлме',
      three_plus_or_office: '3+ бөлме / офис',
      commercial: 'Коммерциялық жүк',
    },
    services: {
      title: 'Өтінімге не кіреді',
      sub: 'Барлығын WhatsApp-та бір хабарламамен жинауға болады',
      transportTitle: 'Жүк тасымалы',
      transportBody: 'Астана бойынша, сағаттық, автопарктегі кез келген көлік класы.',
      loadersTitle: 'Жүк тасушылар',
      loadersBody: 'Тиеу, түсіру, лифтісіз қабатқа көтеру.',
      extraTitle: 'Қосымша қызметтер',
      extraBody: 'Жинау және жиһаз құрастыру — өтінімде нақтылаңыз, жеке есептейміз.',
    },
    trust: {
      title: 'Неге GRUZART',
      items: [
        'Баға алдын ала белгілі — калькулятор есептейді, «болжамен» емес',
        'Бір түртумен байланыс — ұзақ қоңыраусыз WhatsApp-қа жазамыз',
        'Көлем бойынша көлік таңдау — артық тоннаж үшін төлемейсіз',
        'Жүк тасушылар есебі ашық — сағат және адам саны алдын ала белгілі',
      ],
    },
    reviews: { title: 'Пікірлер', placeholder: 'Мұнда GRUZART-тың алғашқы клиенттерінің пікірлері пайда болады.' },
    finalCta: { title: 'Тасымалдау керек пе? GRUZART бұны сіз үшін жасайды.', button: 'Бағасын есептеу' },
    footer: { copyright: '© GRUZART, Астана', privacy: 'Құпиялық саясаты' },
    privacy: {
      title: 'Құпиялық саясаты',
      home: 'Басты бетке',
      back: '← Басты бетке',
      pendingNotice:
        'Бұл беттегі заңды мәтін қазірше тек орыс тілінде — қазақша аудармасын заңгер тексерісінен кейін қосамыз.',
    },
    common: {
      hourlyFrom: (price) => `${fmt(price)} ₸/сағ-тан`,
      resultPrice: (price) => `≈ ${fmt(price)} ₸`,
      loaderLabel: (n) => (n === 0 ? 'Жүк тасушыларсыз' : `${n} жүк тасушы`),
      resultMeta: (vehicleName, hours, loaders) =>
        `${vehicleName}, ${hours} сағ${loaders ? ', ' + loaders + ' жүк тас.' : ''}`,
      waOrder: (cargoName, vehicleName, price) =>
        `Сәлеметсіз бе! Тапсырыс беруді қалаймын: ${cargoName}, ${vehicleName}, болжам бойынша ${fmt(price)} ₸.`,
      waManual: () => 'Сәлеметсіз бе! Коммерциялық жүк тасымалының құнын нақтылағым келеді.',
    },
  },
};

const STORAGE_KEY = 'gruzart.lang';

export function getLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ru' || saved === 'kk') return saved;
  } catch {
    // localStorage недоступен (приватный режим и т.п.) — используем язык по умолчанию
  }
  return 'ru';
}

export function setLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // игнорируем — просто не запомним выбор между визитами
  }
}

export function applyStaticText(lang) {
  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const path = el.getAttribute('data-i18n').split('.');
    let value = dict;
    for (const key of path) value = value?.[key];
    if (typeof value === 'string') el.textContent = value;
  });
  document.documentElement.lang = lang === 'kk' ? 'kk' : 'ru';
}
