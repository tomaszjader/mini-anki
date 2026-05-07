const STORAGE_KEY = "mini-anki-cards-v1";
const API_KEY_STORAGE_KEY = "mini-anki-openai-key-v1";
const SETTINGS_KEY = "mini-anki-settings-v1";
const THEME_STORAGE_KEY = "mini-anki-theme-v1";
const UI_LANGUAGE_STORAGE_KEY = "mini-anki-ui-language-v1";
const OPENAI_MODEL = "gpt-5.5";
const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "coral";

const defaultSettings = {
  newCardsPerDay: 20
};

const languageOptions = [
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
];

const translations = {
  pl: {
    appSubtitle: "Proste fiszki do słówek po polsku i angielsku.",
    uiLanguage: "Język",
    polishUi: "Polski",
    englishUi: "Angielski",
    darkTheme: "Ciemny motyw",
    lightTheme: "Jasny motyw",
    statsAria: "Statystyki",
    totalCardsLabel: "kart",
    dueCardsLabel: "do nauki",
    newCardsLeftLabel: "nowych dziś",
    studiedTodayLabel: "dziś",
    workspaceAria: "Aplikacja fiszek",
    tabsAria: "Widoki",
    studyTab: "Nauka",
    addTab: "Dodaj",
    cardsTab: "Karty",
    studyViewAria: "Nauka",
    addViewAria: "Dodawanie słówek",
    cardsViewAria: "Lista kart",
    noDueTitle: "Nie ma kart do powtórki",
    noDueText: "Dodaj słówko albo wróć później, gdy karta będzie gotowa do nauki.",
    playWord: "Odtwórz słowo",
    playSentence: "Odtwórz zdanie",
    showAnswer: "Pokaż odpowiedź",
    again: "Jeszcze raz",
    hard: "Trudna",
    good: "Umiem",
    easy: "Łatwa",
    suspend: "Wstrzymaj",
    dictionary: "Słownik",
    newDictionaryName: "Nazwa nowego słownika",
    knownLanguage: "Znam",
    learningLanguage: "Uczę się",
    apiKey: "Klucz OpenAI API",
    apiKeyHelp: "Klucz jest zapisany tylko w tej przeglądarce. Do prywatnej lokalnej nauki.",
    generateAi: "Generuj AI",
    addCard: "Dodaj kartę",
    clear: "Wyczyść",
    searchPlaceholder: "Szukaj słówka",
    dictionaryFilterAria: "Filtr słownika",
    statusFilterAria: "Filtr statusu",
    all: "Wszystkie",
    due: "Do nauki",
    new: "Nowe",
    learning: "W trakcie",
    mastered: "Opanowane",
    suspended: "Wstrzymane",
    newPerDay: "Nowe/dzień",
    importModeAria: "Tryb importu",
    importMerge: "Import: połącz",
    importReplace: "Import: zastąp",
    export: "Eksport",
    import: "Import",
    editCard: "Edytuj kartę",
    word: "Słówko",
    translation: "Tłumaczenie",
    nextReview: "Następna powtórka",
    sentence: "Zdanie",
    sentenceTranslation: "Tłumaczenie zdania",
    suspendCard: "Wstrzymaj kartę",
    save: "Zapisz",
    cancel: "Anuluj",
    newDictionaryOption: "Nowy słownik...",
    allDictionaries: "Wszystkie słowniki",
    sourceWordLabel: "Tłumaczenie ({language})",
    targetWordLabel: "Słówko ({language})",
    sentenceLabel: "Zdanie ({language})",
    translationLabel: "Tłumaczenie zdania ({language})",
    sourcePlaceholder: "opcjonalnie, np. {example}",
    targetPlaceholder: "np. house",
    targetPlaceholderGeneric: "wpisz słówko",
    sentencePlaceholder: "Kliknij Generuj AI albo dodaj kartę z zapisanym kluczem",
    translationPlaceholder: "Opcjonalne, AI uzupełni automatycznie",
    newDictionaryPlaceholder: "np. Hiszpański A1",
    direction: "{target} zdanie → {source} tłumaczenie",
    status: "status",
    reviews: "powtórki",
    lapses: "pomyłki",
    next: "następna",
    statusNew: "nowa",
    statusLearning: "w trakcie",
    statusMastered: "opanowana",
    statusSuspended: "wstrzymana",
    edit: "Edytuj",
    resume: "Wznów",
    remove: "Usuń",
    noCards: "Brak kart.",
    missingSource: "tłumaczenie",
    missingTarget: "słówko",
    missingSentence: "zdanie",
    missingSentenceTranslation: "tłumaczenie zdania",
    enterTargetWord: "Wpisz słówko w języku, którego się uczysz.",
    enterApiKeyFill: "Wpisz klucz OpenAI API, żeby automatycznie uzupełnić kartę.",
    generating: "Generuje...",
    aiGenerated: "AI wygenerowało zdanie.",
    aiGenerateFailed: "Nie udało się wygenerować przez AI. Sprawdź klucz API i internet.",
    enterApiKeyAudio: "Wpisz klucz OpenAI API, żeby odtworzyć audio.",
    loading: "Ładuje...",
    audioFailed: "Nie udało się odtworzyć audio. Sprawdź klucz API i internet.",
    duplicateFound: "To słówko jest już w bazie: {source} - {target}.",
    deleteConfirm: "Usunąć kartę \"{target} - {source}\"?",
    cardDeleted: "Karta została usunięta.",
    cardSuspended: "Karta została wstrzymana.",
    cardResumed: "Karta wróciła do nauki.",
    fillAllCardFields: "Uzupełnij wszystkie pola karty.",
    invalidDueDate: "Podaj poprawną datę następnej powtórki.",
    duplicateCard: "Taka karta już istnieje w tym słowniku.",
    cardUpdated: "Karta została zaktualizowana.",
    importedCardMissingFields: "Karta {number} nie ma pól: {fields}.",
    noCardsListInFile: "Nie znaleziono listy kart.",
    replaceConfirm: "Zastąpić wszystkie obecne karty importowanym plikiem?",
    importCancelled: "Import anulowany.",
    importDone: "Zaimportowano kart: {count}. Pominięto duplikatów: {skipped}.",
    enterDictionaryName: "Wpisz nazwę nowego słownika.",
    addDuplicate: "Nie dodano. Ta karta już istnieje: {source} - {target}.",
    cardAdded: "Dodano kartę: {source} - {target}.",
    importFailed: "Nie udało się zaimportować: {message}"
  },
  en: {
    appSubtitle: "Simple vocabulary flashcards in Polish and English.",
    uiLanguage: "Language",
    polishUi: "Polish",
    englishUi: "English",
    darkTheme: "Dark theme",
    lightTheme: "Light theme",
    statsAria: "Statistics",
    totalCardsLabel: "cards",
    dueCardsLabel: "due",
    newCardsLeftLabel: "new today",
    studiedTodayLabel: "today",
    workspaceAria: "Flashcard app",
    tabsAria: "Views",
    studyTab: "Study",
    addTab: "Add",
    cardsTab: "Cards",
    studyViewAria: "Study",
    addViewAria: "Add vocabulary",
    cardsViewAria: "Card list",
    noDueTitle: "No cards due",
    noDueText: "Add a word or come back later when a card is ready to study.",
    playWord: "Play word",
    playSentence: "Play sentence",
    showAnswer: "Show answer",
    again: "Again",
    hard: "Hard",
    good: "Good",
    easy: "Easy",
    suspend: "Suspend",
    dictionary: "Dictionary",
    newDictionaryName: "New dictionary name",
    knownLanguage: "I know",
    learningLanguage: "I am learning",
    apiKey: "OpenAI API key",
    apiKeyHelp: "The key is saved only in this browser. For private local study.",
    generateAi: "Generate AI",
    addCard: "Add card",
    clear: "Clear",
    searchPlaceholder: "Search words",
    dictionaryFilterAria: "Dictionary filter",
    statusFilterAria: "Status filter",
    all: "All",
    due: "Due",
    new: "New",
    learning: "Learning",
    mastered: "Mastered",
    suspended: "Suspended",
    newPerDay: "New/day",
    importModeAria: "Import mode",
    importMerge: "Import: merge",
    importReplace: "Import: replace",
    export: "Export",
    import: "Import",
    editCard: "Edit card",
    word: "Word",
    translation: "Translation",
    nextReview: "Next review",
    sentence: "Sentence",
    sentenceTranslation: "Sentence translation",
    suspendCard: "Suspend card",
    save: "Save",
    cancel: "Cancel",
    newDictionaryOption: "New dictionary...",
    allDictionaries: "All dictionaries",
    sourceWordLabel: "Translation ({language})",
    targetWordLabel: "Word ({language})",
    sentenceLabel: "Sentence ({language})",
    translationLabel: "Sentence translation ({language})",
    sourcePlaceholder: "optional, e.g. {example}",
    targetPlaceholder: "e.g. house",
    targetPlaceholderGeneric: "enter a word",
    sentencePlaceholder: "Click Generate AI or add a card with a saved key",
    translationPlaceholder: "Optional, AI will fill it automatically",
    newDictionaryPlaceholder: "e.g. Spanish A1",
    direction: "{target} sentence → {source} translation",
    status: "status",
    reviews: "reviews",
    lapses: "misses",
    next: "next",
    statusNew: "new",
    statusLearning: "learning",
    statusMastered: "mastered",
    statusSuspended: "suspended",
    edit: "Edit",
    resume: "Resume",
    remove: "Delete",
    noCards: "No cards.",
    missingSource: "translation",
    missingTarget: "word",
    missingSentence: "sentence",
    missingSentenceTranslation: "sentence translation",
    enterTargetWord: "Enter a word in the language you are learning.",
    enterApiKeyFill: "Enter your OpenAI API key to fill the card automatically.",
    generating: "Generating...",
    aiGenerated: "AI generated a sentence.",
    aiGenerateFailed: "AI generation failed. Check your API key and internet connection.",
    enterApiKeyAudio: "Enter your OpenAI API key to play audio.",
    loading: "Loading...",
    audioFailed: "Could not play audio. Check your API key and internet connection.",
    duplicateFound: "This word is already saved: {source} - {target}.",
    deleteConfirm: "Delete card \"{target} - {source}\"?",
    cardDeleted: "Card deleted.",
    cardSuspended: "Card suspended.",
    cardResumed: "Card returned to study.",
    fillAllCardFields: "Fill in all card fields.",
    invalidDueDate: "Enter a valid next review date.",
    duplicateCard: "This card already exists in this dictionary.",
    cardUpdated: "Card updated.",
    importedCardMissingFields: "Card {number} is missing fields: {fields}.",
    noCardsListInFile: "No card list found.",
    replaceConfirm: "Replace all current cards with the imported file?",
    importCancelled: "Import cancelled.",
    importDone: "Imported cards: {count}. Skipped duplicates: {skipped}.",
    enterDictionaryName: "Enter the new dictionary name.",
    addDuplicate: "Not added. This card already exists: {source} - {target}.",
    cardAdded: "Added card: {source} - {target}.",
    importFailed: "Import failed: {message}"
  }
};

const reviewIntervals = [
  5,
  10,
  60 * 24,
  60 * 24 * 3,
  60 * 24 * 7,
  60 * 24 * 15,
  60 * 24 * 30,
  60 * 24 * 60,
  60 * 24 * 120
];

const state = {
  cards: loadCards(),
  settings: loadSettings(),
  uiLanguage: loadUiLanguage(),
  current: null,
  answerVisible: false,
  editingCardId: null
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  totalCards: document.querySelector("#totalCards"),
  dueCards: document.querySelector("#dueCards"),
  newCardsLeft: document.querySelector("#newCardsLeft"),
  studiedToday: document.querySelector("#studiedToday"),
  dictionary: document.querySelector("#dictionary"),
  newDictionaryField: document.querySelector("#newDictionaryField"),
  newDictionaryName: document.querySelector("#newDictionaryName"),
  sourceLanguage: document.querySelector("#sourceLanguage"),
  targetLanguage: document.querySelector("#targetLanguage"),
  sourceWordLabel: document.querySelector("#sourceWordLabel"),
  targetWordLabel: document.querySelector("#targetWordLabel"),
  sentenceLabel: document.querySelector("#sentenceLabel"),
  translationLabel: document.querySelector("#translationLabel"),
  polishWord: document.querySelector("#polishWord"),
  englishWord: document.querySelector("#englishWord"),
  apiKey: document.querySelector("#apiKey"),
  sentence: document.querySelector("#sentence"),
  translation: document.querySelector("#translation"),
  generateAi: document.querySelector("#generateAi"),
  addForm: document.querySelector("#addForm"),
  clearForm: document.querySelector("#clearForm"),
  duplicateNotice: document.querySelector("#duplicateNotice"),
  addNotice: document.querySelector("#addNotice"),
  studyEmpty: document.querySelector("#studyEmpty"),
  flashcard: document.querySelector("#flashcard"),
  cardDirection: document.querySelector("#cardDirection"),
  cardProgress: document.querySelector("#cardProgress"),
  cardPrompt: document.querySelector("#cardPrompt"),
  cardAnswer: document.querySelector("#cardAnswer"),
  cardSentence: document.querySelector("#cardSentence"),
  studyControls: document.querySelector("#studyControls"),
  studyNotice: document.querySelector("#studyNotice"),
  playWord: document.querySelector("#playWord"),
  playSentence: document.querySelector("#playSentence"),
  showAnswer: document.querySelector("#showAnswer"),
  againCard: document.querySelector("#againCard"),
  hardCard: document.querySelector("#hardCard"),
  goodCard: document.querySelector("#goodCard"),
  easyCard: document.querySelector("#easyCard"),
  suspendCard: document.querySelector("#suspendCard"),
  cardsList: document.querySelector("#cardsList"),
  searchCards: document.querySelector("#searchCards"),
  cardDictionaryFilter: document.querySelector("#cardDictionaryFilter"),
  cardStatusFilter: document.querySelector("#cardStatusFilter"),
  newCardsLimit: document.querySelector("#newCardsLimit"),
  importMode: document.querySelector("#importMode"),
  exportCards: document.querySelector("#exportCards"),
  importCards: document.querySelector("#importCards"),
  importFile: document.querySelector("#importFile"),
  cardsNotice: document.querySelector("#cardsNotice"),
  themeToggle: document.querySelector("#themeToggle"),
  uiLanguage: document.querySelector("#uiLanguage"),
  editDialog: document.querySelector("#editDialog"),
  editForm: document.querySelector("#editForm"),
  editDictionary: document.querySelector("#editDictionary"),
  editSourceWord: document.querySelector("#editSourceWord"),
  editTargetWord: document.querySelector("#editTargetWord"),
  editSentence: document.querySelector("#editSentence"),
  editTranslation: document.querySelector("#editTranslation"),
  editDueAt: document.querySelector("#editDueAt"),
  editSuspended: document.querySelector("#editSuspended"),
  editNotice: document.querySelector("#editNotice"),
  cancelEdit: document.querySelector("#cancelEdit")
};

function loadUiLanguage() {
  const saved = localStorage.getItem(UI_LANGUAGE_STORAGE_KEY);
  return saved === "en" ? "en" : "pl";
}

function t(key, params = {}) {
  const template = translations[state.uiLanguage]?.[key] || translations.pl[key] || key;
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function getLanguageName(language) {
  return language.names?.[state.uiLanguage] || language.apiName;
}

function setText(selector, key) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = t(key);
  }
}

function setPlaceholder(selector, key) {
  const element = document.querySelector(selector);
  if (element) {
    element.placeholder = t(key);
  }
}

function setAriaLabel(selector, key) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute("aria-label", t(key));
  }
}

function applyUiLanguage() {
  document.documentElement.lang = state.uiLanguage;
  els.uiLanguage.value = state.uiLanguage;
  els.uiLanguage.querySelector('[value="pl"]').textContent = t("polishUi");
  els.uiLanguage.querySelector('[value="en"]').textContent = t("englishUi");
  document.title = "Mini Anki";

  setText(".brand p", "appSubtitle");
  setText("#uiLanguageLabel", "uiLanguage");
  setText("#totalCardsLabel", "totalCardsLabel");
  setText("#dueCardsLabel", "dueCardsLabel");
  setText("#newCardsLeftLabel", "newCardsLeftLabel");
  setText("#studiedTodayLabel", "studiedTodayLabel");
  setAriaLabel(".stats", "statsAria");
  setAriaLabel(".workspace", "workspaceAria");
  setAriaLabel(".tabs", "tabsAria");
  setText('[data-view="studyView"]', "studyTab");
  setText('[data-view="addView"]', "addTab");
  setText('[data-view="cardsView"]', "cardsTab");
  setAriaLabel("#studyView", "studyViewAria");
  setAriaLabel("#addView", "addViewAria");
  setAriaLabel("#cardsView", "cardsViewAria");
  setText("#studyEmpty h2", "noDueTitle");
  setText("#studyEmpty p", "noDueText");
  setText("#playWord", "playWord");
  setText("#playSentence", "playSentence");
  setText("#showAnswer", "showAnswer");
  setText("#againCard", "again");
  setText("#hardCard", "hard");
  setText("#goodCard", "good");
  setText("#easyCard", "easy");
  setText("#suspendCard", "suspend");
  setText('label[for="dictionary"]', "dictionary");
  setText('label[for="newDictionaryName"]', "newDictionaryName");
  setText('label[for="sourceLanguage"]', "knownLanguage");
  setText('label[for="targetLanguage"]', "learningLanguage");
  setText('label[for="apiKey"]', "apiKey");
  setText(".ai-field small", "apiKeyHelp");
  setText("#generateAi", "generateAi");
  setText('#addForm button[type="submit"]', "addCard");
  setText("#clearForm", "clear");
  setPlaceholder("#newDictionaryName", "newDictionaryPlaceholder");
  setPlaceholder("#sentence", "sentencePlaceholder");
  setPlaceholder("#translation", "translationPlaceholder");
  setPlaceholder("#searchCards", "searchPlaceholder");
  setAriaLabel("#cardDictionaryFilter", "dictionaryFilterAria");
  setAriaLabel("#cardStatusFilter", "statusFilterAria");
  setAriaLabel("#importMode", "importModeAria");
  setText("#newCardsLimitLabel", "newPerDay");
  setText("#exportCards", "export");
  setText("#importCards", "import");
  setText("#editDialog h2", "editCard");
  setText('label[for="editDictionary"]', "dictionary");
  setText('label[for="editTargetWord"]', "word");
  setText('label[for="editSourceWord"]', "translation");
  setText('label[for="editDueAt"]', "nextReview");
  setText('label[for="editSentence"]', "sentence");
  setText('label[for="editTranslation"]', "sentenceTranslation");
  setText("#editSuspendedLabel", "suspendCard");
  setText('#editForm button[type="submit"]', "save");
  setText("#cancelEdit", "cancel");

  const statusLabels = ["all", "due", "new", "learning", "mastered", "suspended"];
  [...els.cardStatusFilter.options].forEach((option, index) => {
    option.textContent = t(statusLabels[index]);
  });
  [...els.importMode.options].forEach((option) => {
    option.textContent = t(option.value === "replace" ? "importReplace" : "importMerge");
  });

  applyTheme(loadTheme());
  renderLanguageOptions(false);
  renderDictionaries();
  updateLanguageLabels();
  renderStudy();
  renderCards();
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  els.themeToggle.textContent = theme === "dark" ? t("lightTheme") : t("darkTheme");
  els.themeToggle.dataset.icon = theme === "dark" ? "☼" : "◐";
  els.themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

function setTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

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

function normalizeSettings(settings) {
  const newCardsPerDay = Number(settings?.newCardsPerDay);
  return {
    newCardsPerDay: Number.isFinite(newCardsPerDay)
      ? Math.max(0, Math.min(200, Math.floor(newCardsPerDay)))
      : defaultSettings.newCardsPerDay
  };
}

function normalizeCard(card) {
  const pl = String(card.pl || card.sourceWord || "").trim();
  const en = String(card.en || card.targetWord || "").trim();

  return {
    ...card,
    id: card.id || crypto.randomUUID(),
    dictionary: String(card.dictionary || "Prosty slownik").trim() || "Prosty slownik",
    pl,
    en,
    sentence: String(card.sentence || "").trim(),
    sourceLanguage: card.sourceLanguage || "pl",
    targetLanguage: card.targetLanguage || "en",
    translation: String(card.translation || simplePolishSentence(pl)).trim(),
    level: Number.isFinite(Number(card.level)) ? Number(card.level) : 0,
    ease: Number.isFinite(Number(card.ease)) ? Number(card.ease) : 2.5,
    reps: Number.isFinite(Number(card.reps)) ? Number(card.reps) : 0,
    lapses: Number.isFinite(Number(card.lapses)) ? Number(card.lapses) : 0,
    dueAt: Number.isFinite(Number(card.dueAt)) ? Number(card.dueAt) : Date.now(),
    createdAt: Number.isFinite(Number(card.createdAt)) ? Number(card.createdAt) : Date.now(),
    firstStudiedAt: card.firstStudiedAt || null,
    lastReviewedAt: card.lastReviewedAt || null,
    suspended: Boolean(card.suspended)
  };
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function normalizeWord(value) {
  return value.trim().toLocaleLowerCase();
}

function getLanguage(code) {
  return languageOptions.find((language) => language.code === code) || languageOptions[0];
}

function extractOutputText(response) {
  if (response.output_text) {
    return response.output_text;
  }

  return (response.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("")
    .trim();
}

function renderLanguageOptions(resetValues = true) {
  const sourceValue = resetValues ? "pl" : els.sourceLanguage.value || "pl";
  const targetValue = resetValues ? "en" : els.targetLanguage.value || "en";

  [els.sourceLanguage, els.targetLanguage].forEach((select) => {
    select.innerHTML = "";
    languageOptions.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = getLanguageName(language);
      select.append(option);
    });
  });

  els.sourceLanguage.value = sourceValue;
  els.targetLanguage.value = targetValue;
}

function updateLanguageLabels() {
  const source = getLanguage(els.sourceLanguage.value);
  const target = getLanguage(els.targetLanguage.value);

  const sourceName = getLanguageName(source);
  const targetName = getLanguageName(target);

  els.sourceWordLabel.textContent = t("sourceWordLabel", { language: sourceName });
  els.targetWordLabel.textContent = t("targetWordLabel", { language: targetName });
  els.sentenceLabel.textContent = t("sentenceLabel", { language: targetName });
  els.translationLabel.textContent = t("translationLabel", { language: sourceName });
  els.polishWord.placeholder = t("sourcePlaceholder", {
    example: source.code === "pl" ? "dom" : sourceName
  });
  els.englishWord.placeholder = target.code === "en" ? t("targetPlaceholder") : t("targetPlaceholderGeneric");
}

function simplePolishSentence(pl) {
  const word = pl.trim();
  if (!word) {
    return "";
  }

  if (word.includes(" ")) {
    return `Uczę się wyrażenia "${word}".`;
  }

  return `Uczę się słowa "${word}".`;
}

function renderHighlightedText(element, text, word) {
  element.textContent = "";

  const source = text || "";
  const needle = (word || "").trim();
  const matchAt = source.toLocaleLowerCase().indexOf(needle.toLocaleLowerCase());

  if (!needle || matchAt === -1) {
    element.textContent = source;
    return;
  }

  const before = source.slice(0, matchAt);
  const match = source.slice(matchAt, matchAt + needle.length);
  const after = source.slice(matchAt + needle.length);
  const highlight = document.createElement("span");
  highlight.className = "study-word";
  highlight.textContent = match;

  element.append(before, highlight, after);
}

function saveApiKey() {
  localStorage.setItem(API_KEY_STORAGE_KEY, els.apiKey.value.trim());
}

function loadApiKey() {
  els.apiKey.value = localStorage.getItem(API_KEY_STORAGE_KEY) || "";
}

async function generateAiSentence() {
  const pl = els.polishWord.value.trim();
  const en = els.englishWord.value.trim();
  const apiKey = els.apiKey.value.trim();
  const sourceLanguage = els.sourceLanguage.value;
  const targetLanguage = els.targetLanguage.value;

  els.addNotice.classList.add("hidden");
  els.duplicateNotice.classList.add("hidden");

  if (!en) {
    els.duplicateNotice.textContent = t("enterTargetWord");
    els.duplicateNotice.classList.remove("hidden");
    return null;
  }

  if (!apiKey) {
    els.duplicateNotice.textContent = t("enterApiKeyFill");
    els.duplicateNotice.classList.remove("hidden");
    return null;
  }

  if (apiKey) {
    saveApiKey();
  }
  els.generateAi.disabled = true;
  els.generateAi.textContent = t("generating");

  try {
    const source = getLanguage(sourceLanguage);
    const target = getLanguage(targetLanguage);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        reasoning: {
          effort: "low"
        },
        instructions: [
          "Create one very simple example sentence for an Anki vocabulary card.",
          `The learner is studying ${target.apiName} from ${source.apiName}.`,
          `The sentence must be in ${target.apiName} and use the exact target word or phrase naturally.`,
          "The sentence must be correct for the word's part of speech.",
          "Use beginner language, maximum 8 words.",
          `Translate the target word or phrase into ${source.apiName}.`,
          `Translate the sentence naturally into ${source.apiName}.`,
          pl
            ? "Use the provided source word or phrase if it is a natural translation."
            : "Infer a natural source-language translation for the target word or phrase.",
          "Return only JSON matching the schema."
        ].join(" "),
        input: [
          `Source language: ${source.apiName}`,
          `Target language: ${target.apiName}`,
          pl ? `Source word: ${pl}` : "Source word: missing",
          `Target word: ${en}`
        ].join("\n"),
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "anki_sentence",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                source_word: { type: "string" },
                target_sentence: { type: "string" },
                source_translation: { type: "string" }
              },
              required: ["source_word", "target_sentence", "source_translation"]
            }
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    const parsed = JSON.parse(extractOutputText(data));
    els.polishWord.value = parsed.source_word || pl;
    els.sentence.value = parsed.target_sentence;
    els.translation.value = parsed.source_translation;
    els.addNotice.textContent = t("aiGenerated");
    els.addNotice.classList.remove("hidden");
    return parsed;
  } catch (error) {
    els.duplicateNotice.textContent = t("aiGenerateFailed");
    els.duplicateNotice.classList.remove("hidden");
    console.error(error);
    return null;
  } finally {
    els.generateAi.disabled = false;
    els.generateAi.textContent = t("generateAi");
  }
}

async function playSpeech(text, kind, button) {
  const apiKey = els.apiKey.value.trim();
  const language = state.current?.targetLanguage || "en";

  els.studyNotice.classList.add("hidden");

  if (!text) {
    return;
  }

  if (!apiKey) {
    els.studyNotice.textContent = t("enterApiKeyAudio");
    els.studyNotice.classList.remove("hidden");
    return;
  }

  saveApiKey();

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = t("loading");

  try {
    const languageName = getLanguage(language).apiName;
    const instructions = kind === "word"
      ? `Say only this ${languageName} word or phrase once. Use clear beginner-friendly pronunciation.`
      : `Read this ${languageName} sentence naturally and clearly for a beginner language learner.`;
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        voice: TTS_VOICE,
        input: text,
        instructions,
        response_format: "mp3"
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.addEventListener("ended", () => URL.revokeObjectURL(audioUrl), { once: true });
    audio.addEventListener("error", () => URL.revokeObjectURL(audioUrl), { once: true });
    await audio.play();
  } catch (error) {
    els.studyNotice.textContent = t("audioFailed");
    els.studyNotice.classList.remove("hidden");
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

function getDictionaries() {
  return [...new Set(["Prosty slownik", ...state.cards.map((card) => card.dictionary)])];
}

function renderDictionaries() {
  const currentValue = els.dictionary.value || "Prosty slownik";
  els.dictionary.innerHTML = "";

  getDictionaries().forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    els.dictionary.append(option);
  });

  const custom = document.createElement("option");
  custom.value = "__new__";
  custom.textContent = t("newDictionaryOption");
  els.dictionary.append(custom);

  els.dictionary.value = getDictionaries().includes(currentValue) ? currentValue : "Prosty slownik";
  updateNewDictionaryField();
  renderCardFilters();
}

function renderCardFilters() {
  const currentDictionary = els.cardDictionaryFilter.value || "all";
  els.cardDictionaryFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("allDictionaries");
  els.cardDictionaryFilter.append(allOption);

  getDictionaries().forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    els.cardDictionaryFilter.append(option);
  });

  els.cardDictionaryFilter.value = getDictionaries().includes(currentDictionary) ? currentDictionary : "all";
}

function updateNewDictionaryField() {
  const isNew = els.dictionary.value === "__new__";
  els.newDictionaryField.classList.toggle("hidden", !isNew);
  if (isNew) {
    els.newDictionaryName.focus();
  }
}

function cardFingerprint(card) {
  return [
    normalizeWord(card.dictionary || ""),
    card.sourceLanguage || "pl",
    card.targetLanguage || "en",
    normalizeWord(card.pl || ""),
    normalizeWord(card.en || "")
  ].join("|");
}

function findDuplicate(pl, en, dictionary, excludeId = null) {
  const cleanPl = normalizeWord(pl);
  const cleanEn = normalizeWord(en);
  const sourceLanguage = els.sourceLanguage.value || "pl";
  const targetLanguage = els.targetLanguage.value || "en";

  return state.cards.find((card) => {
    if (card.id === excludeId) {
      return false;
    }

    const sameDictionary = card.dictionary === dictionary;
    const sameSourceLanguage = (card.sourceLanguage || "pl") === sourceLanguage;
    const sameTargetLanguage = (card.targetLanguage || "en") === targetLanguage;
    const samePolish = cleanPl && normalizeWord(card.pl) === cleanPl;
    const sameEnglish = normalizeWord(card.en) === cleanEn;
    return sameDictionary && sameSourceLanguage && sameTargetLanguage && (samePolish || sameEnglish);
  });
}

function updateDuplicateNotice() {
  const dictionary = getSelectedDictionary();
  if (!dictionary) {
    return false;
  }

  const duplicate = findDuplicate(els.polishWord.value, els.englishWord.value, dictionary);

  if (duplicate && els.englishWord.value.trim()) {
    els.duplicateNotice.textContent = t("duplicateFound", { source: duplicate.pl, target: duplicate.en });
    els.duplicateNotice.classList.remove("hidden");
    return true;
  }

  els.duplicateNotice.classList.add("hidden");
  return false;
}

function getSelectedDictionary() {
  if (els.dictionary.value !== "__new__") {
    return els.dictionary.value;
  }

  const name = els.newDictionaryName.value.trim();
  if (!name) {
    return "";
  }

  return name;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function newCardsStudiedToday() {
  const today = startOfToday();
  return state.cards.filter((card) => card.firstStudiedAt && card.firstStudiedAt >= today).length;
}

function cardsReviewedToday() {
  const today = startOfToday();
  return state.cards.filter((card) => card.lastReviewedAt && card.lastReviewedAt >= today).length;
}

function newCardsLeftToday() {
  return Math.max(0, state.settings.newCardsPerDay - newCardsStudiedToday());
}

function dueCards() {
  const now = Date.now();
  const reviewCards = state.cards
    .filter((card) => !card.suspended && card.reps > 0 && card.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt || a.createdAt - b.createdAt);
  const newCards = state.cards
    .filter((card) => !card.suspended && card.reps === 0 && card.dueAt <= now)
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, newCardsLeftToday());

  return [...reviewCards, ...newCards];
}

function renderStats() {
  els.totalCards.textContent = state.cards.length;
  els.dueCards.textContent = dueCards().length;
  els.newCardsLeft.textContent = newCardsLeftToday();
  els.studiedToday.textContent = cardsReviewedToday();
}

function pickCard() {
  const due = dueCards();
  state.current = due[0] || null;
  state.answerVisible = false;
  renderStudy();
}

function renderStudy() {
  const due = dueCards();
  renderStats();

  if (!state.current) {
    els.studyEmpty.classList.remove("hidden");
    els.flashcard.classList.add("hidden");
    els.studyControls.classList.add("hidden");
    els.studyNotice.classList.add("hidden");
    return;
  }

  const prompt = state.current.sentence;
  const answer = state.current.translation || simplePolishSentence(state.current.pl);
  const source = getLanguage(state.current.sourceLanguage || "pl");
  const target = getLanguage(state.current.targetLanguage || "en");

  els.studyEmpty.classList.add("hidden");
  els.flashcard.classList.remove("hidden");
  els.studyControls.classList.remove("hidden");
  els.cardDirection.textContent = t("direction", {
    target: getLanguageName(target),
    source: getLanguageName(source)
  });
  els.cardProgress.textContent = `${Math.max(1, due.indexOf(state.current) + 1)}/${due.length}`;
  renderHighlightedText(els.cardPrompt, prompt, state.current.en);
  renderHighlightedText(els.cardAnswer, answer, state.current.pl);
  els.cardSentence.textContent = `${state.current.en} = ${state.current.pl}`;
  els.cardAnswer.classList.toggle("hidden", !state.answerVisible);
  els.cardSentence.classList.toggle("hidden", !state.answerVisible);
  els.showAnswer.classList.toggle("hidden", state.answerVisible);
  els.againCard.classList.toggle("hidden", !state.answerVisible);
  els.hardCard.classList.toggle("hidden", !state.answerVisible);
  els.goodCard.classList.toggle("hidden", !state.answerVisible);
  els.easyCard.classList.toggle("hidden", !state.answerVisible);
  els.suspendCard.classList.toggle("hidden", state.answerVisible);
}

function intervalForLevel(level) {
  return reviewIntervals[Math.min(level, reviewIntervals.length - 1)];
}

function rateCurrent(grade) {
  if (!state.current) {
    return;
  }

  const now = Date.now();
  const card = state.current;
  const wasNew = card.reps === 0;

  card.reps += 1;
  card.lastReviewedAt = now;
  card.firstStudiedAt = card.firstStudiedAt || now;

  if (grade === "again") {
    card.level = 0;
    card.ease = Math.max(1.3, card.ease - 0.2);
    card.lapses += wasNew ? 0 : 1;
    card.dueAt = now + 5 * 60 * 1000;
  } else if (grade === "hard") {
    card.level = Math.max(1, card.level);
    card.ease = Math.max(1.3, card.ease - 0.15);
    card.dueAt = now + intervalForLevel(card.level) * 60 * 1000;
  } else if (grade === "easy") {
    card.level = Math.min(card.level + 2, reviewIntervals.length - 1);
    card.ease = Math.min(3.2, card.ease + 0.15);
    card.dueAt = now + Math.round(intervalForLevel(card.level) * card.ease) * 60 * 1000;
  } else {
    card.level = Math.min(card.level + 1, reviewIntervals.length - 1);
    card.dueAt = now + Math.round(intervalForLevel(card.level) * card.ease) * 60 * 1000;
  }

  saveCards();
  pickCard();
  renderCards();
}

function cardStatus(card) {
  if (card.suspended) {
    return "suspended";
  }

  if (card.reps === 0) {
    return "new";
  }

  if (card.level >= 6 && card.lapses === 0) {
    return "mastered";
  }

  return "learning";
}

function matchesCardStatus(card, status) {
  if (status === "all") {
    return true;
  }

  if (status === "due") {
    return !card.suspended && card.dueAt <= Date.now();
  }

  return cardStatus(card) === status;
}

function formatLocalDateTime(timestamp) {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function deleteCard(card) {
  if (!confirm(t("deleteConfirm", { target: card.en, source: card.pl }))) {
    return;
  }

  state.cards = state.cards.filter((item) => item.id !== card.id);
  saveCards();
  if (state.current?.id === card.id) {
    pickCard();
  }
  renderAll();
  showCardsNotice(t("cardDeleted"));
}

function toggleSuspended(card) {
  card.suspended = !card.suspended;
  saveCards();
  if (state.current?.id === card.id && card.suspended) {
    pickCard();
  }
  renderAll();
  showCardsNotice(card.suspended ? t("cardSuspended") : t("cardResumed"));
}

function openEditDialog(card) {
  state.editingCardId = card.id;
  els.editDictionary.value = card.dictionary || "Prosty slownik";
  els.editSourceWord.value = card.pl || "";
  els.editTargetWord.value = card.en || "";
  els.editSentence.value = card.sentence || "";
  els.editTranslation.value = card.translation || "";
  els.editDueAt.value = formatLocalDateTime(card.dueAt || Date.now());
  els.editSuspended.checked = Boolean(card.suspended);
  els.editNotice.classList.add("hidden");
  els.editDialog.showModal();
}

function hasDuplicateCardData(card, excludeId) {
  const fingerprint = cardFingerprint(card);
  return state.cards.some((item) => item.id !== excludeId && cardFingerprint(item) === fingerprint);
}

function saveEditedCard() {
  const card = state.cards.find((item) => item.id === state.editingCardId);
  if (!card) {
    return;
  }

  const next = {
    ...card,
    dictionary: els.editDictionary.value.trim() || "Prosty slownik",
    pl: els.editSourceWord.value.trim(),
    en: els.editTargetWord.value.trim(),
    sentence: els.editSentence.value.trim(),
    translation: els.editTranslation.value.trim(),
    dueAt: els.editDueAt.value ? new Date(els.editDueAt.value).getTime() : card.dueAt,
    suspended: els.editSuspended.checked
  };

  if (!next.pl || !next.en || !next.sentence || !next.translation) {
    els.editNotice.textContent = t("fillAllCardFields");
    els.editNotice.classList.remove("hidden");
    return;
  }

  if (!Number.isFinite(next.dueAt)) {
    els.editNotice.textContent = t("invalidDueDate");
    els.editNotice.classList.remove("hidden");
    return;
  }

  if (hasDuplicateCardData(next, card.id)) {
    els.editNotice.textContent = t("duplicateCard");
    els.editNotice.classList.remove("hidden");
    return;
  }

  Object.assign(card, next);
  saveCards();
  if (state.current?.id === card.id) {
    state.current = card.suspended ? null : card;
  }
  els.editDialog.close();
  state.editingCardId = null;
  pickCard();
  renderAll();
  showCardsNotice(t("cardUpdated"));
}

function renderCards() {
  els.newCardsLimit.value = state.settings.newCardsPerDay;
  const query = normalizeWord(els.searchCards.value);
  const dictionaryFilter = els.cardDictionaryFilter.value || "all";
  const statusFilter = els.cardStatusFilter.value || "all";
  const cards = state.cards.filter((card) => {
    const haystack = `${card.pl} ${card.en} ${card.sentence} ${card.translation || ""} ${card.dictionary}`.toLocaleLowerCase();
    const matchesQuery = haystack.includes(query);
    const matchesDictionary = dictionaryFilter === "all" || card.dictionary === dictionaryFilter;
    return matchesQuery && matchesDictionary && matchesCardStatus(card, statusFilter);
  });

  els.cardsList.innerHTML = "";

  if (!cards.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("noCards");
    els.cardsList.append(empty);
    return;
  }

  cards.forEach((card) => {
    const row = document.createElement("article");
    row.className = "word-card";
    if (card.suspended) {
      row.classList.add("suspended");
    }

    const text = document.createElement("div");
    const title = document.createElement("strong");
    const sentence = document.createElement("p");
    const meta = document.createElement("p");
    const source = getLanguage(card.sourceLanguage || "pl");
    const target = getLanguage(card.targetLanguage || "en");
    title.textContent = `${card.pl} - ${card.en}`;
    const languageText = `${getLanguageName(source)} → ${getLanguageName(target)}`;
    const dueText = new Date(card.dueAt).toLocaleString(state.uiLanguage === "pl" ? "pl-PL" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    const statusText = {
      new: t("statusNew"),
      learning: t("statusLearning"),
      mastered: t("statusMastered"),
      suspended: t("statusSuspended")
    }[cardStatus(card)];
    sentence.textContent = `${card.sentence} / ${card.translation || simplePolishSentence(card.pl)}`;
    meta.textContent = `${card.dictionary} (${languageText}) | ${t("status")}: ${statusText} | ${t("reviews")}: ${card.reps}, ${t("lapses")}: ${card.lapses}, ${t("next")}: ${dueText}`;
    text.append(title, sentence, meta);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "secondary compact";
    edit.dataset.icon = "✎";
    edit.textContent = t("edit");
    edit.addEventListener("click", () => openEditDialog(card));

    const suspend = document.createElement("button");
    suspend.type = "button";
    suspend.className = "subtle compact";
    suspend.dataset.icon = card.suspended ? "▶" : "⏸";
    suspend.textContent = card.suspended ? t("resume") : t("suspend");
    suspend.addEventListener("click", () => toggleSuspended(card));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger compact";
    remove.dataset.icon = "×";
    remove.textContent = t("remove");
    remove.addEventListener("click", () => deleteCard(card));

    actions.append(edit, suspend, remove);
    row.append(text, actions);
    els.cardsList.append(row);
  });
}
function exportCards() {
  const payload = {
    exportedAt: new Date().toISOString(),
    settings: state.settings,
    cards: state.cards
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mini-anki-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function showCardsNotice(message) {
  els.cardsNotice.textContent = message;
  els.cardsNotice.className = "success";
}

function validateImportedCard(card, index) {
  const normalized = normalizeCard(card);
  const missing = [];

  if (!normalized.pl) {
    missing.push(t("missingSource"));
  }

  if (!normalized.en) {
    missing.push(t("missingTarget"));
  }

  if (!normalized.sentence) {
    missing.push(t("missingSentence"));
  }

  if (!normalized.translation) {
    missing.push(t("missingSentenceTranslation"));
  }

  if (missing.length) {
    throw new Error(t("importedCardMissingFields", { number: index + 1, fields: missing.join(", ") }));
  }

  return normalized;
}

function importCardsFromJson(text) {
  const parsed = JSON.parse(text);
  const importedCards = Array.isArray(parsed) ? parsed : parsed.cards;

  if (!Array.isArray(importedCards)) {
    throw new Error(t("noCardsListInFile"));
  }

  if (els.importMode.value === "replace" && !confirm(t("replaceConfirm"))) {
    showCardsNotice(t("importCancelled"));
    return;
  }

  const importMode = els.importMode.value || "merge";
  const existingIds = new Set(state.cards.map((card) => card.id));
  const usedIds = new Set(importMode === "replace" ? [] : existingIds);
  const existingFingerprints = new Set(state.cards.map(cardFingerprint));
  const seenFingerprints = new Set();
  const cards = [];
  let skipped = 0;

  importedCards.forEach((card, index) => {
    const normalized = validateImportedCard({
    ...card,
    id: card.id && !usedIds.has(card.id) ? card.id : crypto.randomUUID()
    }, index);
    usedIds.add(normalized.id);
    const fingerprint = cardFingerprint(normalized);

    if (seenFingerprints.has(fingerprint) || (importMode === "merge" && existingFingerprints.has(fingerprint))) {
      skipped += 1;
      return;
    }

    seenFingerprints.add(fingerprint);
    cards.push(normalized);
  });

  state.cards = importMode === "replace" ? cards : [...cards, ...state.cards];
  if (parsed.settings) {
    state.settings = normalizeSettings(parsed.settings);
    saveSettings();
  }
  saveCards();
  pickCard();
  renderAll();
  showCardsNotice(t("importDone", { count: cards.length, skipped }));
}

function renderAll() {
  renderDictionaries();
  updateLanguageLabels();
  renderStats();
  renderStudy();
  renderCards();
}

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    els.tabs.forEach((item) => item.classList.remove("active"));
    els.views.forEach((view) => view.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.view}`).classList.add("active");
  });
});

els.dictionary.addEventListener("change", () => {
  updateNewDictionaryField();
  updateDuplicateNotice();
});

els.newDictionaryName.addEventListener("input", updateDuplicateNotice);

els.englishWord.addEventListener("input", () => {
  updateDuplicateNotice();
});

els.polishWord.addEventListener("input", () => {
  updateDuplicateNotice();
});

els.sourceLanguage.addEventListener("change", () => {
  updateLanguageLabels();
  updateDuplicateNotice();
});

els.targetLanguage.addEventListener("change", () => {
  updateLanguageLabels();
  updateDuplicateNotice();
});

els.apiKey.addEventListener("change", saveApiKey);
els.generateAi.addEventListener("click", generateAiSentence);

els.addForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const dictionary = getSelectedDictionary();
  const sourceLanguage = els.sourceLanguage.value;
  const targetLanguage = els.targetLanguage.value;
  let pl = els.polishWord.value.trim();
  const en = els.englishWord.value.trim();
  const duplicate = findDuplicate(pl, en, dictionary);

  els.addNotice.classList.add("hidden");

  if (!dictionary) {
    els.duplicateNotice.textContent = t("enterDictionaryName");
    els.duplicateNotice.classList.remove("hidden");
    return;
  }

  if (duplicate) {
    els.duplicateNotice.textContent = t("addDuplicate", { source: duplicate.pl, target: duplicate.en });
    els.duplicateNotice.classList.remove("hidden");
    return;
  }

  if (!en) {
    els.duplicateNotice.textContent = t("enterTargetWord");
    els.duplicateNotice.classList.remove("hidden");
    return;
  }

  if (!pl || !els.sentence.value.trim() || !els.translation.value.trim()) {
    const generated = await generateAiSentence();
    if (!generated) {
      return;
    }
    pl = els.polishWord.value.trim();
  }

  state.cards.unshift({
    id: crypto.randomUUID(),
    dictionary,
    sourceLanguage,
    targetLanguage,
    pl,
    en,
    sentence: els.sentence.value.trim(),
    translation: els.translation.value.trim(),
    level: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    dueAt: Date.now(),
    createdAt: Date.now(),
    firstStudiedAt: null,
    lastReviewedAt: null,
    suspended: false
  });

  saveCards();
  els.addNotice.textContent = t("cardAdded", { source: pl, target: en });
  els.addNotice.classList.remove("hidden");
  els.duplicateNotice.classList.add("hidden");
  els.addForm.reset();
  els.dictionary.value = dictionary;
  els.newDictionaryName.value = "";
  els.sourceLanguage.value = sourceLanguage;
  els.targetLanguage.value = targetLanguage;
  updateLanguageLabels();
  pickCard();
  renderAll();
  els.dictionary.value = dictionary;
  updateNewDictionaryField();
});

els.clearForm.addEventListener("click", () => {
  els.addForm.reset();
  els.duplicateNotice.classList.add("hidden");
  els.addNotice.classList.add("hidden");
  els.dictionary.value = "Prosty slownik";
  els.newDictionaryName.value = "";
  els.sourceLanguage.value = "pl";
  els.targetLanguage.value = "en";
  updateNewDictionaryField();
  updateLanguageLabels();
});

els.showAnswer.addEventListener("click", () => {
  state.answerVisible = true;
  renderStudy();
});

els.playWord.addEventListener("click", () => {
  playSpeech(state.current?.en || "", "word", els.playWord);
});

els.playSentence.addEventListener("click", () => {
  playSpeech(state.current?.sentence || "", "sentence", els.playSentence);
});

els.suspendCard.addEventListener("click", () => {
  if (state.current) {
    toggleSuspended(state.current);
  }
});

els.againCard.addEventListener("click", () => rateCurrent("again"));
els.hardCard.addEventListener("click", () => rateCurrent("hard"));
els.goodCard.addEventListener("click", () => rateCurrent("good"));
els.easyCard.addEventListener("click", () => rateCurrent("easy"));
els.searchCards.addEventListener("input", renderCards);
els.cardDictionaryFilter.addEventListener("change", renderCards);
els.cardStatusFilter.addEventListener("change", renderCards);
els.newCardsLimit.addEventListener("change", () => {
  state.settings = normalizeSettings({ newCardsPerDay: els.newCardsLimit.value });
  saveSettings();
  pickCard();
  renderAll();
});
els.exportCards.addEventListener("click", exportCards);
els.importCards.addEventListener("click", () => els.importFile.click());
els.importFile.addEventListener("change", async () => {
  const file = els.importFile.files[0];
  els.importFile.value = "";
  if (!file) {
    return;
  }

  try {
    importCardsFromJson(await file.text());
  } catch (error) {
    els.cardsNotice.textContent = t("importFailed", { message: error.message });
    els.cardsNotice.className = "notice";
    console.error(error);
  }
});

els.editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveEditedCard();
});

els.cancelEdit.addEventListener("click", () => {
  els.editDialog.close();
  state.editingCardId = null;
});

els.themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

els.uiLanguage.addEventListener("change", () => {
  state.uiLanguage = els.uiLanguage.value === "en" ? "en" : "pl";
  localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, state.uiLanguage);
  applyUiLanguage();
});

els.flashcard.addEventListener("click", () => {
  state.answerVisible = true;
  renderStudy();
});

document.addEventListener("keydown", (event) => {
  const interactiveTag = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(event.target.tagName);
  if (interactiveTag || els.editDialog.open) {
    return;
  }

  if (!state.current) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    state.answerVisible = true;
    renderStudy();
  }

  if (state.answerVisible && event.key === "1") {
    rateCurrent("again");
  }

  if (state.answerVisible && event.key === "2") {
    rateCurrent("hard");
  }

  if (state.answerVisible && event.key === "3") {
    rateCurrent("good");
  }

  if (state.answerVisible && event.key === "4") {
    rateCurrent("easy");
  }
});

loadApiKey();
renderLanguageOptions();
pickCard();
applyUiLanguage();
