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
              src="/logo.png" 
              alt="Vintage Boutique RELOOP Logo" 
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

      {/* Featured Categories */}
      <section className="px-6 md:px-8 py-16 max-w-7xl mx-auto border-t border-foreground/5">
        <h3 className="text-center font-serif font-semibold text-3xl mb-12 text-foreground/90">
          Kategori Populer
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Jaket", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop" },
            { name: "Dress", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=400&auto=format&fit=crop" },
            { name: "Tas", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop" },
            { name: "Sepatu", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400&auto=format&fit=crop" },
            { name: "Kemeja", img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=400&auto=format&fit=crop" },
            { name: "Hijab", img: "https://images.unsplash.com/photo-1589363460779-cbdf1f38e6e8?q=80&w=400&auto=format&fit=crop" }
          ].map((cat) => (
            <a
              key={cat.name}
              href="/katalog"
              className="group relative aspect-[4/5] border border-foreground/10 overflow-hidden rounded-sm hover:border-accent/40 transition-all duration-500 shadow-sm"
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-black/10 group-hover:via-background/25 transition-all duration-500 z-10" />
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col items-center">
                <span className="font-serif text-xl font-medium text-foreground group-hover:text-accent transition-colors">
                  {cat.name}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-foreground/60 mt-1 block">
                  Lihat Koleksi →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

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
