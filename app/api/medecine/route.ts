import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'defaultdb',
  port: Number(process.env.DB_PORT) || 3306,
  ssl: { rejectUnauthorized: false }
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

    // Haversine formula to calculate distance in km
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.phone, 
        p.lat, 
        p.lng,
        (6371 * acos(cos(radians(?)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians(?)) + sin(radians(?)) * sin(radians(p.lat)))) AS distance_km
      FROM pharmacies p
      JOIN inventory i ON p.id = i.pharmacy_id
      WHERE i.medicine_id = ? AND i.status = 'In Stock'
      HAVING distance_km < 50
      ORDER BY distance_km ASC;
    `;

    const [rows]: any = await connection.execute(query, [lat, lng, lat, medicineId]);
    connection.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch pharmacies:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}