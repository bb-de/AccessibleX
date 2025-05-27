import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const accessibilitySettings = pgTable("accessibility_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  settings: jsonb("settings").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accessibilityAnalytics = pgTable("accessibility_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  event: text("event").notNull(),
  data: jsonb("data"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSettingsSchema = createInsertSchema(accessibilitySettings).pick({
  userId: true,
  settings: true,
});

export const insertAnalyticsSchema = createInsertSchema(accessibilityAnalytics).pick({
  userId: true,
  sessionId: true,
  event: true,
  data: true,
  userAgent: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAccessibilitySettings = z.infer<typeof insertSettingsSchema>;
export type AccessibilitySettings = typeof accessibilitySettings.$inferSelect;

export type InsertAccessibilityAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type AccessibilityAnalytics = typeof accessibilityAnalytics.$inferSelect;
