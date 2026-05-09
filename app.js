(function () {
  const { DEFAULT_DICTIONARY, languageOptions } = window.MiniAnkiConfig;
  const { translate } = window.MiniAnkiI18n;
  const {
    normalizeWord,
    simpleSourceSentence,
    normalizeSettings,
    normalizeCard,
    cardFingerprint,
    countCardsReviewedToday,
    newCardsLeftToday,
    dueCards,
    rateCard,
    cardStatus,
    matchesCardStatus
  } = window.MiniAnkiCards;
  const storage = window.MiniAnkiStorage;
  const openai = window.MiniAnkiOpenAI;

  const state = {
    cards: storage.loadCards(),
    settings: storage.loadSettings(),
    uiLanguage: storage.loadUiLanguage(),
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

  function t(key, params = {}) {
    return translate(state.uiLanguage, key, params);
  }

  function getLanguage(code) {
    return languageOptions.find((language) => language.code === code) || languageOptions[0];
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

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    els.themeToggle.textContent = theme === "dark" ? t("lightTheme") : t("darkTheme");
    els.themeToggle.dataset.icon = theme === "dark" ? "*" : "o";
    els.themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  function setTheme(theme) {
    storage.saveTheme(theme);
    applyTheme(theme);
  }

  function saveCards() {
    storage.saveCards(state.cards);
  }

  function saveSettings() {
    storage.saveSettings(state.settings);
  }

  function saveApiKey() {
    storage.saveApiKey(els.apiKey.value);
  }

  function loadApiKey() {
    els.apiKey.value = storage.loadApiKey();
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

    applyTheme(storage.loadTheme());
    renderLanguageOptions(false);
    renderAll();
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

  function getDictionaries() {
    return [...new Set([DEFAULT_DICTIONARY, ...state.cards.map((card) => card.dictionary)])];
  }

  function renderDictionaries() {
    const currentValue = els.dictionary.value || DEFAULT_DICTIONARY;
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

    els.dictionary.value = getDictionaries().includes(currentValue) ? currentValue : DEFAULT_DICTIONARY;
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

  function getSelectedDictionary() {
    if (els.dictionary.value !== "__new__") {
      return els.dictionary.value;
    }

    return els.newDictionaryName.value.trim();
  }

  function findDuplicate(sourceWord, targetWord, dictionary, excludeId = null) {
    const cleanSource = normalizeWord(sourceWord);
    const cleanTarget = normalizeWord(targetWord);
    const sourceLanguage = els.sourceLanguage.value || "pl";
    const targetLanguage = els.targetLanguage.value || "en";

    return state.cards.find((card) => {
      if (card.id === excludeId) {
        return false;
      }

      const sameDictionary = card.dictionary === dictionary;
      const sameSourceLanguage = (card.sourceLanguage || "pl") === sourceLanguage;
      const sameTargetLanguage = (card.targetLanguage || "en") === targetLanguage;
      const sameSourceWord = cleanSource && normalizeWord(card.sourceWord) === cleanSource;
      const sameTargetWord = normalizeWord(card.targetWord) === cleanTarget;
      return sameDictionary && sameSourceLanguage && sameTargetLanguage && (sameSourceWord || sameTargetWord);
    });
  }

  function updateDuplicateNotice() {
    const dictionary = getSelectedDictionary();
    if (!dictionary) {
      return false;
    }

    const duplicate = findDuplicate(els.polishWord.value, els.englishWord.value, dictionary);

    if (duplicate && els.englishWord.value.trim()) {
      els.duplicateNotice.textContent = t("duplicateFound", {
        source: duplicate.sourceWord,
        target: duplicate.targetWord
      });
      els.duplicateNotice.classList.remove("hidden");
      return true;
    }

    els.duplicateNotice.classList.add("hidden");
    return false;
  }

  async function generateAiSentence() {
    const sourceWord = els.polishWord.value.trim();
    const targetWord = els.englishWord.value.trim();
    const apiKey = els.apiKey.value.trim();

    els.addNotice.classList.add("hidden");
    els.duplicateNotice.classList.add("hidden");

    if (!targetWord) {
      els.duplicateNotice.textContent = t("enterTargetWord");
      els.duplicateNotice.classList.remove("hidden");
      return null;
    }

    if (!apiKey) {
      els.duplicateNotice.textContent = t("enterApiKeyFill");
      els.duplicateNotice.classList.remove("hidden");
      return null;
    }

    saveApiKey();
    els.generateAi.disabled = true;
    els.generateAi.textContent = t("generating");

    try {
      const parsed = await openai.generateSentence({
        apiKey,
        source: getLanguage(els.sourceLanguage.value),
        target: getLanguage(els.targetLanguage.value),
        sourceWord,
        targetWord
      });
      els.polishWord.value = parsed.source_word || sourceWord;
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
      const audioBlob = await openai.synthesizeSpeech({
        apiKey,
        text,
        languageName: getLanguage(language).apiName,
        kind
      });
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

  function getDueCards() {
    return dueCards(state.cards, state.settings);
  }

  function renderStats() {
    els.totalCards.textContent = state.cards.length;
    els.dueCards.textContent = getDueCards().length;
    els.newCardsLeft.textContent = newCardsLeftToday(state.cards, state.settings);
    els.studiedToday.textContent = countCardsReviewedToday(state.cards);
  }

  function pickCard() {
    const due = getDueCards();
    state.current = due[0] || null;
    state.answerVisible = false;
    renderStudy();
  }

  function renderStudy() {
    const due = getDueCards();
    renderStats();

    if (!state.current) {
      els.studyEmpty.classList.remove("hidden");
      els.flashcard.classList.add("hidden");
      els.studyControls.classList.add("hidden");
      els.studyNotice.classList.add("hidden");
      return;
    }

    const prompt = state.current.sentence;
    const answer = state.current.translation || simpleSourceSentence(state.current.sourceWord);
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
    renderHighlightedText(els.cardPrompt, prompt, state.current.targetWord);
    renderHighlightedText(els.cardAnswer, answer, state.current.sourceWord);
    els.cardSentence.textContent = `${state.current.targetWord} = ${state.current.sourceWord}`;
    els.cardAnswer.classList.toggle("hidden", !state.answerVisible);
    els.cardSentence.classList.toggle("hidden", !state.answerVisible);
    els.showAnswer.classList.toggle("hidden", state.answerVisible);
    els.againCard.classList.toggle("hidden", !state.answerVisible);
    els.hardCard.classList.toggle("hidden", !state.answerVisible);
    els.goodCard.classList.toggle("hidden", !state.answerVisible);
    els.easyCard.classList.toggle("hidden", !state.answerVisible);
    els.suspendCard.classList.toggle("hidden", state.answerVisible);
  }

  function rateCurrent(grade) {
    if (!state.current) {
      return;
    }

    Object.assign(state.current, rateCard(state.current, grade));
    saveCards();
    pickCard();
    renderCards();
  }

  function formatLocalDateTime(timestamp) {
    const date = new Date(timestamp);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }

  function deleteCard(card) {
    if (!confirm(t("deleteConfirm", { target: card.targetWord, source: card.sourceWord }))) {
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
    els.editDictionary.value = card.dictionary || DEFAULT_DICTIONARY;
    els.editSourceWord.value = card.sourceWord || "";
    els.editTargetWord.value = card.targetWord || "";
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
      dictionary: els.editDictionary.value.trim() || DEFAULT_DICTIONARY,
      sourceWord: els.editSourceWord.value.trim(),
      targetWord: els.editTargetWord.value.trim(),
      sentence: els.editSentence.value.trim(),
      translation: els.editTranslation.value.trim(),
      dueAt: els.editDueAt.value ? new Date(els.editDueAt.value).getTime() : card.dueAt,
      suspended: els.editSuspended.checked
    };

    if (!next.sourceWord || !next.targetWord || !next.sentence || !next.translation) {
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

  function createCardRow(card) {
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
    const languageText = `${getLanguageName(source)} -> ${getLanguageName(target)}`;
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

    title.textContent = `${card.sourceWord} - ${card.targetWord}`;
    sentence.textContent = `${card.sentence} / ${card.translation || simpleSourceSentence(card.sourceWord)}`;
    meta.textContent = `${card.dictionary} (${languageText}) | ${t("status")}: ${statusText} | ${t("reviews")}: ${card.reps}, ${t("lapses")}: ${card.lapses}, ${t("next")}: ${dueText}`;
    text.append(title, sentence, meta);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "secondary compact";
    edit.dataset.icon = "E";
    edit.textContent = t("edit");
    edit.addEventListener("click", () => openEditDialog(card));

    const suspend = document.createElement("button");
    suspend.type = "button";
    suspend.className = "subtle compact";
    suspend.dataset.icon = card.suspended ? ">" : "||";
    suspend.textContent = card.suspended ? t("resume") : t("suspend");
    suspend.addEventListener("click", () => toggleSuspended(card));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger compact";
    remove.dataset.icon = "x";
    remove.textContent = t("remove");
    remove.addEventListener("click", () => deleteCard(card));

    actions.append(edit, suspend, remove);
    row.append(text, actions);
    return row;
  }

  function renderCards() {
    els.newCardsLimit.value = state.settings.newCardsPerDay;
    const query = normalizeWord(els.searchCards.value);
    const dictionaryFilter = els.cardDictionaryFilter.value || "all";
    const statusFilter = els.cardStatusFilter.value || "all";
    const cards = state.cards.filter((card) => {
      const haystack = [
        card.sourceWord,
        card.targetWord,
        card.sentence,
        card.translation,
        card.dictionary
      ].join(" ").toLocaleLowerCase();
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
      els.cardsList.append(createCardRow(card));
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

    if (!normalized.sourceWord) {
      missing.push(t("missingSource"));
    }

    if (!normalized.targetWord) {
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

  function createCardFromForm({ dictionary, sourceLanguage, targetLanguage, sourceWord, targetWord }) {
    return normalizeCard({
      id: crypto.randomUUID(),
      dictionary,
      sourceLanguage,
      targetLanguage,
      sourceWord,
      targetWord,
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
  els.englishWord.addEventListener("input", updateDuplicateNotice);
  els.polishWord.addEventListener("input", updateDuplicateNotice);
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
    let sourceWord = els.polishWord.value.trim();
    const targetWord = els.englishWord.value.trim();
    const duplicate = findDuplicate(sourceWord, targetWord, dictionary);

    els.addNotice.classList.add("hidden");

    if (!dictionary) {
      els.duplicateNotice.textContent = t("enterDictionaryName");
      els.duplicateNotice.classList.remove("hidden");
      return;
    }

    if (duplicate) {
      els.duplicateNotice.textContent = t("addDuplicate", {
        source: duplicate.sourceWord,
        target: duplicate.targetWord
      });
      els.duplicateNotice.classList.remove("hidden");
      return;
    }

    if (!targetWord) {
      els.duplicateNotice.textContent = t("enterTargetWord");
      els.duplicateNotice.classList.remove("hidden");
      return;
    }

    if (!sourceWord || !els.sentence.value.trim() || !els.translation.value.trim()) {
      const generated = await generateAiSentence();
      if (!generated) {
        return;
      }
      sourceWord = els.polishWord.value.trim();
    }

    state.cards.unshift(createCardFromForm({
      dictionary,
      sourceLanguage,
      targetLanguage,
      sourceWord,
      targetWord
    }));

    saveCards();
    els.addNotice.textContent = t("cardAdded", { source: sourceWord, target: targetWord });
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
    els.dictionary.value = DEFAULT_DICTIONARY;
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
    playSpeech(state.current?.targetWord || "", "word", els.playWord);
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
    storage.saveUiLanguage(state.uiLanguage);
    applyUiLanguage();
  });
  els.flashcard.addEventListener("click", () => {
    state.answerVisible = true;
    renderStudy();
  });

  document.addEventListener("keydown", (event) => {
    const interactiveTag = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(event.target.tagName);
    if (interactiveTag || els.editDialog.open || !state.current) {
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
}());
