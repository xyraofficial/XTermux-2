import express from "express";
import { storage } from "./storage";

const app = express();
app.use(express.json());

// Session endpoints
app.get("/api/sessions", async (_req, res) => {
  const sessions = await storage.getSessions();
  res.json(sessions);
});

app.post("/api/sessions", async (req, res) => {
  const session = await storage.createSession(req.body);
  res.json(session);
});

app.patch("/api/sessions/:id", async (req, res) => {
  await storage.updateSessionTitle(parseInt(req.params.id), req.body.title);
  res.sendStatus(204);
});

app.delete("/api/sessions/:id", async (req, res) => {
  await storage.deleteSession(parseInt(req.params.id));
  res.sendStatus(204);
});

// Message endpoints
app.get("/api/messages/:sessionId", async (req, res) => {
  const messages = await storage.getMessages(parseInt(req.params.sessionId));
  res.json(messages);
});

app.post("/api/messages", async (req, res) => {
  const message = await storage.addMessage(req.body);
  res.json(message);
});

app.delete("/api/messages/:sessionId", async (req, res) => {
  await storage.clearSession(parseInt(req.params.sessionId));
  res.sendStatus(204);
});

const PORT = 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend listening on port " + PORT);
});
