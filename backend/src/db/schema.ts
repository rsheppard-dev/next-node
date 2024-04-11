import { boolean, pgEnum, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core';
import { customAlphabet } from 'nanoid';
import {
	pgTable,
	uuid,
	varchar,
	date,
	timestamp,
	text,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

const nanoid = customAlphabet('0123456789', 6);

export const rolesEnum = pgEnum('roles', ['admin', 'member']);

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		givenName: varchar('given_name', { length: 256 }).notNull(),
		familyName: varchar('family_name', { length: 256 }).notNull(),
		email: varchar('email', { length: 256 }).unique().notNull(),
		password: varchar('password', { length: 256 }).notNull(),
		dob: date('date_of_birth'),
		picture: varchar('picture', { length: 256 }),
		isVerified: boolean('is_verified').notNull().default(false),
		verificationCode: varchar('verification_code', { length: 256 }).default(
			nanoid(6)
		),
		passwordResetCode: varchar('password_reset_code', { length: 256 }),
		passwordResetExpiresAt: timestamp('password_reset_expires_at'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	table => {
		return {
			emailIndex: uniqueIndex('email_index').on(table.email),
		};
	}
);

export const usersRelations = relations(users, ({ many }) => ({
	usersToGroups: many(usersToGroups),
	sessions: many(sessions),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type PublicUser = Omit<
	User,
	| 'password'
	| 'verificationCode'
	| 'passwordResetCode'
	| 'passwordResetExpiresAt'
> & { sessionId: string };

export const groups = pgTable('groups', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 256 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const groupRelations = relations(groups, ({ many }) => ({
	usersToGroups: many(usersToGroups),
}));

export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

export const usersToGroups = pgTable(
	'users_to_groups',
	{
		userId: uuid('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		groupId: uuid('group_id')
			.references(() => groups.id, { onDelete: 'cascade' })
			.notNull(),
		role: rolesEnum('role').notNull(),
	},
	table => {
		return {
			pk: primaryKey({ columns: [table.userId, table.groupId] }),
		};
	}
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
	groups: one(groups, {
		fields: [usersToGroups.groupId],
		references: [groups.id],
	}),
	users: one(users, {
		fields: [usersToGroups.userId],
		references: [users.id],
	}),
}));

export type UsersToGroups = InferSelectModel<typeof usersToGroups>;
export type NewUsersToGroups = InferInsertModel<typeof usersToGroups>;

export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	isValid: boolean('is_valid').notNull().default(true),
	userAgent: varchar('user_agent', { length: 256 }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
