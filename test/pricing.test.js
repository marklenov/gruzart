import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice } from '../src/assets/js/pricing.js';

const tariffs = {
  vehicleClasses: [
    { code: 'minivan', name: 'Минивэн', hourlyRate: 3500 },
    { code: 'gazelle_standard', name: 'Газель', hourlyRate: 6000 },
    { code: 'gazelle_long', name: 'Газель увеличенная (4,2 м)', hourlyRate: 9000 },
    { code: 'truck', name: 'Грузовик', hourlyRate: 13000 },
  ],
  cargoCategories: [
    { code: 'few_boxes', name: 'Несколько коробок', suggestedVehicle: 'minivan', estimatedHours: 1 },
    { code: 'one_room', name: '1 комната', suggestedVehicle: 'gazelle_standard', estimatedHours: 2 },
    { code: 'two_rooms', name: '2 комнаты', suggestedVehicle: 'gazelle_standard', estimatedHours: 3 },
    { code: 'commercial', name: 'Коммерческий груз', suggestedVehicle: 'truck', estimatedHours: null },
  ],
  loaders: { pricePerHour: 2500, maxCount: 3 },
  minBillableHours: 2,
};

test('считает перевозку без грузчиков по часовой ставке класса', () => {
  const result = calculatePrice(tariffs, 'two_rooms', 0);
  assert.equal(result.needsManualQuote, false);
  assert.equal(result.vehicle.code, 'gazelle_standard');
  assert.equal(result.hours, 3);
  assert.equal(result.price, 3 * 6000);
});

test('применяет минимальные часы, даже если категория короче', () => {
  const result = calculatePrice(tariffs, 'few_boxes', 0);
  assert.equal(result.hours, 2, 'few_boxes.estimatedHours=1, но minBillableHours=2');
  assert.equal(result.price, 2 * 3500);
});

test('добавляет стоимость грузчиков пропорционально часам', () => {
  const result = calculatePrice(tariffs, 'one_room', 2);
  assert.equal(result.hours, 2);
  assert.equal(result.loaders, 2);
  assert.equal(result.price, 2 * 6000 + 2 * 2 * 2500);
});

test('не даёт больше грузчиков, чем maxCount', () => {
  const result = calculatePrice(tariffs, 'one_room', 99);
  assert.equal(result.loaders, 3);
});

test('коммерческий груз без estimatedHours требует ручного расчёта', () => {
  const result = calculatePrice(tariffs, 'commercial', 0);
  assert.equal(result.needsManualQuote, true);
  assert.equal(result.category.code, 'commercial');
});

test('неизвестная категория груза бросает ошибку', () => {
  assert.throws(() => calculatePrice(tariffs, 'nonexistent', 0));
});
