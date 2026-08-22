import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: 'Wearefamily@3', // Put your MySQL password here
  database: 'medspot_db',
});

// GET: Fetch current status of medicine #1 for Test pharmacy
export async function GET() {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT i.status, p.name 
      FROM inventory i
      JOIN pharmacies p ON i.pharmacy_id = p.id
      WHERE p.name = 'Test pharmacy' AND i.medicine_id = 1
      LIMIT 1;
    `;
    const [rows]: any = await connection.execute(query);
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ status: 'Out of Stock' });
    }

    return NextResponse.json({ status: rows[0].status });
  } catch (error) {
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory status' }, { status: 500 });
  }
}

// POST: Update status (In Stock <-> Out of Stock)
export async function POST(request: Request) {
  try {
    const { status } = await request.json();
    const connection = await pool.getConnection();

    const query = `
      UPDATE inventory i
      JOIN pharmacies p ON i.pharmacy_id = p.id
      SET i.status = ?
      WHERE p.name = 'Test pharmacy' AND i.medicine_id = 1;
    `;
    await connection.execute(query, [status]);
    connection.release();

    return NextResponse.json({ success: true, newStatus: status });
  } catch (error) {
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}