import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json());

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const PORT = parseInt(process.env.PORT || "3456");

interface ContextEntry {
  type: "clipboard" | "selection" | "file";
  content: string;
  timestamp: string;
  source: string;
}

const context: ContextEntry[] = [];

app.post("/context", (req, res) => {
  const entry: ContextEntry = {
    type: req.body.type || "clipboard",
    content: req.body.content,
    timestamp: new Date().toISOString(),
    source: req.body.source || "unknown",
  };
  context.push(entry);
  if (context.length > 100) context.shift();
  res.json({ ok: true });
});

app.get("/context", (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  res.json(context.slice(-limit));
});

app.post("/v1/messages", async (req, res) => {
  try {
    const recentContext = context.slice(-3).map((c) => `[${c.type}] ${c.content}`).join("\n");
    const messages = req.body.messages || [];

    if (recentContext) {
      messages.unshift({
        role: "system",
        content: `Recent context:\n${recentContext}`,
      });
    }

    const ollamaRes = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: req.body.model || "llama3.2",
        messages,
        stream: false,
      }),
    });

    const data = await ollamaRes.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

createServer(app).listen(PORT, () => {
  console.log(`claude-bridge listening on http://localhost:${PORT}`);
  console.log(`Forwarding to Ollama at ${OLLAMA_URL}`);
});
