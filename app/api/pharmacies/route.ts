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
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const medicineId = searchParams.get('medicineId');

    if (!lat || !lng || !medicineId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    // Native MySQL distance calculation (POINT takes Longitude, Latitude)
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.phone, 
        p.lat, 
        p.lng,
        ROUND(ST_Distance_Sphere(POINT(p.lng, p.lat), POINT(?, ?)) / 1000, 2) AS distance_km
      FROM pharmacies p
      JOIN inventory i ON p.id = i.pharmacy_id
      WHERE i.medicine_id = ? AND i.status = 'In Stock'
      HAVING distance_km < 5000
      ORDER BY distance_km ASC;
    `;

    // Notice order: User Longitude first, User Latitude second, then medicineId
    const [rows]: any = await connection.execute(query, [lng, lat, medicineId]);
    connection.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch pharmacies:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}