// filepath: \src\js\api.js
const MENU_DATA_URL = "/data/menu.json";
const NPS_PARK_URL = "https://developer.nps.gov/api/v1/parks";
const NPS_API_KEY = import.meta.env.VITE_NPS_API_KEY;
const PARKS_DATA_URL = "/data/parks.json";

export async function fetchMenuData() {
  const response = await fetch(MENU_DATA_URL);
  if (!response.ok) throw new Error("Failed to load menu data");
  return response.json();
}

export async function fetchParkData(parkCode) {
  const response = await fetch(`${NPS_PARK_URL}?parkCode=${parkCode}`, {
    headers: { "X-Api-Key": NPS_API_KEY },
  });

  if (!response.ok) throw new Error("Failed to load park data");
  const payload = await response.json();
  return payload?.data?.[0] ?? null;
}

export async function fetchParkSelectorData() {
  const response = await fetch(PARKS_DATA_URL);
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data?.parkNames) ? data.parkNames : [];
}