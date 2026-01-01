import express, { type Request, Response, NextFunction } from "express";
import { storage } from "./storage";

const app = express();
app.use(express.json());

app.get("/api/messages", async (_req, res) => {
  const messages = await storage.getMessages();
  res.json(messages);
});

app.post("/api/messages", async (req, res) => {
  const message = await storage.addMessage(req.body);
  res.json(message);
});

app.delete("/api/messages", async (_req, res) => {
  await storage.clearMessages();
  res.sendStatus(204);
});

const PORT = 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend listening on port " + PORT);
});
