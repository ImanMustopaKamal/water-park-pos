import * as SQLite from "expo-sqlite";
import SHA256 from "crypto-js/sha256";

// Open database synchronously
const db = SQLite.openDatabaseSync("app.db");

export const initDatabase = async () => {
  await db.execAsync("PRAGMA foreign_keys = OFF;");

  await db.runAsync(`DROP TRIGGER IF EXISTS trigger_users_updated_at;`);
  await db.runAsync(`DROP TABLE IF EXISTS users;`);
  await db.runAsync(`DROP TABLE IF EXISTS roles;`);
  await db.runAsync(`DROP TRIGGER IF EXISTS trigger_memberships_updated_at;`);
  await db.runAsync(`DROP TABLE IF EXISTS membership_categories;`);
  await db.runAsync(`DROP TABLE IF EXISTS memberships;`);

  await db.execAsync("PRAGMA foreign_keys = ON;");

  // Execute table creation in a transaction
  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
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
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (role_id) REFERENCES roles (id)
    );`
  );

  await db.runAsync(
    `CREATE TRIGGER IF NOT EXISTS trigger_users_updated_at
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
      UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
    END;`
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
    await db.runAsync(
      `INSERT OR IGNORE INTO users (username, name, password, role_id)
      VALUES ('admindev', 'admin dev', ?, ?);`,
      [defaultPassword, adminRoleId]
    );
  }

  // membership
  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS membership_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      status INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO membership_categories (name) VALUES ('GOLD'), ('PLATINUM');`
  );

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS memberships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      status INTEGER NOT NULL DEFAULT 1,
      start_at TEXT,
      end_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES membership_categories(id)
    )`);

  await db.runAsync(
    `CREATE TRIGGER IF NOT EXISTS trigger_memberships_updated_at
    AFTER UPDATE ON memberships
    FOR EACH ROW
    BEGIN
      UPDATE memberships SET updated_at = datetime('now') WHERE id = OLD.id;
    END;`
  );
};

export const getDB = () => db;
