import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export async function DbConnection() {
    const pool = mysql.createPool({
      host: "ls-26a1ac3f3efdbfb194d6622c7b186c31a03404cf.cjmq28yyuto4.ap-south-1.rds.amazonaws.com",
      user: "omnaidu",
      password: "omtech23",
      database: "blog_db",
      waitForConnections: true,
      connectionLimit: 100, // Increased for development
      maxIdle: 20, // Increased for development
      idleTimeout: 300000, // Increased idle timeout for development (5 minutes)
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
    const db = drizzle({
      client: pool,
    });
    return db;
  }