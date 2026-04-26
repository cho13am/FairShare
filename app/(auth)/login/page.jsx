"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'white',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: 'black' }}>
        FairShare
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '40px', fontSize: '14px' }}>
        หารบิลกับเพื่อนได้ง่ายๆ
      </p>

      <button
        onClick={() => signIn("google", { callbackUrl })}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 16px',
          border: '1px solid #e5e7eb',
          borderRadius: '999px',
          backgroundColor: 'white',
          cursor: 'pointer',
          width: '220px',
          fontSize: '13px',
          transition: 'background-color 0.2s',
          color: '#374151'
        }}
      >
        <img
          src="/Google.png"
          alt="Google"
          style={{ width: '18px', height: '18px', objectFit: 'contain' }}
        />
        <span style={{ fontWeight: '500' }}>Continue with Google</span>
      </button>

      <p style={{ marginTop: '40px', fontSize: '10px', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '1px' }}>
        By continuing, you agree to our Terms of Service.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
