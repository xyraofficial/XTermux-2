import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // 'user' | 'model'
  content: text("content").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const selectChatMessageSchema = createSelectSchema(chatMessages);
export type ChatMessage = z.infer<typeof selectChatMessageSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
