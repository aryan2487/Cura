import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'defaultdb',
  port: Number(process.env.DB_PORT) || 3306,
  ssl: { rejectUnauthorized: false } // Required for Aiven cloud MySQL
});

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT id, name FROM medicines');
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch medicines:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}