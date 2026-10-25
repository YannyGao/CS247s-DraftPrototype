import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

async function loadLocalEnv() {
  try {
    const source = await readFile(join(root, ".env.local"), "utf8");
    for (const line of source.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // A local environment file is optional.
  }
}

await loadLocalEnv();

const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function localSummary(transcript) {
  const sentences = transcript
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const find = (patterns) => sentences.filter((sentence) => patterns.some((pattern) => pattern.test(sentence))).slice(0, 3);
  const assessment = find([/assess|concern|suspect|likely|consistent|impression/i]);
  const recommendations = find([/recommend|plan|start|continue|obtain|monitor|follow|consult/i]);
  const pending = find([/pending|await|follow[- ]?up|result|culture|biopsy|imaging/i]);

  return {
    source: "local-fallback",
    sections: {
      "Consult question": sentences[0] || "No consult question identified.",
      Assessment: assessment.join(" ") || sentences.slice(1, 3).join(" ") || "No assessment identified.",
      Recommendations: recommendations.map((item) => `• ${item}`).join("\n") || "• Review and edit the transcript to add recommendations.",
      "Pending and follow-up": pending.map((item) => `• ${item}`).join("\n") || "• No pending items identified."
    }
  };
}

async function summarizeWithOpenAI(transcript) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return localSummary(transcript);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: "Transform the synthetic physician consult transcript into a concise draft with exactly four headings: Consult question, Assessment, Recommendations, Pending and follow-up. Preserve uncertainty and negation. Do not invent facts. This is synthetic test data and the output requires clinician review.",
      input: transcript
    })
  });

  if (!response.ok) throw new Error(`Summary provider returned ${response.status}`);
  const data = await response.json();
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text;
  if (!text) throw new Error("Summary provider returned no text");
  return { source: "api", text };
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/api/summarize") {
      const body = JSON.parse(await readBody(request));
      const transcript = String(body.transcript || "").trim();
      if (transcript.length < 20) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Add more transcript detail before generating a draft." }));
        return;
      }
      const result = await summarizeWithOpenAI(transcript);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(result));
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405);
      response.end("Method not allowed");
      return;
    }

    const rawPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const safePath = normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(root, safePath);
    let fileStat;
    try {
      fileStat = await stat(filePath);
      if (fileStat.isDirectory()) filePath = join(filePath, "index.html");
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const contents = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    if (request.method === "HEAD") response.end();
    else response.end(contents);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: error.message || "Unexpected server error" }));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`CS 247S prototypes running at http://localhost:${port}`);
});

