import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Wearefamily@3', // Put your actual password here
  database: 'medspot_db',
});

// GET: Fetch all medicines and their statuses for Test pharmacy
export async function GET() {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT m.id as medicine_id, m.name as medicine_name, i.status
      FROM inventory i
      JOIN medicines m ON i.medicine_id = m.id
      JOIN pharmacies p ON i.pharmacy_id = p.id
      WHERE LOWER(p.name) LIKE '%test pharmacy%';
    `;
    const [rows]: any = await connection.execute(query);
    connection.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('API GET INVENTORY ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// POST: Update status for a specific medicine
export async function POST(request: Request) {
  try {
    const { medicineId, status } = await request.json();
    const connection = await pool.getConnection();

    const query = `
      UPDATE inventory 
      SET status = ? 
      WHERE pharmacy_id = (
        SELECT id FROM pharmacies 
        WHERE LOWER(name) LIKE '%test pharmacy%' 
        LIMIT 1
      ) 
      AND medicine_id = ?;
    `;

    await connection.execute(query, [status, medicineId]);
    connection.release();

    return NextResponse.json({ success: true, newStatus: status });
  } catch (error) {
    console.error('API POST INVENTORY ERROR:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}