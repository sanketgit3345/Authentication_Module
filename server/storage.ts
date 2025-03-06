import mysql from 'mysql2/promise';
import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import MySQLStore from "express-mysql-session";

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
};

console.log('Attempting to connect to MySQL with config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;
}

export class MySQLStorage implements IStorage {
  private pool: mysql.Pool;
  sessionStore: session.Store;

  constructor() {
    this.pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Initialize session store
    const MySQLStoreSession = MySQLStore(session);
    this.sessionStore = new MySQLStoreSession({
      ...dbConfig,
      createDatabaseTable: true,
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
        }
      }
    });
  }

  async initDatabase() {
    try {
      console.log('Testing database connection...');
      const connection = await this.pool.getConnection();
      console.log('Successfully connected to MySQL');

      console.log('Creating users table if not exists...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
        )
      `);
      console.log('Users table ready');

      connection.release();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return (rows as User[])[0];
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return (rows as User[])[0];
    } catch (error) {
      console.error('Failed to get user by username:', error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [result] = await this.pool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [insertUser.username, insertUser.password]
      );
      const id = (result as mysql.ResultSetHeader).insertId;
      return { id, ...insertUser };
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }
}

// Initialize storage with async initialization
export const storage = new MySQLStorage();
// Call initDatabase but don't block startup
storage.initDatabase().catch(console.error);