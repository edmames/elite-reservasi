"use client";
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e: any) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert("Login Gagal: " + error.message);
    } else {
      router.push('/admin/reservasi'); // Kalau sukses langsung ke daftar tamu
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm">
        <h1 className="text-2xl font-black text-slate-900 mb-6 text-center tracking-tight">Admin Elite 🔑</h1>
        <div className="flex flex-col gap-4">
          <input required type="email" placeholder="Email Admin" value={email} onChange={(e) => setEmail(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-slate-800 font-semibold" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-slate-800 font-semibold" />
          <button type="submit" className="py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg mt-2">MASUK SISTEM</button>
        </div>
      </form>
    </div>
  );
}