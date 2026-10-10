// Изометрические SVG-иконки автопарка — объём через грани и тени, без 3D-рендера и внешних файлов.
// Геометрия и цвета — временная иллюстрация для карточек "Автопарк", не финальный брендинг.

const GROUND_Y = 92;
const DEPTH_DX = 14;
const DEPTH_DY = -8;

function isoBox(x0, w, h) {
  const FBL = [x0, GROUND_Y];
  const FBR = [x0 + w, GROUND_Y];
  const FTL = [x0, GROUND_Y - h];
  const FTR = [x0 + w, GROUND_Y - h];
  const BBR = [x0 + w + DEPTH_DX, GROUND_Y + DEPTH_DY];
  const BTL = [x0 + DEPTH_DX, GROUND_Y - h + DEPTH_DY];
  const BTR = [x0 + w + DEPTH_DX, GROUND_Y - h + DEPTH_DY];
  const poly = (pts) => pts.map((p) => p.join(',')).join(' ');
  return {
    top: poly([FTL, FTR, BTR, BTL]),
    front: poly([FBL, FBR, FTR, FTL]),
    side: poly([FBR, BBR, BTR, FTR]),
    frontTopY: GROUND_Y - h,
  };
}

function windshield(x0, w, bodyH, cabW) {
  const top = GROUND_Y - bodyH + 5;
  const bottom = GROUND_Y - bodyH * 0.48;
  const left = x0 + 4;
  const right = Math.min(x0 + cabW - 3, x0 + w - 3);
  return `<polygon class="van-glass" points="${left},${top} ${right},${top} ${right},${bottom} ${left},${bottom}" />`;
}

function wheel(cx) {
  return `<ellipse class="van-wheel" cx="${cx}" cy="${GROUND_Y + 1}" rx="8" ry="8" />`;
}

function stripe(x0, w, bodyH) {
  const y = GROUND_Y - bodyH * 0.22;
  return `<rect class="van-stripe" x="${x0 + 2}" y="${y}" width="${w - 4}" height="3" />`;
}

// Фургон (кабина и кузов — один объём): минивэн, газель, удлинённая газель.
function vanIcon({ x0, w, h, cabW, wheelXs, viewBox }) {
  const box = isoBox(x0, w, h);
  const svg = [
    `<polygon class="van-side" points="${box.side}" />`,
    `<polygon class="van-front" points="${box.front}" />`,
    `<polygon class="van-top" points="${box.top}" />`,
    windshield(x0, w, h, cabW),
    stripe(x0, w, h),
    ...wheelXs.map(wheel),
  ].join('');
  return `<svg class="van-icon" viewBox="${viewBox}">${svg}</svg>`;
}

// Грузовик: кабина — отдельный, ниже посаженный объём впереди высокого грузового отсека.
function truckIcon({ cabX0, cabW, cabH, cargoX0, cargoW, cargoH, wheelXs, viewBox }) {
  const cab = isoBox(cabX0, cabW, cabH);
  const cargo = isoBox(cargoX0, cargoW, cargoH);
  const svg = [
    `<polygon class="van-side" points="${cargo.side}" />`,
    `<polygon class="van-front" points="${cargo.front}" />`,
    `<polygon class="van-top" points="${cargo.top}" />`,
    `<polygon class="van-side" points="${cab.side}" />`,
    `<polygon class="van-front" points="${cab.front}" />`,
    `<polygon class="van-top" points="${cab.top}" />`,
    windshield(cabX0, cabW, cabH, cabW),
    stripe(cargoX0, cargoW, cargoH),
    ...wheelXs.map(wheel),
  ].join('');
  return `<svg class="van-icon" viewBox="${viewBox}">${svg}</svg>`;
}

const ICONS = {
  minivan: () =>
    vanIcon({ x0: 25, w: 70, h: 32, cabW: 24, wheelXs: [43, 83], viewBox: '0 0 130 104' }),
  gazelle_standard: () =>
    vanIcon({ x0: 14, w: 96, h: 40, cabW: 26, wheelXs: [34, 98], viewBox: '0 0 145 104' }),
  gazelle_long: () =>
    vanIcon({ x0: 5, w: 126, h: 40, cabW: 26, wheelXs: [25, 108, 122], viewBox: '0 0 165 104' }),
  truck: () =>
    truckIcon({
      cabX0: 18,
      cabW: 26,
      cabH: 30,
      cargoX0: 46,
      cargoW: 72,
      cargoH: 50,
      wheelXs: [31, 96, 110],
      viewBox: '0 0 155 118',
    }),
};

export function vehicleIconSvg(code) {
  const build = ICONS[code];
  return build ? build() : '';
}
