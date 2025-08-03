import { PaginationQuery, PaginationResult } from "../models/pagination";
import { getDB } from "../initDB";
import { User, UserEditRequest, UserRequest } from "../models/User";
import { hashPassword } from "../../utils/hash";

const db = getDB();

export const getAllUsers = async (
  req: PaginationQuery
): Promise<PaginationResult<User>> => {
  const { page, limit, search } = req;

  const offset = (page - 1) * limit;

  const columnQuery = ["roles.name", "users.name", "users.username"];

  let query = "";

  if (search !== "") {
    const whereClause = columnQuery
      .map((col) => `${col} LIKE '%${search}%'`)
      .join(" OR ");
    query += ` AND (${whereClause}) `;
  }

  const results = db.getAllSync<{ count: number }>(
    `SELECT COUNT(*) AS count 
    FROM users 
    JOIN roles ON users.role_id = roles.id 
    WHERE status = 1 ${query}`
  );
  const total = results[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const data = await db.getAllAsync<User>(
    `
    SELECT users.*, roles.name as role_name
    FROM users
    JOIN roles ON users.role_id = roles.id 
    WHERE status = 1 ${query}
    ORDER BY id DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return { data, total, totalPages, currentPage: page };
};

export const createUser = async (user: UserRequest): Promise<number> => {
  try {
    const exist = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE username = ? AND status = 1`,
      [user.username]
    );

    if (exist) {
      throw new Error(
        `username: ${user.username} sudah digunakan oleh ${exist.name}`
      );
    }

    const hashedPassword = await hashPassword(user.password);

    const result = await db.runAsync(
      `
    INSERT INTO users 
      (username, name, password, role_id) 
    VALUES
      (?, ?, ?, ?)`,
      [user.username, user.name, hashedPassword, user.role_id]
    );
    console.log("🚀 ~ createUser ~ result:", result);

    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (user: UserEditRequest): Promise<number> => {
  try {
    let password = user.oldPassword;
    if (user.password !== "") {
      password = await hashPassword(user.password);
    }

    const result = await db.runAsync(
      `UPDATE users SET username = ?, name = ?, password = ?, role_id = ? WHERE id = ?`,
      [user.username, user.name, password, user.role_id, user.id]
    );
    console.log("🚀 ~ createUser ~ result:", result);

    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<number> => {
  try {
    const result = await db.runAsync(
      `UPDATE users SET status = 0 WHERE id = ?`,
      [id]
    );

    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (id: string): Promise<User | null> => {
  try {
    const result = db.getFirstAsync<User>(
      `SELECT users.*, roles.name as role_name
      FROM users
      JOIN roles ON users.role_id = roles.id
      WHERE users.id = ? AND users.status = 1`,
      [id]
    );

    if (!result) {
      throw new Error("User tidak ditemukan");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
