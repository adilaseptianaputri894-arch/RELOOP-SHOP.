import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="px-6 md:px-8 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 animate-fade-in">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase border border-accent/20 rounded-full">
            Koleksi Pilihan & Suci · 100% Syariah
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-medium leading-tight">
            Gaya Klasik, <br />
            <span className="italic text-accent">Cerita Baru.</span>
          </h2>
          <p className="text-base md:text-lg opacity-80 max-w-md leading-relaxed">
            Temukan pakaian thrift dan vintage pilihan dengan kualitas premium.
            Mendaur ulang memori, menemukan kembali gaya Anda yang otentik tanpa ragu najis dan gharar.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/katalog"
              className="px-8 py-4 bg-accent text-accent-foreground text-xs tracking-widest font-bold uppercase hover:bg-foreground hover:text-background transition-all duration-300 shadow-lg shadow-accent/15"
            >
              Belanja Sekarang
            </a>
            <a
              href="/katalog"
              className="px-8 py-4 border border-foreground/20 text-foreground text-xs tracking-widest font-bold uppercase hover:border-accent hover:text-accent transition-all duration-300"
            >
              Lihat Katalog
            </a>
          </div>
        </div>

        {/* Decorative Visual - Real image cover */}
        <div className="flex-1 w-full relative group">
          <div className="w-full aspect-[4/5] bg-foreground/5 border border-foreground/10 flex items-center justify-center relative overflow-hidden rounded-sm shadow-xl transition-all duration-500 hover:border-accent/30">
            <img 
              src="/reeloop-cover.png" 
              alt="REELOOP Thrift & Style Logo" 
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20 z-10 pointer-events-none" />
            
            <div className="absolute inset-8 border border-dashed border-white/30 flex flex-col items-center justify-center z-20 backdrop-blur-[1px] bg-black/10">
              <span className="font-serif text-3xl md:text-4xl text-white italic tracking-wide drop-shadow-md">
                Vintage Collection
              </span>
              <span className="text-[10px] text-white/80 uppercase tracking-[0.4em] mt-3 font-semibold drop-shadow-sm">
                Curated Thrift Syariah
              </span>
            </div>

            {/* Vintage stamp */}
            <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-accent rounded-full flex flex-col items-center justify-center text-accent-foreground font-serif italic text-sm border-4 border-background shadow-xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 z-30">
              <span className="not-italic text-[9px] uppercase tracking-wider opacity-85">Est.</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </main>


      {/* Footer */}
      <footer className="border-t border-foreground/10 px-6 md:px-8 py-8 mt-12 bg-foreground/[0.01]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50">© 2026 RELOOP Shop. All rights reserved. 100% Thrift Syariah.</p>
          <div className="flex gap-6 text-xs opacity-50">
            <a href="#" className="hover:opacity-100 hover:text-accent transition-all">Instagram</a>
            <a href="#" className="hover:opacity-100 hover:text-accent transition-all">Shopee</a>
            <a href="#" className="hover:opacity-100 hover:text-accent transition-all">Tokopedia</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
