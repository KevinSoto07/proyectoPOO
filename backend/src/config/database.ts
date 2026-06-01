import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    private static instance: mysql.Pool | null = null;
    
    private constructor() {}

    public static getInstance(): mysql.Pool {
        if (!Database.instance) {
            Database.instance = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 3306,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'plataforma_numeros',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            })
            console.log('conexión creada');
        }
        return Database.instance
    }

    public static async testConnection(): Promise<void> {
        const pool = Database.getInstance();
        const connection = await pool.getConnection();
        console.log('conectado a la db');
        connection.release();
        
    }
}

export default Database;