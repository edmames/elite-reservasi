"use client";
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. Navbar Simpel */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter italic">ELITE.</div>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
          <Link href="/booking" className="hover:text-slate-500 transition">Book Now</Link>
          <Link href="/login" className="px-5 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition">Admin</Link>
        </div>
      </nav>

      {/* 2. Hero Section - Bold & Clean */}
      <header className="max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 bg-white px-4 py-2 rounded-full border border-slate-200">
          Ciputat - South Tangerang
        </span>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
          STAY SMART.<br/>SLEEP ELITE.
        </h1>
        <p className="max-w-md text-slate-500 font-medium leading-relaxed mb-10 text-lg">
          Experience the ultimate transit comfort with our automated room system. 
          Luxury made simple, just for you.
        </p>
        <Link href="/booking" className="group relative inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[32px] font-black text-lg overflow-hidden transition-all active:scale-95 shadow-2xl shadow-slate-300">
          START BOOKING 🚀
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
        </Link>
      </header>

      {/* 3. Features Section - Kotak-kotak Rapih */}
      <section className="max-w-7xl mx-auto px-8 pb-32 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-10 bg-white rounded-[40px] border border-slate-200 shadow-sm">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="font-black text-xl mb-2">Instant Check-in</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Nggak perlu nunggu lama. Datang, konfirmasi, langsung masuk kamar.</p>
        </div>

        <div className="p-10 bg-slate-900 text-white rounded-[40px] shadow-2xl shadow-slate-400">
          <div className="text-4xl mb-4">💎</div>
          <h3 className="font-black text-xl mb-2 text-white">Elite Comfort</h3>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">Fasilitas bintang 5 dengan harga yang ramah di kantong buat transit lu.</p>
        </div>

        <div className="p-10 bg-white rounded-[40px] border border-slate-200 shadow-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="font-black text-xl mb-2">Private & Secure</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Keamanan dan privasi tamu adalah prioritas nomor satu di Elite Residence.</p>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="text-center py-10 border-t border-slate-200 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
        © 2026 Elite Residence Ciputat — All Rights Reserved.
      </footer>
    </div>
  );
}
