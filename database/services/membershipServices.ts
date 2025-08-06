import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import { getDB } from "../initDB";
import {
  Membership,
  MembershipCreate,
  MembershipImport,
} from "../models/Membership";
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
  const { page, limit, search, status } = req;
  console.log(
    "🚀 ~ getAllMembers ~ page, limit, search, status:",
    page,
    limit,
    search,
    status
  );

  const offset = page * limit;

  const columnQuery = ["m.name", "m.code"];

  let query = "";

  if (search !== "") {
    const whereClause = columnQuery
      .map((col) => `${col} LIKE '%${search}%'`)
      .join(" OR ");
    query += `AND (${whereClause}) `;
  }

  // update manual
  const dbExist = await db.getFirstAsync<{ name: string }>(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='memberships';
  `);
  console.log("🚀 ~ getAllMembers ~ dbExist:", dbExist);

  if (dbExist?.name === "memberships") {
    console.log("hello");
    await db.runAsync(`
      UPDATE memberships
      SET status = 0
      WHERE end_at IS NOT NULL AND datetime(end_at) < datetime('now');
    `);
  }

  if (page === -1) {
    const data = await db.getAllAsync<Membership>(
      `SELECT m.*, mc.name as category_name, 
        (CASE WHEN m.status = 1 THEN 'Aktif' ELSE 'Expired' END) as status_name
      FROM memberships m
      JOIN membership_categories mc ON mc.id = m.category_id
      WHERE m.status = ${status}
      ${query}
      ORDER BY m.id DESC`
    );
    console.log("🚀 ~ getAllMembers ~ data:", data);

    return { data, total: 0, totalPages: 0, currentPage: page };
  }

  const results = db.getAllSync<{ count: number }>(
    `SELECT COUNT(*) AS count 
    FROM memberships m
    JOIN membership_categories mc ON mc.id = m.category_id
    WHERE m.status = ${status} ${query}`
  );
  const total = results[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const data = await db.getAllAsync<Membership>(
    `SELECT m.*, mc.name as category_name, 
      (CASE WHEN m.status = 1 THEN 'Aktif' ELSE 'Expired' END) as status_name
    FROM memberships m
    JOIN membership_categories mc ON mc.id = m.category_id
    WHERE m.status = ${status}
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
    const codeCheck = await checkMembership(params.code);

    if (codeCheck) {
      throw new Error(`Kode ${params.code} sudah digunakan`);
    }

    const startAt = formatDateTime(new Date());
    const endAt = formatDateTime(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    const result = await db.runAsync(
      `INSERT INTO memberships
        (name, phone, code, description, category_id, status, start_at, end_at)
      VALUES
        (?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        params.name,
        params.phone,
        params.code,
        params.description,
        params.category_id,
        startAt,
        endAt,
      ]
    );
    console.log("🚀 ~ createMembership ~ result:", result);

    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

export const getMembership = async (id: string): Promise<Membership | null> => {
  try {
    const result = db.getFirstAsync<Membership>(
      `SELECT m.*, mc.name as category_name, 
        (CASE WHEN m.status = 1 THEN 'Aktif' ELSE 'Expired' END) as status_name
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
    const codeCheck = await checkMembership(params.code);

    if (codeCheck && codeCheck.id !== Number(params.id)) {
      throw new Error(`Kode ${params.code} sudah digunakan`);
    }

    const exist = await db.getFirstAsync<Membership>(
      `SELECT * FROM memberships WHERE id = ?`,
      [params.id]
    );

    if (!exist) {
      throw new Error("Membership tidak ditemukan");
    }

    let startAt = exist.start_at;
    let endAt = exist.end_at;
    let status = exist.status;

    if (params.extendPeriod !== "") {
      startAt =
        exist.status === 1 ? exist.start_at : formatDateTime(new Date());

      endAt = formatDateTime(
        new Date(
          (exist.status === 1 ? new Date(exist.end_at).valueOf() : Date.now()) +
            params.extendPeriod * 24 * 60 * 60 * 1000
        )
      );

      status = 1;
    }

    const result = await db.runAsync(
      `UPDATE memberships 
      SET 
        name = ?,
        description = ?,
        category_id = ?,
        code = ?,
        end_at = ?,
        start_at = ?,
        status = ?
      WHERE id = ?`,
      [
        params.name,
        params.description,
        params.category_id,
        params.code,
        endAt,
        startAt,
        status,
        params.id,
      ]
    );

    return result.changes;
  } catch (error) {
    console.log("🚀 ~ updateMembership ~ error:", error);
    throw error;
  }
};

export const checkMembership = async (
  code: string
): Promise<Membership | null> => {
  try {
    const result = await db.getFirstAsync<Membership>(
      `
    SELECT m.*, mc.name as category_name, 
      (CASE WHEN m.status = 1 THEN 'Aktif' ELSE 'Expired' END) as status_name
    FROM memberships m
    JOIN membership_categories mc ON mc.id = m.category_id
    WHERE m.code = ? AND m.status = 1`,
      [code]
    );

    // if (!result) {
    //   throw new Error("Member tidak ditemukan");
    // }

    // console.log("🚀 ~ checkMembership ~ result:", result);

    return result;
  } catch (error) {
    throw error;
  }
};

export const exportData = async (params: any) => {
  try {
    // 1. Get all data without pagination
    const data = await getAllMembers({
      page: -1,
      limit: 0,
      search: params.search,
      status: params.status,
    });
    const plainData = JSON.parse(JSON.stringify(data.data));

    // 2. Create worksheet & workbook
    const ws = XLSX.utils.json_to_sheet(plainData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Memberships");

    // 3. Write to a base64 string directly
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });

    // 4. Save file
    const fileUri = FileSystem.cacheDirectory + "memberships.xlsx";
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 5. Verify file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error("File was not created successfully");
    }

    // 6. Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Share Memberships Data",
      UTI: "com.microsoft.excel.xlsx", // iOS specific
    });
  } catch (error) {
    console.error("❌ Failed to export Excel:", error);
    throw error; // Re-throw if you want to handle this elsewhere
  }
};

export const importData = async () => {
  const res = await DocumentPicker.getDocumentAsync({
    type: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (res.canceled || !res.assets || res.assets.length === 0) {
    alert("Tidak ada file dipilih");
    return;
  }

  const file = res.assets[0];
  const uri = file.uri;

  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const workbook = XLSX.read(b64, { type: "base64" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });

  if (rawData.length === 0) {
    throw new Error("Data membership kosong");
  }

  const data: MembershipImport[] = rawData.map((item) => ({
    category_id: Number(item.category_id),
    category_name: String(item.category_name || ""),
    code: String(item.code || ""),
    name: String(item.name || ""),
    description: String(item.description || ""),
    status: Number(item.status || 0),
    start_at: String(item.start_at || ""),
    end_at: String(item.end_at || ""),
  }));

  // Escape string untuk SQL (gunakan ? placeholder jika pakai prepared statement)
  const values = data.map(
    (item) =>
      `(${item.category_id}, ` +
      `'${item.code.replace(/'/g, "''")}', ` +
      `'${item.name.replace(/'/g, "''")}', ` +
      `'${item.description.replace(/'/g, "''")}', ` +
      `${item.status}, ` +
      `'${item.start_at}', ` +
      `'${item.end_at}')`
  );

  const sql = `
    INSERT INTO memberships 
      (category_id, code, name, description, status, start_at, end_at)
    VALUES
      ${values.join(",\n")}
  `;

  try {
    const result = await db.runAsync(sql);
    console.log("✅ Data berhasil di-import:", result);
  } catch (error) {
    console.error("❌ Gagal insert ke database:", error);
    alert("Gagal menyimpan data ke database.");
  }
};
