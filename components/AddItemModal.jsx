"use client";
import { useState } from "react";

export default function AddItemModal({ isOpen, onClose, onConfirm, itemName }) {
  const [price, setPrice] = useState("0");

  if (!isOpen) return null;

  const handleNumClick = (num) => {
    if (price === "0") setPrice(num.toString());
    else setPrice(price + num.toString());
  };

  const handleBackspace = () => {
    if (price.length > 1) setPrice(price.slice(0, -1));
    else setPrice("0");
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '500px', borderRadius: '30px 30px 0 0', padding: '25px', fontFamily: '-apple-system, sans-serif' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', left: 0, top: 0, border: 'none', background: 'none', fontSize: '24px', color: '#CCC', cursor: 'pointer' }}>×</button>
          <p style={{ margin: 0, color: '#FFB7B2', fontWeight: '700', fontSize: '18px' }}>{itemName}</p>
          <h2 style={{ margin: '10px 0', fontSize: '56px', color: '#4A4A4A', fontWeight: '800' }}>{Number(price).toLocaleString()}</h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#999', marginBottom: '12px' }}>
             <span>👥 คนจ่าย (0 คน คนละ 0)</span>
          </div>
          <button style={{ width: '100%', padding: '12px', borderRadius: '15px', border: '1px solid #FFD1DC', color: '#A0616A', background: '#FFF5F7', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            ✕ ยกเลิกการเลือกทุกคน
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} onClick={() => handleNumClick(n)} style={{ padding: '20px', border: 'none', background: '#FDFCFE', borderRadius: '15px', fontSize: '24px', fontWeight: '600', color: '#4A4A4A', cursor: 'pointer' }}>{n}</button>
          ))}
          <button onClick={() => setPrice("0")} style={{ padding: '20px', border: 'none', background: '#FDFCFE', borderRadius: '15px', fontSize: '14px', color: '#FFB7B2', fontWeight: '700' }}>CLEAR</button>
          <button onClick={() => handleNumClick(0)} style={{ padding: '20px', border: 'none', background: '#FDFCFE', borderRadius: '15px', fontSize: '24px', fontWeight: '600' }}>0</button>
          <button onClick={handleBackspace} style={{ padding: '20px', border: 'none', background: '#FDFCFE', borderRadius: '15px', fontSize: '24px' }}>⌫</button>
        </div>

        <button 
          onClick={() => onConfirm(price)}
          style={{ width: '100%', padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: '#FFD1DC', color: '#A0616A', fontSize: '18px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 209, 220, 0.4)' }}
        >
          ตกลง
        </button>
      </div>
    </div>
  );
}