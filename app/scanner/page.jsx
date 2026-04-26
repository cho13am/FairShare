"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showPermission, setShowPermission] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handlePhotoLibraryClick = () => {
    setShowMenu(false);
    setShowPermission(true);
  };

  const handleAllowPermission = () => {
    setShowPermission(false);
    setTimeout(() => {
      fileInputRef.current.click();
    }, 300);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`เลือกรูปภาพ ${file.name} สำเร็จ!`);
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ backgroundColor: "#000", height: "100vh", width: "100%", position: "relative", overflow: "hidden", fontFamily: "-apple-system, sans-serif" }}>
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
      <div style={{ height: "70%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid #333" }}>
        <p style={{ color: "#FFF", fontSize: "14px", opacity: 0.5 }}>กำลังเปิดกล้อง...</p>
      </div>

      <div style={{ height: "30%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", padding: "20px 0" }}>
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#333", borderRadius: "50%" }}></div>
          <button style={{ width: "70px", height: "70px", borderRadius: "50%", border: "5px solid #FFF", backgroundColor: "transparent" }}></button>
          <button onClick={() => router.back()} style={{ color: "#FFF", background: "none", border: "none", fontSize: "14px", cursor: "pointer" }}>ยกเลิก</button>
        </div>
      </div>

      {showMenu && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: "100%", backgroundColor: "white", borderRadius: "30px 30px 0 0", padding: "25px 20px", animation: "slideUp 0.4s ease-out" }}>
            <style>{` @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } } `}</style>
            <h3 style={{ textAlign: "center", color: "#BBB", fontSize: "13px", fontWeight: "600", marginBottom: "20px", letterSpacing: "0.5px" }}>เลือกวิธีอัปโหลดใบเสร็จ</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              
              <button 
                onClick={handlePhotoLibraryClick}
                style={{ width: "100%", padding: "18px", borderRadius: "18px", border: "none", backgroundColor: "#dededeff", color: "#000000ff", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
              >
              Photo Library
              </button>

              <button onClick={() => alert("ฟังก์ชันถ่ายภาพกำลังพัฒนา")} style={{ width: "100%", padding: "18px", borderRadius: "18px", border: "none", backgroundColor: "#dededeff", color: "#000000ff", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              Take Photo
              </button>

              <button onClick={() => router.back()} style={{ width: "100%", padding: "16px", borderRadius: "18px", border: "none", backgroundColor: "#FFF5F7", color: "#FFB7B2", fontSize: "16px", fontWeight: "700", marginTop: "10px" }}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}


      {showPermission && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 3000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "white", width: "100%", maxWidth: "300px", borderRadius: "20px", overflow: "hidden", textAlign: "center", animation: "popIn 0.3s ease-out" }}>
            <style>{` @keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } `}</style>
            
            <div style={{ padding: "25px 20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>📁</div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "17px", fontWeight: "700", color: "#4A4A4A" }}>"FairShare" ต้องการเข้าถึงรูปภาพของคุณ</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#999", lineHeight: "1.5" }}>เพื่อใช้สำหรับการสแกนและบันทึกรูปภาพใบเสร็จลงในรายการบิลของคุณ</p>
            </div>

            <div style={{ display: "flex", borderTop: "1px solid #F1F1F1" }}>
              <button 
                onClick={() => setShowPermission(false)}
                style={{ flex: 1, padding: "15px", border: "none", background: "none", color: "#FFB7B2", fontSize: "15px", fontWeight: "600", cursor: "pointer", borderRight: "1px solid #F1F1F1" }}
              >
                ไม่อนุญาต
              </button>
              <button 
                onClick={handleAllowPermission}
                style={{ flex: 1, padding: "15px", border: "none", background: "none", color: "#7B1FA2", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
              >
                อนุญาต
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}