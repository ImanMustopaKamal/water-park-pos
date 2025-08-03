import { getDB } from "../initDB";
import { MembershipCategory } from "../models/MembershipCategory";

const db = getDB()

export const getAllMemberCatogories = async (): Promise<MembershipCategory[]> => {
  try {
    const result = await db.getAllAsync<MembershipCategory>(`SELECT * FROM membership_categories`);

    if (!result) {
      throw new Error("Membership category not found");
    }

    return result;
  } catch (error) {
    throw error;
  }
};