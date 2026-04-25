"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useMemo, useEffect } from "react";

// --- Sub-Component: AddItemModal (คงเดิมทุกประการ) ---
const AddItemModal = ({ isOpen, onClose, onConfirm, itemName, initialPrice = "0", isEdit = false }) => {
  const [price, setPrice] = useState("0");
  const [payeesInItem, setPayeesInItem] = useState([]); 
  const [selectedPayeeIds, setSelectedPayeeIds] = useState([]); 
  const [newPayeeName, setNewPayeeName] = useState("");

  useEffect(() => {
    if (isOpen) setPrice(initialPrice.toString());
  }, [isOpen, initialPrice]);

  if (!isOpen) return null;

  const currentPrice = Number(price);
  const pricePerPerson = selectedPayeeIds.length > 0 
    ? (currentPrice / selectedPayeeIds.length).toFixed(2) 
    : "0";

  const addPayee = () => {
    if (!newPayeeName) return;
    const newPerson = { id: Date.now(), name: newPayeeName };
    setPayeesInItem([...payeesInItem, newPerson]);
    setSelectedPayeeIds([...selectedPayeeIds, newPerson.id]);
    setNewPayeeName("");
  };

  const toggleSelect = (id) => {
    if (selectedPayeeIds.includes(id)) {
      setSelectedPayeeIds(selectedPayeeIds.filter(pId => pId !== id));
    } else {
      setSelectedPayeeIds([...selectedPayeeIds, id]);
    }
  };

  const handleNumClick = (num) => setPrice(prev => (prev === "0" ? num.toString() : prev + num.toString()));
  const handleBackspace = () => setPrice(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '500px', borderRadius: '30px 30px 0 0', padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', left: 0, border: 'none', background: 'none', fontSize: '24px', color: '#CCC', cursor: 'pointer' }}>×</button>
          <p style={{ margin: 0, color: '#FFB7B2', fontWeight: '800' }}>{isEdit ? `แก้ไข${itemName}` : (itemName || "ระบุรายการ")}</p>
          <h2 style={{ margin: '10px 0', fontSize: '48px', color: '#4A4A4A' }}>{currentPrice.toLocaleString()}</h2>
        </div>

        <div style={{ backgroundColor: '#FDFCFE', padding: '15px', borderRadius: '20px', marginBottom: '20px', border: '1px solid #F1F1F1' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#999', marginBottom: '12px' }}>👥 คนจ่าย ({selectedPayeeIds.length} คน คนละ {pricePerPerson})</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
            {payeesInItem.map(p => (
              <button key={p.id} onClick={() => toggleSelect(p.id)} style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', fontSize: '13px', backgroundColor: selectedPayeeIds.includes(p.id) ? '#E2FCEF' : '#F1F1F1', color: selectedPayeeIds.includes(p.id) ? '#2D6A4F' : '#999', fontWeight: '600' }}>
                {selectedPayeeIds.includes(p.id) ? `✓ ${p.name}` : p.name}
              </button>
            ))}
          </div>
          <button onClick={() => setSelectedPayeeIds([])} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #FFD1DC', color: '#A0616A', background: '#FFF5F7', fontSize: '13px', fontWeight: '600' }}>✕ ยกเลิกการเลือกทุกคน</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <input type="text" placeholder="ชื่อคนจ่าย" value={newPayeeName} onChange={(e) => setNewPayeeName(e.target.value)} style={{ flex: 3, padding: '12px', borderRadius: '12px', border: '1px solid #F1F1F1', outline: 'none' }} />
          <button onClick={addPayee} style={{ flex: 1.5, backgroundColor: '#E2FCEF', color: '#2D6A4F', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '13px' }}>+ เพิ่มคนจ่าย</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "⌫"].map((k) => (
            <button key={k} onClick={() => { if (k === "C") setPrice("0"); else if (k === "⌫") handleBackspace(); else handleNumClick(k); }} style={{ padding: '15px', border: 'none', background: '#F8F9FA', borderRadius: '12px', fontSize: '20px', fontWeight: '600', color: '#4A4A4A' }}>{k}</button>
          ))}
        </div>

        <button 
          onClick={() => {
            const selectedNames = payeesInItem.filter(p => selectedPayeeIds.includes(p.id)).map(p => p.name);
            onConfirm(price, selectedNames);
            setPrice("0"); setSelectedPayeeIds([]); setPayeesInItem([]);
          }} 
          style={{ width: '100%', padding: '18px', borderRadius: '15px', border: 'none', backgroundColor: '#FFD1DC', color: '#A0616A', fontSize: '18px', fontWeight: '800' }}
        >
          {isEdit ? "บันทึก" : "ตกลง"}
        </button>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState("items");
  const [items, setItems] = useState([]);
  const [payees, setPayees] = useState([]); 
  const [payeeMetadata, setPayeeMetadata] = useState({});
  const [newItemName, setNewItemName] = useState("");
  const [newPayeeName, setNewPayeeName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [editingPayee, setEditingPayee] = useState(null);
  const [viewingPayee, setViewingPayee] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const totalAmount = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);

  const combinedPayees = useMemo(() => {
    const summary = {};
    items.forEach(item => {
      const perPerson = item.price / (item.payees.length || 1);
      item.payees.forEach(name => {
        if (!summary[name]) summary[name] = { total: 0, status: "ยังไม่ได้จ่าย" };
        summary[name].total += perPerson;
      });
    });
    payees.forEach(p => {
      if (!summary[p.name]) summary[p.name] = { total: 0, status: "ยังไม่ได้จ่าย" };
    });
    return Object.entries(summary).map(([name, data]) => ({ name, ...data }));
  }, [items, payees]);

  const handleSaveBill = () => {
    if (!session) {
      signIn("google", { callbackUrl: "/dashboard" });
    } else {
      alert(`บันทึกบิลสำเร็จ!`);
    }
  };

  const handleConfirmAdd = (price, selectedNames) => {
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, price: Number(price), payees: selectedNames } : i));
      setEditingItem(null);
    } else {
      setItems([...items, { id: Date.now(), name: newItemName, price: Number(price), payees: selectedNames }]);
      setNewItemName("");
    }
    setIsModalOpen(false);
  };

  const addGlobalPayee = () => {
    if (!newPayeeName) return;
    setPayees([...payees, { id: Date.now(), name: newPayeeName }]);
    setNewPayeeName("");
  };

  return (
    <div style={{ padding: '0', fontFamily: '-apple-system, sans-serif', backgroundColor: '#FDFCFE', minHeight: '100vh', color: '#4A4A4A' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', backgroundColor: 'white', borderBottom: '1px solid #F1F1F1', position: 'relative' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#333' }}>FairShare</h1>
        
        {session ? (
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{session.user.name}</span>
            </div>

            {showProfileMenu && (
              <div style={{ position: 'absolute', top: '45px', right: 0, backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', width: '150px', zIndex: 1100, border: '1px solid #F1F1F1', overflow: 'hidden' }}>
                <button 
                  onClick={() => router.push("/history")}
                  style={{ width: '100%', padding: '12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #F9F9F9', color: '#4A4A4A' }}
                >
                History
                </button>
                <button 
                  onClick={() => signOut()}
                  style={{ width: '100%', padding: '12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '14px', cursor: 'pointer', color: '#FFB7B2', fontWeight: '600' }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => signIn("google")} style={{ backgroundColor: '#dededeff', border: 'none', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            เข้าสู่ระบบ
          </button>
        )}
      </nav>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(255, 209, 220, 0.2)', marginBottom: '25px' }}>
          <input type="text" placeholder="ชื่อบิล" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #F1F1F1', outline: 'none' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', textAlign: 'center', marginBottom: '30px' }}>
          <div><p style={{ margin: 0, fontSize: '14px', color: '#999' }}>จำนวนคน</p><h2 style={{ margin: 0, fontSize: '32px', color: '#FFB7B2' }}>{combinedPayees.length}</h2></div>
          <div><p style={{ margin: 0, fontSize: '14px', color: '#999' }}>ราคารวม</p><h2 style={{ margin: 0, fontSize: '32px', color: '#FFD1DC' }}>{totalAmount.toLocaleString()}</h2></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <button 
            onClick={handleSaveBill}
            style={{ backgroundColor: '#FFD1DC', color: '#A0616A', border: 'none', padding: '10px 30px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            บันทึกบิล {!session}
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '2px solid #F1F1F1', marginBottom: '20px' }}>
          <button onClick={() => setActiveTab("items")} style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontSize: '14px', fontWeight: '600', color: activeTab === "items" ? '#FFB7B2' : '#999', borderBottom: activeTab === "items" ? '3px solid #FFB7B2' : 'none' }}>รายการ</button>
          <button onClick={() => setActiveTab("payees")} style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontSize: '14px', fontWeight: '600', color: activeTab === "payees" ? '#FFB7B2' : '#999', borderBottom: activeTab === "payees" ? '3px solid #FFB7B2' : 'none' }}>คนจ่าย</button>
        </div>

        <div style={{ minHeight: '200px' }}>
          {activeTab === "items" ? (
            <div>
              <div style={{ display: 'flex', padding: '10px', fontSize: '12px', fontWeight: '700', color: '#999' }}>
                <span style={{ flex: 2 }}>รายการ / คนจ่าย</span><span style={{ flex: 1 }}>ราคา</span><span style={{ flex: 1 }}>ต่อคน</span><span style={{ flex: 0.6 }}>Action</span>
              </div>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', padding: '15px 10px', borderBottom: '1px solid #F1F1F1', fontSize: '14px', alignItems: 'center' }}>
                  <div style={{ flex: 2 }}><div style={{ fontWeight: '600' }}>{item.name}</div><div style={{ fontSize: '11px', color: '#FFB7B2' }}>👥 {item.payees.join(", ")}</div></div>
                  <span style={{ flex: 1 }}>{item.price.toLocaleString()}</span>
                  <span style={{ flex: 1, color: '#FFB7B2', fontWeight: '700' }}>{(item.price / (item.payees.length || 1)).toFixed(2)}</span>
                  <div style={{ flex: 0.6, display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => setItems(items.filter(i => i.id !== item.id))} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}

              <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
              <button onClick={() => { if(!session) signIn("google"); else router.push("/scanner"); }} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px dashed #FFD1DC', background: 'white', color: '#A0616A', margin: '15px 0', cursor: 'pointer' }}>+ อัปโหลดรูปภาพใบเสร็จ {!session}</button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="ชื่อรายการ" style={{ flex: 2, padding: '12px', borderRadius: '12px', border: '1px solid #F1F1F1', outline: 'none' }} />
                <button onClick={() => { if(newItemName) setIsModalOpen(true); }} style={{ flex: 1, backgroundColor: '#E2FCEF', color: '#2D6A4F', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>+ เพิ่ม</button>
              </div>
              <button onClick={() => setItems([])} style={{ width: '100%', marginTop: '10px', color: '#FFB7B2', background: 'none', border: '1px solid #FFB7B2', padding: '8px', borderRadius: '8px', fontSize: '12px' }}>ลบรายการทั้งหมด</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', padding: '10px', fontSize: '12px', fontWeight: '700', color: '#999' }}>
                <span style={{ flex: 1.5 }}>ชื่อคน</span><span style={{ flex: 1 }}>จ่าย</span><span style={{ flex: 1.5 }}>สถานะ</span><span style={{ flex: 1 }}>Action</span>
              </div>
              {combinedPayees.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', padding: '15px 10px', borderBottom: '1px solid #F1F1F1', fontSize: '14px', alignItems: 'center' }}>
                  <span style={{ flex: 1.5, fontWeight: '600' }}>{p.name}</span>
                  <span style={{ flex: 1 }}>{p.total.toFixed(0)}</span>
                  <span style={{ flex: 1.5 }}><span style={{ color: '#FFB7B2', fontSize: '11px', backgroundColor: '#FFF5F7', padding: '4px 8px', borderRadius: '8px' }}>{p.status}</span></span>
                  <div style={{ flex: 1, display: 'flex', gap: '10px', color: '#BBB' }}>
                    <button onClick={() => setEditingPayee(p)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => setViewingPayee(p.name)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>👁️</button>
                    <button onClick={() => { setPayees(payees.filter(payee => payee.name !== p.name)); }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input value={newPayeeName} onChange={(e) => setNewItemName(e.target.value)} placeholder="ชื่อคนจ่าย" style={{ flex: 2, padding: '12px', borderRadius: '12px', border: '1px solid #F1F1F1', outline: 'none' }} />
                <button onClick={addGlobalPayee} style={{ flex: 1, backgroundColor: '#E2FCEF', color: '#2D6A4F', border: 'none', borderRadius: '12px', fontWeight: '700' }}>+ เพิ่ม</button>
              </div>
              <button onClick={() => setPayees([])} style={{ width: '100%', marginTop: '10px', color: '#FFB7B2', background: 'none', border: '1px solid #FFB7B2', padding: '8px', borderRadius: '8px', fontSize: '12px' }}>ลบคนจ่ายทั้งหมด</button>
            </div>
          )}
        </div>
      </div>

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }} 
        onConfirm={handleConfirmAdd} 
        itemName={editingItem ? editingItem.name : newItemName} 
        initialPrice={editingItem ? editingItem.price : "0"}
        isEdit={!!editingItem}
      />

      {editingPayee && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', width: '320px', textAlign: 'center' }}>
             <h3 style={{ marginBottom: '20px' }}>แก้ไขสถานะ</h3>
             <button onClick={() => { setEditingPayee(null); }} style={{ width: '100%', padding: '12px', marginBottom: '10px', backgroundColor: '#E2FCEF', color: '#2D6A4F', border: 'none', borderRadius: '12px', fontWeight: '600' }}>จ่ายแล้ว</button>
             <button onClick={() => { setEditingPayee(null); }} style={{ width: '100%', padding: '12px', backgroundColor: '#FFF5F7', color: '#FFB7B2', border: 'none', borderRadius: '12px', fontWeight: '600' }}>ยังไม่ได้จ่าย</button>
             <button onClick={() => setEditingPayee(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>ยกเลิก</button>
          </div>
        </div>
      )}

      {viewingPayee && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '24px', width: '380px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>รายการที่ {viewingPayee} สั่ง</h3>
                <button onClick={() => setViewingPayee(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
             </div>
             {items.filter(i => i.payees.includes(viewingPayee)).map(i => (
                 <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F9F9F9' }}>
                   <span>{i.name}</span>
                   <span style={{ fontWeight: '700' }}>฿{(i.price / i.payees.length).toFixed(2)}</span>
                 </div>
             ))}
             <button onClick={() => setViewingPayee(null)} style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
}