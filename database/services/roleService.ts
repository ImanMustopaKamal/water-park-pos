import { getDB } from "../initDB";
import { Role } from "../models/Role";

const db = getDB();

export const getRoleById = async (id: number): Promise<Role> => {
  try {
    const result = await db.getFirstAsync<Role>(
      "SELECT * FROM roles WHERE id = ?",
      [id]
    );

    if (!result) {
      throw new Error("Role not found");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllRole = async (): Promise<Role[]> => {
  try {
    const result = await db.getAllAsync<Role>(`SELECT * FROM roles`);

    if (!result) {
      throw new Error("Role not found");
    }

    return result;
  } catch (error) {
    console.log("🚀 ~ getAllRole ~ error:", error)
    throw error;
  }
};
