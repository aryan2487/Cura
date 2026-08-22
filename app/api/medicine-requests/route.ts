import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_database_password_here',
  database: process.env.DB_DATABASE || 'medspot_db',
  port: Number(process.env.DB_PORT) || 3306
});

// Automatically clear out old test requests once when the server boots up
let isClearedOnBoot = false;
async function clearRequestsOnBoot() {
  if (isClearedOnBoot) return;
  try {
    const connection = await pool.getConnection();
    await connection.execute('TRUNCATE TABLE medicine_requests');
    connection.release();
    isClearedOnBoot = true;
    console.log('🧹 Medicine requests automatically cleared on server restart.');
  } catch (error) {
    console.error('Failed to clear requests on boot:', error);
  }
}

// Trigger the boot cleanup
clearRequestsOnBoot();

// GET all custom requests
export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
      'SELECT * FROM medicine_requests ORDER BY id DESC'
    );
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST new custom request from patient
export async function POST(request: Request) {
  try {
    const { customMedicineName } = await request.json();
    if (!customMedicineName) {
      return NextResponse.json({ error: 'Missing medicine name' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO medicine_requests (pharmacy_id, custom_medicine_name, status) VALUES (4, ?, ?)',
      [customMedicineName, 'Pending']
    );
    connection.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT to Confirm or Deny a request
export async function PUT(request: Request) {
  try {
    const { requestId, status } = await request.json();
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE medicine_requests SET status = ? WHERE id = ?',
      [status, requestId]
    );
    connection.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE a request by its ID
export async function DELETE(request: Request) {
  try {
    const { requestId } = await request.json();
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM medicine_requests WHERE id = ?', [requestId]);
    connection.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}