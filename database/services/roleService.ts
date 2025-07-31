import { getDB } from '../initDB';
import { Role } from '../models/Role';

export const getRoleById = async (id: number): Promise<Role> => {
  const db = getDB();
  
  try {
    const result = await db.getFirstAsync<Role>(
      'SELECT * FROM roles WHERE id = ?',
      [id]
    );
    
    if (!result) {
      throw new Error('Role not found');
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};