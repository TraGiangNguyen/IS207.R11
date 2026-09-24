import { executeQuery } from '../data/db.js';

/**
 * User Model: Data Access Layer for MySQL `users` table
 */
export const UserModel = {
  /**
   * Find user by Email
   */
  async findByEmail(email) {
    const [rows] = await executeQuery('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  /**
   * Find user by Username
   */
  async findByUsername(username) {
    const [rows] = await executeQuery('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    return rows[0] || null;
  },

  /**
   * Find user by ID
   */
  async findById(id) {
    const [rows] = await executeQuery('SELECT id, username, email, full_name, role, avatar_url, created_at, updated_at FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  /**
   * Find user by Reset Password Token
   */
  async findByResetToken(token) {
    const [rows] = await executeQuery('SELECT * FROM users WHERE reset_token = ? LIMIT 1', [token]);
    return rows[0] || null;
  },

  /**
   * Create a new user in MySQL
   */
  async create({ username, email, passwordHash, fullName, role = 'customer', avatarUrl = null }) {
    const sql = `
      INSERT INTO users (username, email, password_hash, full_name, role, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await executeQuery(sql, [username, email, passwordHash, fullName, role, avatarUrl]);
    return result.insertId;
  },

  /**
   * Save Password Reset Token
   */
  async setResetToken(userId, token, expiresAt) {
    const sql = 'UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?';
    const [result] = await executeQuery(sql, [token, expiresAt, userId]);
    return result.affectedRows > 0;
  },

  /**
   * Find user by ID including password_hash
   */
  async findByIdWithPassword(id) {
    const [rows] = await executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  /**
   * Update user profile details (fullName, avatarUrl)
   */
  async updateProfile(userId, { fullName, avatarUrl }) {
    const sql = 'UPDATE users SET full_name = ?, avatar_url = ? WHERE id = ?';
    const [result] = await executeQuery(sql, [fullName, avatarUrl, userId]);
    return result.affectedRows > 0;
  },

  /**
   * Update User Password and clear reset token
   */
  async updatePassword(userId, newPasswordHash) {
    const sql = 'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?';
    const [result] = await executeQuery(sql, [newPasswordHash, userId]);
    return result.affectedRows > 0;
  },
};

export default UserModel;
