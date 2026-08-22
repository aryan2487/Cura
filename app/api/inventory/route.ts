import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const { pharmacyId, medicineId, status } = await request.json();

    if (!pharmacyId || !medicineId || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    const query = `UPDATE inventory SET status = ? WHERE pharmacy_id = ? AND medicine_id = ?`;
    await connection.execute(query, [status, pharmacyId, medicineId]);
    connection.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}