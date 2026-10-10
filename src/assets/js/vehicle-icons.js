// Flat-иллюстрации автопарка (карикатурный стиль): плоские силуэты, жирный контур,
// без фотореализма и без изометрии. Геометрия — временная иллюстрация для карточек
// "Автопарк", не финальный брендинг.

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

function cab(x0, w, y0) {
  const cx0 = x0 + 6;
  const cw = w - 12;
  return (
    `<rect class="van-body" x="${x0}" y="${y0}" width="${w}" height="${BASELINE - y0}" rx="8" stroke-linejoin="round"/>` +
    `<rect class="van-window" x="${cx0}" y="${y0 + 6}" width="${cw}" height="${(BASELINE - y0) * 0.4}" rx="5"/>`
  );
}

// Арочная тентованная будка (газель): плоская с боков, округлый верх — как натянутый тент.
function tentCargo(x0, x1, apexY, ribXs) {
  const arch = 18;
  const d =
    `M ${x0} ${BASELINE} L ${x0} ${apexY + arch} Q ${x0} ${apexY} ${x0 + arch} ${apexY} ` +
    `L ${x1 - arch} ${apexY} Q ${x1} ${apexY} ${x1} ${apexY + arch} L ${x1} ${BASELINE} Z`;
  const ribs = ribXs
    .map((x) => `<line class="van-rib" x1="${x}" y1="${apexY + 2}" x2="${x}" y2="${BASELINE - 1}"/>`)
    .join('');
  return `<path class="van-tent" d="${d}" stroke-linejoin="round"/>${ribs}`;
}

function minivanSvg() {
  return `<svg class="van-icon" viewBox="0 0 170 100">
    <rect class="van-body" x="20" y="28" width="130" height="54" rx="16" stroke-linejoin="round"/>
    <rect class="van-window" x="30" y="36" width="95" height="20" rx="8"/>
    <line class="van-rib" x1="95" y1="38" x2="95" y2="80"/>
    ${wheels([55, 120])}
  </svg>`;
}

function gazelleSvg({ viewBox, tentEnd, ribXs, wheelXs }) {
  return `<svg class="van-icon" viewBox="${viewBox}">
    ${cab(15, 35, 38)}
    ${tentCargo(50, tentEnd, 35, ribXs)}
    ${wheels(wheelXs)}
  </svg>`;
}

function truckSvg() {
  return `<svg class="van-icon" viewBox="0 0 200 100">
    ${cab(15, 38, 42)}
    <rect class="van-box" x="55" y="15" width="125" height="67" rx="6" stroke-linejoin="round"/>
    <rect class="van-stripe-flat" x="58" y="50" width="119" height="5" />
    ${wheels([33, 150, 168])}
  </svg>`;
}

const ICONS = {
  minivan: minivanSvg,
  gazelle_standard: () =>
    gazelleSvg({ viewBox: '0 0 170 100', tentEnd: 150, ribXs: [80, 115], wheelXs: [33, 130] }),
  gazelle_long: () =>
    gazelleSvg({ viewBox: '0 0 210 100', tentEnd: 195, ribXs: [80, 115, 150, 180], wheelXs: [33, 175, 193] }),
  truck: truckSvg,
};

export function vehicleIconSvg(code) {
  const build = ICONS[code];
  return build ? build() : '';
}
