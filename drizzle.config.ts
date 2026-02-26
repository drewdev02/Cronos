import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/main/database/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:local.db'
  }
})
