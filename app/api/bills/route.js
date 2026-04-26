import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const data = await req.json();
    const { title, bill_name, total_amount, items, receipt_url } = data;

    const [billResult] = await db.query(
      'INSERT INTO bills (title, bill_name, total_amount, payer_id, receipt_url) VALUES (?, ?, ?, ?, ?)',
      [title, bill_name, total_amount, session.user.email, receipt_url]
    );

    const billId = billResult.insertId;

    if (items && items.length > 0) {
      for(const item of items) {
        await db.query(
          'INSERT INTO bill_items (bill_id, item_name, price) VALUES (?, ?, ?)',
          [billId, item.name || item.item_name, item.price || item.amount]
        );
      }
    }

    return NextResponse.json({ message: 'Bill created', billId: billId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [bills] = await db.query('SELECT * FROM bills ORDER BY created_at DESC');

    const billsWithItems = await Promise.all(bills.map(async (bill) => {
      const [items] = await db.query('SELECT * FROM bill_items WHERE bill_id = ?', [bill.id]);

      return {
        ...bill,
        created_at: new Date(bill.created_at).toLocaleString('th-TH'),
        items: items
      };
    }))

    return NextResponse.json(billsWithItems);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}