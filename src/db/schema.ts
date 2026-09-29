import { pgTable, uuid, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("aurora_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  plan: varchar("plan", { length: 20 }).notNull().default("free"),
  avatarColor: varchar("avatar_color", { length: 20 }).notNull().default("#7B2CFF"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("aurora_favorites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  seriesSlug: varchar("series_slug", { length: 120 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchHistory = pgTable("aurora_watch_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  seriesSlug: varchar("series_slug", { length: 120 }).notNull(),
  episodeNumber: integer("episode_number").notNull().default(1),
  progressSec: integer("progress_sec").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserRow = typeof users.$inferSelect;
