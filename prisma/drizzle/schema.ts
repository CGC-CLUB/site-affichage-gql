import { relations, sql } from "drizzle-orm";
import { boolean, datetime, foreignKey, mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const User = mysqlTable("User", {
  id: varchar("id", { length: 191 })
    .notNull()
    .primaryKey()
    .default(sql`uuid()`),
  email: varchar("email", { length: 191 }).notNull().unique(),
  family_name: varchar("family_name", { length: 191 }).notNull(),
  first_name: varchar("first_name", { length: 191 }).notNull(),
  password: varchar("password", { length: 191 }).notNull(),
  role: mysqlEnum("role", ["USER", "CHEF", "ADMIN"]).notNull().default("USER"),
  departmentId: varchar("departmentId", { length: 191 }),
  createdAt: datetime("createdAt", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  validated: boolean("validated").notNull(),
});

export const Post = mysqlTable(
  "Post",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .primaryKey()
      .default(sql`uuid()`),
    content: varchar("content", { length: 191 }),
    authorId: varchar("authorId", { length: 191 }).notNull(),
    image: varchar("image", { length: 191 }),
    createdAt: datetime("createdAt", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    validated: boolean("validated").notNull(),
    departmentId: varchar("departmentId", { length: 191 }).notNull(),
    important: boolean("important").notNull(),
  },
  (Post) => ({
    Post_author_fkey: foreignKey({
      name: "Post_author_fkey",
      columns: [Post.authorId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Post_department_fkey: foreignKey({
      name: "Post_department_fkey",
      columns: [Post.departmentId],
      foreignColumns: [Department.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  })
);

export const Department = mysqlTable(
  "Department",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .primaryKey()
      .default(sql`uuid()`),
    name: varchar("name", { length: 191 }).notNull(),
    chefId: varchar("chefId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (Department) => ({
    Department_chef_fkey: foreignKey({
      name: "Department_chef_fkey",
      columns: [Department.chefId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  })
);

export const TVs = mysqlTable(
  "TVs",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .primaryKey()
      .default(sql`uuid()`),
    name: varchar("name", { length: 191 }).notNull(),
    departmentId: varchar("departmentId", { length: 191 }).notNull(),
    password: varchar("password", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (TVs) => ({
    TVs_Department_fkey: foreignKey({
      name: "TVs_Department_fkey",
      columns: [TVs.departmentId],
      foreignColumns: [Department.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  })
);

export const UserRelations = relations(User, ({ many }) => ({
  Post: many(Post, {
    relationName: "PostToUser",
  }),
  Department: many(Department, {
    relationName: "DepartmentToUser",
  }),
}));

export const PostRelations = relations(Post, ({ one }) => ({
  author: one(User, {
    relationName: "PostToUser",
    fields: [Post.authorId],
    references: [User.id],
  }),
  department: one(Department, {
    relationName: "DepartmentToPost",
    fields: [Post.departmentId],
    references: [Department.id],
  }),
}));

export const DepartmentRelations = relations(Department, ({ one, many }) => ({
  chef: one(User, {
    relationName: "DepartmentToUser",
    fields: [Department.chefId],
    references: [User.id],
  }),
  TVs: many(TVs, {
    relationName: "DepartmentToTVs",
  }),
  Post: many(Post, {
    relationName: "DepartmentToPost",
  }),
}));

export const TVsRelations = relations(TVs, ({ one }) => ({
  Department: one(Department, {
    relationName: "DepartmentToTVs",
    fields: [TVs.departmentId],
    references: [Department.id],
  }),
}));

export type UserType = typeof User.$inferSelect;
export type PostType = typeof Post.$inferSelect;
export type DepartmentType = typeof Department.$inferSelect;
export type TVType = typeof TVs.$inferSelect;
