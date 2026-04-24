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