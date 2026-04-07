"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminReservasi() {
  const [listReservasi, setListReservasi] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function proteksiHalaman() {
      // 1. Cek apakah ada user yang login
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        // Kalau nggak ada user, tendang ke halaman login
        router.push('/login');
      } else {
        // Kalau ada, baru tarik data reservasi
        ambilDataReservasi();
      }
    }
    proteksiHalaman();
  }, [router]);

  async function ambilDataReservasi() {
    const { data } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false });
    if (data) setListReservasi(data);
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">Daftar Reservasi Masuk 📥</h1>
        
        <div className="grid gap-4">
          {listReservasi.length === 0 ? (
            <p className="text-slate-400 font-medium italic">Belum ada pesanan masuk hari ini...</p>
          ) : (
            listReservasi.map((res) => (
              <div key={res.id} className="p-6 bg-white border border-slate-200 rounded-[24px] shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{res.nama}</h3>
                    <p className="text-sm text-emerald-600 font-bold mt-1">WA: {res.whatsapp}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-slate-900 px-3 py-1.5 rounded-full font-black text-white uppercase tracking-tighter">
                      {res.tipe_kamar}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <p>📅 {res.tanggal_kedatangan}</p>
                  <p>⏰ {res.jam_kedatangan}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}