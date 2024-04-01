import { boolean, pgEnum, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import {
	pgTable,
	uuid,
	varchar,
	date,
	timestamp,
	text,
} from 'drizzle-orm/pg-core';

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
		isVerified: boolean('is_verified').notNull().default(false),
		verificationToken: varchar('verification_token', { length: 256 })
			.notNull()
			.default(nanoid()),
		passwordResetToken: varchar('password_reset_token', { length: 256 }),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	table => {
		return {
			emailIndex: uniqueIndex('email_index').on(table.email),
		};
	}
);

export const group = pgTable('groups', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 256 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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
