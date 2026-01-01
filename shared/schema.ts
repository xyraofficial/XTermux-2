import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const chatSessions = sqliteTable("chat_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull().default("New Chat"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").references(() => chatSessions.id).notNull(),
  role: text("role").notNull(), // 'user' | 'model'
  content: text("content").notNull(),
  image: text("image"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertChatSessionSchema = createInsertSchema(chatSessions);
export const selectChatSessionSchema = createSelectSchema(chatSessions);
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const selectChatMessageSchema = createSelectSchema(chatMessages);

export type ChatSession = z.infer<typeof selectChatSessionSchema>;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatMessage = z.infer<typeof selectChatMessageSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
