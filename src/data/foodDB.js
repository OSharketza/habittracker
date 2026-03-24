import { extendedFoodDB } from './extendedFoodDB';
import { generatedFoodDB } from './generatedFoodDB';
import { indianFoodDB } from './indianFoodDB';

const normalizeName = (value = '') =>
  value
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const withDefaults = (item) => ({
  ...item,
  category: item.category || 'Indian',
  diet: item.diet || 'unknown',
  serving: item.serving || '1 serving'
});

const mergedMap = new Map();

[
  ...extendedFoodDB.map(withDefaults),
  ...indianFoodDB.map(withDefaults),
  ...generatedFoodDB.map(withDefaults)
].forEach((item) => {
  mergedMap.set(normalizeName(item.name), item);
});

export const foodDB = Array.from(mergedMap.values()).sort((a, b) =>
  a.name.localeCompare(b.name)
);
