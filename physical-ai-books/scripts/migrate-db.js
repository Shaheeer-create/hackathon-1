const { drizzle } = require('drizzle-orm/better-sqlite3');
const { migrate } = require('drizzle-orm/better-sqlite3/migrator');
const Database = require('better-sqlite3');
require('dotenv').config();

try {
  // Connect to SQLite database
  const sqlite = new Database(process.env.DATABASE_URL || './local.db');
  const db = drizzle(sqlite);

  // Run migrations
  migrate(db, { migrationsFolder: './drizzle' });

  console.log('Database migrations completed successfully');
  sqlite.close();
} catch (error) {
  console.error('Error running database migrations:', error);
  process.exit(1);
}