import CryptoJS from 'crypto-js';

const hash = CryptoJS.SHA256('password').toString();

export const hashPassword = async (password: string): Promise<string> => {
  return CryptoJS.SHA256(password).toString();
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return CryptoJS.SHA256(password).toString() === hash;
};
