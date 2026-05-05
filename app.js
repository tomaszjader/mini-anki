const STORAGE_KEY = "mini-anki-cards-v1";
const API_KEY_STORAGE_KEY = "mini-anki-openai-key-v1";
const SETTINGS_KEY = "mini-anki-settings-v1";
const THEME_STORAGE_KEY = "mini-anki-theme-v1";
const OPENAI_MODEL = "gpt-5.5";
const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "coral";

const defaultSettings = {
  newCardsPerDay: 20
};

const languageOptions = [
  { code: "pl", name: "polski", apiName: "Polish" },
  { code: "en", name: "angielski", apiName: "English" },
  { code: "de", name: "niemiecki", apiName: "German" },
  { code: "es", name: "hiszpanski", apiName: "Spanish" },
  { code: "fr", name: "francuski", apiName: "French" },
  { code: "it", name: "wloski", apiName: "Italian" },
  { code: "pt", name: "portugalski", apiName: "Portuguese" },
  { code: "uk", name: "ukrainski", apiName: "Ukrainian" },
  { code: "ru", name: "rosyjski", apiName: "Russian" },
  { code: "cs", name: "czeski", apiName: "Czech" },
  { code: "sv", name: "szwedzki", apiName: "Swedish" },
  { code: "no", name: "norweski", apiName: "Norwegian" },
  { code: "nl", name: "niderlandzki", apiName: "Dutch" },
  { code: "ja", name: "japonski", apiName: "Japanese" },
  { code: "ko", name: "koreanski", apiName: "Korean" },
  { code: "zh", name: "chinski", apiName: "Chinese" }
];

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

function loadTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  els.themeToggle.textContent = theme === "dark" ? "Jasny motyw" : "Ciemny motyw";
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

function renderLanguageOptions() {
  [els.sourceLanguage, els.targetLanguage].forEach((select) => {
    select.innerHTML = "";
    languageOptions.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = language.name;
      select.append(option);
    });
  });

  els.sourceLanguage.value = "pl";
  els.targetLanguage.value = "en";
}

function updateLanguageLabels() {
  const source = getLanguage(els.sourceLanguage.value);
  const target = getLanguage(els.targetLanguage.value);

  els.sourceWordLabel.textContent = `Tłumaczenie (${source.name})`;
  els.targetWordLabel.textContent = `Słówko (${target.name})`;
  els.sentenceLabel.textContent = `Zdanie (${target.name})`;
  els.translationLabel.textContent = `Tłumaczenie zdania (${source.name})`;
  els.polishWord.placeholder = `opcjonalnie, np. ${source.code === "pl" ? "dom" : source.name}`;
  els.englishWord.placeholder = target.code === "en" ? "np. house" : "wpisz słówko";
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
    els.duplicateNotice.textContent = "Wpisz słówko w języku, którego się uczysz.";
    els.duplicateNotice.classList.remove("hidden");
    return null;
  }

  if (!apiKey) {
    els.duplicateNotice.textContent = "Wpisz klucz OpenAI API, żeby automatycznie uzupełnić kartę.";
    els.duplicateNotice.classList.remove("hidden");
    return null;
  }

  if (apiKey) {
    saveApiKey();
  }
  els.generateAi.disabled = true;
  els.generateAi.textContent = "Generuje...";

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
    els.addNotice.textContent = "AI wygenerowało zdanie.";
    els.addNotice.classList.remove("hidden");
    return parsed;
  } catch (error) {
    els.duplicateNotice.textContent = "Nie udało się wygenerować przez AI. Sprawdź klucz API i internet.";
    els.duplicateNotice.classList.remove("hidden");
    console.error(error);
    return null;
  } finally {
    els.generateAi.disabled = false;
    els.generateAi.textContent = "Generuj AI";
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
    els.studyNotice.textContent = "Wpisz klucz OpenAI API, żeby odtworzyć audio.";
    els.studyNotice.classList.remove("hidden");
    return;
  }

  saveApiKey();

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Ładuje...";

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
    els.studyNotice.textContent = "Nie udało się odtworzyć audio. Sprawdź klucz API i internet.";
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
  custom.textContent = "Nowy słownik...";
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
  allOption.textContent = "Wszystkie słowniki";
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
    els.duplicateNotice.textContent = `To słówko jest już w bazie: ${duplicate.pl} - ${duplicate.en}.`;
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
  els.cardDirection.textContent = `${target.name} zdanie → ${source.name} tłumaczenie`;
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
  if (!confirm(`Usunąć kartę "${card.en} - ${card.pl}"?`)) {
    return;
  }

  state.cards = state.cards.filter((item) => item.id !== card.id);
  saveCards();
  if (state.current?.id === card.id) {
    pickCard();
  }
  renderAll();
  showCardsNotice("Karta została usunięta.");
}

function toggleSuspended(card) {
  card.suspended = !card.suspended;
  saveCards();
  if (state.current?.id === card.id && card.suspended) {
    pickCard();
  }
  renderAll();
  showCardsNotice(card.suspended ? "Karta została wstrzymana." : "Karta wróciła do nauki.");
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
    els.editNotice.textContent = "Uzupełnij wszystkie pola karty.";
    els.editNotice.classList.remove("hidden");
    return;
  }

  if (!Number.isFinite(next.dueAt)) {
    els.editNotice.textContent = "Podaj poprawną datę następnej powtórki.";
    els.editNotice.classList.remove("hidden");
    return;
  }

  if (hasDuplicateCardData(next, card.id)) {
    els.editNotice.textContent = "Taka karta już istnieje w tym słowniku.";
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
  showCardsNotice("Karta została zaktualizowana.");
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
    empty.textContent = "Brak kart.";
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
    const languageText = `${source.name} → ${target.name}`;
    const dueText = new Date(card.dueAt).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    const statusText = {
      new: "nowa",
      learning: "w trakcie",
      mastered: "opanowana",
      suspended: "wstrzymana"
    }[cardStatus(card)];
    sentence.textContent = `${card.sentence} / ${card.translation || simplePolishSentence(card.pl)}`;
    meta.textContent = `${card.dictionary} (${languageText}) | status: ${statusText} | powtórki: ${card.reps}, pomyłki: ${card.lapses}, następna: ${dueText}`;
    text.append(title, sentence, meta);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "secondary compact";
    edit.dataset.icon = "✎";
    edit.textContent = "Edytuj";
    edit.addEventListener("click", () => openEditDialog(card));

    const suspend = document.createElement("button");
    suspend.type = "button";
    suspend.className = "subtle compact";
    suspend.dataset.icon = card.suspended ? "▶" : "⏸";
    suspend.textContent = card.suspended ? "Wznów" : "Wstrzymaj";
    suspend.addEventListener("click", () => toggleSuspended(card));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger compact";
    remove.dataset.icon = "×";
    remove.textContent = "Usuń";
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
    missing.push("tłumaczenie");
  }

  if (!normalized.en) {
    missing.push("słówko");
  }

  if (!normalized.sentence) {
    missing.push("zdanie");
  }

  if (!normalized.translation) {
    missing.push("tłumaczenie zdania");
  }

  if (missing.length) {
    throw new Error(`Karta ${index + 1} nie ma pól: ${missing.join(", ")}.`);
  }

  return normalized;
}

function importCardsFromJson(text) {
  const parsed = JSON.parse(text);
  const importedCards = Array.isArray(parsed) ? parsed : parsed.cards;

  if (!Array.isArray(importedCards)) {
    throw new Error("Nie znaleziono listy kart.");
  }

  if (els.importMode.value === "replace" && !confirm("Zastąpić wszystkie obecne karty importowanym plikiem?")) {
    showCardsNotice("Import anulowany.");
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
  showCardsNotice(`Zaimportowano kart: ${cards.length}. Pominięto duplikatów: ${skipped}.`);
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
    els.duplicateNotice.textContent = "Wpisz nazwę nowego słownika.";
    els.duplicateNotice.classList.remove("hidden");
    return;
  }

  if (duplicate) {
    els.duplicateNotice.textContent = `Nie dodano. Ta karta już istnieje: ${duplicate.pl} - ${duplicate.en}.`;
    els.duplicateNotice.classList.remove("hidden");
    return;
  }

  if (!en) {
    els.duplicateNotice.textContent = "Wpisz słówko w języku, którego się uczysz.";
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
  els.addNotice.textContent = `Dodano kartę: ${pl} - ${en}.`;
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
    els.cardsNotice.textContent = `Nie udało się zaimportować: ${error.message}`;
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

renderLanguageOptions();
renderDictionaries();
loadApiKey();
applyTheme(loadTheme());
pickCard();
renderAll();
