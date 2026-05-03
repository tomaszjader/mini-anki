const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const OPENAI_MODEL = "gpt-5.5";
const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "coral";
const ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendAudio(res, status, buffer, contentType = "audio/mpeg") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(buffer);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) {
        req.destroy();
        reject(new Error("Request too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
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

async function generateSentence(req, res) {
  try {
    const body = JSON.parse(await readBody(req));
    const apiKey = (body.apiKey || process.env.OPENAI_API_KEY || "").trim();
    const pl = (body.pl || "").trim();
    const en = (body.en || "").trim();

    if (!apiKey || !pl || !en) {
      sendJson(res, 400, { error: "Missing API key or words." });
      return;
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: [
          "Create one very simple English example sentence for an Anki vocabulary card.",
          "The sentence must use the exact English word or phrase naturally.",
          "The sentence must be correct for the word's part of speech.",
          "Use beginner English, maximum 8 words.",
          "The Polish translation must be natural and must contain the Polish word or phrase.",
          "Return only JSON matching the schema."
        ].join(" "),
        input: `Polish word: ${pl}\nEnglish word: ${en}`,
        text: {
          format: {
            type: "json_schema",
            name: "anki_sentence",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                english_sentence: { type: "string" },
                polish_translation: { type: "string" }
              },
              required: ["english_sentence", "polish_translation"]
            }
          }
        }
      })
    });

    if (!response.ok) {
      sendJson(res, response.status, { error: await response.text() });
      return;
    }

    const data = await response.json();
    sendJson(res, 200, JSON.parse(extractOutputText(data)));
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function synthesizeSpeech(req, res) {
  try {
    const body = JSON.parse(await readBody(req));
    const apiKey = (body.apiKey || process.env.OPENAI_API_KEY || "").trim();
    const text = (body.text || "").trim();
    const kind = body.kind === "word" ? "word" : "sentence";

    if (!apiKey || !text) {
      sendJson(res, 400, { error: "Missing API key or text." });
      return;
    }

    const instructions = kind === "word"
      ? "Say only this English word or phrase once. Use clear beginner-friendly pronunciation."
      : "Read this English sentence naturally and clearly for a beginner language learner.";

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
      sendJson(res, response.status, { error: await response.text() });
      return;
    }

    const audio = Buffer.from(await response.arrayBuffer());
    sendAudio(res, 200, audio, response.headers.get("content-type") || "audio/mpeg");
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

function serveStatic(req, res) {
  const requested = req.url === "/" ? "/index.html" : req.url;
  const pathname = decodeURIComponent(requested.split("?")[0]);
  const filePath = path.normalize(path.join(ROOT, pathname));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/generate") {
    generateSentence(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/speech") {
    synthesizeSpeech(req, res);
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Mini Anki: http://localhost:${PORT}`);
});
