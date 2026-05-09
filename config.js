(function () {
  window.MiniAnkiConfig = {
    STORAGE_KEY: "mini-anki-cards-v1",
    API_KEY_STORAGE_KEY: "mini-anki-openai-key-v1",
    SETTINGS_KEY: "mini-anki-settings-v1",
    THEME_STORAGE_KEY: "mini-anki-theme-v1",
    UI_LANGUAGE_STORAGE_KEY: "mini-anki-ui-language-v1",
    DEFAULT_DICTIONARY: "Prosty słownik",
    OPENAI_MODEL: "gpt-5.5",
    TTS_MODEL: "gpt-4o-mini-tts",
    TTS_VOICE: "coral",
    defaultSettings: {
      newCardsPerDay: 20
    },
    languageOptions: [
      { code: "pl", names: { pl: "polski", en: "Polish" }, apiName: "Polish" },
      { code: "en", names: { pl: "angielski", en: "English" }, apiName: "English" },
      { code: "de", names: { pl: "niemiecki", en: "German" }, apiName: "German" },
      { code: "es", names: { pl: "hiszpański", en: "Spanish" }, apiName: "Spanish" },
      { code: "fr", names: { pl: "francuski", en: "French" }, apiName: "French" },
      { code: "it", names: { pl: "włoski", en: "Italian" }, apiName: "Italian" },
      { code: "pt", names: { pl: "portugalski", en: "Portuguese" }, apiName: "Portuguese" },
      { code: "uk", names: { pl: "ukraiński", en: "Ukrainian" }, apiName: "Ukrainian" },
      { code: "ru", names: { pl: "rosyjski", en: "Russian" }, apiName: "Russian" },
      { code: "cs", names: { pl: "czeski", en: "Czech" }, apiName: "Czech" },
      { code: "sv", names: { pl: "szwedzki", en: "Swedish" }, apiName: "Swedish" },
      { code: "no", names: { pl: "norweski", en: "Norwegian" }, apiName: "Norwegian" },
      { code: "nl", names: { pl: "niderlandzki", en: "Dutch" }, apiName: "Dutch" },
      { code: "ja", names: { pl: "japoński", en: "Japanese" }, apiName: "Japanese" },
      { code: "ko", names: { pl: "koreański", en: "Korean" }, apiName: "Korean" },
      { code: "zh", names: { pl: "chiński", en: "Chinese" }, apiName: "Chinese" }
    ],
    reviewIntervals: [
      5,
      10,
      60 * 24,
      60 * 24 * 3,
      60 * 24 * 7,
      60 * 24 * 15,
      60 * 24 * 30,
      60 * 24 * 60,
      60 * 24 * 120
    ]
  };
}());
