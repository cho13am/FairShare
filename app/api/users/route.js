import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT id, username, email FROM users');
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}