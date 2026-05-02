const STORAGE_KEY = "mini-anki-cards-v1";
const API_KEY_STORAGE_KEY = "mini-anki-openai-key-v1";

const seedCards = [
  {
    id: crypto.randomUUID(),
    dictionary: "Prosty slownik",
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
    pl: "jesc",
    en: "eat",
    sentence: "I eat bread.",
    translation: "Jem chleb.",
    level: 0,
    dueAt: Date.now(),
    createdAt: Date.now()
  }
];

const intervals = [0, 1, 10, 60, 60 * 24, 60 * 24 * 3, 60 * 24 * 7];
const state = {
  cards: loadCards(),
  current: null,
  answerVisible: false
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  totalCards: document.querySelector("#totalCards"),
  dueCards: document.querySelector("#dueCards"),
  dictionary: document.querySelector("#dictionary"),
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
  showAnswer: document.querySelector("#showAnswer"),
  againCard: document.querySelector("#againCard"),
  goodCard: document.querySelector("#goodCard"),
  cardsList: document.querySelector("#cardsList"),
  searchCards: document.querySelector("#searchCards"),
  resetDemo: document.querySelector("#resetDemo")
};

function loadCards() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return seedCards;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map(normalizeCard) : seedCards;
  } catch {
    return seedCards;
  }
}

function normalizeCard(card) {
  return {
    ...card,
    translation: card.translation || simplePolishSentence(card.pl || "")
  };
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards));
}

function normalizeWord(value) {
  return value.trim().toLocaleLowerCase("pl-PL");
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
  const matchAt = source.toLocaleLowerCase("pl-PL").indexOf(needle.toLocaleLowerCase("pl-PL"));

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

  els.addNotice.classList.add("hidden");
  els.duplicateNotice.classList.add("hidden");

  if (!pl || !en) {
    els.duplicateNotice.textContent = "Wpisz slowko po polsku i po angielsku.";
    els.duplicateNotice.classList.remove("hidden");
    return null;
  }

  if (apiKey) {
    saveApiKey();
  }
  els.generateAi.disabled = true;
  els.generateAi.textContent = "Generuje...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        apiKey,
        pl,
        en
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const parsed = await response.json();
    els.sentence.value = parsed.english_sentence;
    els.translation.value = parsed.polish_translation;
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

  return state.cards.find((card) => {
    const sameDictionary = card.dictionary === dictionary;
    const samePolish = normalizeWord(card.pl) === cleanPl;
    const sameEnglish = normalizeWord(card.en) === cleanEn;
    return sameDictionary && (samePolish || sameEnglish);
  });
}

function updateDuplicateNotice() {
  const dictionary = getSelectedDictionary();
  const duplicate = findDuplicate(els.polishWord.value, els.englishWord.value, dictionary);

  if (duplicate && els.polishWord.value.trim() && els.englishWord.value.trim()) {
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

function dueCards() {
  const now = Date.now();
  return state.cards
    .filter((card) => card.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt || a.createdAt - b.createdAt);
}

function renderStats() {
  els.totalCards.textContent = state.cards.length;
  els.dueCards.textContent = dueCards().length;
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
    return;
  }

  const prompt = state.current.sentence;
  const answer = state.current.translation || simplePolishSentence(state.current.pl);

  els.studyEmpty.classList.add("hidden");
  els.flashcard.classList.remove("hidden");
  els.studyControls.classList.remove("hidden");
  els.cardDirection.textContent = "EN zdanie -> PL tlumaczenie";
  els.cardProgress.textContent = `${Math.max(1, due.indexOf(state.current) + 1)}/${due.length}`;
  renderHighlightedText(els.cardPrompt, prompt, state.current.en);
  renderHighlightedText(els.cardAnswer, answer, state.current.pl);
  els.cardSentence.textContent = `${state.current.en} = ${state.current.pl}`;
  els.cardAnswer.classList.toggle("hidden", !state.answerVisible);
  els.cardSentence.classList.toggle("hidden", !state.answerVisible);
  els.showAnswer.classList.toggle("hidden", state.answerVisible);
  els.againCard.classList.toggle("hidden", !state.answerVisible);
  els.goodCard.classList.toggle("hidden", !state.answerVisible);
}

function rateCurrent(isGood) {
  if (!state.current) {
    return;
  }

  const card = state.current;
  card.level = isGood ? Math.min(card.level + 1, intervals.length - 1) : 0;
  card.dueAt = Date.now() + intervals[card.level] * 60 * 1000;
  saveCards();
  pickCard();
  renderCards();
}

function renderCards() {
  const query = normalizeWord(els.searchCards.value);
  const cards = state.cards.filter((card) => {
    const haystack = `${card.pl} ${card.en} ${card.sentence} ${card.translation || ""} ${card.dictionary}`.toLocaleLowerCase("pl-PL");
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
    title.textContent = `${card.pl} - ${card.en}`;
    sentence.textContent = `${card.dictionary}: ${card.sentence} / ${card.translation || simplePolishSentence(card.pl)}`;
    text.append(title, sentence);

    const remove = document.createElement("button");
    remove.type = "button";
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

function renderAll() {
  renderDictionaries();
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

els.apiKey.addEventListener("change", saveApiKey);
els.generateAi.addEventListener("click", generateAiSentence);

els.addForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const dictionary = getSelectedDictionary();
  const pl = els.polishWord.value.trim();
  const en = els.englishWord.value.trim();
  const duplicate = findDuplicate(pl, en, dictionary);

  els.addNotice.classList.add("hidden");

  if (duplicate) {
    els.duplicateNotice.textContent = `Nie dodano. Ta karta juz istnieje: ${duplicate.pl} - ${duplicate.en}.`;
    els.duplicateNotice.classList.remove("hidden");
    return;
  }

  if (!els.sentence.value.trim() || !els.translation.value.trim()) {
    const generated = await generateAiSentence();
    if (!generated) {
      return;
    }
  }

  state.cards.unshift({
    id: crypto.randomUUID(),
    dictionary,
    pl,
    en,
    sentence: els.sentence.value.trim(),
    translation: els.translation.value.trim(),
    level: 0,
    dueAt: Date.now(),
    createdAt: Date.now()
  });

  saveCards();
  els.addNotice.textContent = `Dodano karte: ${pl} - ${en}.`;
  els.addNotice.classList.remove("hidden");
  els.duplicateNotice.classList.add("hidden");
  els.addForm.reset();
  els.dictionary.value = dictionary;
  pickCard();
  renderAll();
});

els.clearForm.addEventListener("click", () => {
  els.addForm.reset();
  els.duplicateNotice.classList.add("hidden");
  els.addNotice.classList.add("hidden");
  els.dictionary.value = "Prosty slownik";
});

els.showAnswer.addEventListener("click", () => {
  state.answerVisible = true;
  renderStudy();
});

els.againCard.addEventListener("click", () => rateCurrent(false));
els.goodCard.addEventListener("click", () => rateCurrent(true));
els.searchCards.addEventListener("input", renderCards);

els.resetDemo.addEventListener("click", () => {
  state.cards = seedCards.map((card) => ({ ...card, id: crypto.randomUUID(), dueAt: Date.now() }));
  saveCards();
  pickCard();
  renderAll();
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
    rateCurrent(false);
  }

  if (state.answerVisible && event.key === "2") {
    rateCurrent(true);
  }
});

renderDictionaries();
loadApiKey();
pickCard();
renderAll();
