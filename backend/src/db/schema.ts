import {
	boolean,
	index,
	pgEnum,
	primaryKey,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
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
export const inviteStatusEnum = pgEnum('invite_status', [
	'sent',
	'viewed',
	'accepted',
	'rejected',
]);

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().unique().defaultRandom(),
		givenName: varchar('given_name', { length: 256 }).notNull(),
		familyName: varchar('family_name', { length: 256 }).notNull(),
		email: varchar('email', { length: 256 }).unique().notNull(),
		password: varchar('password', { length: 256 }).notNull(),
		dob: date('date_of_birth'),
		picture: varchar('picture', { length: 256 }),
		isVerified: boolean('is_verified').notNull().default(false),
		verificationCode: varchar('verification_code', { length: 256 }).default(
			nanoid()
		),
		ResetPasswordCode: varchar('password_reset_code', { length: 256 }),
		ResetPasswordExpiresAt: timestamp('password_reset_expires_at'),
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
	usersToNotifications: many(UsersToNotifications),
	sessions: many(sessions),
	invitesReceived: many(invites, {
		relationName: 'invitee',
	}),
	invitesSent: many(invites, {
		relationName: 'inviter',
	}),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type PublicUser = Omit<
	User,
	| 'password'
	| 'verificationCode'
	| 'ResetPasswordCode'
	| 'ResetPasswordExpiresAt'
> & { sessionId: string };

export const groups = pgTable('groups', {
	id: uuid('id').primaryKey().unique().defaultRandom(),
	name: varchar('name', { length: 256 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const groupRelations = relations(groups, ({ many }) => ({
	usersToGroups: many(usersToGroups),
	invites: many(invites),
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
		role: rolesEnum('role').notNull().default('member'),
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
	id: uuid('id').primaryKey().unique().defaultRandom(),
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

export const invites = pgTable(
	'invites',
	{
		id: uuid('id').primaryKey().unique().defaultRandom(),
		inviterId: uuid('inviter_id').notNull(),
		groupId: uuid('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' }),
		inviteDate: timestamp('invite_date').notNull().defaultNow(),
		joinDate: timestamp('join_date'),
		inviteCode: varchar('invite_code', { length: 256 }).default(nanoid()),
		email: varchar('email', { length: 256 }).notNull(),
		role: rolesEnum('role').notNull().default('member'),
		message: text('message'),
		inviteeId: uuid('invitee_id').references(() => users.id, {
			onDelete: 'cascade',
		}),
		status: inviteStatusEnum('status').notNull().default('sent'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	table => {
		return {
			inviteEmailIndex: index('invite_email_index').on(table.email),
			inviteCodeIndex: index('invite_code_index').on(table.inviteCode),
		};
	}
);

export const invitesRelations = relations(invites, ({ one }) => ({
	group: one(groups, {
		fields: [invites.groupId],
		references: [groups.id],
	}),
	inviter: one(users, {
		fields: [invites.inviterId],
		references: [users.id],
		relationName: 'inviter',
	}),
	invitee: one(users, {
		fields: [invites.inviteeId],
		references: [users.id],
		relationName: 'invitee',
	}),
}));

export type Invite = InferSelectModel<typeof invites>;
export type NewInvite = InferInsertModel<typeof invites>;
export type PublicInvite = Omit<Invite, 'inviteCode'>;

export const notifications = pgTable('notifications', {
	id: uuid('id').primaryKey().unique().defaultRandom(),
	title: varchar('title', { length: 256 }).notNull(),
	message: text('message').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ many }) => ({
	usersToNotifications: many(UsersToNotifications),
}));

export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;

export const UsersToNotifications = pgTable('users_to_notifications', {
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	notificationId: uuid('notification_id')
		.references(() => notifications.id, { onDelete: 'cascade' })
		.notNull(),
	isViewed: boolean('is_viewed').notNull().default(false),
});

export const usersToNotificationsRelations = relations(
	UsersToNotifications,
	({ one }) => ({
		users: one(users, {
			fields: [UsersToNotifications.userId],
			references: [users.id],
		}),
		notifications: one(notifications, {
			fields: [UsersToNotifications.notificationId],
			references: [notifications.id],
		}),
	})
);

export type UsersToNotifications = InferSelectModel<
	typeof UsersToNotifications
>;
export type NewUsersToNotifications = InferInsertModel<
	typeof UsersToNotifications
>;
