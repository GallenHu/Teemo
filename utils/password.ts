// https://github.com/AhmedAlqurafi/next-auth-credentials/blob/main/utils/hash.ts
import { compare, hash } from "bcryptjs";

/**
 * 对给定的密码进行加盐和哈希处理
 * @param {string} password - 要哈希的明文密码
 * @param {number} [saltRounds=10] - 加盐的轮数，默认为10
 * @returns {Promise<string>} 返回一个Promise，解析为哈希后的密码
 */
export async function saltAndHashPassword(password: string, saltRounds = 10) {
  try {
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
}
