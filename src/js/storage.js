// filepath: \src\js\storage.js
const FAVORITES_KEY = "favorite-parks";

export function readFavorites() {
  const value = localStorage.getItem(FAVORITES_KEY);
  return value ? JSON.parse(value) : [];
}

export function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

export function addFavorite(park) {
  const favorites = readFavorites();
  const exists = favorites.some((p) => p.parkCode === park.parkCode);
  if (!exists) {
    favorites.push(park);
    saveFavorites(favorites);
  }
}

export function removeFavorite(parkCode) {
  const updated = readFavorites().filter((p) => p.parkCode !== parkCode);
  saveFavorites(updated);
  return updated;
}