import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    
    const docRef = await addDoc(collection(db, "bills"), {
      title: data.title || "มื้ออาหารใหม่",
      total_amount: Number(data.total_amount),
      payer_id: "30001",
      createdAt: serverTimestamp(),
      items: data.items || []
    });

    return NextResponse.json({ message: 'Success', billId: docRef.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const q = query(collection(db, "bills"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const bills = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toLocaleString('th-TH') || "ไม่ระบุเวลา"
    }));

    return NextResponse.json(bills);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}