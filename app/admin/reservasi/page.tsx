"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function DataReservasi() {
  const [listReservasi, setListReservasi] = useState<any[]>([]);
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterJam, setFilterJam] = useState('');

  useEffect(() => { ambilData(); }, []);

  async function ambilData() {
    const { data } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false });
    if (data) setListReservasi(data);
  }

  // Fungsi Filter Otomatis
  const dataFiltered = listReservasi.filter((item) => {
    return (
      (filterTanggal === '' || item.tanggal_kedatangan === filterTanggal) &&
      (filterJam === '' || item.jam_kedatangan.includes(filterJam))
    );
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* 1. Header & Filter Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Daftar Reservasi 📥</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Filter Tanggal</label>
            <input 
              type="date" 
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Filter Jam</label>
            <input 
              type="time" 
              onChange={(e) => setFilterJam(e.target.value)}
              className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 2. List Data Section */}
      <div className="max-w-6xl mx-auto grid gap-4">
        {dataFiltered.map((res) => (
          <div key={res.id} className="p-6 bg-white rounded-[24px] border border-slate-200 flex flex-col md:flex-row justify-between items-center shadow-sm">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black">
                {res.nama.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">{res.nama}</h3>
                <p className="text-sm font-bold text-emerald-600">{res.whatsapp}</p>
              </div>
            </div>
            
            <div className="flex gap-8 mt-4 md:mt-0 text-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Tipe</p>
                <p className="font-bold text-slate-800">{res.tipe_kamar}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Jadwal</p>
                <p className="font-bold text-slate-800">📅 {res.tanggal_kedatangan} | ⏰ {res.jam_kedatangan}</p>
              </div>
            </div>
          </div>
        ))}
        {dataFiltered.length === 0 && (
          <p className="text-center text-slate-400 font-bold py-10">Data tidak ditemukan dengan filter tersebut... 🔍</p>
        )}
      </div>
    </div>
  );
}