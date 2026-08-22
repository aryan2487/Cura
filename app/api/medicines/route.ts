import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Wearefamily@3',
  database: process.env.DB_DATABASE || 'medspot_db',
  port: Number(process.env.DB_PORT) || 3306
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