"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function BookingPage() {
  const [kamarTersedia, setKamarTersedia] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    nama: '', 
    whatsapp: '', 
    tipe_kamar: '', 
    tanggal_kedatangan: '', 
    jam_kedatangan: '' 
  });

  // FUNGSI INTI: Pengecekan Ketersediaan
  const cekKetersediaanRealTime = async (tgl: string, jam: string) => {
    // Jika tanggal atau jam belum diisi, kosongkan pilihan kamar
    if (!tgl || !jam) {
      setKamarTersedia([]);
      return;
    }

    try {
      // LOGIKA: Ambil kamar yang (Status === Tersedia) 
      // ATAU (Status === Terisi TAPI tersedia_kembali_jam <= jam kedatangan tamu)
      const { data, error } = await supabase
        .from('kamar')
        .select('*')
        .or(`status.eq.Tersedia,tersedia_kembali_jam.lte.${jam}`);

      if (error) throw error;
      if (data) setKamarTersedia(data);
    } catch (err) {
      console.error("Gagal cek kamar:", err);
    }
  };

  // Trigger pengecekan setiap ada perubahan di Tanggal atau Jam
  useEffect(() => {
    cekKetersediaanRealTime(form.tanggal_kedatangan, form.jam_kedatangan);
    // Reset pilihan kamar di form jika jam berubah agar tamu pilih ulang yang tersedia
    setForm(prev => ({ ...prev, tipe_kamar: '' }));
  }, [form.tanggal_kedatangan, form.jam_kedatangan]);

  async function kirimBooking(e: any) {
    e.preventDefault();
    const { error } = await supabase.from('reservasi').insert([form]);
    
    if (!error) {
      alert("✅ Berhasil! Reservasi Elite Residence sudah tercatat.");
      setForm({ nama: '', whatsapp: '', tipe_kamar: '', tanggal_kedatangan: '', jam_kedatangan: '' });
      setKamarTersedia([]);
    } else {
      alert("❌ Gagal: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-md border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight italic">ELITE STAY.</h1>
        <p className="text-sm text-slate-500 mb-8 font-medium">Sistem otomatis cek unit ready.</p>

        <form onSubmit={kirimBooking} className="flex flex-col gap-5">
          {/* INPUT DATA */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <input required type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full mt-1.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-900 focus:border-slate-900" placeholder="Nama lu siapa?" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
            <input required type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full mt-1.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-900 focus:border-slate-900" placeholder="08xxx" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tanggal</label>
              <input required type="date" value={form.tanggal_kedatangan} onChange={(e) => setForm({ ...form, tanggal_kedatangan: e.target.value })} className="w-full mt-1.5 p-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-black" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Datang</label>
              <input required type="time" value={form.jam_kedatangan} onChange={(e) => setForm({ ...form, jam_kedatangan: e.target.value })} className="w-full mt-1.5 p-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-black" />
            </div>
          </div>

          {/* SELECT KAMAR DINAMIS */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit Tersedia</label>
            <select 
              required 
              disabled={!form.jam_kedatangan}
              value={form.tipe_kamar} 
              onChange={(e) => setForm({ ...form, tipe_kamar: e.target.value })} 
              className="w-full mt-1.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-900 appearance-none disabled:opacity-50 transition-all"
            >
              {!form.jam_kedatangan ? (
                <option value="">Pilih jam dulu boss...</option>
              ) : kamarTersedia.length === 0 ? (
                <option value="">🚫 Kamar Penuh di Jam Ini</option>
              ) : (
                <>
                  <option value="">-- Pilih Unit Kamar --</option>
                  {kamarTersedia.map((item) => (
                    <option key={item.id} value={`Kamar ${item.no_kamar} (${item.tipe})`}>
                      No. {item.no_kamar} - {item.tipe}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={kamarTersedia.length === 0 || !form.tipe_kamar}
            className="w-full mt-2 py-4 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 disabled:bg-slate-300 shadow-xl shadow-slate-200"
          >
            KONFIRMASI SEKARANG 🚀
          </button>
        </form>
      </div>
    </div>
  );
}