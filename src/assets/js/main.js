import { calculatePrice } from './pricing.js';
import { translations, getLanguage, setLanguage, applyStaticText } from './i18n.js';
import { vehicleIconSvg } from './vehicle-icons.js';

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
      return `<div class="vehicle-card">
        ${vehicleIconSvg(v.code)}
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
    .map((item) => `<li>${item}</li>`)
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

function updateCalculator(lang) {
  const dict = translations[lang];
  const cargoCode = document.getElementById('cargo-select').value;
  const loaderCount = parseInt(document.getElementById('loaders-select').value, 10) || 0;
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
  const cargoLabel = dict.cargo[result.category.code] ?? result.category.name;

  resultEl.textContent = dict.common.resultPrice(result.price);
  metaEl.textContent = dict.common.resultMeta(vehicleLabel, result.hours, result.loaders);
  waBtn.href = waLink(dict.common.waOrder(cargoLabel, vehicleLabel, result.price));
}

function renderAll(lang) {
  applyStaticText(lang);
  renderFleet(lang);
  renderTrust(lang);
  renderCargoOptions(lang);
  renderLoaderOptions(lang);
  updateCalculator(lang);
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
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

async function init() {
  const res = await fetch('data/tariffs.json');
  tariffs = await res.json();
  const telHref = `tel:+${tariffs.whatsapp.replace(/\D/g, '')}`;
  document.querySelectorAll('[data-tel-link]').forEach((el) => {
    el.href = telHref;
  });
  initLanguageToggle();
  initCalculatorEvents();
  renderAll(getLanguage());
}

init();
