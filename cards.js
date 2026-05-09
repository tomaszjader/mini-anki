(function () {
  const { DEFAULT_DICTIONARY, defaultSettings, reviewIntervals } = window.MiniAnkiConfig;

  function normalizeWord(value) {
    return String(value || "").trim().toLocaleLowerCase();
  }

  function simpleSourceSentence(sourceWord) {
    const word = String(sourceWord || "").trim();
    if (!word) {
      return "";
    }

    if (word.includes(" ")) {
      return `Uczę się wyrażenia "${word}".`;
    }

    return `Uczę się słowa "${word}".`;
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
    const sourceWord = String(card?.sourceWord || card?.pl || "").trim();
    const targetWord = String(card?.targetWord || card?.en || "").trim();

    return {
      id: card?.id || crypto.randomUUID(),
      dictionary: String(card?.dictionary || DEFAULT_DICTIONARY).trim() || DEFAULT_DICTIONARY,
      sourceLanguage: card?.sourceLanguage || "pl",
      targetLanguage: card?.targetLanguage || "en",
      sourceWord,
      targetWord,
      sentence: String(card?.sentence || "").trim(),
      translation: String(card?.translation || simpleSourceSentence(sourceWord)).trim(),
      level: Number.isFinite(Number(card?.level)) ? Number(card.level) : 0,
      ease: Number.isFinite(Number(card?.ease)) ? Number(card.ease) : 2.5,
      reps: Number.isFinite(Number(card?.reps)) ? Number(card.reps) : 0,
      lapses: Number.isFinite(Number(card?.lapses)) ? Number(card.lapses) : 0,
      dueAt: Number.isFinite(Number(card?.dueAt)) ? Number(card.dueAt) : Date.now(),
      createdAt: Number.isFinite(Number(card?.createdAt)) ? Number(card.createdAt) : Date.now(),
      firstStudiedAt: card?.firstStudiedAt || null,
      lastReviewedAt: card?.lastReviewedAt || null,
      suspended: Boolean(card?.suspended)
    };
  }

  function cardFingerprint(card) {
    return [
      normalizeWord(card.dictionary),
      card.sourceLanguage || "pl",
      card.targetLanguage || "en",
      normalizeWord(card.sourceWord),
      normalizeWord(card.targetWord)
    ].join("|");
  }

  function startOfToday(now = Date.now()) {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  function countNewCardsStudiedToday(cards, now = Date.now()) {
    const today = startOfToday(now);
    return cards.filter((card) => card.firstStudiedAt && card.firstStudiedAt >= today).length;
  }

  function countCardsReviewedToday(cards, now = Date.now()) {
    const today = startOfToday(now);
    return cards.filter((card) => card.lastReviewedAt && card.lastReviewedAt >= today).length;
  }

  function newCardsLeftToday(cards, settings, now = Date.now()) {
    return Math.max(0, settings.newCardsPerDay - countNewCardsStudiedToday(cards, now));
  }

  function dueCards(cards, settings, now = Date.now()) {
    const reviewCards = cards
      .filter((card) => !card.suspended && card.reps > 0 && card.dueAt <= now)
      .sort((a, b) => a.dueAt - b.dueAt || a.createdAt - b.createdAt);
    const newCards = cards
      .filter((card) => !card.suspended && card.reps === 0 && card.dueAt <= now)
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, newCardsLeftToday(cards, settings, now));

    return [...reviewCards, ...newCards];
  }

  function intervalForLevel(level) {
    return reviewIntervals[Math.min(level, reviewIntervals.length - 1)];
  }

  function rateCard(card, grade, now = Date.now()) {
    const next = { ...card };
    const wasNew = next.reps === 0;

    next.reps += 1;
    next.lastReviewedAt = now;
    next.firstStudiedAt = next.firstStudiedAt || now;

    if (grade === "again") {
      next.level = 0;
      next.ease = Math.max(1.3, next.ease - 0.2);
      next.lapses += wasNew ? 0 : 1;
      next.dueAt = now + 5 * 60 * 1000;
    } else if (grade === "hard") {
      next.level = Math.max(1, next.level);
      next.ease = Math.max(1.3, next.ease - 0.15);
      next.dueAt = now + intervalForLevel(next.level) * 60 * 1000;
    } else if (grade === "easy") {
      next.level = Math.min(next.level + 2, reviewIntervals.length - 1);
      next.ease = Math.min(3.2, next.ease + 0.15);
      next.dueAt = now + Math.round(intervalForLevel(next.level) * next.ease) * 60 * 1000;
    } else {
      next.level = Math.min(next.level + 1, reviewIntervals.length - 1);
      next.dueAt = now + Math.round(intervalForLevel(next.level) * next.ease) * 60 * 1000;
    }

    return next;
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

  function matchesCardStatus(card, status, now = Date.now()) {
    if (status === "all") {
      return true;
    }

    if (status === "due") {
      return !card.suspended && card.dueAt <= now;
    }

    return cardStatus(card) === status;
  }

  window.MiniAnkiCards = {
    normalizeWord,
    simpleSourceSentence,
    normalizeSettings,
    normalizeCard,
    cardFingerprint,
    startOfToday,
    countNewCardsStudiedToday,
    countCardsReviewedToday,
    newCardsLeftToday,
    dueCards,
    rateCard,
    cardStatus,
    matchesCardStatus
  };
}());
