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

const seedCards = [
  {
    id: crypto.randomUUID(),
    dictionary: "Prosty slownik",
    sourceLanguage: "pl",
    targetLanguage: "en",
    pl: "dom",
    en: "house",
    sentence: "This is a house.",
    translation: "To jest dom.",
    level: 0,
    dueAt: Date.now(),
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    dictionary: "Prosty slownik",
    sourceLanguage: "pl",
    targetLanguage: "en",
    pl: "kot",
    en: "cat",
    sentence: "The cat is small.",
    translation: "Kot jest maly.",
    level: 0,
    dueAt: Date.now(),
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    dictionary: "Prosty slownik",
    sourceLanguage: "pl",
    targetLanguage: "en",
    pl: "woda",
    en: "water",
    sentence: "I drink water.",
    translation: "Pije wode.",
    level: 0,
    dueAt: Date.now(),
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    dictionary: "Prosty slownik",
    sourceLanguage: "pl",
    targetLanguage: "en",
    pl: "jesc",
    en: "eat",
    sentence: "I eat bread.",
    translation: "Jem chleb.",
    level: 0,
    dueAt: Date.now(),
    createdAt: Date.now()
  }
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
  answerVisible: false
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  totalCards: document.querySelector("#totalCards"),
  dueCards: document.querySelector("#dueCards"),
  newCardsLeft: document.querySelector("#newCardsLeft"),
  dictionary: document.querySelector("#dictionary"),
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
  cardsList: document.querySelector("#cardsList"),
  searchCards: document.querySelector("#searchCards"),
  newCardsLimit: document.querySelector("#newCardsLimit"),
  exportCards: document.querySelector("#exportCards"),
  importCards: document.querySelector("#importCards"),
  importFile: document.querySelector("#importFile"),
  cardsNotice: document.querySelector("#cardsNotice"),
  resetDemo: document.querySelector("#resetDemo"),
  themeToggle: document.querySelector("#themeToggle")
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
    return seedCards.map(normalizeCard);
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map(normalizeCard) : seedCards.map(normalizeCard);
  } catch {
    return seedCards.map(normalizeCard);
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
  return {
    ...card,
    sourceLanguage: card.sourceLanguage || "pl",
    targetLanguage: card.targetLanguage || "en",
    translation: card.translation || simplePolishSentence(card.pl || ""),
    level: Number.isFinite(Number(card.level)) ? Number(card.level) : 0,
    ease: Number.isFinite(Number(card.ease)) ? Number(card.ease) : 2.5,
    reps: Number.isFinite(Number(card.reps)) ? Number(card.reps) : 0,
    lapses: Number.isFinite(Number(card.lapses)) ? Number(card.lapses) : 0,
    dueAt: Number.isFinite(Number(card.dueAt)) ? Number(card.dueAt) : Date.now(),
    firstStudiedAt: card.firstStudiedAt || null,
    lastReviewedAt: card.lastReviewedAt || null
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

  els.sourceWordLabel.textContent = `Tlumaczenie (${source.name})`;
  els.targetWordLabel.textContent = `Slowko (${target.name})`;
  els.sentenceLabel.textContent = `Zdanie (${target.name})`;
  els.translationLabel.textContent = `Tlumaczenie zdania (${source.name})`;
  els.polishWord.placeholder = `opcjonalnie, np. ${source.code === "pl" ? "dom" : source.name}`;
  els.englishWord.placeholder = target.code === "en" ? "np. house" : "wpisz slowko";
}

function simplePolishSentence(pl) {
  const word = pl.trim();
  if (!word) {
    return "";
  }

  if (word.includes(" ")) {
    return `Ucze sie wyrazenia "${word}".`;
  }

  return `Ucze sie slowa "${word}".`;
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
    els.duplicateNotice.textContent = "Wpisz slowko w jezyku, ktorego sie uczysz.";
    els.duplicateNotice.classList.remove("hidden");
    return null;
  }

  if (!apiKey) {
    els.duplicateNotice.textContent = "Wpisz klucz OpenAI API, zeby automatycznie uzupelnic karte.";
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
    els.addNotice.textContent = "AI wygenerowalo zdanie.";
    els.addNotice.classList.remove("hidden");
    return parsed;
  } catch (error) {
    els.duplicateNotice.textContent = "Nie udalo sie wygenerowac przez AI. Sprawdz klucz API i internet.";
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
    els.studyNotice.textContent = "Wpisz klucz OpenAI API, zeby odtworzyc audio.";
    els.studyNotice.classList.remove("hidden");
    return;
  }

  saveApiKey();

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Laduje...";

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
    els.studyNotice.textContent = "Nie udalo sie odtworzyc audio. Sprawdz klucz API i internet.";
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
  custom.textContent = "Nowy slownik...";
  els.dictionary.append(custom);

  els.dictionary.value = getDictionaries().includes(currentValue) ? currentValue : "Prosty slownik";
}

function findDuplicate(pl, en, dictionary) {
  const cleanPl = normalizeWord(pl);
  const cleanEn = normalizeWord(en);
  const sourceLanguage = els.sourceLanguage.value || "pl";
  const targetLanguage = els.targetLanguage.value || "en";

  return state.cards.find((card) => {
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
  const duplicate = findDuplicate(els.polishWord.value, els.englishWord.value, dictionary);

  if (duplicate && els.englishWord.value.trim()) {
    els.duplicateNotice.textContent = `To slowko jest juz w bazie: ${duplicate.pl} - ${duplicate.en}.`;
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

  const name = prompt("Nazwa nowego slownika:");
  if (!name || !name.trim()) {
    els.dictionary.value = "Prosty slownik";
    return "Prosty slownik";
  }

  const option = document.createElement("option");
  option.value = name.trim();
  option.textContent = name.trim();
  els.dictionary.insertBefore(option, els.dictionary.lastElementChild);
  els.dictionary.value = name.trim();
  return name.trim();
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

function newCardsLeftToday() {
  return Math.max(0, state.settings.newCardsPerDay - newCardsStudiedToday());
}

function dueCards() {
  const now = Date.now();
  const reviewCards = state.cards
    .filter((card) => card.reps > 0 && card.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt || a.createdAt - b.createdAt);
  const newCards = state.cards
    .filter((card) => card.reps === 0 && card.dueAt <= now)
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, newCardsLeftToday());

  return [...reviewCards, ...newCards];
}

function renderStats() {
  els.totalCards.textContent = state.cards.length;
  els.dueCards.textContent = dueCards().length;
  els.newCardsLeft.textContent = newCardsLeftToday();
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
  els.cardDirection.textContent = `${target.name} zdanie -> ${source.name} tlumaczenie`;
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

function renderCards() {
  els.newCardsLimit.value = state.settings.newCardsPerDay;
  const query = normalizeWord(els.searchCards.value);
  const cards = state.cards.filter((card) => {
    const haystack = `${card.pl} ${card.en} ${card.sentence} ${card.translation || ""} ${card.dictionary}`.toLocaleLowerCase();
    return haystack.includes(query);
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

    const text = document.createElement("div");
    const title = document.createElement("strong");
    const sentence = document.createElement("p");
    const source = getLanguage(card.sourceLanguage || "pl");
    const target = getLanguage(card.targetLanguage || "en");
    title.textContent = `${card.pl} - ${card.en}`;
    const languageText = `${source.name} -> ${target.name}`;
    const dueText = new Date(card.dueAt).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    sentence.textContent = `${card.dictionary} (${languageText}): ${card.sentence} / ${card.translation || simplePolishSentence(card.pl)} | powtorki: ${card.reps}, pomylki: ${card.lapses}, nastepna: ${dueText}`;
    text.append(title, sentence);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger compact";
    remove.dataset.icon = "×";
    remove.textContent = "Usun";
    remove.addEventListener("click", () => {
      state.cards = state.cards.filter((item) => item.id !== card.id);
      saveCards();
      if (state.current?.id === card.id) {
        pickCard();
      }
      renderAll();
    });

    row.append(text, remove);
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

function importCardsFromJson(text) {
  const parsed = JSON.parse(text);
  const importedCards = Array.isArray(parsed) ? parsed : parsed.cards;

  if (!Array.isArray(importedCards)) {
    throw new Error("Nie znaleziono listy kart.");
  }

  const existingIds = new Set(state.cards.map((card) => card.id));
  const cards = importedCards.map((card) => normalizeCard({
    ...card,
    id: card.id && !existingIds.has(card.id) ? card.id : crypto.randomUUID()
  }));

  state.cards = [...cards, ...state.cards];
  if (parsed.settings) {
    state.settings = normalizeSettings(parsed.settings);
    saveSettings();
  }
  saveCards();
  pickCard();
  renderAll();
  showCardsNotice(`Zaimportowano kart: ${cards.length}.`);
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
  getSelectedDictionary();
  updateDuplicateNotice();
});

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

  if (duplicate) {
    els.duplicateNotice.textContent = `Nie dodano. Ta karta juz istnieje: ${duplicate.pl} - ${duplicate.en}.`;
    els.duplicateNotice.classList.remove("hidden");
    return;
  }

  if (!en) {
    els.duplicateNotice.textContent = "Wpisz slowko w jezyku, ktorego sie uczysz.";
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
    lastReviewedAt: null
  });

  saveCards();
  els.addNotice.textContent = `Dodano karte: ${pl} - ${en}.`;
  els.addNotice.classList.remove("hidden");
  els.duplicateNotice.classList.add("hidden");
  els.addForm.reset();
  els.dictionary.value = dictionary;
  els.sourceLanguage.value = sourceLanguage;
  els.targetLanguage.value = targetLanguage;
  updateLanguageLabels();
  pickCard();
  renderAll();
});

els.clearForm.addEventListener("click", () => {
  els.addForm.reset();
  els.duplicateNotice.classList.add("hidden");
  els.addNotice.classList.add("hidden");
  els.dictionary.value = "Prosty slownik";
  els.sourceLanguage.value = "pl";
  els.targetLanguage.value = "en";
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

els.againCard.addEventListener("click", () => rateCurrent("again"));
els.hardCard.addEventListener("click", () => rateCurrent("hard"));
els.goodCard.addEventListener("click", () => rateCurrent("good"));
els.easyCard.addEventListener("click", () => rateCurrent("easy"));
els.searchCards.addEventListener("input", renderCards);
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
    els.cardsNotice.textContent = `Nie udalo sie zaimportowac: ${error.message}`;
    els.cardsNotice.className = "notice";
    console.error(error);
  }
});

els.resetDemo.addEventListener("click", () => {
  state.cards = seedCards.map((card) => normalizeCard({ ...card, id: crypto.randomUUID(), dueAt: Date.now() }));
  saveCards();
  pickCard();
  renderAll();
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
