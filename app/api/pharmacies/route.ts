import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: 'Wearefamily@3', // <--- REPLACE THIS with your MySQL Workbench password
  database: 'medspot_db', 
});

export async function GET(request: Request) {
  try {
    const connection = await pool.getConnection();
    
    // We removed the distance filter and location math for a moment to force it to return EVERYTHING in stock.
    const query = `
      SELECT p.id, p.name, p.phone,
             ST_Y(p.location) AS lat, 
             ST_X(p.location) AS lng
      FROM pharmacies p
      JOIN inventory i ON p.id = i.pharmacy_id
      WHERE i.medicine_id = 1 AND i.status = 'In Stock';
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    // This will print the database result directly into your VS Code terminal!
    console.log("DATABASE RESPONSE:", rows);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch pharmacies' }, { status: 500 });
  }
}