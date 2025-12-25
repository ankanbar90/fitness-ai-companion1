// server/server.js (FINAL VERSION: GROQ + DATABASE)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const sqlite3 = require("sqlite3").verbose(); // Database Library

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. SETUP DATABASE ---
const db = new sqlite3.Database("./chat.db", (err) => {
  if (err) console.error("❌ Database Error:", err.message);
  else console.log("📂 Connected to SQLite database.");
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_msg TEXT,
  ai_msg TEXT,
  personality TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// --- 2. SETUP AI CLIENT (GROQ) ---
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/api/chat", async (req, res) => {
  const { message, userContext } = req.body;
  const personality = userContext?.personality || "A";
  const usageDays = userContext?.usageDays || 1;
  const lifestyle = userContext?.lifestyle || { steps: 0, sleepHours: 8 };

  console.log(`\n💬 Message: "${message}" | P=${personality}`);

  const systemPrompt = `
    You are a fitness AI companion.
    Personality: ${personality} (A=Supportive, B=Creative, C=Strict).
    User Stats: Days ${usageDays}, Steps ${lifestyle.steps}, Sleep ${lifestyle.sleepHours}h.
    Refuse medical questions. Keep answer under 100 words.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiReply = completion.choices[0].message.content;

    // --- 3. SAVE TO DATABASE ---
    const stmt = db.prepare(
      "INSERT INTO history (user_msg, ai_msg, personality) VALUES (?, ?, ?)"
    );
    stmt.run(message, aiReply, personality);
    stmt.finalize();

    // THIS IS THE LOG YOU WANT TO SEE 👇
    console.log("✅ Saved to DB & Sent Reply.");
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ reply: "⚠️ Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} (Database Active)`)
);
