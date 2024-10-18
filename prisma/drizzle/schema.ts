import { relations, sql } from 'drizzle-orm'
import { boolean, foreignKey, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const Role = pgEnum('Role', ['USER', 'CHEF', 'ADMIN'])

export const User = pgTable('User', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	email: text('email').notNull().unique(),
	family_name: text('family_name').notNull(),
	first_name: text('first_name').notNull(),
	password: text('password').notNull(),
	role: Role('role').notNull().default("USER"),
	departmentId: text('departmentId'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull(),
	validated: boolean('validated').notNull()
});

export const Post = pgTable('Post', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	content: text('content'),
	authorId: text('authorId').notNull(),
	image: text('image'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull(),
	validated: boolean('validated').notNull(),
	departmentId: text('departmentId').notNull(),
	important: boolean('important').notNull()
}, (Post) => ({
	'Post_author_fkey': foreignKey({
		name: 'Post_author_fkey',
		columns: [Post.authorId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'Post_department_fkey': foreignKey({
		name: 'Post_department_fkey',
		columns: [Post.departmentId],
		foreignColumns: [Department.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Department = pgTable('Department', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	name: text('name').notNull(),
	chefId: text('chefId').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
}, (Department) => ({
	'Department_chef_fkey': foreignKey({
		name: 'Department_chef_fkey',
		columns: [Department.chefId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const TVs = pgTable('TVs', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	name: text('name').notNull(),
	departmentId: text('departmentId').notNull(),
	password: text('password').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
}, (TVs) => ({
	'TVs_Department_fkey': foreignKey({
		name: 'TVs_Department_fkey',
		columns: [TVs.departmentId],
		foreignColumns: [Department.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const UserRelations = relations(User, ({ many }) => ({
	Post: many(Post, {
		relationName: 'PostToUser'
	}),
	Department: many(Department, {
		relationName: 'DepartmentToUser'
	})
}));

export const PostRelations = relations(Post, ({ one }) => ({
	author: one(User, {
		relationName: 'PostToUser',
		fields: [Post.authorId],
		references: [User.id]
	}),
	department: one(Department, {
		relationName: 'DepartmentToPost',
		fields: [Post.departmentId],
		references: [Department.id]
	})
}));

export const DepartmentRelations = relations(Department, ({ one, many }) => ({
	chef: one(User, {
		relationName: 'DepartmentToUser',
		fields: [Department.chefId],
		references: [User.id]
	}),
	TVs: many(TVs, {
		relationName: 'DepartmentToTVs'
	}),
	Post: many(Post, {
		relationName: 'DepartmentToPost'
	})
}));

export const TVsRelations = relations(TVs, ({ one }) => ({
	Department: one(Department, {
		relationName: 'DepartmentToTVs',
		fields: [TVs.departmentId],
		references: [Department.id]
	})
}));