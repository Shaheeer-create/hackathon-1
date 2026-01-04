import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// User table (from Better Auth)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  // Additional fields for technical background
  softwareSkills: text('softwareSkills', { mode: 'json' }),
  hardwareExperience: text('hardwareExperience', { mode: 'json' }),
});

// Session table (from Better Auth)
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Account table (from Better Auth)
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  providerId: text('providerId').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refreshToken: text('refreshToken'),
  accessToken: text('accessToken'),
  idToken: text('idToken'),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Verification table (from Better Auth)
export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
});