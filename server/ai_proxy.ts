import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

router.post("/completions", async (req, res) => {
  try {
    const { messages, model = "gpt-4o" } = req.body;
    const response = await openai.chat.completions.create({
      model,
      messages,
    });
    res.json(response);
  } catch (error) {
    console.error("AI Proxy Error:", error);
    res.status(500).json({ error: "AI Processing Failed" });
  }
});

export default router;
