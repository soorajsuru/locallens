export const selectedCityStorageKey = "locallens:selected-city";

export function getStoredSelectedCity() {
  if (typeof window === "undefined") return "";

  return window.localStorage.getItem(selectedCityStorageKey) ?? "";
}

export function storeSelectedCity(city: string) {
  if (typeof window === "undefined") return;

  if (city) {
    window.localStorage.setItem(selectedCityStorageKey, city);
  } else {
    window.localStorage.removeItem(selectedCityStorageKey);
  }
}
