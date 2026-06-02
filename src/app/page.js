import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/reeloop-cover.png" 
            alt="REELOOP Thrift & Style Logo" 
            className="w-full h-full object-cover"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10" />
        </div>

        {/* Text Content Layer */}
        <div className="relative z-20 flex flex-col items-center text-center space-y-8 px-6 animate-fade-in max-w-3xl">
          <div className="inline-block px-4 py-1.5 bg-background/90 text-accent text-xs font-semibold tracking-widest uppercase border border-accent/20 rounded-full shadow-sm">
            Koleksi Pilihan & Suci · 100% Syariah
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-medium leading-tight text-foreground">
            Gaya Klasik, <br />
            <span className="italic text-accent">Cerita Baru.</span>
          </h2>
          <p className="text-base md:text-lg text-foreground/90 max-w-md leading-relaxed font-medium">
            Temukan pakaian thrift dan vintage pilihan dengan kualitas premium.
            Mendaur ulang memori, menemukan kembali gaya Anda yang otentik tanpa ragu najis dan gharar.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 justify-center">
            <a
              href="/katalog"
              className="px-8 py-4 bg-accent text-accent-foreground text-xs tracking-widest font-bold uppercase hover:bg-foreground hover:text-background transition-all duration-300 shadow-lg shadow-accent/15"
            >
              Belanja Sekarang
            </a>
            <a
              href="/katalog"
              className="px-8 py-4 bg-background/80 border border-foreground/20 text-foreground text-xs tracking-widest font-bold uppercase hover:border-accent hover:text-accent transition-all duration-300 backdrop-blur-sm"
            >
              Lihat Katalog
            </a>
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
