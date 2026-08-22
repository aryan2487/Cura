import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: 'Wearefamily@3', // <--- Put your password here!
  database: 'medspot_db', 
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Defaulting to central Indore (near Rajwada/Palasia)
  const lat = searchParams.get('lat') || '22.7196';
  const lng = searchParams.get('lng') || '75.8577';
  const medicineId = searchParams.get('medicineId') || '1';

  try {
    const connection = await pool.getConnection();
    const userLocationPoint = `POINT(${lng} ${lat})`;

    // Calculates real-world distance in km using Earth's curvature!
    const query = `
      SELECT p.id, p.name, p.phone,
             ST_Y(p.location) AS lat, 
             ST_X(p.location) AS lng,
             ROUND((ST_Distance_Sphere(p.location, ST_GeomFromText(?, 4326)) / 1000), 2) AS distance_km
      FROM pharmacies p
      JOIN inventory i ON p.id = i.pharmacy_id
      WHERE i.medicine_id = ? AND i.status = 'In Stock'
      ORDER BY distance_km ASC;
    `;

    const [rows] = await connection.execute(query, [userLocationPoint, medicineId]);
    connection.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch pharmacies' }, { status: 500 });
  }
}