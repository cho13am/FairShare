import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.username,
        (
          IFNULL((SELECT SUM(total_amount) FROM bills WHERE payer_id = u.id), 0) - 
          IFNULL((SELECT SUM(amount) FROM bill_details WHERE user_id = u.id), 0)
        ) as net_balance
      FROM users u
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}