import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { title, total_amount, payer_id } = await req.json();
    const [result] = await db.query(
      'INSERT INTO bills (title, total_amount, payer_id) VALUES (?, ?, ?)',
      [title, total_amount, payer_id]
    );
    return NextResponse.json({ message: 'Bill created', billId: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM bills ORDER BY created_at ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}