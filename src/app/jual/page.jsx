"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function JualBarang() {
  const router = useRouter();
  
  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hijab");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("Sangat Baik");
  const [era, setEra] = useState("Modern");
  
  // Sharia defect & thaharah states
  const [defectGrade, setDefectGrade] = useState("Tidak Ada");
  const [defectDesc, setDefectDesc] = useState("");
  const [isPurified, setIsPurified] = useState(true);
  const [thaharahConfirmed, setThaharahConfirmed] = useState(false);
  const [siddiqConfirmed, setSiddiqConfirmed] = useState(false);
  
  // Image upload states
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation: Size limit (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 2MB untuk optimasi database.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Base64 String
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!thaharahConfirmed || !siddiqConfirmed) {
      alert("Mohon setujui komitmen thaharah dan keabsahan akad siddiq sebelum melanjutkan.");
      return;
    }

    // Get existing products
    let existingProducts = [];
    const stored = localStorage.getItem("reloop_products_v2");
    if (stored) {
      try {
        existingProducts = JSON.parse(stored);
      } catch (err) {
        console.error("Failed to parse stored products", err);
      }
    }

    const newProduct = {
      id: Date.now(),
      name,
      category,
      price: parseInt(price),
      size,
      condition,
      era,
      defectGrade,
      defectDesc: defectDesc || "Kondisi sangat mulus, tidak ditemukan cacat fisik.",
      purificationStatus: isPurified
        ? "Telah disucikan secara syar'i (dicuci bersih oleh penjual dengan air mengalir untuk menghilangkan najis, disetrika uap, dan disinfeksi)."
        : "Belum dicuci bersih secara syar'i (Pembeli wajib menyucikan sebelum dipakai salat).",
      isPurified,
      image, // Base64 data URL
    };

    const updatedProducts = [newProduct, ...existingProducts];
    localStorage.setItem("reloop_products_v2", JSON.stringify(updatedProducts));

    alert("Barang Anda berhasil diposting ke Katalog Syariah!");
    router.push("/katalog");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase border border-accent/20 rounded-full mb-4">
            Penjual Mitra Syariah
          </div>
          <h1 className="text-3xl md:text-4xl font-serif">
            Jual Barang Thrift Anda
          </h1>
          <p className="text-sm opacity-70 mt-2 max-w-md mx-auto leading-relaxed">
            Daftarkan pakaian vintage Anda untuk dijual. Wajib menerapkan transparansi kondisi dan kesucian produk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-foreground/10 p-8 bg-foreground/[0.01] space-y-6">
          
          {/* Section 1: Informasi Dasar */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent border-b border-foreground/10 pb-2">
              1. Informasi Dasar Produk
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Nama Pakaian</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Vintage Corduroy Vest"
                  className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Harga Jual (Rp)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="125000"
                  className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-xs"
                >
                  {["Hijab", "Kemeja", "Sepatu", "Tas", "Dress", "Rok", "Abaya"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Ukuran (Size)</label>
                <input
                  type="text"
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="L / XL / 32"
                  className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Kondisi</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-background border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-xs"
                >
                  {["Sangat Baik", "Baik", "Cukup Baik", "Vintage"].map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Era Pakaian</label>
                <select
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  className="w-full bg-background border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-xs"
                >
                  {["1970s", "1980s", "1990s", "2000s", "Modern"].map((er) => (
                    <option key={er} value={er}>{er}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Upload Foto */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent border-b border-foreground/10 pb-2">
              2. Foto Produk
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Unggah Foto Pakaian (Maks 2MB)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-foreground/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:border-foreground/15 file:text-xs file:font-semibold file:bg-background file:text-foreground file:cursor-pointer hover:file:bg-foreground hover:file:text-background file:transition-colors"
                />
              </div>

              {/* Photo Preview Container */}
              <div className="w-32 h-40 bg-foreground/[0.03] border border-dashed border-foreground/20 flex items-center justify-center overflow-hidden rounded-sm relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] uppercase tracking-widest text-center opacity-40 p-2">Pratinjau Foto</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Kepatuhan Syariah */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent border-b border-foreground/10 pb-2">
              3. Transparansi Cacat & Kesucian (Syariah)
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Tingkat Cacat (Grade)</label>
                <select
                  value={defectGrade}
                  onChange={(e) => setDefectGrade(e.target.value)}
                  className="w-full bg-background border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-xs"
                >
                  {["Tidak Ada", "Sangat Ringan", "Ringan", "Sedang"].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Uraian Detail Cacat / Kekurangan</label>
                <input
                  type="text"
                  value={defectDesc}
                  onChange={(e) => setDefectDesc(e.target.value)}
                  placeholder="Contoh: Noda luntur tipis di saku depan (isi jika ada)"
                  className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-xs italic"
                />
              </div>
            </div>

            <div className="bg-foreground/[0.02] border border-foreground/10 p-4 space-y-3">
              <label className="flex gap-3 cursor-pointer items-start">
                <input
                  type="checkbox"
                  checked={isPurified}
                  onChange={(e) => setIsPurified(e.target.checked)}
                  className="mt-1 accent-accent"
                />
                <span className="text-xs text-foreground/80 leading-normal">
                  Pakaian ini sudah dicuci dan disucikan secara syar'i (mengalirkan air pembilas untuk menyucikan najis yang mungkin ada).
                </span>
              </label>

              <hr className="border-foreground/10" />

              <label className="flex gap-3 cursor-pointer items-start">
                <input
                  type="checkbox"
                  required
                  checked={thaharahConfirmed}
                  onChange={(e) => setThaharahConfirmed(e.target.checked)}
                  className="mt-1 accent-accent"
                />
                <span className="text-xs text-foreground/80 leading-normal">
                  <strong>Pernyataan Kebersihan:</strong> Saya bersaksi di hadapan Allah bahwa pakaian ini dikirim dalam keadaan bersih dan suci (Bebas Najis) secara fisik dan hukum syariat.
                </span>
              </label>

              <label className="flex gap-3 cursor-pointer items-start">
                <input
                  type="checkbox"
                  required
                  checked={siddiqConfirmed}
                  onChange={(e) => setSiddiqConfirmed(e.target.checked)}
                  className="mt-1 accent-accent"
                />
                <span className="text-xs text-foreground/80 leading-normal">
                  <strong>Akad As-Siddiq (Anti-Tadlis):</strong> Saya berkomitmen tidak menutupi cacat barang (*Tadlis*) demi keuntungan sepihak. Seluruh detail cacat di atas telah saya tulis dengan jujur.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-accent text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all duration-300 shadow-md shadow-accent/15"
          >
            Posting ke Katalog Syariah (Iklankan)
          </button>
        </form>
      </div>
    </div>
  );
}
