"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminInnapStyle() {
  const [list, setList] = useState<any[]>([]);
  const [kamar, setKamar] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    ambilData();
  }, []);

  async function ambilData() {
    const { data: res } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false });
    const { data: kmr } = await supabase.from('kamar').select('*');
    if (res) setList(res);
    if (kmr) setKamar(kmr);
  }

  const kamarReady = kamar.filter(k => k.status === 'Tersedia').length;

  return (
    <div className="flex min-h-screen bg-[#f4f7fe] font-sans text-slate-700">
      {/* --- SIDEBAR (ALA INNAP) --- */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black">E</div>
          {sidebarOpen && <h1 className="font-black text-xl tracking-tighter text-slate-900">ELITE.</h1>}
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-4 p-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold transition">
            <span>📊</span> {sidebarOpen && "Dashboard"}
          </a>
          <div className="relative group">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl font-bold transition">
              <span>🏨</span> {sidebarOpen && "Master Room"}
            </button>
            <div className="pl-12 space-y-2 mt-2 hidden group-hover:block">
              <a href="/admin/rooms" className="block text-sm font-medium text-slate-500 hover:text-indigo-600">Room Status</a>
              <p className="text-[10px] font-black text-emerald-500 uppercase">{kamarReady} Ready</p>
            </div>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Content */}
        <header className="p-8 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-slate-400">Pages / Dashboard</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Main Dashboard</h2>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-full shadow-sm border border-slate-100">
            <input type="text" placeholder="Search..." className="pl-4 bg-transparent outline-none text-sm font-medium" />
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
          </div>
        </header>

        <div className="px-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Booking', val: list.length, icon: '📅', color: 'text-indigo-600' },
              { label: 'Available Room', val: kamarReady, icon: '🏠', color: 'text-emerald-500' },
              { label: 'Checked In', val: '12', icon: '✅', color: 'text-blue-500' },
              { label: 'Pending', val: '2', icon: '⏳', color: 'text-amber-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">{s.icon}</div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table Area (Clean Style) */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Recent Booking</h3>
              <button className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">See All</button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] bg-slate-50/50">
                  <th className="p-6">Customer</th>
                  <th className="p-6">Room Type</th>
                  <th className="p-6">Date & Time</th>
                  <th className="p-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 transition">
                    <td className="p-6">
                      <p className="font-black text-slate-900">{res.nama}</p>
                      <p className="text-xs font-bold text-slate-400">{res.whatsapp}</p>
                    </td>
                    <td className="p-6 font-bold text-sm text-slate-600">{res.tipe_kamar}</td>
                    <td className="p-6">
                      <p className="text-sm font-black text-slate-900">{res.tanggal_kedatangan}</p>
                      <p className="text-[10px] font-bold text-slate-400 italic">{res.jam_kedatangan}</p>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase">Confirmed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}