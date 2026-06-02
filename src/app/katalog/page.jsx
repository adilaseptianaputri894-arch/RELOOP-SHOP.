"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

const DUMMY_PRODUCTS = [];

export default function Katalog() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [addedToast, setAddedToast] = useState(false);

  // Load products from localStorage or fall back to dummy data
  useEffect(() => {
    const stored = localStorage.getItem("reloop_products");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (e) {
        setProducts(DUMMY_PRODUCTS);
        localStorage.setItem("reloop_products", JSON.stringify(DUMMY_PRODUCTS));
      }
    } else {
      setProducts(DUMMY_PRODUCTS);
      localStorage.setItem("reloop_products", JSON.stringify(DUMMY_PRODUCTS));
    }
  }, []);

  const filteredProducts = activeCategory === "Semua"
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase border border-accent/20 rounded-full">
            Koleksi Pilihan
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold">
            Katalog Vintage Syariah
          </h1>
          <p className="text-sm opacity-70 max-w-md mx-auto leading-relaxed">
            100% Pakaian Syar'i & Suci. Transparansi cacat barang diungkapkan secara jelas demi menghindari penipuan (Gharar).
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {["Semua", "Jaket", "Dress", "Tas", "Sepatu", "Kemeja", "Hijab"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all duration-300 ${
                activeCategory === cat
                  ? "border-accent bg-accent text-accent-foreground shadow-sm"
                  : "border-foreground/15 hover:border-accent hover:text-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group border border-foreground/10 bg-foreground/[0.01] hover:border-accent/40 transition-all duration-500 relative overflow-hidden cursor-pointer rounded-sm flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="aspect-[3/4] bg-foreground/[0.04] relative overflow-hidden flex flex-col justify-between p-3">
                
                {/* Real image if uploaded, otherwise vintage stamp placeholder */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity z-0">
                    <span className="font-serif italic text-2xl">{product.era}</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] mt-1">{product.category}</span>
                  </div>
                )}

                <div className="flex justify-between items-start z-10 relative">
                  <div className="px-2 py-1 bg-background/90 text-[10px] uppercase tracking-wider font-semibold border border-foreground/10">
                    {product.condition}
                  </div>
                  {product.isPurified && (
                    <div className="px-2 py-1 bg-accent text-accent-foreground text-[9px] uppercase tracking-widest font-bold">
                      ✓ Suci
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/35 z-10 pointer-events-none" />

                {/* Defect tag */}
                <div className="z-10 relative bg-background/95 border border-foreground/10 p-2 text-[10px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Cacat:</span>
                    <span className={product.defectGrade === "Tidak Ada" ? "text-green-600" : "text-amber-700"}>
                      {product.defectGrade}
                    </span>
                  </div>
                  <p className="line-clamp-1 opacity-70 italic">"{product.defectDesc}"</p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                  <span className="px-5 py-2.5 bg-foreground text-background text-xs uppercase tracking-widest font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Detail Syariah
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2 border-t border-foreground/10 bg-background z-20 relative">
                <p className="text-[10px] uppercase tracking-wider opacity-50">{product.category} · Size {product.size}</p>
                <h3 className="font-semibold text-sm leading-tight text-foreground/90 group-hover:text-accent transition-colors">{product.name}</h3>
                <p className="font-serif text-accent text-lg font-bold">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-foreground">
          <div
            className="bg-background border border-foreground/15 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-md shadow-2xl relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground text-xl p-2 z-10 transition-colors"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-5">
              {/* Product Visual Area */}
              <div className="md:col-span-2 bg-foreground/5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-foreground/15 min-h-[300px]">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 block">{selectedProduct.category}</span>
                  <h3 className="font-serif text-2xl italic">{selectedProduct.era} Collection</h3>
                </div>

                {/* Display uploaded product photo in the modal */}
                {selectedProduct.image ? (
                  <div className="aspect-[3/4] w-full bg-foreground/[0.04] overflow-hidden rounded-sm relative my-4 border border-foreground/10">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="my-auto text-center border-y border-dashed border-foreground/20 py-8">
                    <span className="text-xs uppercase tracking-[0.3em] block opacity-40">Est. Condition</span>
                    <span className="font-semibold text-lg">{selectedProduct.condition}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                    <span>Size: {selectedProduct.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                    <span>100% Suci (Syar'i)</span>
                  </div>
                </div>
              </div>

              {/* Product Info Area */}
              <div className="md:col-span-3 p-8 flex flex-col justify-between space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-serif leading-snug">{selectedProduct.name}</h2>
                  <p className="text-2xl font-bold text-accent mt-2 font-serif">
                    Rp {selectedProduct.price.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Sharia Transparency Details */}
                <div className="space-y-4 text-xs">
                  {/* Defect Disclosure */}
                  <div className="border border-amber-900/10 bg-amber-900/[0.02] p-4 rounded-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800">Transparansi Cacat (Khiyar Aib)</span>
                      <span className={`px-2 py-0.5 text-[9px] font-semibold rounded-full ${
                        selectedProduct.defectGrade === "Tidak Ada" 
                          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200" 
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                      }`}>
                        Cacat: {selectedProduct.defectGrade}
                      </span>
                    </div>
                    <p className="opacity-80 italic leading-relaxed">"{selectedProduct.defectDesc}"</p>
                  </div>

                  {/* Purification Details */}
                  <div className="border border-green-900/10 bg-green-900/[0.02] p-4 rounded-sm">
                    <h4 className="font-bold uppercase tracking-wider text-[10px] text-green-700 mb-1">Status Kesucian (Thaharah)</h4>
                    <p className="opacity-80 leading-relaxed">{selectedProduct.purificationStatus}</p>
                  </div>

                  {/* Sharia Contract (Akad) */}
                  <div className="border border-foreground/10 bg-foreground/[0.01] p-4 rounded-sm">
                    <h4 className="font-bold uppercase tracking-wider text-[10px] opacity-70 mb-1">Jenis Akad Penjualan</h4>
                    <p className="opacity-70 leading-relaxed">
                      Menggunakan akad <strong>Bai' Al-Musawamah</strong> (jual beli suka-sama-suka dengan harga yang disepakati bersama secara sukarela tanpa membeberkan harga modal/keuntungan pokok oleh penjual).
                    </p>
                  </div>
                </div>

                {/* Khiyar Info */}
                <div className="text-[10px] opacity-60 leading-normal border-t border-foreground/10 pt-4">
                  *Dengan menekan tombol di bawah, Anda menyetujui kondisi cacat barang dan akad jual beli. Anda memiliki hak <strong>Khiyar Aib</strong> (pengembalian) jika ditemukan cacat tersembunyi yang belum dijelaskan sebelumnya.
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold uppercase tracking-widest text-xs transition-colors rounded-sm shadow-md"
                    >
                      Beli & Masuk Keranjang
                    </button>
                    <a
                      href={`/chat?productId=${selectedProduct.id}`}
                      className="px-6 py-4 bg-foreground text-background hover:bg-accent hover:text-accent-foreground font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center rounded-sm"
                    >
                      Nego / Chat
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-2.5 border border-foreground/20 hover:border-foreground text-[10px] uppercase tracking-widest font-semibold transition-colors rounded-sm"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Added to Cart Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-6 py-4 rounded-sm border border-accent/25 shadow-xl flex items-center gap-3 animate-fade-in">
          <span className="text-accent font-bold">✓</span>
          <span className="text-xs uppercase tracking-wider font-semibold">Barang Berhasil Ditambahkan ke Keranjang</span>
        </div>
      )}
    </div>
  );
}
