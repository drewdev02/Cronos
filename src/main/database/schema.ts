import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core'

// ── Clients ────────────────────────────────────────────────────────────
export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP')
})

// ── Projects ───────────────────────────────────────────────────────────
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  clientId: text('client_id').references(() => clients.id),
  color: text('color'),
  rate: real('rate').default(0),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP')
})

// ── Tasks ──────────────────────────────────────────────────────────────
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  projectId: text('project_id').references(() => projects.id),
  duration: real('duration').notNull().default(0),
  startTime: text('start_time'),
  endTime: text('end_time'),
  status: text('status', { enum: ['pending', 'in_progress', 'completed'] })
    .notNull()
    .default('pending'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP')
})
