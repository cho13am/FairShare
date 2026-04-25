"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function HistoryPage() {
  const router = useRouter();
  const { data: session } = useSession();
  

  const [billHistory, setBillHistory] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [editingPayee, setEditingPayee] = useState(null);

  const handleUpdateStatus = (payeeName, newStatus) => {
    setBillHistory(prev => prev.map(bill => {
      if (bill.id === selectedBill.id) {
        const updatedStatuses = bill.payeeStatuses.map(ps => 
          ps.name === payeeName ? { ...ps, status: newStatus } : ps
        );
        const updatedBill = { ...bill, payeeStatuses: updatedStatuses };
        setSelectedBill(updatedBill);
        return updatedBill;
      }
      return bill;
    }));
    setEditingPayee(null);
  };

  return (
    <div style={{ padding: '0', fontFamily: '-apple-system, sans-serif', backgroundColor: '#FDFCFE', minHeight: '100vh', color: '#4A4A4A' }}>
      
      <nav style={{ display: 'flex', alignItems: 'center', padding: '15px 25px', backgroundColor: 'white', borderBottom: '1px solid #F1F1F1' }}>
        <button onClick={() => selectedBill ? setSelectedBill(null) : router.push("/dashboard")} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', marginRight: '15px', color: '#999' }}>
          {selectedBill ? "✕" : "←"}
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
          {selectedBill ? "รายละเอียดบิล" : "ประวัติบิล"}
        </h1>
      </nav>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        
        {billHistory.length > 0 ? (
          <div>
            {!selectedBill ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {billHistory.map(bill => (
                  <div key={bill.id} onClick={() => setSelectedBill(bill)} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #F1F1F1', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{bill.title}</h3>
                        <p style={{ margin: 0, fontSize: '12px', color: '#BBB' }}>📅 {bill.date} | 🕒 {bill.time}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#FFB7B2' }}>฿{bill.total}</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#FFD1DC' }}>ดูรายละเอียด ›</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#BBB' }}>{selectedBill.date} {selectedBill.time}</p>
                  <h2 style={{ margin: '8px 0', fontSize: '22px', fontWeight: '800' }}>{selectedBill.title}</h2>
                  <div style={{ display: 'inline-block', padding: '6px 15px', borderRadius: '999px', backgroundColor: '#FFF5F7', color: '#A0616A', fontWeight: '700' }}>
                    ยอดรวม ฿{selectedBill.total}
                  </div>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '15px', border: '1px solid #F1F1F1', marginBottom: '20px' }}>
                  {selectedBill.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', padding: '15px 0', borderBottom: '1px solid #F8F9FA', fontSize: '14px' }}>
                      <div style={{ flex: 2 }}>
                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#FFB7B2', marginTop: '4px' }}>👥 {item.payees.join(", ")}</div>
                      </div>
                      <span style={{ flex: 1, textAlign: 'right' }}>{item.price}</span>
                      <span style={{ flex: 1, textAlign: 'right', fontWeight: '700', color: '#FFB7B2' }}>{(item.price / item.payees.length).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <h4 style={{ margin: '0 0 12px 10px', fontSize: '14px', color: '#999' }}>สถานะการคืนเงิน</h4>
                <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '15px', border: '1px solid #F1F1F1' }}>
                  {selectedBill.payeeStatuses.map((ps, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                      <span style={{ fontWeight: '600' }}>{ps.name} (฿{ps.amount})</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px', backgroundColor: ps.status === 'paid' ? '#E2FCEF' : '#FFF5F7', color: ps.status === 'paid' ? '#2D6A4F' : '#FFB7B2' }}>
                          {ps.status === 'paid' ? 'จ่ายแล้ว' : 'ยังไม่ได้จ่าย'}
                        </span>
                        <button onClick={() => setEditingPayee(ps)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✏️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '100px', 
            padding: '40px 20px', 
            backgroundColor: 'white', 
            borderRadius: '30px', 
            border: '1px solid #F1F1F1',
            boxShadow: '0 10px 30px rgba(255, 209, 220, 0.1)' 
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📄</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', color: '#4A4A4A' }}>ยังไม่มีบิลที่บันทึก</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#BBB', lineHeight: '1.6' }}>
            </p>
            <button 
              onClick={() => router.push("/dashboard")}
              style={{ marginTop: '25px', padding: '12px 30px', borderRadius: '15px', border: 'none', backgroundColor: '#FFD1DC', color: '#A0616A', fontWeight: '700', cursor: 'pointer' }}
            >
              ไปสร้างบิลกันเลย!
            </button>
          </div>
        )}
      </div>

      {editingPayee && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', width: '320px', textAlign: 'center' }}>
             <h3 style={{ marginBottom: '20px' }}>แก้ไขสถานะของ {editingPayee.name}</h3>
             <button onClick={() => handleUpdateStatus(editingPayee.name, "paid")} style={{ width: '100%', padding: '12px', marginBottom: '10px', backgroundColor: '#E2FCEF', color: '#2D6A4F', border: 'none', borderRadius: '12px', fontWeight: '600' }}>จ่ายแล้ว</button>
             <button onClick={() => handleUpdateStatus(editingPayee.name, "pending")} style={{ width: '100%', padding: '12px', backgroundColor: '#FFF5F7', color: '#FFB7B2', border: 'none', borderRadius: '12px', fontWeight: '600' }}>ยังไม่ได้จ่าย</button>
             <button onClick={() => setEditingPayee(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#999' }}>ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
}