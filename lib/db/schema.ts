import { primaryKey, uuid, pgTable, timestamp, text, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid("id").notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("kind", { enum: ["custom", "gemini"] })
      .notNull()
      .default("custom"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);
