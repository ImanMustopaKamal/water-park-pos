import * as SQLite from "expo-sqlite";
import SHA256 from 'crypto-js/sha256';

// Open database synchronously
const db = SQLite.openDatabaseSync("app.db");

export const initDatabase = async () => {
  // Enable foreign key support
  await db.execAsync("PRAGMA foreign_keys = ON;");

  await db.runAsync(`DROP TABLE IF EXISTS users;`);
  await db.runAsync(`DROP TABLE IF EXISTS roles;`);

  // Execute table creation in a transaction
  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );`
  );

  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role_id INTEGER,
      status INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (role_id) REFERENCES roles (id)
    );`
  );

  // Insert default roles
  await db.runAsync(
    `INSERT OR IGNORE INTO roles (name) VALUES ('admin'), ('owner'), ('spv'), ('cashier');`
  );

  // Get admin role_id
  const roleResult = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM roles WHERE name = 'admin'`
  );
  
  const adminRoleId = roleResult?.id;

  if (adminRoleId) {
    // Simple hashed password (use bcrypt if required)
    const defaultPassword = SHA256("admindev123").toString(); // hashed password

    // Insert default user
    await db.runAsync(`
      INSERT OR IGNORE INTO users (username, name, password, role_id)
      VALUES ('admindev', 'admin dev', ?, ?);`,
      [defaultPassword, adminRoleId]
    );
  }

  // membership
  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS membership_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`
  )
// description
      // price
  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS memberships (
      id INTEGER PRIMARY KEY AUTOINCREMENT
    )`
  )
};

export const getDB = () => db;
