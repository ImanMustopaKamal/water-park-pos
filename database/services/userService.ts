import { PaginationQuery, PaginationResult } from "../models/pagination";
import { getDB } from "../initDB";
import { User } from "../models/User";

const db = getDB();

export const getAllUsers = async (
  req: PaginationQuery
): Promise<PaginationResult<User>> => {
  const { page, limit } = req;

  const offset = (page - 1) * limit;

  const results = db.getAllSync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM users"
  );
  const total = results[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const data = await db.getAllAsync<User>(
    "SELECT * FROM users ORDER BY id DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );

  return { data, total, totalPages, currentPage: page };
};
