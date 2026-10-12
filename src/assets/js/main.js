import { calculatePrice } from './pricing.js';
import { translations, getLanguage, setLanguage, applyStaticText } from './i18n.js';

let tariffs = null;

function waLink(text) {
  const digits = tariffs.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

// Перерисовывает <select> новым списком опций, сохраняя выбранное значение (или ставя fallback).
function renderSelectOptions(select, options, fallbackValue) {
  const prevValue = select.value;
  select.innerHTML = options.map(({ value, label }) => `<option value="${value}">${label}</option>`).join('');
  select.value = options.some((o) => o.value === prevValue) ? prevValue : fallbackValue;
}

function renderFleet(lang) {
  const dict = translations[lang];
  const grid = document.getElementById('fleet-grid');
  grid.innerHTML = tariffs.vehicleClasses
    .map((v) => {
      const label = dict.vehicles[v.code] ?? { name: v.name, dims: v.approxDimensions };
      return `<div class="vehicle-card" data-reveal>
        <img class="van-photo" src="assets/img/fleet/${v.code}.webp" alt="${label.name}" loading="lazy" width="320" height="175">
        <h4>${label.name}</h4>
        <div class="dims">${label.dims}</div>
        <div class="rate">${dict.common.hourlyFrom(v.hourlyRate)}</div>
      </div>`;
    })
    .join('');
}

function renderTrust(lang) {
  const dict = translations[lang];
  document.getElementById('trust-list').innerHTML = dict.trust.items
    .map((item) => `<li data-reveal>${item}</li>`)
    .join('');
}

function renderCargoOptions(lang) {
  const dict = translations[lang];
  const select = document.getElementById('cargo-select');
  const options = tariffs.cargoCategories.map((c) => ({ value: c.code, label: dict.cargo[c.code] ?? c.name }));
  renderSelectOptions(select, options, options[0]?.value);
}

function renderLoaderOptions(lang) {
  const dict = translations[lang];
  const select = document.getElementById('loaders-select');
  const options = [];
  for (let n = 0; n <= tariffs.loaders.maxCount; n++) {
    options.push({ value: String(n), label: dict.common.loaderLabel(n) });
  }
  renderSelectOptions(select, options, '0');
}

// Чек-лист вещей для категории "Утилизация" — сохраняет отмеченные пункты при перерисовке.
function renderDisposalItems(lang) {
  const dict = translations[lang];
  const list = document.getElementById('disposal-items-list');
  const checked = new Set(
    Array.from(list.querySelectorAll('input:checked')).map((input) => input.value),
  );
  list.innerHTML = tariffs.disposalItems
    .map((item) => {
      const label = dict.disposalItems[item.code] ?? item.name;
      const isChecked = checked.has(item.code) ? 'checked' : '';
      return `<label class="checkbox-item">
        <input type="checkbox" value="${item.code}" class="disposal-item-checkbox" ${isChecked}>
        ${label}
      </label>`;
    })
    .join('');
  list.querySelectorAll('.disposal-item-checkbox').forEach((input) => {
    input.addEventListener('change', () => updateCalculator(getLanguage()));
  });
}

function getCheckedDisposalLabels(lang) {
  const dict = translations[lang];
  return Array.from(document.querySelectorAll('.disposal-item-checkbox:checked')).map((input) => {
    const item = tariffs.disposalItems.find((i) => i.code === input.value);
    return dict.disposalItems[input.value] ?? item?.name ?? input.value;
  });
}

function updateCalculator(lang) {
  const dict = translations[lang];
  const cargoCode = document.getElementById('cargo-select').value;
  const isDisposal = cargoCode === 'disposal';
  const loadersField = document.getElementById('loaders-field');
  const disposalField = document.getElementById('disposal-items-field');
  loadersField.hidden = isDisposal;
  disposalField.hidden = !isDisposal;

  const loaderCount = isDisposal ? 0 : parseInt(document.getElementById('loaders-select').value, 10) || 0;
  const resultEl = document.getElementById('calc-result');
  const metaEl = document.getElementById('calc-result-meta');
  const waBtn = document.getElementById('calc-wa-btn');

  const result = calculatePrice(tariffs, cargoCode, loaderCount);

  if (result.needsManualQuote) {
    resultEl.textContent = dict.calc.manualTitle;
    metaEl.textContent = dict.calc.manualHint;
    waBtn.href = waLink(dict.common.waManual());
    return;
  }

  const vehicleLabel = dict.vehicles[result.vehicle.code]?.name ?? result.vehicle.name;

  resultEl.textContent = dict.common.resultPrice(result.price);
  metaEl.textContent = dict.common.resultMeta(vehicleLabel, result.hours, result.loaders);

  if (isDisposal) {
    const itemLabels = getCheckedDisposalLabels(lang);
    const itemsText = itemLabels.length ? itemLabels.join(', ') : dict.calc.disposalNoneSelected;
    waBtn.href = waLink(dict.common.waDisposal(itemsText, vehicleLabel, result.price));
  } else {
    const cargoLabel = dict.cargo[result.category.code] ?? result.category.name;
    waBtn.href = waLink(dict.common.waOrder(cargoLabel, vehicleLabel, result.price));
  }
}

// Плавно показывает элементы с [data-reveal], когда они входят в область видимости при скролле.
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]:not(.is-visible)');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );
  items.forEach((el) => observer.observe(el));
}

function updateStickyContact(lang) {
  const waBtn = document.getElementById('sticky-wa-btn');
  if (!waBtn) return;
  waBtn.href = waLink(translations[lang].common.waGeneral());
}

function renderAll(lang) {
  applyStaticText(lang);
  renderFleet(lang);
  renderTrust(lang);
  renderCargoOptions(lang);
  renderLoaderOptions(lang);
  renderDisposalItems(lang);
  updateCalculator(lang);
  updateStickyContact(lang);
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  initScrollReveal();
}

// Показывает плавающую панель контактов, когда хиро (со своими кнопками) уже проскроллен.
function initStickyContact() {
  const panel = document.getElementById('sticky-contact');
  const hero = document.querySelector('.hero-photo');
  if (!panel) return;
  if (!hero || !('IntersectionObserver' in window)) {
    panel.classList.add('is-visible');
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        panel.classList.toggle('is-visible', !entry.isIntersecting);
      });
    },
    { threshold: 0 },
  );
  observer.observe(hero);
}

function initLanguageToggle() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
      renderAll(btn.dataset.lang);
    });
  });
}

function initCalculatorEvents() {
  document.getElementById('cargo-select').addEventListener('change', () => updateCalculator(getLanguage()));
  document.getElementById('loaders-select').addEventListener('change', () => updateCalculator(getLanguage()));
}

// Декоративные падающие листья в хиро — чисто CSS-анимация, JS только расставляет случайные параметры.
function initAutumnLeaves() {
  const hero = document.querySelector('.hero');
  const zone = document.querySelector('.leaves-zone');
  if (!hero || !zone) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fallDistance = hero.offsetHeight + 60;
  const COUNT = 12;
  for (let i = 0; i < COUNT; i++) {
    const leaf = document.createElement('span');
    leaf.className = `leaf leaf-${(i % 4) + 1}`;
    const duration = 9 + Math.random() * 7;
    const delay = -Math.random() * duration;
    const size = 12 + Math.random() * 10;
    const drift = Math.round(Math.random() * 60 - 30);
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.setProperty('--fall', `${fallDistance}px`);
    leaf.style.setProperty('--duration', `${duration}s`);
    leaf.style.setProperty('--delay', `${delay}s`);
    leaf.style.setProperty('--size', `${size}px`);
    leaf.style.setProperty('--drift', `${drift}px`);
    zone.appendChild(leaf);
  }
}

async function init() {
  const res = await fetch('data/tariffs.json');
  tariffs = await res.json();
  const telHref = `tel:+${tariffs.whatsapp.replace(/\D/g, '')}`;
  document.querySelectorAll('[data-tel-link]').forEach((el) => {
    el.href = telHref;
  });
  initLanguageToggle();
  initCalculatorEvents();
  initAutumnLeaves();
  initStickyContact();
  renderAll(getLanguage());
}

init();
