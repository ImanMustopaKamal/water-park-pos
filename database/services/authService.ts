import { getDB } from '../initDB';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../../utils/hash';

export const registerUser = async (user: User): Promise<number> => {
  const hashedPassword = await hashPassword(user.password);
  const db = getDB();
  
  try {
    const result = await db.runAsync(
      'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)',
      [user.username, hashedPassword, user.role_id]
    );
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (username: string, password: string): Promise<User> => {
  const db = getDB();
  
  try {
    const result = await db.getFirstAsync<User>(`
      SELECT users.*, roles.name as role_name
      FROM users
      JOIN roles ON users.role_id = roles.id
      WHERE users.username = ?
      `,
      [username]
    );
    
    if (!result) {
      throw new Error('User not found');
    }
    
    const isMatch = await comparePassword(password, result.password);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};