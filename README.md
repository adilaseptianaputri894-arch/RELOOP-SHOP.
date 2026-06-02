# RELOOP Shop — Thrift & Vintage Store Syariah

RELOOP Shop adalah aplikasi e-commerce dan kasir Point of Sale (POS) modern khusus untuk pakaian thrift dan vintage yang dirancang dan diimplementasikan sepenuhnya berdasarkan prinsip **Muamalah Syariah (Perdagangan Islam)**. 

Aplikasi ini dibangun menggunakan **Next.js 16 (App Router)** dan **Tailwind CSS v4** dengan palet warna premium bertema **Cream & Maroon** yang estetis dan menenangkan.

---

## 🌟 Fitur Utama Syariah

Aplikasi ini mengintegrasikan fungsionalitas syariah secara langsung ke dalam alur belanja digital:
1. **Transparansi Cacat (Khiyar Aib)**: Menampilkan tingkat cacat (*defect grade*) dan deskripsi detail kekurangan pakaian secara transparan di katalog produk untuk menghindari ketidakjelasan (*Gharar*).
2. **Status Kesucian Pakaian (Thaharah)**: Menyertakan status pencucian dan sterilisasi pakaian guna memastikan barang bebas dari *najis* sebelum diperjualbelikan.
3. **Jual Barang Mitra Syariah (Unggah Foto)**: Pembeli atau mitra penjual dapat mendaftarkan pakaian mereka sendiri melalui halaman **/jual**, lengkap dengan input gambar (Base64 data URL), deskripsi cacat jujur, serta pernyataan jaminan Thaharah dan Akad Siddiq (bebas penipuan/Tadlis).
4. **Akad Bai' Al-Musawamah**: Transaksi jual beli menggunakan akad saling ridha atas harga akhir yang disepakati tanpa mewajibkan penjual mengungkapkan harga modal aslinya.
5. **Sertifikat Akad & Hak Khiyar Digital**: Pembeli mendapatkan sertifikat akad digital setelah checkout yang menjamin Hak Khiyar Aib selama 3 hari (hak retur jika ditemukan cacat tersembunyi yang belum dideklarasikan).
6. **POS Kasir Syariah**: Fitur khusus admin kasir untuk memasukkan barang dengan deskripsi cacat, mencatat nama pelanggan, dan menerbitkan struk penjualan offline yang dilengkapi naskah akad jual beli yang sah.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js](https://nextjs.org) (v16.2.6)
* **Library UI**: React 19, Lucide React (opsional)
* **Styling**: Tailwind CSS v4 dengan PostCSS
* **State Management**: React Context (`CartContext`) & LocalStorage
* **Database & Auth (Siap Integrasi)**: Supabase

---

## 📂 Struktur Project

```bash
RELOOP-SHOP/
├── src/
│   ├── app/                # App Router Pages
│   │   ├── cart/           # Keranjang & Checkout Akad Flow
│   │   ├── katalog/        # Katalog Produk & Detail Modal Syariah
│   │   ├── jual/           # Unggah & Jual Pakaian Mitra Syariah
│   │   ├── login/          # Halaman Login
│   │   ├── register/       # Halaman Register
│   │   ├── pos/            # Sistem Kasir POS Syariah
│   │   ├── globals.css     # Styling Utama & Variabel Tema Cream-Maroon
│   │   ├── layout.js       # Root Layout & Provider Wrapper
│   │   └── page.js         # Landing Page
│   ├── components/         # Reusable Components (Navbar, dll.)
│   ├── context/            # State Context (AuthContext, CartContext)
│   └── lib/                # Supabase SDK Client Setup
├── README.md               # Overview Project
├── ARCHITECTURE.md         # Dokumentasi Arsitektur
├── COMPLIANCE.md           # Kebijakan Kepatuhan Syariah
├── AI_SPEC.md              # Spesifikasi Integrasi Kecerdasan Buatan (AI)
├── DEV_GUIDE.md            # Panduan Pengembangan
├── SECURITY.md             # Kebijakan Keamanan Aplikasi
└── BUSINESS_RULES.md       # Aturan Bisnis & Logika Finansial Syariah
```

---

## 🚀 Memulai Aplikasi (Localhost)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi RELOOP Shop di komputer lokal Anda:

### 1. Install Dependencies
Pastikan Anda memiliki Node.js terinstal, lalu jalankan perintah:
```bash
npm install
```

### 2. Konfigurasi Environment (Opsional untuk Demo)
Salin berkas `.env.example` menjadi `.env.local` dan masukkan kunci API Supabase jika Anda ingin menghubungkannya dengan database:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*Catatan: Aplikasi ini dapat berjalan dengan fungsionalitas penuh untuk Keranjang, POS, dan Detail Syariah menggunakan in-memory state jika Supabase belum dikonfigurasi.*

### 3. Jalankan Dev Server
Jalankan perintah berikut untuk menjalankan server pengembangan lokal:
```bash
npm run dev
```

Buka browser Anda di [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

---

## 📜 7 Dokumen Inti Codebase

Untuk memahami secara menyeluruh arsitektur, kepatuhan syariah, dan aturan bisnis dari aplikasi ini, silakan baca berkas dokumentasi berikut di direktori utama:
1. **[README.md](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/README.md)**: Dokumen gambaran umum ini.
2. **[ARCHITECTURE.md](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/ARCHITECTURE.md)**: Arsitektur sistem, struktur data, dan siklus data keranjang belanja.
3. **[COMPLIANCE.md](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/COMPLIANCE.md)**: Analisis syariah, fatwa rujukan, akad perdagangan, dan sanitasi najis.
4. **[AI_SPEC.md](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/AI_SPEC.md)**: Alur automasi AI untuk audit cacat pakaian dan penentuan grading barang.
5. **[DEV_GUIDE.md](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/DEV_GUIDE.md)**: Instruksi lengkap bagi developer untuk debugging, linting, dan build.
6. **[SECURITY.md](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/SECURITY.md)**: Model ancaman, manajemen sesi, dan keamanan role pelanggan vs kasir.
7. **[BUSINESS_RULES.md](file:///c:/Users/HP/OneDrive/Dokumen/GitHub/RELOOP-SHOP/BUSINESS_RULES.md)**: Skema perhitungan diskon syariah, margin margin laba, dan durasi pengajuan khiyar.
