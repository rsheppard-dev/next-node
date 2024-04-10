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
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

const nanoid = customAlphabet('0123456789', 6);

export const rolesEnum = pgEnum('roles', ['admin', 'member']);

export const user = pgTable(
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

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;
export type PublicUser = Omit<
	User,
	| 'password'
	| 'verificationCode'
	| 'passwordResetCode'
	| 'passwordResetExpiresAt'
> & { sessionId: string };

export const group = pgTable('groups', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 256 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Group = InferSelectModel<typeof group>;
export type NewGroup = InferInsertModel<typeof group>;

export const groupUsers = pgTable(
	'group_users',
	{
		id: uuid('id').defaultRandom(),
		userId: uuid('user_id')
			.references(() => user.id, { onDelete: 'cascade' })
			.notNull(),
		groupId: uuid('group_id')
			.references(() => group.id, { onDelete: 'cascade' })
			.notNull(),
		role: rolesEnum('role').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	table => {
		return {
			pk: primaryKey({ columns: [table.userId, table.groupId] }),
		};
	}
);

export type GroupUser = InferSelectModel<typeof groupUsers>;
export type NewGroupUser = InferInsertModel<typeof groupUsers>;

export const session = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull(),
	isValid: boolean('is_valid').notNull().default(true),
	userAgent: varchar('user_agent', { length: 256 }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;
