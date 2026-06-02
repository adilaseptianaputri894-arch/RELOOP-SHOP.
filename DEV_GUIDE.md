# DEV_GUIDE.md — Panduan Pengembangan & Kontribusi

Dokumen ini ditujukan sebagai panduan praktis bagi pengembang (*developers*) untuk menyiapkan lingkungan pengembangan lokal, menjalankan aplikasi, dan memperluas fungsionalitas syariah pada codebase RELOOP Shop.

---

## 💻 Persyaratan Sistem

Sebelum memulai, pastikan perangkat Anda telah memenuhi prasyarat berikut:
* **Node.js**: Versi `18.x` atau lebih baru (direkomendasikan versi LTS terbaru).
* **Package Manager**: `npm` (disertakan saat mengunduh Node.js).
* **OS**: Windows, macOS, atau Linux.

---

## 🛠️ Langkah Instalasi Lokal

1. **Clone Repository**:
   ```bash
   git clone https://github.com/username/RELOOP-SHOP.git
   cd RELOOP-SHOP
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Pengaturan Variabel Lingkungan**:
   Buat file `.env.local` di direktori utama proyek dengan menyalin berkas sampel:
   ```bash
   cp .env.example .env.local
   ```
   Isi file dengan kredensial Supabase Anda jika Anda ingin menggunakan basis data cloud:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   *Catatan: Jika variabel ini kosong, sistem otentikasi akan gagal melakukan request ke DB, namun sisa fitur (Katalog, Detail Modal, Keranjang, POS, dan Checkout Akad) tetap dapat diuji secara lokal menggunakan local state.*

4. **Jalankan Server Pengembangan**:
   ```bash
   npm run dev
   ```
   Server lokal akan aktif di port default `http://localhost:3000`.

---

## 🎨 Pengembangan UI dengan Tailwind CSS v4

Aplikasi ini menggunakan **Tailwind CSS v4** yang terintegrasi secara modular. 

### Karakteristik Tailwind CSS v4 dalam Proyek Ini:
1. **Konfigurasi Tema**: Konfigurasi tema tidak lagi menggunakan file terpisah `tailwind.config.js` melainkan disatukan di dalam berkas [globals.css](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/src/app/globals.css) menggunakan direktif `@theme`:
   ```css
   @theme inline {
     --color-background: var(--background);
     --color-foreground: var(--foreground);
     --color-accent: var(--accent);
     --color-accent-foreground: var(--accent-foreground);
     --font-sans: var(--font-geist-sans);
     --font-mono: var(--font-geist-mono);
   }
   ```
2. **Kustomisasi Warna Cream & Maroon**:
   Jika ingin menyesuaikan nuansa warna, Anda cukup mengubah variabel CSS di blok `:root` dan `@media (prefers-color-scheme: dark)` pada [globals.css](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/src/app/globals.css).

---

## ✍️ Cara Memperluas Fungsionalitas Syariah

### 1. Menambahkan Barang Baru ke Katalog
Ubah data produk dummy pada [katalog/page.jsx](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/src/app/katalog/page.jsx). Pastikan setiap item baru menyertakan properti kepatuhan syariah berikut:
```javascript
{
  id: 9,
  name: "Vintage Tweed Vest",
  category: "Rompi",
  price: 110000,
  size: "M",
  condition: "Sangat Baik",
  era: "1980s",
  defectGrade: "Ringan", // 'Tidak Ada' | 'Sangat Ringan' | 'Ringan' | 'Sedang'
  defectDesc: "Satu kancing tengah diganti kancing senada karena kancing asli retak.",
  purificationStatus: "Telah disucikan secara syar'i (pencucian air mengalir & sterilisasi uap).",
  isPurified: true
}
```

### 2. Mengubah Syarat Akad Checkout
Logika alur akad dikelola di [cart/page.jsx](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/src/app/cart/page.jsx) dalam komponen Modal Checkout.
* Untuk mengubah naskah ijab qobul, cari bagian `<p className="text-xs text-foreground/80 italic leading-relaxed text-center">` di bawah **Step 2 (Akad Musawamah)** dan sunting kalimat kontrak sesuai kebutuhan fatwa ter-update.
* Masa berlaku garansi khiyar aib dikonfigurasi pada render Sertifikat Akad Digital (Step 3).

### 3. Mengubah Struk POS Kasir
Struk cetak kasir offline dikelola di [pos/page.jsx](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/src/app/pos/page.jsx) di dalam modal struk (`isReceiptModalOpen`).
* Layout dioptimalkan untuk pencetakan termal lurus menggunakan kelas CSS `@media print` atau optimasi grid kecil agar rapi saat dicetak via printer kasir fisik.

### 4. Penanganan Unggah Foto (Base64 & Cloud Storage)
Fitur unggah gambar jualan pada halaman `/jual` dikonversi menjadi format **Base64 Data URL** menggunakan API browser `FileReader`:
* **Lokasi Kode**: Dikendalikan oleh `handleImageChange` dalam `src/app/jual/page.jsx`.
* **Keterbatasan LocalStorage**: Karena data disimpan di `localStorage` (`reloop_products`), ukuran base64 dibatasi maksimal 2MB per file untuk mencegah kuota browser (5MB) cepat penuh.
* **Migrasi ke Cloud Storage (Rekomendasi Produksi)**:
  Untuk memindahkan alur ini ke cloud storage seperti **Supabase Storage**, ikuti langkah berikut:
  1. Buat bucket baru bernama `product-images` di dashboard Supabase dengan akses publik (SELECT) dan terbatas untuk Admin/Penjual (INSERT).
  2. Impor client supabase di `/jual/page.jsx` dan gunakan fungsi berikut untuk unggah file mentah:
     ```javascript
     const { data, error } = await supabase.storage
       .from('product-images')
       .upload(`public/${Date.now()}-${file.name}`, file);
     ```
  3. Ambil URL publik gambar menggunakan `supabase.storage.from().getPublicUrl()` dan simpan URL tersebut ke database pada properti `image` produk.

---

## 🧪 Perintah Pengembangan Lainnya

* **Build untuk Produksi**:
  ```bash
  npm run build
  ```
* **Jalankan Aplikasi Hasil Build**:
  ```bash
  npm run start
  ```
* **Linting Kode (ESLint)**:
  ```bash
  npm run lint
  ```
