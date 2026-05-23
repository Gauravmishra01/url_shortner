const localStorageKey = "urlshortner.auth.token";
const sessionStorageKey = "urlshortner.auth.token.session";

const canUseStorage = () => typeof window !== "undefined";

export const getStoredAuthToken = () => {
  if (!canUseStorage()) return "";

  try {
    return (
      window.localStorage.getItem(localStorageKey) ||
      window.sessionStorage.getItem(sessionStorageKey) ||
      ""
    );
  } catch {
    return "";
  }
};

export const setStoredAuthToken = (token, { persistent = true } = {}) => {
  if (!canUseStorage()) return;

  try {
    window.localStorage.removeItem(localStorageKey);
    window.sessionStorage.removeItem(sessionStorageKey);

    if (!token) return;

    const storage = persistent ? window.localStorage : window.sessionStorage;
    storage.setItem(persistent ? localStorageKey : sessionStorageKey, token);
  } catch {
    // Ignore storage failures on constrained mobile browsers.
  }
};

export const clearStoredAuthToken = () => {
  if (!canUseStorage()) return;

  try {
    window.localStorage.removeItem(localStorageKey);
    window.sessionStorage.removeItem(sessionStorageKey);
  } catch {
    // Ignore storage failures on constrained mobile browsers.
  }
};
