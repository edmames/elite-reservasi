"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminDashboard() {
  const [listReservasi, setListReservasi] = useState<any[]>([]);
  const [filterTanggal, setFilterTanggal] = useState('');
  const [kamar, setKamar] = useState<any[]>([]);

  useEffect(() => { 
    ambilData();
    const interval = setInterval(ambilData, 5000); // Auto refresh tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  async function ambilData() {
    const { data: res } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false });
    const { data: kmr } = await supabase.from('kamar').select('*');
    if (res) setListReservasi(res);
    if (kmr) setKamar(kmr);
  }

  const dataFiltered = listReservasi.filter(item => filterTanggal === '' || item.tanggal_kedatangan === filterTanggal);
  const kamarTersedia = kamar.filter(k => k.status === 'Tersedia').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* --- NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl italic">E</div>
            <h1 className="font-black tracking-tighter text-xl">ELITE CONTROL.</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                🏨 Master Room <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 hidden group-hover:block overflow-hidden transition-all">
                <a href="/admin/rooms" className="block px-6 py-4 hover:bg-slate-50 text-xs font-bold border-b border-slate-50">🎮 Room Control</a>
                <div className="px-6 py-4 bg-emerald-50 text-emerald-600">
                  <p className="text-[10px] font-black uppercase tracking-widest">Available Now</p>
                  <p className="text-xl font-black">{kamarTersedia} Kamar Ready</p>
                </div>
              </div>
            </div>
            <button className="text-xs font-black text-rose-500 uppercase tracking-widest">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8">
        {/* --- STATS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Reservasi</p>
            <p className="text-4xl font-black text-slate-900">{listReservasi.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kamar Tersedia</p>
            <p className="text-4xl font-black text-emerald-500">{kamarTersedia}</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl shadow-slate-200">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Filter Tanggal</p>
            <input 
              type="date" 
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="bg-transparent text-white font-black text-xl outline-none w-full [color-scheme:dark]"
            />
          </div>
        </div>

        {/* --- LIST RESERVASI --- */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
          <p className="text-xs font-bold text-slate-400">{dataFiltered.length} booking ditemukan</p>
        </div>

        <div className="grid gap-4">
          {dataFiltered.map((res) => (
            <div key={res.id} className="group bg-white p-6 rounded-[28px] border border-slate-100 flex flex-col md:flex-row justify-between items-center transition-all hover:shadow-xl hover:scale-[1.01]">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xl">
                  {res.nama.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-900 leading-tight">{res.nama}</h4>
                  <p className="text-sm font-bold text-slate-400">{res.whatsapp}</p>
                </div>
              </div>

              <div className="flex gap-12 mt-6 md:mt-0">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Room Type</p>
                  <p className="font-black text-slate-800 bg-slate-100 px-4 py-1 rounded-full text-xs">{res.tipe_kamar}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Check-in Schedule</p>
                  <p className="font-black text-slate-800 italic">📅 {res.tanggal_kedatangan} • ⏰ {res.jam_kedatangan}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6 md:mt-0">
                <button className="px-6 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg shadow-emerald-200">Confirm</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}