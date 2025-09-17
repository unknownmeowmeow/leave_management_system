import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT, 10)
    });

    this.db = this.pool.promise();
  }
}

const database = new Database().db;
export default database;
