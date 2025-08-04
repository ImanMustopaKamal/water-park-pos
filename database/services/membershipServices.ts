import { getDB } from "../initDB";
import { Membership, MembershipCreate } from "../models/Membership";
import { PaginationQuery, PaginationResult } from "../models/pagination";

const db = getDB();

function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`
  );
}

export const generateMembershipCode = async (): Promise<string> => {
  // const category = await db.getFirstAsync<MembershipCategory>(
  //   `SELECT name FROM membership_categories WHERE id = ?`,
  //   [category_id]
  // );

  // if (!category) {
  //   throw new Error("Kategori tidak ditemukan");
  // }

  // const prefix = category.name.replace(/\s+/g, "_").toUpperCase();

  const result = await db.getFirstAsync<Membership>(
    `SELECT code FROM memberships ORDER BY id DESC LIMIT 1`
  );

  let nextNumber = 1;
  if (result?.code) {
    const lastNumber = parseInt(result.code, 10);
    nextNumber = lastNumber + 1;
  }

  const padded = nextNumber.toString().padStart(6, "0");
  return `${padded}`;
};

export const getAllMembers = async (
  req: PaginationQuery
): Promise<PaginationResult<Membership>> => {
  const { page, limit, search } = req;

  const offset = page * limit;

  const columnQuery = ["m.name", "m.code"];

  let query = "";

  if (search !== "") {
    const whereClause = columnQuery
      .map((col) => `${col} LIKE '%${search}%'`)
      .join(" OR ");
    query += `WHERE (${whereClause}) `;
  }

  // update manual
  await db.runAsync(`
    UPDATE memberships
    SET status = 0
    WHERE end_at IS NOT NULL
      AND datetime(end_at) < datetime('now')`);

  const results = db.getAllSync<{ count: number }>(
    `SELECT COUNT(*) AS count 
    FROM memberships m
    JOIN membership_categories mc ON mc.id = m.category_id ${query}`
  );
  const total = results[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const data = await db.getAllAsync<Membership>(
    `SELECT m.*, mc.name as category_name, 
      (CASE WHEN m.status = 1 THEN 'Aktif' ELSE 'Tidak Aktif' END) as status_name
    FROM memberships m
    JOIN membership_categories mc ON mc.id = m.category_id
    ${query}
    ORDER BY m.id DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return { data, total, totalPages, currentPage: page };
};

export const deleteMember = async (id: number): Promise<number> => {
  try {
    const result = await db.runAsync(
      `UPDATE memberships SET status = 0 WHERE id = ?`,
      [id]
    );

    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

export const createMembership = async (
  params: MembershipCreate
): Promise<number> => {
  try {
    // const code = await generateMembershipCode();
    const startAt = formatDateTime(new Date());
    const endAt = formatDateTime(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    const result = await db.runAsync(
      `INSERT INTO memberships
        (name, code, description, category_id, status, start_at, end_at)
      VALUES
        (?, ?, ?, ?, 1, ?, ?)`,
      [
        params.name,
        params.code,
        params.description,
        params.category_id,
        startAt,
        endAt,
      ]
    );

    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

export const getMembership = async (id: string): Promise<Membership | null> => {
  try {
    const result = db.getFirstAsync<Membership>(
      `SELECT m.*, mc.name as category_name, 
        (CASE WHEN m.status = 1 THEN 'Aktif' ELSE 'Tidak Aktif' END) as status_name
      FROM memberships m
      JOIN membership_categories mc ON mc.id = m.category_id
      WHERE m.id = ?`,
      [id]
    );

    if (!result) {
      throw new Error("Membership tidak ditemukan");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateMembership = async (params: any): Promise<number> => {
  try {
    const exist = await db.getFirstAsync<Membership>(
      `SELECT * FROM memberships WHERE id = ?`,
      [params.id]
    );

    if (!exist) {
      throw new Error("Membership tidak ditemukan");
    }

    const endAt =
      params.extendPeriod !== ""
        ? formatDateTime(
            new Date(
              new Date(exist.end_at).valueOf() +
                params.extendPeriod * 24 * 60 * 60 * 1000
            )
          )
        : exist.end_at;

    const result = await db.runAsync(
      `UPDATE memberships 
      SET 
        name = ?,
        description = ?,
        category_id = ?,
        code = ?,
        end_at = ?
      WHERE id = ?`,
      [
        params.name,
        params.description,
        params.category_id,
        params.code,
        endAt,
        params.id,
      ]
    );
    console.log("🚀 ~ updateMembership ~ result:", result);

    return result.lastInsertRowId;
  } catch (error) {
    console.log("🚀 ~ updateMembership ~ error:", error);
    throw error;
  }
};

export const checkMembership = async (code: string): Promise<Membership | null> => {
  try {
    const result = await db.getFirstAsync<Membership>(`
    SELECT m.*, mc.name as category_name, 
      (CASE WHEN m.status = 1 THEN 'Aktif' ELSE 'Tidak Aktif' END) as status_name
    FROM memberships m
    JOIN membership_categories mc ON mc.id = m.category_id
    WHERE m.code = ?`, [code]);

    if(!result) {
      throw new Error('Member tidak ditemukan')
    }
    
    console.log("🚀 ~ checkMembership ~ result:", result)

    return result
  } catch (error) {
    throw error;
  }
};
