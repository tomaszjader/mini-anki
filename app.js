const STORAGE_KEY = "mini-anki-cards-v1";

const seedCards = [
  {
    id: crypto.randomUUID(),
    dictionary: "Prosty slownik",
    pl: "dom",
    en: "house",
    sentence: "This is a house.",
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
    level: 0,
    dueAt: Date.now(),
    createdAt: Date.now()
  }
];

const intervals = [0, 1, 10, 60, 60 * 24, 60 * 24 * 3, 60 * 24 * 7];
const state = {
  cards: loadCards(),
  current: null,
  answerVisible: false,
  direction: "pl-en"
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  totalCards: document.querySelector("#totalCards"),
  dueCards: document.querySelector("#dueCards"),
  dictionary: document.querySelector("#dictionary"),
  polishWord: document.querySelector("#polishWord"),
  englishWord: document.querySelector("#englishWord"),
  sentence: document.querySelector("#sentence"),
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
    return Array.isArray(parsed) ? parsed : seedCards;
  } catch {
    return seedCards;
  }
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards));
}

function normalizeWord(value) {
  return value.trim().toLocaleLowerCase("pl-PL");
}

function simpleSentence(en) {
  const word = en.trim();
  if (!word) {
    return "";
  }

  const lower = word.toLocaleLowerCase("en-US");
  const article = /^[aeiou]/i.test(lower) ? "an" : "a";

  if (lower.includes(" ")) {
    return `I learn "${word}" today.`;
  }

  if (lower.endsWith("ing")) {
    return `I am ${word}.`;
  }

  return `This is ${article} ${word}.`;
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

function updateSentence() {
  if (!els.sentence.value.trim()) {
    els.sentence.value = simpleSentence(els.englishWord.value);
  }
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
  state.direction = Math.random() > 0.5 ? "pl-en" : "en-pl";
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

  const prompt = state.direction === "pl-en" ? state.current.pl : state.current.en;
  const answer = state.direction === "pl-en" ? state.current.en : state.current.pl;

  els.studyEmpty.classList.add("hidden");
  els.flashcard.classList.remove("hidden");
  els.studyControls.classList.remove("hidden");
  els.cardDirection.textContent = state.direction === "pl-en" ? "PL -> EN" : "EN -> PL";
  els.cardProgress.textContent = `${Math.max(1, due.indexOf(state.current) + 1)}/${due.length}`;
  els.cardPrompt.textContent = prompt;
  els.cardAnswer.textContent = answer;
  els.cardSentence.textContent = state.current.sentence;
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
    const haystack = `${card.pl} ${card.en} ${card.sentence} ${card.dictionary}`.toLocaleLowerCase("pl-PL");
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
    sentence.textContent = `${card.dictionary}: ${card.sentence}`;
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
  els.sentence.value = simpleSentence(els.englishWord.value);
  updateDuplicateNotice();
});

els.polishWord.addEventListener("input", updateDuplicateNotice);

els.addForm.addEventListener("submit", (event) => {
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

  state.cards.unshift({
    id: crypto.randomUUID(),
    dictionary,
    pl,
    en,
    sentence: els.sentence.value.trim() || simpleSentence(en),
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
pickCard();
renderAll();
