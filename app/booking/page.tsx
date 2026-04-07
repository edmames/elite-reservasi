"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function BookingPage() {
  const [kamarTersedia, setKamarTersedia] = useState<any[]>([]);
  // Tambah tanggal_kedatangan di state
  const [form, setForm] = useState({ 
    nama: '', 
    whatsapp: '', 
    tipe_kamar: '', 
    tanggal_kedatangan: '', 
    jam_kedatangan: '' 
  });

  useEffect(() => {
    async function cekKamarKosong() {
      const { data } = await supabase.from('kamar').select('*').eq('status', 'Tersedia');
      if (data) setKamarTersedia(data);
    }
    cekKamarKosong();
  }, []);

 async function kirimBooking(e: any) {
  e.preventDefault();
  const { error } = await supabase.from('reservasi').insert([form]);
  
  if (!error) {
    alert("✅ Berhasil!");
    setForm({ nama: '', whatsapp: '', tipe_kamar: '', tanggal_kedatangan: '', jam_kedatangan: '' });
  } else {
    // INI YANG PENTING: Liat pesan error aslinya di layar HP/PC lu
    alert("❌ Detail Error: " + error.message + " | Hint: " + error.hint);
    console.error(error);
  }
}

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-md border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Elite Residence 🏨</h1>
        <p className="text-sm text-slate-500 mb-8 font-medium">Isi detail kedatangan kamu di bawah.</p>

        <form onSubmit={kirimBooking} className="flex flex-col gap-5">
          {/* NAMA */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <input required type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full mt-1.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition font-semibold text-slate-900" placeholder="Siapa nama lu?" />
          </div>

          {/* WHATSAPP */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
            <input required type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full mt-1.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition font-semibold text-slate-900" placeholder="08xxx" />
          </div>

          {/* TANGGAL & JAM (GRID) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tanggal</label>
              <input required type="date" value={form.tanggal_kedatangan} onChange={(e) => setForm({ ...form, tanggal_kedatangan: e.target.value })} className="w-full mt-1.5 p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition font-bold text-black" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Datang</label>
              <input required type="time" value={form.jam_kedatangan} onChange={(e) => setForm({ ...form, jam_kedatangan: e.target.value })} className="w-full mt-1.5 p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition font-bold text-black color-scheme-light" />
            </div>
          </div>

          {/* PILIH KAMAR */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pilih Kamar</label>
            <select required value={form.tipe_kamar} onChange={(e) => setForm({ ...form, tipe_kamar: e.target.value })} className="w-full mt-1.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition font-semibold text-slate-900 appearance-none">
              <option value="">-- Cek Kamar Kosong --</option>
              {kamarTersedia.map((item) => (
                <option key={item.id} value={`Kamar ${item.no_kamar}`}>
                  Kamar {item.no_kamar} ({item.tipe})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full mt-2 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
            KONFIRMASI BOOKING 🚀
          </button>
        </form>
      </div>
    </div>
  );
}