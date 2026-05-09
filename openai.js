(function () {
  const { OPENAI_MODEL, TTS_MODEL, TTS_VOICE } = window.MiniAnkiConfig;

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

  async function generateSentence({ apiKey, source, target, sourceWord, targetWord }) {
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
          sourceWord
            ? "Use the provided source word or phrase if it is a natural translation."
            : "Infer a natural source-language translation for the target word or phrase.",
          "Return only JSON matching the schema."
        ].join(" "),
        input: [
          `Source language: ${source.apiName}`,
          `Target language: ${target.apiName}`,
          sourceWord ? `Source word: ${sourceWord}` : "Source word: missing",
          `Target word: ${targetWord}`
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
    return JSON.parse(extractOutputText(data));
  }

  async function synthesizeSpeech({ apiKey, text, languageName, kind }) {
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

    return response.blob();
  }

  window.MiniAnkiOpenAI = {
    generateSentence,
    synthesizeSpeech
  };
}());
