import { Express } from "express";
import { storage } from "./storage";

export function registerRoutes(app: Express) {
  // Session endpoints
  app.get("/api/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions);
    } catch (e) {
      console.error("Error fetching sessions:", e);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const session = await storage.createSession(req.body);
      res.json(session);
    } catch (e) {
      console.error("Error creating session:", e);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      await storage.updateSessionTitle(parseInt(req.params.id), req.body.title);
      res.sendStatus(204);
    } catch (e) {
      console.error("Error updating session:", e);
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      await storage.deleteSession(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (e) {
      console.error("Error deleting session:", e);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  // Message endpoints
  app.get("/api/messages/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getMessages(parseInt(req.params.sessionId));
      res.json(messages);
    } catch (e) {
      console.error("Error fetching messages:", e);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const message = await storage.addMessage(req.body);
      res.json(message);
    } catch (e) {
      console.error("Error adding message:", e);
      res.status(500).json({ error: "Failed to add message" });
    }
  });

  app.delete("/api/messages/:sessionId", async (req, res) => {
    try {
      await storage.clearSession(parseInt(req.params.sessionId));
      res.sendStatus(204);
    } catch (e) {
      console.error("Error clearing session:", e);
      res.status(500).json({ error: "Failed to clear session" });
    }
  });
}
