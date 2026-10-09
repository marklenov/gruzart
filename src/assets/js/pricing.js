export function calculatePrice(tariffs, cargoCode, loaderCount) {
  const category = tariffs.cargoCategories.find((c) => c.code === cargoCode);
  if (!category) {
    throw new Error(`Unknown cargo category: ${cargoCode}`);
  }

  if (category.estimatedHours == null) {
    return { needsManualQuote: true, category };
  }

  const vehicle = tariffs.vehicleClasses.find((v) => v.code === category.suggestedVehicle);
  const hours = Math.max(tariffs.minBillableHours, category.estimatedHours);
  const loaders = Math.max(0, Math.min(tariffs.loaders.maxCount, loaderCount || 0));
  const price = hours * vehicle.hourlyRate + loaders * hours * tariffs.loaders.pricePerHour;

  return { needsManualQuote: false, category, vehicle, hours, loaders, price };
}
