import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const medicineId = searchParams.get('medicineId');

  if (!lat || !lng || !medicineId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT p.id, p.name, p.phone, 
             ROUND(ST_Distance_Sphere(p.location, ST_GeomFromText(?, 4326)) / 1000, 2) AS distance_km
      FROM pharmacies p
      JOIN inventory i ON p.id = i.pharmacy_id
      WHERE i.medicine_id = ? AND i.status = 'In Stock'
      HAVING distance_km <= 5
      ORDER BY distance_km ASC;
    `;
    const [rows] = await connection.execute(query, [`POINT(${lng} ${lat})`, medicineId]);
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}