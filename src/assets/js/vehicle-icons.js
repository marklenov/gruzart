// Flat-иллюстрации автопарка (карикатурный стиль): плоские силуэты, жирный контур,
// без фотореализма и без изометрии. Пропорции подсмотрены на реальных фото (HiAce,
// ГАЗель Next тентованная, грузовик-фургон) — но это самостоятельный рисунок,
// не обработка чужих фотографий. Геометрия — временная иллюстрация, не финальный брендинг.

const BASELINE = 82;
const WHEEL_R = 13;
const HUB_R = 5;

function wheels(xs) {
  return xs
    .map(
      (x) =>
        `<circle class="van-wheel" cx="${x}" cy="${BASELINE}" r="${WHEEL_R}"/>` +
        `<circle class="van-hub" cx="${x}" cy="${BASELINE}" r="${HUB_R}"/>`,
    )
    .join('');
}

// Плоская вертикальная кабина (газель/грузовик) с окном и декоративной решёткой радиатора.
function cab(x0, w, y0) {
  const cx0 = x0 + 6;
  const cw = w - 12;
  return (
    `<rect class="van-body" x="${x0}" y="${y0}" width="${w}" height="${BASELINE - y0}" rx="8" stroke-linejoin="round"/>` +
    `<rect class="van-window" x="${cx0}" y="${y0 + 6}" width="${cw}" height="${(BASELINE - y0) * 0.4}" rx="5"/>` +
    `<line class="van-rib" x1="${x0 + 4}" y1="${BASELINE - 9}" x2="${x0 + w - 4}" y2="${BASELINE - 9}"/>`
  );
}

// Арочная тентованная будка (газель): плоская с боков, округлый верх — как натянутый тент.
function tentCargo(x0, x1, apexY, ribXs, toneClass) {
  const arch = 18;
  const d =
    `M ${x0} ${BASELINE} L ${x0} ${apexY + arch} Q ${x0} ${apexY} ${x0 + arch} ${apexY} ` +
    `L ${x1 - arch} ${apexY} Q ${x1} ${apexY} ${x1} ${apexY + arch} L ${x1} ${BASELINE} Z`;
  const ribs = ribXs
    .map((x) => `<line class="van-rib" x1="${x}" y1="${apexY + 2}" x2="${x}" y2="${BASELINE - 1}"/>`)
    .join('');
  return `<path class="${toneClass}" d="${d}" stroke-linejoin="round"/>${ribs}`;
}

// Минивэн (силуэт в духе Toyota HiAce) — скруглённый нос вместо плоской кабины.
function minivanSvg() {
  const body = `M 150 ${BASELINE} L 150 34 L 62 34 Q 28 34 22 56 Q 18 70 26 ${BASELINE} Z`;
  return `<svg class="van-icon" viewBox="0 0 170 100">
    <path class="van-body" d="${body}" stroke-linejoin="round"/>
    <polygon class="van-window" points="40,40 60,40 56,58 36,58"/>
    <rect class="van-window" x="66" y="40" width="74" height="18" rx="6"/>
    <line class="van-rib" x1="140" y1="40" x2="140" y2="58"/>
    ${wheels([50, 120])}
  </svg>`;
}

function gazelleSvg({ viewBox, tentEnd, apexY, ribXs, wheelXs, toneClass }) {
  return `<svg class="van-icon" viewBox="${viewBox}">
    ${cab(15, 35, 38)}
    ${tentCargo(50, tentEnd, apexY, ribXs, toneClass)}
    ${wheels(wheelXs)}
  </svg>`;
}

// Грузовик (силуэт в духе среднего фургона-бокса) — высокая плоская кабина + светлый сплошной кузов.
function truckSvg() {
  return `<svg class="van-icon" viewBox="0 0 200 100">
    ${cab(15, 38, 30)}
    <rect class="van-box" x="55" y="15" width="125" height="67" rx="6" stroke-linejoin="round"/>
    <rect class="van-stripe-flat" x="58" y="62" width="119" height="5" />
    ${wheels([33, 150, 168])}
  </svg>`;
}

const ICONS = {
  minivan: minivanSvg,
  gazelle_standard: () =>
    gazelleSvg({
      viewBox: '0 0 170 100',
      tentEnd: 150,
      apexY: 35,
      ribXs: [80, 115],
      wheelXs: [33, 130],
      toneClass: 'van-tent',
    }),
  gazelle_long: () =>
    gazelleSvg({
      viewBox: '0 0 210 100',
      tentEnd: 195,
      apexY: 26,
      ribXs: [80, 115, 150, 180],
      wheelXs: [33, 185],
      toneClass: 'van-tent-long',
    }),
  truck: truckSvg,
};

export function vehicleIconSvg(code) {
  const build = ICONS[code];
  return build ? build() : '';
}
