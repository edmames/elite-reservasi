"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Konek ke Supabase pake kunci rahasia
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [kamar, setKamar] = useState([]);

  useEffect(() => {
    ambilDataKamar();
  }, []);

  async function ambilDataKamar() {
    const { data } = await supabase.from('kamar').select('*').order('no_kamar', { ascending: true });
    if (data) setKamar(data);
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">🏨 Elite Residence</h1>
        <p className="text-slate-500 mb-8 font-medium">Dashboard Reservasi Stay Smart ID</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {kamar.map((item) => (
            <div key={item.id} className={`p-6 rounded-3xl border shadow-sm transition hover:shadow-md ${item.status === 'Terisi' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.tipe}</div>
              <div className="text-4xl font-black mb-4 text-slate-800">{item.no_kamar}</div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${item.status === 'Terisi' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}