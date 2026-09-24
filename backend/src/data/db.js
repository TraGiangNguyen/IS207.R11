import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'beautypals_db',
  DB_PORT = 3306,
} = process.env;

let pool = null;
let isConnectedToMySQL = false;

// Fallback in-memory store simulating MySQL users table
const inMemoryStore = {
  users: [],
  autoId: 1,
};

// Seed default test user in in-memory store
(async () => {
  const defaultHash = await bcrypt.hash('Admin@123', 10);
  inMemoryStore.users.push({
    id: inMemoryStore.autoId++,
    username: 'admin',
    email: 'admin@beautypals.com',
    password_hash: defaultHash,
    full_name: 'Quản Trị Viên BeautyPals',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    reset_token: null,
    reset_token_expires_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  });
})();

/**
 * Initialize connection and verify/create schema
 */
export async function initDatabase() {
  try {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: Number(DB_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log(`[DB] MySQL Connected successfully to ${DB_HOST}:${DB_PORT}`);

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${DB_NAME}\``);

    // Create users table
    const createUsersTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'staff', 'customer') DEFAULT 'customer',
        avatar_url VARCHAR(255) NULL,
        reset_token VARCHAR(255) NULL,
        reset_token_expires_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createUsersTableSQL);
    console.log('[DB] MySQL Schema initialized: Table `users` is ready.');

    connection.release();
    isConnectedToMySQL = true;
    return true;
  } catch (error) {
    console.warn(`[DB WARNING] Could not connect to local MySQL Server (${error.message}).`);
    console.log('[DB NOTICE] Operating in In-Memory MySQL Emulator Mode for offline development & internal testing.');
    isConnectedToMySQL = false;
    return false;
  }
}

/**
 * Universal Query Executor: Routes to live MySQL or Memory Adapter
 */
export async function executeQuery(sql, params = []) {
  if (isConnectedToMySQL && pool) {
    const [rows, fields] = await pool.query(sql, params);
    return [rows, fields];
  }

  // Emulate standard MySQL queries for inMemoryStore
  const cleanSQL = sql.trim();

  // 1. SELECT by email or username or id or reset_token
  if (/^SELECT/i.test(cleanSQL)) {
    let result = [...inMemoryStore.users];

    if (/WHERE email = \?/i.test(cleanSQL)) {
      result = result.filter((u) => u.email.toLowerCase() === String(params[0]).toLowerCase());
    } else if (/WHERE username = \?/i.test(cleanSQL)) {
      result = result.filter((u) => u.username.toLowerCase() === String(params[0]).toLowerCase());
    } else if (/WHERE \(email = \? OR username = \?\)/i.test(cleanSQL)) {
      const val = String(params[0]).toLowerCase();
      result = result.filter((u) => u.email.toLowerCase() === val || u.username.toLowerCase() === val);
    } else if (/WHERE id = \?/i.test(cleanSQL)) {
      result = result.filter((u) => Number(u.id) === Number(params[0]));
    } else if (/WHERE reset_token = \?/i.test(cleanSQL)) {
      const token = String(params[0]);
      result = result.filter((u) => u.reset_token === token);
    }

    return [result, []];
  }

  // 2. INSERT into users
  if (/^INSERT INTO users/i.test(cleanSQL)) {
    const [username, email, password_hash, full_name, role, avatar_url] = params;
    const newUser = {
      id: inMemoryStore.autoId++,
      username,
      email,
      password_hash,
      full_name,
      role: role || 'customer',
      avatar_url: avatar_url || null,
      reset_token: null,
      reset_token_expires_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    inMemoryStore.users.push(newUser);
    return [{ insertId: newUser.id, affectedRows: 1 }, []];
  }

  // 3. UPDATE users reset_token
  if (/UPDATE users SET reset_token = \?, reset_token_expires_at = \? WHERE id = \?/i.test(cleanSQL)) {
    const [reset_token, reset_token_expires_at, id] = params;
    const user = inMemoryStore.users.find((u) => Number(u.id) === Number(id));
    if (user) {
      user.reset_token = reset_token;
      user.reset_token_expires_at = reset_token_expires_at;
      user.updated_at = new Date();
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  // 4. UPDATE users password_hash
  if (/UPDATE users SET password_hash = \?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = \?/i.test(cleanSQL)) {
    const [password_hash, id] = params;
    const user = inMemoryStore.users.find((u) => Number(u.id) === Number(id));
    if (user) {
      user.password_hash = password_hash;
      user.reset_token = null;
      user.reset_token_expires_at = null;
      user.updated_at = new Date();
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  // 5. UPDATE users full_name, avatar_url
  if (/UPDATE users SET full_name = \?, avatar_url = \? WHERE id = \?/i.test(cleanSQL)) {
    const [full_name, avatar_url, id] = params;
    const user = inMemoryStore.users.find((u) => Number(u.id) === Number(id));
    if (user) {
      user.full_name = full_name;
      user.avatar_url = avatar_url;
      user.updated_at = new Date();
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  return [[], []];
}

export default {
  initDatabase,
  executeQuery,
};
