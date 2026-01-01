import { 
  type ChatMessage, 
  type InsertChatMessage, 
  type ChatSession, 
  type InsertChatSession,
  chatMessages, 
  chatSessions 
} from "../shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getSessions(): Promise<ChatSession[]>;
  createSession(session: InsertChatSession): Promise<ChatSession>;
  getMessages(sessionId: number): Promise<ChatMessage[]>;
  addMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearSession(sessionId: number): Promise<void>;
  deleteSession(sessionId: number): Promise<void>;
  updateSessionTitle(sessionId: number, title: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSessions(): Promise<ChatSession[]> {
    return await db.select().from(chatSessions).orderBy(desc(chatSessions.createdAt));
  }

  async createSession(session: InsertChatSession): Promise<ChatSession> {
    const [newSession] = await db.insert(chatSessions).values(session).returning();
    return newSession;
  }

  async getMessages(sessionId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(chatMessages.id);
  }

  async addMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async clearSession(sessionId: number): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  async deleteSession(sessionId: number): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId));
    await db.delete(chatSessions).where(eq(chatSessions.id, sessionId));
  }

  async updateSessionTitle(sessionId: number, title: string): Promise<void> {
    await db.update(chatSessions).set({ title }).where(eq(chatSessions.id, sessionId));
  }
}

export const storage = new DatabaseStorage();
