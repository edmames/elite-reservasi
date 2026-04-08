"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminProDashboard() {
  const [list, setList] = useState<any[]>([]);
  const [kamar, setKamar] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ambilSemuaData();
    const interval = setInterval(ambilSemuaData, 10000); // Auto-refresh data tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  async function ambilSemuaData() {
    const { data: res } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false });
    const { data: kmr } = await supabase.from('kamar').select('*').order('no_kamar', { ascending: true });
    if (res) setList(res);
    if (kmr) setKamar(kmr);
  }

  // JURUS SAKTI 1: PROSES CHECK-IN
  async function handleCheckIn(idReservasi: string, noKamar: string) {
    setLoading(true);
    const jamSelesai = prompt("Tamu ini sewa sampai jam berapa? (Contoh 14:00)");
    
    if (jamSelesai) {
      // 1. Update Tabel Kamar jadi Terisi
      const { error: errKamar } = await supabase
        .from('kamar')
        .update({ status: 'Terisi', tersedia_kembali_jam: jamSelesai })
        .eq('no_kamar', noKamar.replace('Kamar ', '')); // Bersihin string "Kamar 101" jadi "101"

      // 2. Update Status di Tabel Reservasi (Opsional: tambahin kolom status di tabel reservasi lu)
      // await supabase.from('reservasi').update({ status: 'Checked In' }).eq('id', idReservasi);

      if (!errKamar) alert(`Kamar ${noKamar} Berhasil Check-in!`);
    }
    setLoading(false);
    ambilSemuaData();
  }

  // JURUS SAKTI 2: PROSES CHECK-OUT (Bikin Kamar Free Lagi)
  async function handleCheckOut(idKamar: string) {
    if (confirm("Kamar sudah dibersihkan dan siap disewakan lagi?")) {
      const { error } = await supabase
        .from('kamar')
        .update({ status: 'Tersedia', tersedia_kembali_jam: null })
        .eq('id', idKamar);

      if (!error) alert("Kamar Sekarang Available!");
      ambilSemuaData();
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-8 shadow-2xl">
        <div className="text-2xl font-black italic tracking-tighter border-b border-white/10 pb-4">ELITE ADMIN.</div>
        <nav className="space-y-4">
          <div className="p-4 bg-white/10 rounded-2xl font-bold">📊 Dashboard</div>
          <div className="p-4 hover:bg-white/5 rounded-2xl font-bold cursor-pointer transition">🏨 Rooms List</div>
        </nav>
        <div className="mt-auto p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl">
          <p className="text-[10px] font-black uppercase">Ready Rooms</p>
          <p className="text-2xl font-black text-emerald-400">{kamar.filter(k => k.status === 'Tersedia').length} Units</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Operation Panel</h1>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-400 italic">Elite Residence Ciputat</p>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Live Monitoring</p>
          </div>
        </div>

        {/* SECTION 1: MASTER ROOM CONTROL (Grid Mode) */}
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">🕹️ Live Room Control</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {kamar.map((k) => (
            <div key={k.id} className={`p-4 rounded-[24px] border-2 shadow-sm transition-all ${k.status === 'Terisi' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-2xl font-black">{k.no_kamar}</p>
                <div className={`w-3 h-3 rounded-full ${k.status === 'Terisi' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3">{k.tipe}</p>
              {k.status === 'Terisi' ? (
                <div>
                  <p className="text-[10px] font-bold text-rose-600 mb-2">Selesai: {k.tersedia_kembali_jam}</p>
                  <button onClick={() => handleCheckOut(k.id)} className="w-full py-2 bg-rose-600 text-white text-[10px] font-black rounded-lg uppercase">Check-out</button>
                </div>
              ) : (
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Available</p>
              )}
            </div>
          ))}
        </div>

        {/* SECTION 2: TABLE RESERVASI */}
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">📅 Incoming Booking</h2>
        <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="p-6">Guest Info</th>
                <th className="p-6">Requested Room</th>
                <th className="p-6">Schedule</th>
                <th className="p-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {list.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-6">
                    <p className="font-black text-slate-900">{res.nama}</p>
                    <p className="text-xs font-bold text-indigo-600">{res.whatsapp}</p>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-600">{res.tipe_kamar}</span>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-black text-slate-900">{res.tanggal_kedatangan}</p>
                    <p className="text-xs font-bold text-slate-400">{res.jam_kedatangan}</p>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => handleCheckIn(res.id, res.tipe_kamar)}
                      disabled={loading}
                      className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-full hover:bg-indigo-600 transition"
                    >
                      CHECK-IN
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}