import { type ChatMessage, type InsertChatMessage, chatMessages } from "../shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  getMessages(): Promise<ChatMessage[]>;
  addMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearMessages(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMessages(): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).orderBy(chatMessages.id);
  }

  async addMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async clearMessages(): Promise<void> {
    // In a real app we might soft delete or filter by session, 
    // but for this toolbox we'll just clear the table as requested.
    await db.delete(chatMessages);
  }
}

export const storage = new DatabaseStorage();
