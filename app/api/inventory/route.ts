import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_database_password_here',
  database: process.env.DB_DATABASE || 'medspot_db',
  port: Number(process.env.DB_PORT) || 3306
});

export async function GET(request: Request) {
  try {
    const connection = await pool.getConnection();
    
    // Fetch inventory items joined with medicine names for a specific pharmacy (e.g., Pharmacy ID 4 for Testing, or ID 1)
    // You can change pharmacy_id = 4 to whatever store you want the admin dashboard to manage
    const query = `
      SELECT 
        i.id AS inventory_id,
        i.pharmacy_id,
        i.medicine_id,
        m.name AS medicine_name,
        i.status
      FROM inventory i
      JOIN medicines m ON i.medicine_id = m.id
      WHERE i.pharmacy_id = 4;
    `;

    const [rows]: any = await connection.execute(query);
    connection.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { medicineId, status } = body;

    if (!medicineId || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    
    // Update status for the testing pharmacy (ID 4)
    const query = `
      UPDATE inventory 
      SET status = ? 
      WHERE pharmacy_id = 4 AND medicine_id = ?;
    `;

    await connection.execute(query, [status, medicineId]);
    connection.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update inventory:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}