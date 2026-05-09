(function () {
  const {
    STORAGE_KEY,
    API_KEY_STORAGE_KEY,
    SETTINGS_KEY,
    THEME_STORAGE_KEY,
    UI_LANGUAGE_STORAGE_KEY,
    defaultSettings
  } = window.MiniAnkiConfig;
  const { normalizeCard, normalizeSettings } = window.MiniAnkiCards;

  function loadCards() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeCard) : [];
    } catch {
      return [];
    }
  }

  function saveCards(cards) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }

  function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) {
      return { ...defaultSettings };
    }

    try {
      return normalizeSettings(JSON.parse(saved));
    } catch {
      return { ...defaultSettings };
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function loadTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" ? "dark" : "light";
  }

  function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  function loadUiLanguage() {
    const saved = localStorage.getItem(UI_LANGUAGE_STORAGE_KEY);
    return saved === "en" ? "en" : "pl";
  }

  function saveUiLanguage(language) {
    localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, language);
  }

  function loadApiKey() {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
  }

  function saveApiKey(apiKey) {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
  }

  window.MiniAnkiStorage = {
    loadCards,
    saveCards,
    loadSettings,
    saveSettings,
    loadTheme,
    saveTheme,
    loadUiLanguage,
    saveUiLanguage,
    loadApiKey,
    saveApiKey
  };
}());
